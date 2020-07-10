<template>
    <div id="app">
        <div>
          <md-button class="md-raised" @click="triggerThemeUpload">
            upload theme
          </md-button>
          <input type="file" v-show="false" ref="themeInput" @change="uploadTheme">
        </div>
        <div>
          <img ref="themeImage" :src="themeImgSrc" alt="" @load="getThemeFeatures" />
        </div>
        <div>
          <md-button class="md-raised" @click="triggerUpload">
            apply
          </md-button>
          <input type="file" v-show="false" ref="fileInput" @change="upload">
        </div>
        <div>
          <img ref="image" :src="imgSrc" alt="" @load="getFeatures" />
        </div>
        <div>
          <label for="cluster_n">cluster number</label>
          <input name="cluster_n" type="range" v-model="clusterNumber" min="1" max="15" />{{clusterNumber}}
          <br />
          <label for="colorSpace">color/space weights:</label>
          <input name="colorSpace" type="range" v-model="colorSpaceRatio" min="0.2" max="8" step="0.2" />{{colorSpaceRatio}}
          <br />
          <md-button class="md-raised" @click="getImageData">test</md-button>
        </div>
        <div>
          <color-pool :colors="colors" />
        </div>
        <canvas ref="canvas"></canvas>
    </div>
</template>

<script>
import { transImgData2Features, randColors, transImgData2ThemeFeatures } from './utils';
import { KMeans } from './lib/kmeans';
import ColorPool from './components/ColorPool';

export default {
  name: 'App',
  components: {
    ColorPool
  },
  data () {
    return {
      imgSrc: null,
      themeImgSrc: null,
      clusterNumber: 5,
      colorSpaceRatio: 3.8,
      features: [],
      themeFeatures: []
    }
  },
  methods: {
    triggerUpload () {
      this.$refs.fileInput.click();
    },
    upload () {
      console.log(this.$refs.fileInput.files)
      if (this.$refs.fileInput.files.length > 0) {
        this.imgSrc = URL.createObjectURL(this.$refs.fileInput.files[0])
      }
    },
    triggerThemeUpload () {
      this.$refs.themeInput.click();
    },
    uploadTheme () {
      console.log(this.$refs.themeInput.files)
      if (this.$refs.themeInput.files.length > 0) {
        this.themeImgSrc = URL.createObjectURL(this.$refs.themeInput.files[0])
      }
    },
    getFeatures () {
      const canvas = this.$refs.canvas;
      canvas.width = this.$refs.image.width || 400;
      canvas.height = this.$refs.image.height || 400;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(this.$refs.image, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const features = transImgData2Features(data);
      this.features = features;
    },
    getThemeFeatures () {
      const canvas = document.createElement('canvas');
      canvas.width = this.$refs.themeImage.width || 400;
      canvas.height = this.$refs.themeImage.height || 400;
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ctx.drawImage(this.$refs.themeImage, 0, 0);
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);

      const features = transImgData2ThemeFeatures(data);
      this.themeFeatures = features;
    },
    getImageData () {
      const canvas = this.$refs.canvas;
      const ctx = canvas.getContext('2d');
      const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const features = this.features;
      const kmeans = new KMeans(Number(this.clusterNumber));
      const groups = kmeans.fit_predict(features, this.weights);

      for (let i = 0; i < data.data.length; i += 4) {
        let pixIndex = i / 4;
        for (let j = 0; j < 4; j++) {
          data.data[i + j] = this.colors[groups[pixIndex]][0 + j];
        }
      }
      ctx.putImageData(data, 0, 0);
    }
  },
  computed: {
    colors () {
      if (this.themeFeatures.length === 0) return [];
      console.log(this.clusterNumber)
      // const colors = randColors(Number(this.clusterNumber));
      const clusterNumber = Number(this.clusterNumber);
      const kmeans = new KMeans(clusterNumber);
      const groups = kmeans.fit_predict(this.themeFeatures, [1, 1, 1, 0])
      const colors = kmeans.centers.map(center => {
        return center.map(c => Math.round(c * 255))
      })
      console.log('colors', colors, kmeans.centers)
      return colors;
    },
    weights () {
      const r = Number(this.colorSpaceRatio);
      return [1, 1, r, r, r, 0];
    }
  },
  watch: {
    colors () {
      if (this.imgSrc !== null) {
        this.getImageData();
      }
    },
    weights () {
      if (this.imgSrc !== null) {
        this.getImageData();
      }
    }
  }
}
</script>

<style>
#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}
</style>
