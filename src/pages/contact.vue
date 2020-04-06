<template>
  <div class="container">
    <div>

      <logo />
      <h1 class="title">Revisionary App</h1>
      <h2 class="subtitle">Contact Page</h2>

      <div class="links">
        <nuxt-link class="button--green" to="/">Home</nuxt-link>
      </div>

    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  }
}
</script>

<style>
</style>
