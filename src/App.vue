<template>
<div id="app" v-cloak>
  <transition :name="transitionName">
    <router-view class="router"></router-view>
  </transition>
</div>
</template>
<script>
import "../assets/css/common.css"
export default {
  name: 'App',
  data() {
    return {
      transitionName: ''
    }
  },
  watch: { //使用watch 监听$router的变化
    $route(to, from) {
      //如果to索引大于from索引,判断为前进状态,反之则为后退状态
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      this.transitionName = toDepth < fromDepth ? 'turn-out' : 'turn-in'
    }
  }
}
</script>
