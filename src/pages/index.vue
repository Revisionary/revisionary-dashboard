<template>
  <div class="container">
    <div>

      <logo />
      <h1 class="title">Revisionary App</h1>
      <h2 class="subtitle">Revisionary App dashboard</h2>
      <div class="links">
        <a
          href="https://nuxtjs.org/"
          target="_blank"
          class="button--green"
        >Documentation</a>
        <nuxt-link class="button--grey" to="contact">Contact</nuxt-link>
      </div>

      <ul style="text-align: left;">
        <li v-for="post in posts" v-bind:key="post.id"><nuxt-link :to="`post/${post.slug}`">{{ post.title }}</nuxt-link></li>
      </ul>

    </div>
  </div>
</template>

<script>
import Logo from '~/components/Logo.vue'

export default {
  components: {
    Logo
  },
  data() {
    return { posts: [] }
  },
  async created() {

    this.fetchPosts();
    
  },
  methods: {
    async fetchPosts() {

      const resp = await this.$axios.$get('https://dapi.revisionary.co/v1/sad/sa');
      this.posts = resp.posts

    }
  },
}
</script>

<style>
</style>
