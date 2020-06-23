<template>
	<div id="lost-password-form" class="wrapper">
		<h1 class="title">Reset Your Password</h1>
		<form class="form" @submit.prevent="login">
			<input type="email" name="email" v-model="email" placeholder="Email Address" />
			<button>Send verification link</button>
		</form>
		<hr />
		<div class="recommend">
			Didn't receive email?
			<nuxt-link to="/support/" style="color: #7eb464;">Get help.</nuxt-link>
		</div>
		<nuxt-link class="forgot-pass" to="/login/">
			<ArrowLeftIcon />Back to Sign In
		</nuxt-link>
	</div>
</template>

<script>
	import ArrowLeftIcon from "~/components/atoms/icon-arrow-left.vue";

	export default {
		layout: "landing",
		components: {
			ArrowLeftIcon
		},
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
