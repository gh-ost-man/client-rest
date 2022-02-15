<template>
  <div class="p-3 text-white">
    <h3>Update test</h3>
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
    <form @submit.prevent="submitHandle" v-if="examObj">
      <div class="mb-3">
        <label class="labels">Title</label
        ><input
          type="test"
          class="form-control bg-transparent text-white"
          placeholder="enter title"
          v-model="examObj.title"
        />
      </div>
      <div class="mb-3">
        <label class="labels">Description</label>
        <textarea
          class="form-control bg-dark text-white border-0"
          placeholder="enter description"
          v-model="examObj.description"
        ></textarea>
      </div>
      <div class="mb-3">
        <label class="labels">Duration time</label
        ><input
          type="number"
          step="5"
          min="30"
          max="360"
          class="form-control bg-transparent text-white"
          placeholder="enter duration time"
          v-model="examObj.durationTime"
        />
      </div>
      <div class="mb-3">
        <label class="labels">Passing Score</label
        ><input
          type="number"
          step="1"
          min="40"
          max="100"
          class="form-control bg-transparent text-white"
          placeholder="enter passing score"
          v-model="examObj.passingScore"
        />
      </div>
      <div class="mb-3">
        <label class="labels">Status</label>
        <select
          class="form-select bg-transparent text-white"
          aria-label="Default select example"
          v-model="examObj.status"
        >
          <option
            class="text-dark"
            v-for="s in statuses"
            :key="s.value"
            :value="s.value"
          >
            {{ s.title }}
          </option>
        </select>
      </div>
      <button class="btn btn-outline-light" :disabled="loading">
        <span v-if="!loading">Update</span>
        <span v-else>Updating...</span>
      </button>
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { useRoute } from 'vue-router';

export default {
  setup(props) {
    const error = ref(null);
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getExamById, updateExam } = examService();
    const route = useRoute();

    const statuses = ref([
      {
        title: "NotAvailable",
        value: 0,
      },
      {
        title: "Available",
        value: 1,
      },
      {
        title: "Finished",
        value: 2,
      },
    ]);
    const examObj =ref(null);

    console.log();

    onMounted(async () => {
        let response = await getExamById(route.params.id);

        if(response && response.value) {
            if(response.value.status === 200) {
                examObj.value = response.value.data;
            } else {
                error.value = JSON.stringify(handleResponse(response.value), undefined, 2);
            }
        }
    });

    const submitHandle = async () => {
      error.value = null;
      loading.value = true;

        console.log(examObj.value);
      let response = await updateExam(examObj.value.id, examObj.value);

      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("The test updated successfully");
        } else {
          error.value = JSON.stringify(
            handleResponse(response.value),
            undefined,
            2
          );
        }
      }
    };

    return { error, loading, examObj, statuses, submitHandle };
  },
};
</script>

<style>
</style>