<template>
  <div class="content">
    <div class="container">
      <h2 class="mb-5 c-title">Exams</h2>
      <hr class="bg-secondary" />

      <div class="row" v-if="exams">
        <div class="col-md-4 my-2">
          <router-link
            class="btn btn-outline-light"
            :to="{ name: 'CreateExam' }"
            >Create</router-link
          >
        </div>
        <div class="col-md-8 my-2">
          <div class="row">
            <div class="col-md-6 my-2">
              <div>
                <input
                  class="form-control c-input"
                  placeholder="filter by title"
                  type="text"
                  v-model.trim="filterTitle"
                />
              </div>
            </div>
            <div class="col-md-6 my-2">
              <select
                class="form-select c-select"
                aria-label="Default select example"
                v-model="filterStatus"
              >
                <option value="" selected class="text-white">All</option>
                <option
                  class="text-white"
                  v-for="s in statuses"
                  :key="s.value"
                  :value="s.value"
                >
                  {{ s.title }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
      <hr class="bg-secondary" />
      <div class="table-responsive custom-table-responsive" v-if="exams">
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
              <th scope="col">Title</th>
              <th scope="col">DurationTime</th>
              <th scope="col">PassingScore</th>
              <th scope="col">Status</th>
              <th scope="col">Qty of quesitons</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="exam in examsItems" :key="exam.id">
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
    const filterTitle = ref("");
    const filterStatus = ref("");
    const statuses = ref([
      {
        title: "NotAvailable",
        key: 0,
        value: "NotAvailable",
      },
      {
        title: "Available",
        key: 1,
        value: "Available",
      },
      {
        title: "Finished",
        key: 2,
        value: "Finished",
      },
    ]);

    onMounted(async () => {
      getFilterFromStorage();
      let response = await getAllExams();
      if (response && response.value) {
        if (response.value.status === 200) {
          exams.value = response.value.data;

          exams.value.forEach(async (element) => {
            element.status = statuses.value.find(
              (x) => x.key === element.status
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

    const changePage = (pag) => {
      currentPage.value = pag;
    };

    const sortedExams = computed(() => {
      return exams.value
        ? exams.value.sort((x1, x2) => x1.id - x2.id)
        : exams.value;
    });

    const filterByTitleExams = computed(() => {
      currentPage.value = 1;
      return filterTitle.value
        ? sortedExams.value.filter((x) =>
            x.title.toLowerCase().includes(filterTitle.value.toLowerCase())
          )
        : sortedExams.value;
    });

    const filterByStatusExams = computed(() => {
      currentPage.value = 1;
      return filterStatus.value
        ? filterByTitleExams.value.filter(
            (x) => x.status.toLowerCase() === filterStatus.value.toLowerCase()
          )
        : filterByTitleExams.value;
    });

    const examsItems = computed(() => {
      filterStorage();
      paggination.value = paginate(
        filterByStatusExams.value.length,
        currentPage.value,
        pageSize
      );
      return filterByStatusExams.value.slice(
        paggination.value.startIndex,
        paggination.value.endIndex + 1
      );
    });

    //Save filter to storage
    const filterStorage = () => {
      let filterObj = {};

      filterObj.title = filterTitle.value;
      filterObj.status = filterStatus.value;
      filterObj.currentPage = currentPage.value;

      sessionStorage.filterExams = JSON.stringify(filterObj);
    };

    //Get filter fromstorage
    const getFilterFromStorage = () => {
      let filter = sessionStorage.getItem("filterExams");

      if (filter) {
        let filterObj = JSON.parse(filter);
        filterTitle.value = filterObj.title ? filterObj.title : "";
        filterStatus.value = filterObj.status ? filterObj.status : "";
        currentPage.value = filterObj.currentPage || "";

      }
    };

    return {
      exams,
      sortedExams,
      examsItems,
      currentPage,
      statuses,
      filterTitle,
      filterStatus,
      paggination,
      changePage,
    };
  },
};
</script>

<style scoped>
@import "../../assets/css/table.css";
</style>