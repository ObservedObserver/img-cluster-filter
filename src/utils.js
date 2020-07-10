import assert from "assert";

export function transImgData2Matrix(props) {
    assert.equal(props.data instanceof Uint8ClampedArray, true);
    assert.equal(typeof props.width, 'number');
    assert.equal(typeof props.height, 'number');
    const { data, width, height } = props;
    const matrix = [];
    console.log('props', props);
    for (let i = 0; i < height; i++) {
        matrix.push([]);
        for (let j = 0; j < width; j++) {
            matrix[i].push(null)
        }
    }
    for (let i = 0; i < data.length; i += 4) {
        let pix = [];
        const pixIndex = i / 4;
        for (let j = 0; j < 4; j++) {
            pix.push(data[i + j])
        }
        matrix[Math.floor(pixIndex / width)][pixIndex % width] = pix;
    }
    return matrix;
}

export function transImgData2Features(props) {
    assert.equal(props.data instanceof Uint8ClampedArray, true);
    assert.equal(typeof props.width, 'number');
    assert.equal(typeof props.height, 'number');
    const { data, width, height } = props;
    const features = [];
    for (let i = 0; i < data.length; i += 4) {
        let x = i / 4 % width;
        let y = Math.floor(i / 4 / width);
        let pix = [x / width, y / height];
        for (let j = 0; j < 4; j++) {
            pix.push(data[i + j] / 255);
        }
        features.push(pix);
    }
    return features;
}

export function transImgData2ThemeFeatures(props) {
    assert.equal(props.data instanceof Uint8ClampedArray, true);
    assert.equal(typeof props.width, "number");
    assert.equal(typeof props.height, "number");
    const { data } = props;
    const features = [];
    for (let i = 0; i < data.length; i += 4) {
        let pix = [];
        for (let j = 0; j < 4; j++) {
            pix.push(data[i + j] / 255);
        }
        features.push(pix);
    }
    return features;
}

export function randColors(n = 0) {
    let colors = [];
    for (let i = 0; i < n; i++) {
        colors.push([
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            Math.round(Math.random() * 255),
            255
        ]);
    }
    return colors;
}