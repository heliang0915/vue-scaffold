<template>
<div>
  首页 {{state}}
  <router-link to="/test">11111111</router-link>
</div>
</template>
<script type="text/javascript">
import {mapActions,mapGetters} from 'vuex';
export default {
  // mixins:[TitleMixin],
  title() {
    return "这是首页"
  },
  data() {
    return {
      message: '1111'
    }
  },
  methods: {
    ...mapActions({
      // getIndexList: 'fetchIndexList'
    })
  },
  computed: {
    ...mapGetters({
      state: "getIndexList"
    })
  },
  asyncData(obj){
     let store=obj.store==null?obj:obj.store;
     store.dispatch('fetchIndexList');
     // console.log("asyncData...........");
  },
  mounted() {
    this.getIndexList();

  }
}
</script>
<style>
body {
  font-style: italic;
  background: #FFF;
}
</style>
