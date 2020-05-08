<template>
	<header id="sub-header" :class="{ loading: isLoading }">
		<div class="subtitle">{{subtitle}}</div>
		<details>
			<summary>
				<h1>
					{{ title.substr(0, 15) }}
					<ChevronDownIcon />
				</h1>
			</summary>
			<div class="details-menu sub-menu right">
				<ul>
					<li class="active">
						<a href="#">All Projects (3)</a>
					</li>
					<li>
						<a href="#">Archived Projects (2)</a>
					</li>
					<li>
						<a href="#">Deleted Projects (0)</a>
					</li>
				</ul>
			</div>
		</details>

		<p class="description">{{ description }}</p>

		<div class="bottom">
			<div class="tabs">
				<a href="#" class="active">ALL</a>
				<a href="#">MINE</a>
				<a href="#">SHARED</a>
				<a href="#">FAVORITES</a>
				<a href="#">PERSONAL PROJECTS</a>

				<a href="#" style="font-size: 15px;">+</a>
			</div>
		</div>
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
		position: relative;

		h1 {
			font-weight: bold;
			font-size: 30px;
			line-height: 36px;
			letter-spacing: -0.3px;
			color: #2d3137;
			text-transform: capitalize;
			display: inline-flex;
			align-items: center;

			& > svg {
				margin-left: 4px;
				margin-top: 5px;
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
			margin-bottom: 30px;
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

				border-radius: 3px;
				max-width: 200px;
				height: 36px;
				color: transparent;
				opacity: 0.2;
				pointer-events: none;

				& > a {
					opacity: 0;
					display: none;
				}
			}

			.description {
				max-width: 500px;
				height: 23px;
				//opacity: 0.5;
			}
		}

		& > .bottom {
			position: absolute;
			bottom: -1px;
			//background-color: red;

			.tabs {
				& > a {
					color: #9296a0;
					font-size: 13px;
					line-height: 16px;
					font-weight: 400;
					letter-spacing: 0.1px;
					text-transform: uppercase;
					display: inline-block;
					padding-bottom: 14px;
					margin-right: 20px;
					border-bottom: 1px solid transparent;

					&.active {
						color: #4d5058;
						font-weight: 600;
						border-color: #037ef3;
					}

					&:hover {
						border-color: #037ef3;
					}
				}
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
