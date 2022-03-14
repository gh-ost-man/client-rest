<template>
  <div class="rounded mt-5 mb-5">
    <div class="row">
      <div class="col-md-12 border-right mb-3 text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right c-title">
              <i><font-awesome-icon icon="circle-user" /></i>
              Profile
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row">
            <div class="col-md-12">
              <label class="labels text-info c-text">First name</label>
              <p class="text-warning mx-2">{{ currentUser.firstName }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">Last name</label>
              <p class="text-warning mx-2">{{ currentUser.lastName }}</p>
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels text-info c-text">Email</label>
              <p class="text-warning mx-2">{{ currentUser.email }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">Roles</label>
              <p class="text-warning mx-2">{{ currentUser.roles }}</p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels text-info c-text">CreatedAt</label>
              <p class="text-warning mx-2">
                {{ new Date(currentUser.createdAt).toLocaleString() }}
              </p>
            </div>
            <div class="col-md-12">
              <label class="labels text-info c-text">UpdatedAt</label>
              <p class="text-warning mx-2">
                {{ new Date(currentUser.createdAt).toLocaleString() }}
              </p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels text-info c-text">Additional info</label>
              <p class="text-warning mx-2">{{ currentUser.additionalInfo }}</p>
            </div>
            <hr class="bg-info" />
          </div>
        </div>
      </div>
      <div class="col-md-6">
        <label class="labels c-label">
          <i class="m-2 fs-5"><font-awesome-icon icon="at" /></i>
          Change Email </label
        ><input
          type="text"
          class="form-control bg-transparent text-white c-input"
          placeholder="enter email"
          v-model.trim="userEmail"
        />
        <button
          class="btn btn-outline-info mt-2"
          @click="sendMessageHandle"
          :disabled="loading || userEmail === currentUser.email || !userEmail"
        >
          Update
        </button>
      </div>
      <div class="col-md-6"></div>
      <div class="col-md-6 border-right text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right text-info">
              <i class="fa-solid fa-user-gear">
                <font-awesome-icon icon="user-gear" />
              </i>
              Profile Settings
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-2">
            <div class="col-md-6">
              <label class="labels c-label">
                <i class="m-2 fs-5"><font-awesome-icon icon="user" /></i>
                First name</label
              ><input
                type="text"
                class="form-control bg-transparent text-white c-input"
                placeholder="first name"
                v-model.trim="userUpdateObj.firstName"
              />
            </div>
            <div class="col-md-6">
              <label class="labels c-label">
                <i class=" m-2 fs-5"><font-awesome-icon icon="user" /></i>
                Last name</label
              ><input
                type="text"
                class="form-control bg-transparent text-white c-input"
                v-model.trim="userUpdateObj.lastName"
                placeholder="surname"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12 mt-2">
              <label class="labels c-label">
                <i class=" m-2 fs-5"><font-awesome-icon icon="circle-info" /></i>
                Additional info</label
              ><textarea
                class="form-control bg-transparent text-white c-input"
                placeholder="enter additional info"
                v-model.trim="userUpdateObj.additionalInfo"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
              @click="saveProfileHandle"
              :disabled="loading"
              type="button"
            >
              Save Profile
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right text-info">
              <i><font-awesome-icon icon="lock" /></i>
              Change password
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="m-2 fs-5"><font-awesome-icon icon="lock" /></i>
                Current password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter password"
                v-model="changePasswordObj.currentPassword"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="m-2 fs-5"><font-awesome-icon icon="lock" /></i>
                New password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter New password"
                v-model="changePasswordObj.newPassword"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">
                <i class="m-2 fs-5"><font-awesome-icon icon="lock" /></i>
                Confirm password</label
              ><input
                type="password"
                class="form-control bg-transparent text-white c-input"
                placeholder="enter Confirm password"
                v-model="changePasswordObj.confirmPassword"
              />
            </div>
          </div>
          <hr class="bg-info" />
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
              @click="changePasswordHandle"
              type="button"
              :disabled="loading"
            >
              Change password
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  <code-dialog
    v-model:show="dialogVisible"
    @submit="updateEmailHandle"
  ></code-dialog>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRouter } from "vue-router";
import handleResponse from "@/_helpers/handleResponse.js";
import Role from "@/_helpers/_role.js";
import authService from "@/_services/authService.js";
import userService from "@/_services/userService.js";
import CodeDialog from "@/components/AccessCodeDialog.vue";
export default {
  components: { CodeDialog },
  setup() {
    const { currentUser, setAuth, setAuthUser } = authService();
    const { update, changePassword, getUserById, sendMessage, updateEmail } =
      userService();
    const loading = ref(false);
    const error = ref(null);
    const toast = getCurrentInstance().appContext.app.$toast;
    const dialogVisible = ref(false);
    const userEmail = ref(null);

    onMounted(async () => {
      await getUserData();
     
    });

    const getUserData = async () => {
      let res = await getUserById(currentUser.value.id);

      if (res && res.value) {
        if (res.value.status === 200) {
          setAuthUser(res.value.data);
           userEmail.value = currentUser.value.email;
        }
      }
    };

    const userUpdateObj = ref({
      id: currentUser.value.id,
      firstName: currentUser.value.firstName,
      lastName: currentUser.value.lastName,
      additionalInfo: currentUser.value.additionalInfo,
    });
    const changePasswordObj = ref({
      idUser: currentUser.value.id,
      currentPassword: null,
      newPassword: null,
      confirmPassword: null,
    });

    const saveProfileHandle = async () => {
      loading.value = true;

      // console.log(userUpdateObj.value);
      let response = await update(userUpdateObj.value);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Update Successfully");
          await getUserData();
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

    const changePasswordHandle = async () => {
      if (
        changePasswordObj.value.currentPassword &&
        changePasswordObj.value.newPassword &&
        changePasswordObj.value.confirmPassword
      ) {
        if (
          changePasswordObj.value.newPassword !==
          changePasswordObj.value.confirmPassword
        ) {
          toast.error("Passwords mismatch!");
        } else {
          console.log(changePasswordObj.value);
          loading.value = true;
          let response = await changePassword(changePasswordObj.value);
          loading.value = false;

          if (response && response.value) {
            if (response.value.status === 204) {
              toast.success("Password changed successfully!");
              changePasswordObj.value = {
                idUser: currentUser.value.id,
                currentPassword: null,
                newPassword: null,
                confirmPassword: null,
              };
            } else {
              handleResponse(response.value).forEach((element) => {
                toast.error(element, {
                  position: "top",
                  duration: 5000,
                });
              });
            }
          }
        }
      } else {
        toast.error("Fill all fields!");
      }
    };

    const sendMessageHandle = async () => {
      if (!userEmail.value) {
        toast.error("Email is required");
        return;
      }

      loading.value = true;
      let response = await sendMessage({
        id: currentUser.value.id,
        email: userEmail.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          return;
        }

        if (response.value.status === 200) {
          dialogVisible.value = true;
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

    const updateEmailHandle = async (accessCode) => {
      let response = await updateEmail({
        id: currentUser.value.id,
        email: userEmail.value,
        accessCode: accessCode,
      });

      if (response && response.value) {
        if (response.value.status === 200) {
          dialogVisible.value = false;
          toast.success("Email updated successfully");
          await getUserData();
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
      // error,
      userEmail,
      currentUser,
      dialogVisible,
      userUpdateObj,
      changePasswordObj,
      saveProfileHandle,
      changePasswordHandle,
      sendMessageHandle,
      updateEmailHandle,
    };
  },
};
</script>

<style scopped>
.c-text {
  text-transform: uppercase;
  letter-spacing: 2px;
  font-weight: 500;
}

/* .c-logo span {
  animation:  animate 5s linear infinite;
}

@keyframes animate {
    0%, 18%, 50.1%, 60%, 65.1%, 80%, 90.1%, 92%{
        color: #0e3742;
        text-shadow: none;
    }
    18.1%, 20.1%,30%,50%, 60.1%, 65%,80.1%, 90%, 92.1%, 100% {
        color:#fff;
        text-shadow:  0 0 10px #03bcf4,
        0 0 20px #03bcf4,
        0 0 40px #03bcf4,
        0 0 80px #03bcf4,
        0 0 160px #03bcf4,
        0 0 400px #03bcf4;
    }
} */

.c-label {
  color: cyan;
}

.c-input {
  color: #ffc107 !important;
  border: 0 !important;
  border-bottom: 1px solid #ffc107 !important;
}
.c-input:focus {
  border: 1px solid cyan !important;
  border-color: cyan !important;
}
</style>