<template>
	<div class="block">
		<div class="top">IMAGE</div>
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
				<a href="#">
					<StarIcon />
				</a>
			</div>
		</div>
	</div>
</template>

<script>
	import StarIcon from "~/components/atoms/icon-star.vue";

	export default {
		components: {
			StarIcon
		},
		props: {
			blockData: {
				type: Object
			}
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

		.top {
			height: 165px;
			padding: 12px;
			background: #0e1117;
			color: white;
			border-top-left-radius: 6px;
			border-top-right-radius: 6px;
		}

		.info {
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

		.bottom {
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
			box-shadow: 0px 2px 14px #e7ecf5;
		}
	}
</style>
