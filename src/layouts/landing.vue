<template>
	<div id="page">
		<header>
			<nuxt-link class="logo" to="/">
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
		middleware: "authentication",
		components: {
			Logo,
			ArrowLeftIcon
		}
	};
</script>

<style lang="scss" scoped>
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
			background-image: url("~assets/images/landing-bg-pattern.svg");
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
	}
</style>
