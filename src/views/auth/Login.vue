<template>
  <div class="p-5">
    <div v-if="error">
      <textarea
        class="form-control bg-dark text-secondary border-0"
        style="overflow: hidden"
        cols="30"
        rows="15"
        :value="error"
      ></textarea>
    </div>
    <form>
      <h3 class="text-white">Login</h3>

      <div class="form-group">
        <label class="text-white">Email address</label>
        <input
          type="email"
          class="form-control"
          v-model="email"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-white">Password</label>
        <input
          type="password"
          class="form-control"
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
      <router-link class="btn btn-outline-light mt-2 mx-1" :to="{ name: 'Register' }">Register</router-link>
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
    const error = ref(null);
    const email = ref("admin@google.com");
    const password = ref("Admin1!");
    const router = useRouter();
    const toast = getCurrentInstance().appContext.app.$toast;
    const { login } = authService();

    const submit = async () => {
      loading.value = true;
      error.value = null;

      var response = await login({
        email: email.value,
        password: password.value,
      });
      let roles = Role.filter((x) => x !== "Student");

      loading.value = false;

      if (response && response.value) {
        if (response.value.status == 200) {
          let user_roles = response.value.data.user.roles.split(",");
          let isStaff = false;

          if (user_roles) {
            for (let role of user_roles) {
              if (roles.includes(role)) {
                isStaff = true;
                break;
              }
            }
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
          error.value = handleResponse(response.value);
        }
      }
    };

    return { email, password, loading, error, submit };
  },
};
</script>

<style>
</style>