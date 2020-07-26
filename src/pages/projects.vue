<template>
  <div id="projects" class="content">
    <TopBar data-type="dashboard" />
    <SubHeader data-type="project" />

    <nuxt-child />

    <Footer />
  </div>
</template>

<script>
import TopBar from "~/components/TopBar.vue";
import SubHeader from "~/components/SubHeader.vue";
import Footer from "~/components/Footer.vue";

export default {
  layout: "app",
  components: {
    SubHeader,
    Footer,
    TopBar
  },
  created() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start();
    });

    this.$store.dispatch("projects/fetch");
  }
};
</script>

<style lang="scss">
</style>
