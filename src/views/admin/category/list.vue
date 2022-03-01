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
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          :totalPages="paggination.totalPages"
          @changePage="changePage"
        ></paggination>
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
              <tr scope="row">
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
import { useRouter } from "vue-router";
import categoryService from "@/_services/categoryService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";

export default {
  components: { Paggination },
  setup() {
    const error = ref(null);
    const categories = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getAllCategories } = categoryService();
    const currentPage = ref(1);
    const pageSize = 15;

    const paggination = ref(null);

    onMounted(async () => {
      await getData();
    });

    const getData = async () => {
      var response = await getAllCategories(currentPage.value, pageSize);

      if (response && response.value) {
        if (response.value.status === 200) {
          categories.value = response.value.data.items;

          paggination.value = {
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
    const sortedCategories = computed(() => {
      return categories.value
        ? categories.value.sort((x1, x2) => x1.id - x2.id)
        : null;
    });

    const changePage = async (pag) => {
      currentPage.value = pag;

      await getData();
    };
    return {
      categories,
      sortedCategories,
      error,
      currentPage,
      paggination,
      changePage,
    };
  },
};
</script>

<style scoped>
@import "../../../assets/css/table.css";
</style>