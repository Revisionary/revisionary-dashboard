<template>
  <div class="container">

      <h1>Projects</h1>
      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magnam voluptatum facilis impedit similique! Vero repellat corporis omnis expedita eveniet dolores voluptatibus quod cum illum quia nulla, quasi amet quos velit?</p>

      <br><ul>
        <li v-for="post in posts" v-bind:key="post.id"><nuxt-link :to="`post/${post.id}`">{{ post.title }}</nuxt-link></li>
      </ul>

      
      <br><br><nuxt-link to="/page">Go to a page</nuxt-link>

  </div>
</template>

<script>
// import Logo from '~/components/Logo.vue'

export default {
  components: {
    //Logo
  },
  data() {
    return {
      posts: []
    }
  },
  async created() {

    this.fetchPosts();
    
  },
  methods: {
    async fetchPosts() {

      const resp = await this.$axios.$get('https://jsonplaceholder.typicode.com/posts');
      this.posts = resp.splice(0,5);

    }
  },
}
</script>

<style>

</style>
