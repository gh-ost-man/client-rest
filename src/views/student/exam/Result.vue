<template>
  <div class="p-3">
    <h1 class="text-white">Result</h1>
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

    return {};
  },
};
</script>

<style>
</style>