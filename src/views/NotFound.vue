<template>
    <section class="notfound">
        <h2>对不起页面走丢了404</h2>
        <router-link to="/index">去首页</router-link>
    </section>
</template>
<script>
    export default{
      title () {
       return "对不起页面走丢了"
     },
        data() {
            return {}
        }
    }
</script>
<style>
  .notfound{
    color: red;
  }
</style>
