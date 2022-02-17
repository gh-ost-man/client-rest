<template>
  <div class="p-5">
    <div v-if="error">
      <textarea
        class="form-control bg-dark text-secondary border-0"
        style="overflow: hidden"
        cols="30"
        rows="15"
        :value="error"
        readonly
      ></textarea>
    </div>
    <form @submit.prevent="getAccessCode">
      <h3 class="text-white">Register</h3>
      <div class="form-group">
        <label class="text-white">First name</label>
        <input
          type="text"
          class="form-control"
          v-model="newUser.firstName"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-white">Last name</label>
        <input
          type="text"
          class="form-control"
          v-model="newUser.lastName"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-white">Email address</label>
        <input
          type="email"
          class="form-control"
          v-model="newUser.email"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-white">Password</label>
        <input
          type="password"
          class="form-control"
          id="exampleInputPassword1"
          v-model="newUser.password"
          :disabled="loading"
        />
      </div>
      <div class="form-group">
        <label class="text-white">Additional Info</label>
        <textarea
          type="text"
          class="form-control"
          v-model="newUser.additionalInfo"
          :disabled="loading"
        ></textarea>
      </div>
      <button class="btn btn-primary">Register</button>
    </form>
    <my-dialog v-model:show="dialogVisible" @submit="submitHandle">
      <h1>Hello</h1>
    </my-dialog>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";
import MyDialog from "@/components/MyDialog.vue";
export default {
  components: { MyDialog },

  setup() {
    const error = ref(null);
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const router = useRouter();
    let resAccessCode = null;
    const newUser = ref({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      additionalInfo: null,
      code:null,
    });
    const dialogVisible = ref(false);
    const { register, accessCode } = authService();

    const getAccessCode = async () => {
     

      resAccessCode = await accessCode({ email: newUser.value.email });
      if (resAccessCode && resAccessCode.value) {
        if (resAccessCode.value.status === 204) {
          console.log(resAccessCode.value.data);
           dialogVisible.value = true;
        } else {
          error.value = handleResponse(resAccessCode.value);
        }
      }
    };

    const submitHandle = async (accessCode) => {
      newUser.value.code = accessCode;
      error.value = null;
      loading.value = true;
      var response = await register(newUser.value);
      loading.value = false;
      let roles = Role.filter((x) => x !== "Student");

      if (response && response.value) {
        if (response.value.status == 200) {
          toast.success("Register Successfully");

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
            router.push({ name: "Home" });
          } else {
            router.push({ name: "Login" });
          }
        } else {
          toast.error("Some errors");
          error.value = handleResponse(response.value);
        }
      }
    };

    return {
      newUser,
      error,
      loading,
      dialogVisible,
      submitHandle,
      getAccessCode,
    };
  },
};
</script>

<style scopped>
</style>