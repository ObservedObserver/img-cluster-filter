<template>
  <div class="color-container">
      <div class="color-box"  v-for="(color, index) in colorStrs" :key="color + index" :style="{background: color}"></div>
  </div>
</template>

<script>
export default {
    name: 'colorPool',
    props: {
        colors: {
            type: Array,
            default () {
                return []
            }
        }
    },
    computed: {
        colorStrs () {
            return this.$props.colors.map(color => `rgba(${color.join(',')})`)
        }
    }
}
</script>

<style scoped>
.color-container {
    padding: 4px;
    margin: 4px;
    display: flex;
    justify-content: center;
}
.color-box {
    width: 40px;
    height: 40px;
    margin: 2px;
}
</style>