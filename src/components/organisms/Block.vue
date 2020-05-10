<template>
	<div class="block">
		<div class="top" :style="'background-image: url(' + sampleImage + ');'">
			<div class="actions">
				<div class="top">
					<div class="left">USERS</div>
					<div class="center"></div>
					<div class="right">
						<details>
							<summary>
								<MoreIcon />
							</summary>
							<div class="details-menu sub-menu compact right">
								<ul>
									<li>
										<a href="#">Edit</a>
									</li>
									<li>
										<a href="#">Archive</a>
									</li>
									<li>
										<a href="#">Delete</a>
									</li>
								</ul>
							</div>
						</details>
					</div>
				</div>
				<div class="middle">
					<div class="left"></div>
					<div class="center tooltip-not-contained" data-tooltip="Open this project">
						<nuxt-link :to="`/project/${blockData.id}`">
							<ArrowRightIcon />
						</nuxt-link>
					</div>
					<div class="right"></div>
				</div>
				<div class="bottom">
					<div class="left">VERSIONS</div>
					<div class="center"></div>
					<div class="right">PINS</div>
				</div>
			</div>
		</div>
		<div class="info">
			<div class="title">
				<nuxt-link :to="`/project/${blockData.id}`">
					{{ blockData.title.substr(0, 15) }}
					<span class="count">(14)</span>
				</nuxt-link>
			</div>
			<div class="description">{{ blockData.body.substr(0, 35) }}</div>
		</div>
		<div class="bottom">
			<div class="date">2 Days Ago</div>
			<div class="favorites">
				<a href="#" data-tooltip="Add to Favorites">
					<StarIcon />
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import ArrowRightIcon from "~/components/atoms/icon-arrow-right.vue";
	import MoreIcon from "~/components/atoms/icon-more.vue";
	import StarIcon from "~/components/atoms/icon-star.vue";

	export default {
		components: {
			ArrowRightIcon,
			MoreIcon,
			StarIcon
		},
		props: {
			blockData: {
				type: Object
			}
		},
		data() {
			return {
				sampleImage: "https://placeimg.com/640/480/any"
			};
		}
	};
</script>

<style lang="scss">
	.block {
		display: inline-flex;
		flex-direction: column;
		background-color: white;
		width: 100%;
		border-radius: 6px;
		border: 1px solid #eaedf3;
		box-shadow: 0px 2px 14px #edf1fa;

		& > .top {
			position: relative;
			height: 165px;
			padding: 12px;
			background-color: #0e1117;
			background-size: cover;
			background-repeat: no-repeat;
			color: white;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;

			&::before {
				content: "";
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: #1d222f;
				opacity: 0.5;
				border-top-left-radius: inherit;
				border-top-right-radius: inherit;
			}

			& > .actions {
				position: absolute;
				top: 0;
				left: 0;
				width: 100%;
				height: 100%;
				background-color: rgba(29, 34, 47, 0.5);
				display: flex;
				flex-direction: column;
				justify-content: space-between;
				padding: 12px 14px;
				opacity: 0;
				transition: 500ms;
				border-top-left-radius: inherit;
				border-top-right-radius: inherit;

				& > * {
					display: flex;
					justify-content: space-between;
					align-items: center;
				}
			}
		}

		& > .info {
			padding: 20px;

			.title {
				color: #2d3137;
				font-size: 18px;
				line-height: 21px;
				font-weight: 600;
				margin-bottom: 5px;

				.count {
					color: #b0b0b0;
				}
			}

			.description {
				color: #78808b;
				font-size: 15px;
				line-height: 20px;
			}
		}

		& > .bottom {
			display: flex;
			justify-content: space-between;
			padding: 14px 20px;
			border-top: 1px solid #ececec;
			color: #a1a1a1;

			.date {
				font-size: 12px;
				line-height: normal;
				font-weight: 500;
				text-transform: uppercase;
			}
		}

		&:hover {
			box-shadow: 0px 3px 24px #e0eafb;

			& > .top {
				& > .actions {
					opacity: 1;
				}
			}
		}
	}
</style>
