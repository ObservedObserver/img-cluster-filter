const assert = require("assert");

export class KMeans {
    constructor (n_clusters = 2, opt_ratio = 0.05) {
        this.n_clusters = n_clusters;
        this.features = [];
        this.targets = [];
        this.centers = [];
        this.weights = [];
        this.opt_ratio = opt_ratio;
        this.objective = Infinity;
    }
    assignment () {
        const { features, centers, weights } = this;
        const targets = features.map(() => 0);
        let objective = 0;
        for (let i = 0; i < features.length; i++) {
            let nearestIndex = 0;
            let nearestDis = Infinity;
            for (let j = 0; j < centers.length; j++) {
                const dis_square = centers[j].reduce((total, value, index) => total + ((value - features[i][index]) * weights[index]) ** 2, 0);

                if (dis_square < nearestDis) {
                    nearestIndex = j;
                    nearestDis = dis_square;
                }
            }
            targets[i] = nearestIndex;
            objective += nearestDis;
        }
        this.targets = targets;
        console.log('centers', centers);
        // return objective
        if (objective < this.objective * (1 - this.opt_ratio)) {
            this.objective = objective
            this.update();
            this.assignment();
        }
    }
    update () {
        const centers = [];
        const { features, n_clusters, targets } = this;
        assert.equal(features.length > 0, true);
        const featureSize = features[0].length;
        let cluster_counter = new Array(n_clusters).fill(0);
        for (let i = 0; i < n_clusters; i++) {
            centers.push(new Array(featureSize).fill(0));
        }
        for (let i = 0; i < features.length; i++) {
            const center = centers[targets[i]];
            cluster_counter[targets[i]]++;
            for (let j = 0; j < center.length; j++) {
                center[j] += features[i][j]
            }
        }
        console.log(cluster_counter, 'counter!!!')
        for (let i = 0; i < centers.length; i++) {
            for (let j = 0; j < centers[i].length; j++) {
                centers[i][j] /= cluster_counter[i];
            }
        }
        this.centers = centers;
        return centers;
    }
    init_centers () {
        assert.equal(this.features.length > 0, true);
        const featureSize = this.features[0].length;
        const randSet = new Set();
        this.centers = [];
        let randIndex = 0;
        for (let i = 0; i < this.n_clusters; i++) {
            randIndex = Math.round(Math.random() * this.features.length);
            while (randSet.has(randIndex)) {
                randIndex = Math.round(Math.random() * this.features.length);
            }
            randSet.add(randIndex)
            this.centers.push(this.features[randIndex])
        }
        // console.log(this.centers)
    }
    fit_predict(features = [], weights) {
        assert.equal(features.length > 0, true)
        if (weights === undefined) {
            this.weights = features[0].map(() => 1);
        } else {
            assert.equal(weights.length, features[0].length)
            this.weights = weights;
        }
        this.objective = Infinity;
        this.features = features;
        this.init_centers();
        this.assignment();
        return this.targets;
    }
}