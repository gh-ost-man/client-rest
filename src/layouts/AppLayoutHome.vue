<template>
  <div>
    <header class="">
      <nav class="navbar navbar-expand-lg navbar-light bg-light $blue-700">
        <div class="container">
          <a class="navbar-brand" href="#">Navbar</a>
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
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
              </li>
              <li class="nav-item dropdown">
                <a
                  class="nav-link dropdown-toggle"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Dropdown
                </a>
                <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li><a class="dropdown-item" href="#">Action</a></li>
                  <li><a class="dropdown-item" href="#">Another action</a></li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a class="dropdown-item" href="#">Something else here</a>
                  </li>
                </ul>
              </li>
              <li class="nav-item">
                <a
                  class="nav-link disabled"
                  href="#"
                  tabindex="-1"
                  aria-disabled="true"
                  >Disabled</a
                >
              </li>
            </ul>
            <div class="d-flex">
              <div class="d-flex justify-content-center">
                <div><i class="fa-solid fa-user-graduate fs-3"></i></div>
                <div>student@google.com</div>
              </div>
              <button class="btn btn-dark mx-1" @click="logoutHandle">Logout</button>
            </div>
            <!-- <form class="d-flex">
              <input
                class="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button class="btn btn-outline-success" type="submit">
                Search
              </button>
            </form> -->
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
