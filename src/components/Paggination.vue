<template>
  <nav aria-label="Page navigation example">
    <ul class="pagination justify-content-center">
      <li
        style="cursor: pointer"
        class="page-item"
        :class="{ active: page === currentPage }"
        v-for="page in pages"
        :key="page"
      >
        <div class="page-link" @click="changePagi(page)">{{ page }}</div>
      </li>
    </ul>
  </nav>
</template>

<script>
export default {
  name: "Paggination",
  props: ["pages", "currentPage"],
  emits: ["changePage"],
  methods: {
    changePagi(page) {
      console.log(page);

     this.$emit('changePage', page);
    }
  },
};
</script>

<style>
</style>