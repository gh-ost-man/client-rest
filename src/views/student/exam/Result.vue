<template>
  <div class="p-3">
    <h3 class="text-white">Result</h3>
    <hr class="bg-info">
    <div class="text-white" v-if="report">
      <p>User: {{ report.applicantId }}</p>
      <p>Exam: {{ report.examId }}</p>
      <p>GRADE: {{ report.grade }}</p>
      <p>Date: {{ report.reportDate }}</p>
    </div>
    <div class="d-flex justify-content-center" v-if="!report">
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
import handleResponse from "@/_helpers/handleResponse.js";
import reportService from "@/_services/reportService.js";
import { onMounted, ref, computed, getCurrentInstance, onUnmounted } from "vue";

export default {
  props: ["idReport"],
  setup(props) {
    const toast = getCurrentInstance().appContext.app.$toast;
    const report = ref(null);

    const { getReportById } = reportService();

    onMounted(async () => {
      let response = await getReportById(props.idReport);

      if (response && response.value) {
        if (response.value.status === 200) {
          report.value = response.value.data;
          console.log(report.value);
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

    return { report };
  },
};
</script>

<style>
</style>