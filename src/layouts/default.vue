<template>
  <div id="page">
    <Header />
    <main>
      <SideBar />
      <nuxt />
    </main>
    <Footer />
  </div>
</template>

<script>
import Header from '~/components/Header.vue'
import SideBar from '~/components/SideBar.vue'
import Footer from '~/components/Footer.vue'

export default {
  components: {
    Header,
    SideBar,
    Footer
  }
}
</script>

<style lang="scss">
  @import "~/assets/style/global";

  main {
    display: table;

    & > aside {
      display: table-cell;
      vertical-align: top;
    }

    & > .content {
      display: table-cell;
      vertical-align: top;

      & > header {
        background-color: #fff;
        padding: 40px 55px;
        border-bottom: 1px solid #EAEDF3;
      }

    }
  }
</style>
