<template>
	<div id="signup-form" class="wrapper">
		<h1 class="title">Sign up to Revisionary</h1>
		<form class="form" @submit.prevent="login">
			<input type="email" name="email" v-model="email" placeholder="Email Address" />
			<input type="text" name="full-name" v-model="fullName" placeholder="Full Name" />
			<input type="password" name="password" v-model="password" placeholder="Password" />
			<button>Sign Up</button>
		</form>
		<hr />
		<div class="recommend">
			Already have an account?
			<nuxt-link to="/login/">Login here.</nuxt-link>
		</div>
		<!-- <nuxt-link class="forgot-pass" to="/lost-password/">I forgot my password...</nuxt-link> -->
	</div>
</template>

<script>
	export default {
		// middleware: "authentication",
		layout: "landing",
		data() {
			return {
				email: "",
				fullName: "",
				password: ""
			};
		},
		methods: {
			login() {
				if (process.browser) window.$nuxt.$root.$loading.start();
				this.$auth
					.loginWith("local", {
						data: {
							username: this.username,
							password: this.password
						}
					})
					.then(({ status, data }) => {
						if (status === 200) {
							this.$auth.setUser(data.userInfo);

							this.$store.commit("users/add", data.userInfo, {
								root: true
							});

							this.$store.commit("toggleSideBar", true);

							if (process.browser)
								window.$nuxt.$root.$loading.finish();
						}
					})
					.catch(error => {
						console.log("ERROR: ", error);
						if (process.browser) window.$nuxt.$root.$loading.fail();
					});
			}
		}
	};
</script>
