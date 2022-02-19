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
.c-label {
  color: cyan;
  text-transform: uppercase;
  font-weight: 500;
  letter-spacing: 2px;
}

.c-input {
  color: #ffc107 ;
  background: transparent !important;
  border: 0 !important;
  border-bottom: 1px solid #ffc107 !important;
}
.c-input:focus {
   color: #ffc107 ;
  background: transparent !important;
  border: 1px solid cyan !important;
  border-color: cyan !important;
}

.c-title {
  font-size: 30px;
  letter-spacing: 5px;
  text-transform: uppercase;
  -webkit-box-reflect: below -15px linear-gradient(transparent, #0004);
  color: #fff;
  text-shadow: 0 0 10px #03bcf4, 0 0 20px #03bcf4, 0 0 40px #03bcf4,
    0 0 80px #03bcf4, 0 0 160px #03bcf4, 0 0 400px #03bcf4;
}
</style>