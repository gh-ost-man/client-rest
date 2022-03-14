<template>
  <router-view></router-view>
</template>

<script>
export default {
 beforeUnmount() {
    sessionStorage.removeItem("filterReports");
  }
};
</script>

<style>
</style>