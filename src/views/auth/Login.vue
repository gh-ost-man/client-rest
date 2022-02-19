<template>
  <div class="p-5">
    <form>
      <h3 class="text-info">Login</h3>

      <div class="form-group">
        <label class="labels c-label">
          <i class="fa-solid fa-at"></i>
          Email address
        </label>
        <input
          type="email"
          class="form-control c-input"
          v-model="email"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-info">
          <i class="fa-solid fa-key"></i>
          Password
        </label>
        <input
          type="password"
          class="form-control c-input"
          id="exampleInputPassword1"
          v-model="password"
          :disabled="loading"
        />
      </div>
      <button
        @click.prevent="submit"
        :disabled="loading"
        class="btn btn-outline-info mt-2 mx-1"
      >
        Login
      </button>
      <router-link
        class="btn btn-outline-light mt-2 mx-1"
        :to="{ name: 'Register' }"
        >Register</router-link
      >
    </form>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";

export default {
  setup() {
    const loading = ref(null);
    const email = ref("admin@google.com");
    const password = ref("Admin1!");
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { login } = authService();

    const submit = async () => {
      loading.value = true;

      var response = await login({
        email: email.value,
        password: password.value,
      });
      let roles = Role.filter((x) => x !== "Student");

      loading.value = false;

      if (response && response.value) {
        if (response.value.status == 200) {
          let user_roles = null;
          let isStaff = false;

          console.log(user_roles);

          if (response.value.data.user.roles) {
            user_roles = response.value.data.user.roles.split(",");

            for (let role of user_roles) {
              if (roles.includes(role)) {
                isStaff = true;
                break;
              }
            }
          } else {
            router.push({ name: "Forbidden" });
            return;
          }

          if (isStaff) {
            router.push({ name: "ProfileAdmin" });
          } else if (user_roles.includes("Student")) {
            console.log("HERE STUDENT");
            router.push({ name: "Home" });
          } else {
            router.push({ name: "Login" });
          }
        } else {
          loading.value = false;
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    return { email, password, loading, submit };
  },
};
</script>

<style>
</style>