<template>
  <div>
    <header class="header" />
    <slot />
  </div>
</template>

<script>

export default {
  name: "home-layout",
}
</script>

<style scoped>
.header {
  height: 5rem;
  background-color: green;
}
</style>
