<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Exams</h2>
      <hr class="bg-secondary" />
      <div>
        <router-link
          class="btn btn-outline-light"
          :to="{ name: 'CreateExam' }"
          v-if="sortedExams"
          >Create</router-link
        >
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="sortedExams">
        <paggination
          :pages="paggination.pages"
          :currentPage="currentPage"
          @changePage="changePage"
          v-if="paggination.pages.length > 1"
        ></paggination>
        <table class="table custom-table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Title</th>
              <th scope="col">DurationTime</th>
              <th scope="col">PassingScore</th>
              <th scope="col">Status</th>
              <th scope="col">Qty of quesitons</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="exam in sortedExams" :key="exam.id">
              <tr scope="row">
                <td>{{ exam.id }}</td>
                <td>{{ exam.title }}</td>
                <td>{{ exam.durationTime }}</td>
                <td>{{ exam.passingScore }}</td>
                <td>{{ exam.status }}</td>
                <td>{{ exam.qtyOfQuestions }}</td>
                <td>
                  <router-link
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'ExamQuestions', params: { id: exam.id } }"
                  >
                    <i class="fa-solid fa-list-ul icon"></i>
                  </router-link>
                  <router-link
                    class="btn btn-outline-light mx-1"
                    :to="{ name: 'EditExam', params: { id: exam.id } }"
                  >
                    <i class="fa-solid fa-pen-to-square icon"></i>
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
    <div class="d-flex justify-content-center" v-if="!exams">
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
import examService from "@/_services/examService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import paginate from "@/_helpers/paginate.js";
import Paggination from "@/components/Paggination";

export default {
  components: { Paggination },
  setup() {
    const exams = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const { getAllExams, getAllExamQuestions } = examService();
    const currentPage = ref(1);
    const pageSize = 15;
    const paggination = ref(null);
    const statuses = [
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
    ];



    onMounted(async () => {
      let response = await getAllExams();

      if (response && response.value) {
        if (response.value.status === 200) {
          exams.value = response.value.data;

          exams.value.forEach(async (element) => {
            element.status = statuses.find(
              (x) => x.value === element.status
            ).title;

            let res = await getAllExamQuestions(element.id);

            if (res && res.value) {
              if (res.value.status === 200) {
                element.qtyOfQuestions = res.value.data.length;
              } else {
                handleResponse(res.value).forEach((element) => {
                  toast.error(element, {
                    position: "top",
                    duration: 5000,
                  });
                });
              }
            }
          });

          currentPage.value = 1;
          paggination.value = paginate(
            exams.value.length,
            currentPage.value,
            pageSize
          );
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

    const sortedExams = computed(() => {
      return exams.value ? exams.value.sort((x1, x2) => x1.id - x2.id) : null;
    });

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const examsItems = computed(() => {
      paggination.value = paginate(
        sortedExams.value.length,
        currentPage.value,
        pageSize
      );
      return exams.value.slice(
        paggination.value.startIndex,
        paggination.value.endIndex + 1
      );
    });

    return {
      exams,
      sortedExams,
      examsItems,
      currentPage,
      paggination,
      changePage,
    };
  },
};
</script>

<style scopped>
@import "../../assets/table.css";
</style>