<template>
     <router-link :to="{name:'CategoriesList'}" class="btn btn-outline-info"><i class="fa-solid fa-circle-arrow-left"></i></router-link>
  <div class="p-3 text-white">
    <form @submit.prevent="submitHandle">
      <div>
        <label class="labels c-label">Name of category</label
        ><input
          type="text"
          class="form-control bg-transparent c-input"
          placeholder="enter name"
          v-model.trim="name"
        />
      </div>
      <div class="mt-2">
        <button class="btn btn-outline-info" :disabled="loading" type="submit">
          <span v-if="!loading">Create</span>
          <span v-else>Creating...</span>
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import categoryService from "@/_services/categoryService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { useRouter } from 'vue-router';
export default {
  setup() {
    const name = ref(null);
    const loading = ref(false);
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { createCategory } = categoryService();

    const submitHandle = async () => {

      loading.value = true;
      let response = await createCategory({ name: name.value });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 201) {
          toast.success("The category was added successfully");
          name.value = null;

          router.push({name: "CategoriesList"});
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

    return { name, loading, submitHandle };
  },
};
</script>

<style>
</style>