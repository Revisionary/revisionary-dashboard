<template>
	<div id="login-form" class="wrapper">
		<h1 class="title">Sign in to Revisionary</h1>
		<form class="form" @submit.prevent="login">
			<input type="text" v-model="username" placeholder="Email Address" autocomplete="email" />
			<input type="password" v-model="password" placeholder="Password" autocomplete="current-password" />
			<button>Login</button>
		</form>
		<hr />
		<div class="recommend">
			Still not have any account?
			<nuxt-link to="/signup/">Signup now.</nuxt-link>
		</div>
		<nuxt-link class="forgot-pass" to="/lost-password/">I forgot my password...</nuxt-link>
	</div>
</template>

<script>
	export default {
		auth: "guest",
		data() {
			return {
				username: "",
				password: ""
			};
		},
		methods: {
			login() {
				this.$nuxt.$loading.start();

				this.$auth
					.loginWith("local", {
						data: {
							username: this.username,
							password: this.password
						}
					})
					.then(({ status, data }) => {
						if (status === 200) {
							console.log("Logged In");

							this.$auth.setUser(data.userInfo);

							this.$store.commit("users/add", data.userInfo);

							this.$store.commit("toggleSideBar", true);
						}
					})
					.catch(error => {
						console.log("ERROR: ", error);
						//if (process.browser) window.$nuxt.$root.$loading.fail();
					});
			}
		}
	};
</script>
