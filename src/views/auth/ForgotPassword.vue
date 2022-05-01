<template>
  <div class="p-3">
    <div class="w-50 m-auto mt-5" v-if="!flag">
      <form>
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
        <button
          class="btn btn-outline-info mt-3"
          @click.prevent="sendEmailHandle"
          :disabled="loading"
        >
          Submit
        </button>
      </form>
    </div>
    <div class="w-50 m-auto mt-5" v-if="flag">
      <form>
        <div class="form-group mb-2">
          <label class="labels c-label">
            <font-awesome-icon icon="key" />
            Code
          </label>
          <input
            type="text"
            class="form-control c-input"
            v-model="code"
            :disabled="loading"
          />
        </div>
        <div class="form-group mb-2">
          <label class="labels c-label">
            <font-awesome-icon icon="lock" />
            New password
          </label>
          <input
            type="password"
            class="form-control c-input"
            v-model="newPassword"
            :disabled="loading"
          />
        </div>
        <div class="form-group mb-2">
          <label class="labels c-label">
            <font-awesome-icon icon="lock" />
            Confirm password
          </label>
          <input
            type="password"
            class="form-control c-input"
            v-model="confirmPassword"
            :disabled="loading"
          />
        </div>
        <button
          class="btn btn-outline-info"
          :disabled="loading"
          @click.prevent="setNewPasswordHanlde"
        >
          Submit
        </button>
        <button class="btn btn-outline-light mx-2" @click.prevent="sendEmailHandle">
          Send a new code
        </button>
      </form>
    </div>
    <div></div>
  </div>
</template>

<script>
import { ref, getCurrentInstance } from "vue";
import authService from "@/_services/authService.js";
import handleResponse from "@/_helpers/handleResponse.js";
import { useRouter } from "vue-router";
import Role from "@/_helpers/_role.js";
export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);
    const router = useRouter();
    const flag = ref(false);

    const { forgotPassword, setNewPassword, login } = authService();

    const code = ref(null);
    const email = ref(null);
    const newPassword = ref(null);
    const confirmPassword = ref(null);

    const sendEmailHandle = async () => {
      if (!email.value) {
        toast.error("Email is required", {
          position: "top",
          duration: 3000,
        });

        return;
      }
      console.log("send");
      loading.value = true;
      let response = await forgotPassword({
        email: email.value,
        type: "message",
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 200) {
          flag.value = true;
          toast.info("Code was send to your email: " + email.value);
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

    const setNewPasswordHanlde = async () => {
      if (!code.value) {
        toast.error("Code is required", {
          position: "top",
          duration: 3000,
        });
        return;
      }

      var reg = new RegExp("^[0-9]*$");

      if (reg.test(code.value) == false) {
        toast.error("Code: Only Numeric is allowed.");
        return;
      }

      if (!newPassword.value) {
        toast.error("New password is required", {
          position: "top",
          duration: 3000,
        });
        return;
      }
      if (!confirmPassword.value) {
        toast.error("Confirm password is required", {
          position: "top",
          duration: 3000,
        });
        return;
      }
      if (newPassword.value !== confirmPassword.value) {
        toast.error("Passwords mismatch", {
          position: "top",
          duration: 3000,
        });
        return;
      }

      loading.value = true;
      let response = await setNewPassword({
        email: email.value,
        password: newPassword.value,
        accessCode: code.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 200) {
          let reslogin = await login({
            email: email.value,
            password: newPassword.value,
          });

          let roles = Role.filter((x) => x !== "Student");

          loading.value = false;

          if (reslogin && reslogin.value) {
            if (reslogin.value.status == 200) {
              let user_roles = null;
              let isStaff = false;

              if (reslogin.value.data.user.roles) {
                user_roles = reslogin.value.data.user.roles.split(",");

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
              handleResponse(reslogin.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
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
      loading,
      flag,
      code,
      email,
      newPassword,
      confirmPassword,
      sendEmailHandle,
      setNewPasswordHanlde,
    };
  },
};
</script>

<style>
</style>