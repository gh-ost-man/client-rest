<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Categories</h2>
      <hr class="bg-secondary" />
      <div>
        <router-link
          class="btn btn-outline-info"
          :to="{ name: 'CreateCategory' }"
          >Create</router-link
        >
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="categories">
        <pagination
          :middleVal="middleVal"
          :pages="pagination.pages"
          :currentPage="currentPage"
          :totalPages="pagination.totalPages"
          @changePage="changePage"
        ></pagination>
        <table class="table custom-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="category in sortedCategories" :key="category.id">
              <tr class="c-table-hover" scope="row">
                <td>{{ category.id }}</td>
                <td>{{ category.name }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light"
                    :to="{ name: 'EditCategory', params: { id: category.id } }"
                  >
                    <i class="icon">
                      <font-awesome-icon icon="pen-to-square"
                    /></i>
                  </router-link>
                </td>
              </tr>
              <tr class="spacer">
                <td colspan="100"></td>
              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="!sortedCategories">
      <div
        class="spinner-border align-center text-primary text-center"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, getCurrentInstance, computed } from "vue";
import categoryService from "@/_services/categoryService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Pagination from "@/components/Pagination";

export default {
  components: { Pagination },
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const categories = ref(null);

    const { getAllCategories } = categoryService();

    const pagination = ref(null);
    const currentPage = ref(1);
    const pageSize = 15;
    const middleVal = ref(10);
    const cntBetween = ref(5);

    onMounted(async () => {
      await getData();
    });

    /**
     * Get all categories from server
     */
    const getData = async () => {
      var response = await getAllCategories(
        currentPage.value,
        pageSize,
        middleVal.value,
        cntBetween.value
      );

      if (response && response.value) {
        if (response.value.status === 200) {
          categories.value = response.value.data.items;

          pagination.value = {
            pages: response.value.data.pages,
            totalPages: response.value.data.totalPages,
          };
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    /**
     * Sort categories by id
     */
    const sortedCategories = computed(() => {
      return categories.value
        ? categories.value.sort((x1, x2) => x1.id - x2.id)
        : null;
    });

    /**
     * Changes current page
     *
     * @param {number} pag New page
     */
    const changePage = async (pag) => {
      currentPage.value = pag;

      await getData();
    };
    return {
      categories,
      sortedCategories,
      currentPage,
      pagination,
      middleVal,
      changePage,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>