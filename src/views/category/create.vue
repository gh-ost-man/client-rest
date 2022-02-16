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
    <form @submit.prevent="submitHandle">
      <div>
        <label class="labels">Name of category</label
        ><input
          type="text"
          class="form-control bg-transparent text-white"
          placeholder="enter name"
          v-model="name"
        />
      </div>
      <div class="mt-2">
        <button class="btn btn-outline-light" :disabled="loading" type="submit">
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
export default {
  setup() {
    const name = ref(null);
    const error = ref(null);
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { createCategory } = categoryService();

    const submitHandle = async () => {
      error.value = null;

      loading.value = true;
      let response = await createCategory({ name: name.value });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 201) {
          toast.success("The category was added successfully");
          name.value = null;
        } else {
          toast.error("Some errors");
          // error.value = JSON.stringify(
          //   handleResponse(response.value),
          //   undefined,
          //   2
          // );
          error.value =  handleResponse(response.value);
        }
      }
    };

    return { name, error, loading, submitHandle };
  },
};
</script>

<style>
</style>