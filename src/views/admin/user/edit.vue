<template>
  <div class="rounded mt-5 mb-5">
      <router-link :to="{name:'UsersList'}" class="btn btn-outline-info"><i><font-awesome-icon icon="circle-arrow-left" /></i></router-link>
    <div class="row">
      <div class="col-md-12 border-right mb-3 text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right c-title">
              <i><font-awesome-icon icon="circle-user" /></i>
              User
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-2">
            <div class="col-md-12">
              <label class="labels c-label">First name</label>
              <p class="text-warning mx-2">{{ user.firstName }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels c-label">Last name</label>
              <p class="text-warning mx-2">{{ user.lastName }}</p>
            </div>
          </div>
          <hr class="bg-info" />
          <div class="row mt-3">
            <div class="col-md-12">
              <label class="labels c-label">Email</label>
              <p class="text-warning mx-2">{{ user.email }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels c-label">Roles</label>
              <p class="text-warning mx-2">{{ user.roles }}</p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels c-label">CreatedAt</label>
              <p class="text-warning mx-2">{{ new Date(user.createdAt).toLocaleString() }}</p>
            </div>
            <div class="col-md-12">
              <label class="labels c-label">UpdatedAt</label>
              <p class="text-warning mx-2">{{ new Date(user.updatedAt).toLocaleString() }}</p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <label class="labels c-label">Additional info</label>
              <p class="text-warning mx-2">{{ user.additionalInfo }}</p>
            </div>
            <hr class="bg-info" />
            <div class="col-md-12">
              <button
                class="btn btn-outline-danger"
                @click="removeUserHandle"
                :disabled="loading"
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right text-info">
              <i><font-awesome-icon icon="key" /></i>
              Add Role
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-2">
            <div class="col-md-12">
             
              <label class="labels c-label">
                 <i class="m-2 fs-5"><font-awesome-icon icon="key" /></i>
                Role</label>
              <select
                class="form-select text-white  c-select"
                v-model.trim="newRole"
              >
                <option
                  class="text-white"
                  v-for="r in roles"
                  :key="r.value"
                  :value="r.value"
                >
                  {{ r.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
              @click="addRoleHandle"
              :disabled="loading"
              type="button"
            >
              Add role
            </button>
          </div>
        </div>
      </div>
      <div class="col-md-6 border-right text-white" v-if="user">
        <div class="p-3 py-5">
          <div class="d-flex justify-content-between align-items-center mb-3">
            <h4 class="text-right text-info">
              <i><font-awesome-icon icon="key" /></i>
              Remove Role
            </h4>
          </div>
          <hr class="bg-info" />
          <div class="row mt-2">
            <div class="col-md-12">
             
              <label class="labels c-label">
                 <i class="m-2 fs-5"><font-awesome-icon icon="key" /></i>
                Role</label>
              <select
                class="form-select text-white  c-select"
                v-model.trim="roleRemove"
              >
                <option
                  class="text-white"
                  v-for="r in userRoles"
                  :key="r.value"
                  :value="r.value"
                >
                  {{ r.title }}
                </option>
              </select>
            </div>
          </div>
          <div class="mt-5">
            <button
              class="btn btn-outline-info profile-button"
              @click="removeRoleHandle"
              type="button"
            >
              Remove role
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-center" v-if="loading">
      <div
        class="spinner-border align-center text-primary text-center"
        role="status"
      >
        <span class="visually-hidden">Loading...</span>
      </div>
    </div>
  </div>

  <div
    class="modal fade show"
    id="exampleModal"
    tabindex="1"
    aria-labelledby="exampleModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">Modal title</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
          ></button>
        </div>
        <div class="modal-body">...</div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
          >
            Close
          </button>
          <button type="button" class="btn btn-primary">Save changes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, getCurrentInstance, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import handleResponse from "@/_helpers/handleResponse.js";
import userService from "@/_services/userService.js";
import Role from "@/_helpers/_role.js";
export default {
  setup() {
    const toast = getCurrentInstance().appContext.app.$toast;
    const loading = ref(false);

    const { update, changePassword, getUserById, addRole, removeRole, removeUser } =
      userService();

    const route = useRoute();
    const router = useRouter();
    
    const user = ref(null);
    const userUpdateObj = ref(null);
    const changePasswordObj = ref(null);
    const roles = ref([]); // list of roles that the user does not have
    const userRoles = ref([]); // list of user roles
    const newRole = ref(null); // role for add
    const roleRemove = ref(null); // role f remove

    /**
     * Gets data of user
     */
    const fetchData = async () => {
      userRoles.value = [];
      roles.value = [];
      newRole.value = null;
      roleRemove.value = null;
      loading.value = true;
      let response = await getUserById(route.params.id);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 200) {
          user.value = response.value.data;

          Role.forEach((element) => {
            if (!user.value.roles.includes(element)) {
              roles.value.push({ title: element, value: element });
            }
          });

          let arr = user.value.roles.split(",");
          arr.forEach((element) => {
            userRoles.value.push({ title: element, value: element });
          });

          userUpdateObj.value = {
            id: user.value.id,
            firstName: user.value.firstName,
            lastName: user.value.lastName,
            email: user.value.email,
            additionalInfo: user.value.additionalInfo,
          };

          changePasswordObj.value = {
            idUser: user.value.id,
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
    };

    onMounted(async () => {
      await fetchData();
    });

    /**
     * Updates data of user
     */
    const saveProfileHandle = async () => {
      loading.value = true;

      let response = await update(userUpdateObj.value);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Update Successfully");
          await fetchData();
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

    /**
     * Changes password of user
     */
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
                idUser: user.value.id,
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

    /**
     * Add new role to user
     */
    const addRoleHandle = async () => {
      loading.value = true;

      let response = await addRole({
        userId: user.value.id,
        role: newRole.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Role added successfully");
          await fetchData();
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

    /**
     * Delete role from user
     */
    const removeRoleHandle = async () => {
    
      loading.value = true;

      let response = await removeRole({
        userId: user.value.id,
        role: roleRemove.value,
      });
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success("Role removed successfully");
          await fetchData();
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

    /**
     * Delete user
     */
    const removeUserHandle = async () => {
     
      loading.value = true;
      let response = await removeUser(user.value.id);
      loading.value = false;

      if (response && response.value) {
        if (response.value.status === 204) {
          toast.success(`User ${user.value.email} removed successfully`);
          router.push({ name: "UsersList" });
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
      user,
      newRole,
      roleRemove,
      userRoles,
      roles,
      userUpdateObj,
      changePasswordObj,
      saveProfileHandle,
      changePasswordHandle,
      addRoleHandle,
      removeRoleHandle,
      removeUserHandle,
    };
  },
};
</script>

<style>
</style>