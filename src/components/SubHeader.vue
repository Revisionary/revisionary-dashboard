<template>
	<header id="sub-header" :class="{ loading: isLoading }">
		<div class="subtitle">{{subtitle}}</div>
		<h1 class="dropdown">
			<a href="#">
				{{title}}
				<ChevronDownIcon />
			</a>
		</h1>
		<p class="description">{{ description }}</p>
	</header>
</template>

<script>
	import ChevronDownIcon from "~/components/atoms/icon-chevron-down.vue";

	export default {
		components: {
			ChevronDownIcon
		},
		props: {
			isLoading: {
				default: false
			},
			subtitle: {
				default: ""
			},
			title: {
				default: "Loading...",
				required: true
			},
			description: {
				default: "Loading..."
			}
		}
	};
</script>

<style lang="scss">
	#sub-header {
		h1 {
			font-weight: bold;
			font-size: 30px;
			line-height: 36px;
			letter-spacing: -0.3px;
			color: #2d3137;

			& > a {
				display: flex;
				align-items: center;

				& > svg {
					margin-left: 4px;
					margin-top: 5px;
				}
			}
		}

		.subtitle {
			font-style: normal;
			font-weight: bold;
			font-size: 14px;
			line-height: 17px;
			letter-spacing: -0.3px;
			color: #9f9f9f;
			text-transform: uppercase;
			margin-bottom: 4px;
		}

		.description {
			font-weight: normal;
			font-size: 17px;
			line-height: 23px;
			color: #78808b;
			margin-top: 5px;
		}

		&.loading {
			h1,
			.description {
				background: linear-gradient(
					90deg,
					#9ea5ab,
					rgb(230, 230, 230),
					#9ea5ab
				);
				background-size: 300% 100%;
				animation: gradientBG 3s ease infinite;

				//background-color: #9ea5ab;
				border-radius: 3px;
				max-width: 200px;
				color: transparent;
				opacity: 0.2;
				pointer-events: none;

				& > a {
					opacity: 0;
				}
			}

			.description {
				max-width: 500px;
				//opacity: 0.5;
			}
		}
	}

	@keyframes gradientBG {
		0% {
			background-position: 0% 50%;
		}
		50% {
			background-position: 100% 50%;
		}
		100% {
			background-position: 0% 50%;
		}
	}
</style>
