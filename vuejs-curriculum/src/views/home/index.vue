<template>
  <home-layout>
    <p>This is your landingpage.</p>
    <router-view />
  </home-layout>
</template>

<script>
import HomeLayout from "../../layouts/HomeLayout";

export default {
  components: {
    "home-layout": HomeLayout
  }
};
</script>
