<template>
  <router-view></router-view>
</template>

<script>
export default {
  beforeUnmount() {
    sessionStorage.removeItem("filterQuestions");
  },
};
</script>

<style>
</style>