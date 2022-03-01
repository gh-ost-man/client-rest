<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <button class="btn btn-outline-warning" @click="testHandle">Test</button>
    <button class="btn btn-outline-warning" @click="refreshHandle">
      Refresh Token
    </button>
  </div>
</template>

<script>
import useApi from "../composables/useApi";
import { onMounted } from "@vue/runtime-core";
import CryptoJS from "crypto-js";
// @ is an alias to /src
export default {
  name: "Home",
  methods: {
    testHandle() {
      // let arr = ["Incorect passwrod"];
      // let arr1 = {alpha: 'Incorect alpha'};

      // console.log(arr[0].length);

      // var values = Object.keys(arr).map(function (key) {
      //   console.log(key);
      //   console.log(Number.isInteger(Number.parseInt(key)));

      //   if (!Number.isInteger(Number.parseInt(key))) {
      //     return arr[key].join(", ");
      //   }
      //    else {
      //     return arr[key];
      //   }
      // });

      let pvtData = {
        id:1,
        fName: "John",
        lName: "Smith",
        roles: "Admin,Manager"
      };
      let secret = "123#$%";

      // const data = CryptoJS.AES.encrypt(JSON.stringify(pvtData).toString(), secret).toString();
      // localStorage.setItem("secretData", data);

      const secretData = localStorage.getItem("secretData");

      const decryptData = CryptoJS.AES.decrypt(
        secretData,
        secret
      ).toString(CryptoJS.enc.Utf8);

      console.log(decryptData);
      console.log(JSON.parse(decryptData).id);
    },
  },
  setup() {
    const { refreshToken } = useApi();

    const refreshHandle = async () => {
      // console.log("HERE");
      //  await refreshToken();
      
      let pvtData = localStorage.getItem('user');
      let secret = "123#$%";

      const data = CryptoJS.AES.encrypt(pvtData, secret).toString();
      localStorage.setItem("secretData", data);
    };

    return { refreshHandle };
  },
};
</script>
