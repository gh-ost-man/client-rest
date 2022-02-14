<template>
   <component :is="layout">
      <router-view/>
    </component>
</template>

<script>
import AppLayoutDefault from '@/layouts/AppLayoutDefault';
import AppLayoutHome from '@/layouts/AppLayoutHome'
import AppLayoutAdmin from '@/layouts/AppLayoutAdmin'
export default {
components: {AppLayoutDefault, AppLayoutHome , AppLayoutAdmin},
  computed: {
    layout () {
      // console.log(this.$route);
       return 'app-layout-'+ (this.$route.meta.layout || 'default')
      
    }
  }
}
</script>

<style>
body {
  background: #191919;
}
</style>