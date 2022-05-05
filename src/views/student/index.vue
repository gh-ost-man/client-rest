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
    <!-- <h3>{{ currentUser.firstName }} {{ currentUser.lastName }}</h3>
    <h5>{{ currentUser.email }}</h5>
    <hr class="mt-3 text-secondary" /> -->
    <div class="body">
      <div v-if="currentUser">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'ProfileStudent' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center ">
                    <i class="text-info "
                      ><font-awesome-icon icon="user-circle"
                    /></i>
                  </h1>
                  <h2 class="text-info">Profile</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary fs-6">
                    Here we can view your profile.
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="exams">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'ExamsStudent' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="graduation-cap"
                    /></i>
                  </h1>
                  <h2 class="text-info">Exams</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary fs-6">
                    Here we can view your exams and pass it.
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
      <div v-if="reports">
        <div class="container-card">
          <div class="card">
            <router-link :to="{ name: 'HistoryStudent' }">
              <div class="box">
                <div class="content">
                  <h1 class="text-center">
                    <i class="text-info"
                      ><font-awesome-icon icon="clipboard-list"
                    /></i>
                  </h1>
                  <h2 class="text-info">Reports</h2>
                  <h3 class="mb-2 text-warning">Description</h3>
                  <p class="text-secondary fs-6">
                    Here we can view your results of exams
                  </p>
                </div>
              </div>
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <!-- <div class="row d-flex align-content-stretch flex-wrap">
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
    </div> -->
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
  font-size: calc(20 * (100vw / 1280)) !important;
}

@media (max-width: 767px) {
  h4 {
    font-size: calc(24px + (16 + 16 * 0.7) * ((100vw - 320px) / 1280));
  }
}

@import url("https://fonts.googleapis.com/css2?family=Jaldi:wght@400;700&&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700&display=swap");

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Poppins", sans-serif;
}
.body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}
.container-card {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  margin: 30px 0;
}
.card {
  background-color: #232427;
}
.container-card .card {
  position: relative;
  min-width: 280px;
  height: 390px;
  /* box-shadow: inset 5px 5px 5px rgba(0, 0, 0, 0.2),
    inset -5px -5px 15px rgba(255, 255, 255, 0.1),
    5px 5px 15px rgba(0, 0, 0, 0.3), -5px -5px 15px rgba(255, 255, 255, 0.1); */
  box-shadow: inset 5px 5px 5px darkcyan, inset -5px -5px 15px darkcyan,
    5px 5px 15px darkcyan, -5px -5px 15px darkcyan;

  border-radius: 15px;
  margin: 30px;
}
.container-card .card .box {
  position: absolute;
  top: 20px;
  left: 20px;
  right: 20px;
  bottom: 20px;
  background: transparent;
  border: 2px solid #2a2b2f;
  border-radius: 15px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
  transition: 0.5s;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  word-wrap: break-word;
}
.container-card .card .box::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  height: 190%;
  /* background: rgba(23, 23, 23, 0.1); */
  pointer-events: none;
}
.container-card .card .box:hover {
  transform: translateY(-50px);
  /* box-shadow: 0 40px 70px rgba(0, 0, 0, 0.05) !important; */
  /* box-shadow: cyan !important; */
}
.container-card .card .box .content {
  padding: 20px;
  text-align: justify;
}
.container-card .card .box .content h2 {
  /* position: absolute; */
  text-align: center;
  margin-top: 5%;
  /* top: 20px; */
  /* right: 20px; */
  font-size: 1.7em;
  /* color: rgba(0, 174, 255, 0.176); */
  color: darkcyan !important;
}
.container-card .card .box .content h3 {
  font-size: 1.3em;
  text-align: center;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;
  padding-top: 65px;
}
.container-card .card .box .content p {
  font-size: 13px;
  font-weight: 300;
  color: rgba(255, 255, 255, 0.5);
  z-index: 1;
  transition: 0.5s;
}

.text-body {
  position: absolute;
}
</style>