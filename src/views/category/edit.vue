<template>
  <div class="p-3 text-white">
    <div v-if="error">
      <textarea
        class="form-control bg-dark text-secondary border-0"
        style="overflow: hidden"
        cols="30"
        rows="15"
        :value="error"
        readonly
      ></textarea>
    </div>
    <form @submit.prevent="submitHandle" v-if="category">
      <div>
        <label class="labels">Name of category</label
        ><input
          type="text"
          class="form-control bg-transparent text-white"
          placeholder="enter name"
          v-model="category.name"
        />
      </div>
      <div class="mt-2">
        <button class="btn btn-outline-light" :disabled="loading" type="submit">
          <span v-if="!loading">Create</span>
          <span v-else>Creating...</span>
        </button>
         <button class="btn btn-outline-danger mx-2" @click="deleteCategoryHandle" :disabled="loading">
          <span v-if="!loading">Delete</span>
          <span v-else>Deleting...</span>
        </button>
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
  setup() {
    const category = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { updateCategory, getCategory, deleteCategory } = categoryService();
    const route = useRoute();

    onMounted(async () => {
      error.value = null;
      let response = await getCategory(route.params.id);
      if (response && response.value) {
        if (response.value.status === 200) {
            category.value = response.value.data;
        } else {
          toast.error("Some error");
          // error.value = JSON.stringify(
          //   handleResponse(response.value),
          //   undefined,
          //   2
          // );
          error.value =  handleResponse(response.value);

        }
      }
    });

    const submitHandle = async () => {
      error.value = null;

      loading.value = true;
      let response = await updateCategory(category.value.id, { name: category.value.name });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The category was updated successfully");
        } else {
          toast.error("Some errors");
          error.value = JSON.stringify(handleResponse(response.value));
        }
      }
    };

    const deleteCategoryHandle = async() => {
      error.value = null;

      loading.value = true;

      let response = await deleteCategory(category.value.id);

      loading.value =false;

      if(response && response.value) {
        if(response.value.status === 204) {
          toast.success("The category deleted successfully");
        } else {
          toast.error("Some error");
          error.value = JSON.stringify(handleResponse(response.value), undefined, 2);
        }

      }
    }

    return { category, error, loading, submitHandle, deleteCategoryHandle };
  },
};
</script>

<style>
</style>