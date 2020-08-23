<template>
	<div id="landing-page">
		<header>
			<nuxt-link class="logo" to="/projects/">
				<Logo />
			</nuxt-link>
			<nuxt-link class="back-home" to="/">
				<ArrowLeftIcon />Back to home page
			</nuxt-link>
		</header>
		<main>
			<div class="content-side">
				<div class="wrapper">
					<h2 class="title">Your ultimate visual feedback toolkit</h2>
					<p>Revisionary makes it super easy to invite your clients and teammates to leave useful comments* directly on your live websites.</p>
				</div>
			</div>
			<div class="form-side">
				<nuxt />
			</div>
		</main>
	</div>
</template>

<script>
	import Logo from "~/components/atoms/Logo.vue";
	import ArrowLeftIcon from "~/components/atoms/icon-arrow-left.vue";

	export default {
		auth: false,
		components: {
			Logo,
			ArrowLeftIcon,
		},
	};
</script>

<style lang="scss">
	#landing-page {
		header {
			position: absolute;
			top: 0;
			left: 0;
			padding-top: 20px;
			padding-left: 40px;
			z-index: 2;
			color: #969fab;
			display: flex;
			flex-direction: row;
			justify-content: left;
			align-items: center;

			.logo {
				svg {
					display: block;
				}
			}

			.back-home {
				margin-left: 35px;
				font-weight: 600;
				display: flex;
				align-items: center;

				svg {
					margin-right: 10px;
				}
			}
		}

		main {
			width: 100%;
			display: grid;
			grid-template-columns: 50% 50%;
			height: calc(100vh);
			background-color: #fff;

			& > * {
				display: flex;
				justify-content: center;
				align-items: center;
				padding: 120px;
			}

			& > .content-side {
				background-image: url("~assets/images/landing-bg-pattern.png");
				background-size: contain;
				background-color: #020b1d;
				background-position: 100% 100%;
				background-repeat: no-repeat;
				color: white;

				.title {
					font-size: 66px;
					line-height: 110%;
					font-weight: 600;
					letter-spacing: 1px;
				}

				p {
					opacity: 0.8;
					font-size: 21px;
					line-height: 140%;
					margin-top: 30px;
				}
			}

			& > .form-side {
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
					font-size: 15px;
					line-height: 110%;
					font-weight: 600;
					color: #969fab;
					border-bottom: 1px solid;
					padding-bottom: 4px;
					padding-right: 8px;

					svg {
						margin-right: 10px;
					}
				}
			}
		}
	}
</style>
