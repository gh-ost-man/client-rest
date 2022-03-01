<template>
  <router-view></router-view>
</template>

<script>
export default {
  beforeUnmount() {
    sessionStorage.removeItem("filterUsers");
  }
}
</script>

<style>

</style>