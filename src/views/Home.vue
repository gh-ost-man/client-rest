<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />

    <button class="btn btn-outline-warning" @click="testHandle">Test</button>
    <button class="btn btn-outline-warning" @click="refreshHandle">Refresh Token</button>
  </div>
</template>

<script>
import useApi from "../composables/useApi"
import { onMounted } from '@vue/runtime-core';
// @ is an alias to /src
export default {
  name: "Home",
  methods: {
    testHandle() {
      let arr = ["Incorect passwrod"];
      let arr1 = {alpha: 'Incorect alpha'};

      console.log(arr[0].length);

      var values = Object.keys(arr).map(function (key) {
        console.log(key);
        console.log(Number.isInteger(Number.parseInt(key)));

        if (!Number.isInteger(Number.parseInt(key))) {
          return arr[key].join(", ");
        }
         else {
          return arr[key];
        }
      });

      //console.log(values);
    },
   
  },
   setup() {
        const {refreshToken} = useApi();

        const refreshHandle = async() => {
          console.log("HERE");
           await refreshToken();
        };

      return {refreshHandle}
    }
};
</script>
