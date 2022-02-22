<template>
  <div class="dialog" v-if="show" @click.stop="hideDialog">
    <div @click.stop class="dialog__content">
      <label class="labels text-info">
        <i class="fa-solid fa-key"></i>
        Access code
      </label
      >
      <input
        class="form-control bg-transparent c-input"
        v-model.number="accessCode"
        type="text"
      />
      <button class="btn btn-outline-info mt-3" @click="sendHandle">
        Send
      </button>
    </div>
  </div>
</template>

<script >
export default {
  name: "code-dialog",
  data() {
    return {
      accessCode: null,
    };
  },
  props: ["show"],
  methods: {
    hideDialog() {
      this.$emit("update:show", false);
    },
    sendHandle() {
      this.$emit("submit", this.accessCode);
    },
  },
};
</script>

<style scoped>

.dialog {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  position: fixed;
  display: flex;
}

.dialog__content {
  margin: auto;
  border: 1px solid cyan;
  border-radius: 12px;
  min-height: 50px;
  min-width: 300px;
  padding: 20px;
}
</style>