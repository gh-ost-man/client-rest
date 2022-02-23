<template>
  <div class="p-5">
    <form @submit.prevent="sendMessage">
      <h3 class="text-info">Register</h3>
      <div class="form-group mt-1">
        <label class="c-label">
          
          <font-awesome-icon icon="user-graduate" />
          First name
        </label>
        <input
          type="text"
          class="form-control c-input"
          v-model.trim="newUser.firstName"
          :disabled="loading"

        />
      </div>
      <div class="form-group mt-1">
        <label class="c-label">
          <font-awesome-icon icon="user-graduate" />
          Last name
        </label>
        <input
          type="text"
          class="form-control c-input"
          v-model.trim="newUser.lastName"
          :disabled="loading"
        />
      </div>
      <div class="form-group mt-1">
        <label class="c-label">
           <font-awesome-icon icon="at" />
          Email address</label
        >
        <input
          type="email"
          class="form-control c-input"
          v-model.trim="newUser.email"
          :disabled="loading"
        />
      </div>
      <div class="form-group mt-1">
        <label class="c-label">
           <font-awesome-icon icon="lock" />
          Password</label
        >
        <input
          type="password"
          class="form-control c-input"
          id="exampleInputPassword1"
          v-model="newUser.password"
          :disabled="loading"
        />
      </div>
      <div class="form-group mt-1">
        <label class="c-label">
           <font-awesome-icon icon="circle-info" />

          Additional Info</label
        >
        <textarea
          type="text"
          class="form-control c-input"
          v-model.trim="newUser.additionalInfo"
          :disabled="loading"
        ></textarea>
      </div>
      <button class="btn btn-outline-info mt-3" :disabled="loading">
        <span v-if="!loading">Register</span>
        <span v-else>Registering ...</span>
      </button>
      <router-link
        class="btn btn-outline-light mt-3 mx-1"
        :disabled="loading"
        :to="{ name: 'Login' }"
        >Login</router-link
      >
    </form>
    <code-dialog v-model:show="dialogVisible" @submit="submitHandle"></code-dialog>
    
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";
import CodeDialog from "@/components/AccessCodeDialog.vue";
export default {
  components: { CodeDialog },

  setup() {
    const loading = ref(false);
    const toast = getCurrentInstance().appContext.app.$toast;
    const router = useRouter();
    const newUser = ref({
      firstName: null,
      lastName: null,
      email: null,
      password: null,
      additionalInfo: null,
      code: -1,
    });
    const dialogVisible = ref(false);
    const { register, accessCode } = authService();

    const sendMessage = async () => {

      if(!newUser.value.firstName ||newUser.value.firstName==='') {
        toast.error("First name is required");
        return
      }
       if(!newUser.value.lastName ||newUser.value.lastName==='') {
        toast.error("Last name is required");
        return
      }
       if(!newUser.value.email ||newUser.value.email==='') {
        toast.error("Email is required");
        return
      }
       if(!newUser.value.password ||newUser.value.password==='') {
        toast.error("Password is required");
        return
      }


      loading.value = true;
      let resAccessCode = await accessCode(newUser.value);
      loading.value = false;
      if (resAccessCode && resAccessCode.value) {
        if (resAccessCode.value.status === 204) {
          console.log(resAccessCode.value.data);
          dialogVisible.value = true;
        } else {
          handleResponse(resAccessCode.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    const submitHandle = async (accessCode) => {
      newUser.value.code = accessCode;
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
          handleResponse(response.value).forEach((element) => {
            toast.error(element, {
              position: "top",
              duration: 5000,
            });
          });
        }
      }
    };

    return {
      newUser,
      loading,
      dialogVisible,
      submitHandle,
      sendMessage,
    };
  },
};
</script>

<style scopped>
</style>