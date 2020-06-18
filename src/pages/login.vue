<template>
	<div id="login-form" class="wrapper">
		<h1 class="title">Sign in to Revisionary</h1>
		<div class="form">
			<input type="text" v-model="username" placeholder="Email Address..." />
			<input type="password" v-model="password" placeholder="Password..." />
			<button @click="login">Login</button>
		</div>
		<hr />
		<div class="recommend">
			Still not have any accounts?
			<nuxt-link to="/signup/">Signup now.</nuxt-link>
		</div>
		<nuxt-link class="forgot-pass" to="/lost-password/">I forgot my password...</nuxt-link>
	</div>
</template>

<script>
	export default {
		// middleware: "authenticated",
		layout: "landing",
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
	.title {
		font-weight: 600;
		font-size: 34px;
		line-height: 110%;
		margin-bottom: 20px;
	}

	.form {
		display: flex;
		flex-direction: column;
		justify-content: center;
		margin-top: 30px;

		& > *:not(button) {
			width: 370px;
			background: #ffffff;
			border: 1px solid rgba(42, 53, 69, 0.15);
			box-sizing: border-box;
			box-shadow: inset 0px 0px 4px rgba(16, 17, 24, 0.15);
			border-radius: 6px;
			height: 50px;
			font-size: 16px;
			line-height: 110%;
			padding: 0 24px;
			margin-bottom: 15px;
		}

		button {
			width: 370px;
			background: #0363f3;
			box-shadow: inset 0px 0px 4px rgba(16, 17, 24, 0.15);
			border-radius: 6px;
			height: 50px;
			font-weight: 600;
			font-size: 18px;
			line-height: 110%;
		}
	}

	hr {
		margin-top: 25px;
		margin-bottom: 25px;
		border: 1px solid rgba(16, 17, 24, 0.1);
		border-bottom: none;
	}

	.recommend {
		font-weight: 600;
		font-size: 16px;
		line-height: 110%;
		color: rgba(0, 0, 0, 0.8);

		a {
			color: #0363f3;
		}
	}

	.forgot-pass {
		display: inline-block;
		margin-top: 40px;
		font-size: 18px;
		line-height: 110%;
		font-weight: 600;
		color: #969fab;
		border-bottom: 1px solid;
		padding-bottom: 4px;
		padding-right: 8px;
	}
</style>
