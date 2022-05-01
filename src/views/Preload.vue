<template>
  <div class="anim p-5">
    <div class="preloader text-animation">VCE USER TESTING SYSTEM</div>
    <div class="text-main">
      <span>P</span>
      <span>R</span>
      <span>O</span>
      <span>U</span>
      <span>D</span>
    </div>
    <div class="text-createby">
      <div>Create by: TAlex</div>
      <div>ITSTEP 2022</div>
    </div>
  </div>
</template>


<script >
export default {
  name: "preloader",
  data() {
    return {
      show: true,
    };
  },
  mounted() {
    this.showToggle()

    document.querySelector(".text-animation").innerHTML = document
      .querySelector(".text-animation")
      .textContent.replace(/./g, "<span>$&</span>");

    let spans = document.querySelectorAll(".text-animation span");

     spans[0].style.left = "-" + innerWidth * Math.random() + "px";
  
    for (let i = 0; i < spans.length; i++) {
      let left = innerWidth * Math.random() * (0.5 - 0.01) + 0.01;
      let top = innerHeight * Math.random() * (0.5 - 0.01) + 0.01;

      if (Math.random() < 0.5) {
        spans[i].style.left = "-" + left + "px";
      } else {
        spans[i].style.left = left + "px";
      }

      if (Math.random() < 0.5) {
        spans[i].style.top = "-" + top + "px";
      } else {
        spans[i].style.top = top + "px";
      }
    }

    let hr = document.createElement("hr");
    document.querySelector(".text-animation").append(hr);
  },

  methods: {
    showToggle() {
      setTimeout(() => {
        this.show = false;
        this.$router.push({ name: "Login" });
      }, 5000);
    },
  },
};
</script>

<style scoped>
@import "../assets/css/animation.css";
@import url("https://fonts.googleapis.com/css2?family=Audiowide&display=swap");
@import url("https://fonts.googleapis.com/css2?family=Audiowide&family=Iceland&display=swap");


</style>