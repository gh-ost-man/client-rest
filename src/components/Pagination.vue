<template>
  <!-- <nav aria-label="Page navigation example" class="">
    <ul class="pagination d-flex bg-danger justify-content-center">
      <li
        style="cursor: pointer"
        class="page-item d-block"
        :class="{ active: page === currentPage }"
        v-for="page in pages"
        :key="page"
      >
        <div class="page-link" @click="changePagi(page)">{{ page }}</div>
      </li>
    </ul>
  </nav> -->
  <div class="pagination w-auto d-flex justify-content-center">
    <ul>
      <li class="btn prev" @click="prevHanlde">Prev</li>
      <li class="numb" @click="firstHandle" v-if="currentPage >= middleVal">
        1
      </li>
      <li class="dots" v-if="currentPage >= middleVal">...</li>
      <li
        style="cursor: pointer"
        class="numb"
        :class="{ active: page === currentPage }"
        v-for="page in pages"
        :key="page"
        @click="changePagi(page)"
      >
        {{ page }}
      </li>
      <li class="dots" v-if="!pages.includes(totalPages) && totalPages > 0">
        ...
      </li>
      <li
        class="numb"
        @click="lastHandle"
        v-if="!pages.includes(totalPages) && totalPages > 0"
      >
        {{ totalPages }}
      </li>
      <li class="btn next" @click="nextHandle">Next</li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Pagination",
  props: {
    pages: {
      type: Array,
      default: 1,
    },
    currentPage: {
      type: Number,
      default: 1,
    },
    totalPages: {
      type: Number,
      default: 1,
    },
    middleVal: {
      type: Number,
      default: 10,
    },
  },
  emits: ["changePage"],
  methods: {
    changePagi(page) {
      this.$emit("changePage", page);
    },
    prevHanlde() {
      this.$emit(
        "changePage",
        this.currentPage - 1 > 0 ? this.currentPage - 1 : 1
      );
    },
    nextHandle() {
      this.$emit(
        "changePage",
        this.pages.includes(this.currentPage + 1)
          ? this.currentPage + 1
          : this.totalPages
      );
    },
    firstHandle() {
      this.$emit("changePage", 1);
    },
    lastHandle() {
      this.$emit("changePage", this.totalPages);
    },
  },
};
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
body {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #20b2aa;
  min-height: 100vh;
  padding: 10px;
}
.pagination ul {
  /* width: 100%; */
  display: flex;
  flex-wrap: wrap;
  /* background: #fff; */
  padding: 8px;
  border-radius: 50px;
  box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.1);
}
.pagination ul li {
  color: #20b2aa;
  list-style: none;
  line-height: 45px;
  text-align: center;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  user-select: none;
  transition: all 0.3s ease;
}
.pagination ul li.numb {
  list-style: none;
  height: 45px;
  width: 45px;
  margin: 0 3px;
  line-height: 45px;
  border-radius: 50%;
}
.pagination ul li.numb.first {
  margin: 0px 3px 0 -5px;
}
.pagination ul li.numb.last {
  margin: 0px -5px 0 3px;
}
.pagination ul li.dots {
  font-size: 22px;
  cursor: default;
}
.pagination ul li.btn {
  padding: 0 20px;
  border-radius: 50px;
}
.pagination li.active,
.pagination ul li.numb:hover,
.pagination ul li:first-child:hover,
.pagination ul li:last-child:hover {
  color: #fff;
  background: #20b2aa;
}
</style>