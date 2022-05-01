<template>
  <div class="p-5">
    <form class="w-50 m-auto login">
      <h3 class="text-info">Login</h3>

      <div class="form-group">
        <label class="labels c-label">
          <font-awesome-icon icon="at" />
          Email address
        </label>
        <input
          type="email"
          class="form-control c-input"
          v-model.trim="email"
          :disabled="loading"
        />
      </div>
      <div class="form-group mt-2">
        <label class="text-info c-label">
          <font-awesome-icon icon="key" />
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
      <p class="text-white text-end mt-1" v-if="!loading" @click="$router.push({name: 'ForgotPassword'})" style="cursor:pointer;">Forgot password?</p>
      <button
        @click.prevent="submit"
        :disabled="loading"
        class="btn btn-outline-info mt-2 mx-1"
        
      >
        Login
      </button>
      <!-- <router-link class="btn btn-outline-info mt-2" :to="{name: 'ForgotPassword'}" v-if="!loading">Forgot password</router-link> -->
      <router-link
        class="btn btn-outline-light mt-2 mx-1"
        :to="{ name: 'Register' }"
        v-if="!loading"
      >
        Register
      </router-link>
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
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(null);

    const email = ref(null);
    const password = ref(null);

    const router = useRouter();

    const { login } = authService();

    const submit = async () => {
      loading.value = true;

      //Send data
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

          //If roles is staff
          if (isStaff) {
            router.push({ name: "HomeAdmin" });
          } else if (user_roles.includes("Student")) {
            console.log("HERE STUDENT");
            router.push({ name: "HomeStudent" });
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

<style scoped>
.login {
  margin-top: 10% !important;
}
</style>