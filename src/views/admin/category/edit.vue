<template>
  <router-link :to="{ name: 'CategoriesList' }" class="btn btn-outline-info">
    <i><font-awesome-icon icon="circle-arrow-left" /></i>
  </router-link>
  <div class="p-3 text-white">
    <form @submit.prevent="submitHandle" v-if="category">
      <div>
        <label class="labels c-label">Name of category</label>
        <input
          type="text"
          class="form-control bg-transparent c-input"
          placeholder="enter name"
          v-model.trim="category.name"
        />
      </div>
      <div class="mt-2">
        <button class="btn btn-outline-info" :disabled="loading" type="submit">
          <span v-if="!loading">Edit</span>
          <span v-else>Editing...</span>
        </button>
        <!-- <button
          class="btn btn-outline-danger mx-2"
          @click="deleteCategoryHandle"
          :disabled="loadingDelete"
        >
          <span v-if="!loadingDelete">Delete</span>
          <span v-else>Deleting...</span>
        </button> -->
      </div>
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import categoryService from "@/_services/categoryService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { useRoute } from "vue-router";
export default {
  props: ['id'],
  setup(props) {
    const category = ref(null);
    const loading = ref(false);
    const loadingDelete = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { updateCategory, getCategory, deleteCategory } = categoryService();
    const route = useRoute();

    onMounted(async () => {
      let response = await getCategory(props.id);
      if (response && response.value) {
        if (response.value.status === 200) {
          category.value = response.value.data;
        } else {
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    /**
     * Updates category
     */

    const submitHandle = async () => {
      loading.value = true;
      let response = await updateCategory(category.value.id, {
        name: category.value.name,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The category was updated successfully");
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
     * Deletes category
     */

    const deleteCategoryHandle = async () => {
      loadingDelete.value = true;

      let response = await deleteCategory(category.value.id);

      loadingDelete.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The category removed successfully");
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

    return {
      category,
      loading,
      loadingDelete,
      submitHandle,
      deleteCategoryHandle,
    };
  },
};
</script>

<style>
</style>