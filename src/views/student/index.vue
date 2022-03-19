<template>
  <div class="text-white p-3">
    <!-- <div class="row">
      <div class="col-md-2">
        <i>
          <font-awesome-icon class="h-75 w-100" icon="user-graduate" />
        </i>
      </div>
      <div class="col-md-3 text-center">
        <h3>{{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
        <h5>{{ currentUser.email }}</h5>
        <h3>{{ currentUser.roles }}</h3>
      </div>
    </div> -->
    <!-- <div class="card mb-3 bg-transparent" style="max-width: 440px">
      <div class="row g-0">
        <div class="col-md-4 col-sm-12">
          <i>
            <font-awesome-icon class="h-75 w-100" icon="user-graduate" />
          </i>
        </div>
        <div class="col-md-8 col-sm-12">
          <div class="card-body text-center">
            <h5 class="card-title">
              {{ currentUser.firstName }} {{ currentUser.lastName }}
            </h5>
            <p class="card-text">{{ currentUser.email }}</p>
            <p class="card-text">
              <small class="text-muted">{{ currentUser.roles }}</small>
            </p>
          </div>
        </div>
      </div>
    </div> -->
    <h3>{{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
    <h5>{{ currentUser.email }}</h5>
    <hr class="mt-3" />
    <div class="row d-flex align-content-stretch flex-wrap">
      <div class="col-md-4" v-if="exams">
        <div class="card border-secondary bg-transparent">
          <div class="card-header border-secondary h-100">
            Exams
            <router-link
              :to="{ name: 'ExamsStudent' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3">
              <div class="col-md-6 col-sm-6 text-center">
                <h4>Exams</h4>
                <h2>{{ exams.length }}</h2>
              </div>
              <div class="col-md-6 col-sm-6 text-center">
                <i>
                  <font-awesome-icon class="fs-1" icon="graduation-cap" />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4" v-if="reports">
        <div class="card border-secondary bg-transparent h-100">
          <div class="card-header border-secondary">
            Reports
            <router-link
              :to="{ name: 'HistoryStudent' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3">
              <div class="col-md-6 col-sm-6 text-center">
                <h4>Reports</h4>
                <h2>{{ reports.length }}</h2>
              </div>
              <div class="col-md-6 col-sm-6 text-center">
                <i>
                  <font-awesome-icon class="fs-1" icon="clipboard-list" />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-4 " v-if="currentUser">
        <div class="card border-secondary bg-transparent h-100">
          <div class="card-header border-secondary">
            Profile
            <router-link
              :to="{ name: 'ProfileStudent' }"
              class="btn text-white"
              style="float: right !important"
              >View</router-link
            >
          </div>
          <div class="card-body">
            <div class="row p-3">
              <div class="col-md-6 col-sm-6 text-center">
                <h4>Profile</h4>
              </div>
              <div class="col-md-6 col-sm-6 text-center">
                <i>
                  <font-awesome-icon class="fs-1" icon="circle-user" />
                </i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import authService from "@/_services/authService.js";
import usersService from "@/_services/userService.js";
import reportService from "@/_services/reportService.js";
import handleResponse from "@/_helpers/handleResponse.js";
export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);

    const exams = ref(null);
    const reports = ref(null);

    const { currentUser } = authService();
    const { getUserExams } = usersService();
    const { getReportsByUserId } = reportService();

    onMounted(async () => {
      let responseExams = await getUserExams(currentUser.value.id);

      if (responseExams && responseExams.value) {
        if (responseExams.value.status === 200) {
          console.log(responseExams.value.data);
          exams.value = responseExams.value.data.items;
        } else {
          handleResponse(responseExams.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }

      let responseReports = await getReportsByUserId(currentUser.value.id);

      if (responseReports && responseReports.value) {
        if (responseReports.value.status === 200) {
          reports.value = responseReports.value.data;
        } else {
          handleResponse(responseReports.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    });

    return { currentUser, exams, reports };
  },
};
</script>



<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Audiowide&family=Iceland&display=swap");

* {
  font-family: "Audiowide", sans-serif;
}

h4 {
  font-size: calc( 20 * (100vw / 1280)) !important;
}

@media (max-width: 767px) {
  h4 {
    font-size: calc(24px + (16 + 16 * 0.7) * ((100vw - 320px) / 1280))
  }
}

/* body {
  overflow: hidden;
  background-color: #232526;
} */

/* .text-animation {
  position: absolute;
  top: 24%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  font-family: "Audiowide", sans-serif;
  color: rgb(240, 240, 240);
  font-size: 28px;
} */

/* .text-animation span {
  position: relative;
  opacity: 0;
  animation: textAnimation 2s ease-in-out forwards;
} */

/* @keyframes textAnimation {
  to {
    top: 0;
    left: 0;
    opacity: 1;
  }
} */
/* 
hr {
  position: relative;
  border: 0.7px solid rgb(0, 87, 102);
  left: 50%;
  width: 100%;
  animation: lineAnimation 1.1s ease-in-out forwards;
  animation-delay: 1.4s;
  opacity: 0;
    overflow: hidden;

} */

/* @keyframes lineAnimation {
  to {
    top: 0;
    left: 0;
    opacity: 1;
  }
} */

/* .text-createby {
  position: absolute;
  display: flex;
  justify-content: space-between;
  bottom: 30px;
  left: 10%;
  width: 80%;
  font-family: "Audiowide", sans-serif;
  font-size: 14px;
  color: rgb(104, 104, 104);
  animation: createbyAnimation 1.2s ease-in-out forwards;
  animation-delay: 1.4s;
  opacity: 0;
} */
/* 
@keyframes createbyAnimation {
  to {
    opacity: 1;
  }
} */

/* .text-logoAnimation{

    position: absolute;
    top: 40%;
    text-align: center;
    width: 100%;
    font-family: "Audiowide", sans-serif;
    color: rgb(27, 27, 27);
    font-size: 90px;
} */
</style>