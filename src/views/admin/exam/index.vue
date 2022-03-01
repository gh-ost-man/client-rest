<template>
  <router-view></router-view>
</template>

<script>
export default {
  beforeUnmount() {
    sessionStorage.removeItem("filterExams");
  }
}
</script>

<style>

</style>