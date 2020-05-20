<template>
	<div class="card add-new" :class="{open: isOpen}">
		<div class="top" @click.prevent="toggleAddNew">
			<div class="add-new-opener">
				<PlusIconLarge />
				<br />Add New Project
			</div>
		</div>
		<div class="info" v-show="isOpen">
			<input ref="url" type="url" placeholder="Enter a website URL..." />
		</div>
		<div class="bottom" v-show="isOpen">Advanced Options</div>
	</div>
</template>

<script>
	import PlusIconLarge from "~/components/atoms/icon-plus-large.vue";

	export default {
		components: {
			PlusIconLarge
		},
		props: {
			blockData: {
				type: Object
			}
		},
		methods: {
			toggleAddNew() {
				this.isOpen = !this.isOpen;

				const url = this.$refs.url;
				url.focus();

				setTimeout(function() {
					url.focus();
				}, 200);
			}
		},
		data() {
			return {
				isOpen: false
			};
		}
	};
</script>

<style lang="scss">
	.card.add-new {
		& > .top {
			height: 100%;
			background-color: #fff;
			color: black;
			justify-content: center;
			align-items: center;
			text-align: center;
			font-size: 15px;
			line-height: 18px;
			font-weight: 500;
			cursor: pointer;

			&::before {
				content: none;
			}

			.add-new-opener {
				svg {
					margin-bottom: 10px;
				}
			}
		}

		& > .info {
			box-shadow: inset 0px 12px 18px rgba(0, 0, 0, 0.02);

			input {
				min-height: 35px;
				font-weight: normal;
				font-size: 12px;
				line-height: 14px;
				padding: 5px 12px;
			}
		}

		& > .bottom {
			font-weight: 500;
			font-size: 12px;
			line-height: 14px;
			text-align: center;
			justify-content: center;
			align-items: center;
			cursor: pointer;
		}
	}
</style>
