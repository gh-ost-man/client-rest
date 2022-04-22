<template>
  <div>
    <header class="">
      <nav class="navbar navbar-expand-lg navbar-light bg-light $blue-700">
        <div class="container">
          <!-- <a class="navbar-brand" href="#">ITSTEP</a> -->
          <router-link class="navbar-brand" :to="{name: 'HomeStudent'}">PROUD</router-link>
          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
              <li class="nav-item">
                <router-link class="nav-link active" :to="{name: 'ExamsStudent'}">Exams</router-link>
              </li>
              <li class="nav-item">
                 <router-link class="nav-link active" :to="{name: 'ProfileStudent'}">Profile</router-link>
              </li>
              <li class="nav-item">
                 <router-link class="nav-link active" :to="{name: 'HistoryStudent'}">History</router-link>
              </li>
            </ul>
            <div class="d-flex">
              <div class="d-flex justify-content-center">
                <div><i class="fa-solid fa-user-graduate fs-3"></i></div>
                <div>
                  <div> {{$store.state.user?.firstName}} {{$store.state.user?.lastName}}</div>
                  <div> {{$store.state.user?.email}}</div>
                </div>
              </div>
              <button class="btn btn-dark mx-1" @click="logoutHandle">Logout</button>
            </div>
          </div>
        </div>
      </nav>
    </header>

    <div class="container">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import authService from "@/_services/authService.js";
import { computed, ref, watch, watchEffect } from "vue";
import { useRouter } from "vue-router";
export default {
  name: "home-layout",
  setup() {
    const { logOut } = authService();
    const router = useRouter();

    const logoutHandle = () => {
      console.log("click");
      logOut();

      router.push({ name: "Login" });
    };

    return { logoutHandle };
  },
};
</script>

<style scoped>
</style>
