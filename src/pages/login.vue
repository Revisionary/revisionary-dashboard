<template>
	<div id="dashboard" class="content">
		<div class="content-wrapper">
			<h1>Signin to Revisionary</h1>
			<div class="form">
				<input type="text" v-model="username" placeholder="Email Address..." />
				<input type="password" v-model="password" placeholder="Password..." />
				<button @click="login">Login</button>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		// middleware: "authenticated",
		data() {
			return {
				username: "",
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
					.then(({ data }) => {
						//console.log("RESSS", data);
						this.$auth.setUser(data.userInfo);

						this.$store.commit("users/add", data.userInfo, {
							root: true
						});
						this.$store.commit("toggleSideBar", true);

						if (process.browser) window.$nuxt.$root.$loading.finish();
					})
					.catch(error => {
						console.log("ERROR: ", error);
						if (process.browser) window.$nuxt.$root.$loading.fail();
					});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.content-wrapper {
		text-align: center;
	}

	.form {
		display: flex;
		justify-content: center;
		margin-top: 30px;

		& > * {
			margin-right: 10px;
		}
	}
</style>
