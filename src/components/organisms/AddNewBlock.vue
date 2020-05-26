<template>
	<div class="card add-new" :class="{open: isOpen}">
		<div class="top" @click.prevent="toggleAddNew">
			<div class="add-new-opener">
				<PlusIconLarge />
				<br />Add New Project
			</div>
		</div>
		<div class="info" v-show="isOpen">
			<form>
				<input ref="url" type="url" placeholder="Enter a website URL..." required />
				<button>
					<ChevronRightIcon />
				</button>
			</form>
			<p>
				or
				<a href="#">upload your page design</a>
				<span class="bottom-tooltip" data-tooltip="Some info here...">
					<QuestionIcon />
				</span>
			</p>
		</div>
		<div class="bottom" v-show="isOpen">Advanced Options</div>
	</div>
</template>

<script>
	import PlusIconLarge from "~/components/atoms/icon-plus-large.vue";
	import ChevronRightIcon from "~/components/atoms/icon-chevron-right.vue";
	import QuestionIcon from "~/components/atoms/icon-question.vue";

	export default {
		components: {
			PlusIconLarge,
			ChevronRightIcon,
			QuestionIcon
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
		overflow: hidden;

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
			user-select: none;

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
			font-weight: 500;
			font-size: 12px;
			line-height: 14px;
			color: #9e9e9e;
			letter-spacing: -0.1px;

			a {
				color: black;
				border-bottom: 1px solid #e0e0e0;
				padding-bottom: 2px;
			}

			p {
				margin-bottom: 20px;
			}

			form {
				display: flex;

				input {
					min-height: 35px;
					font-weight: normal;
					font-size: 12px;
					line-height: 14px;
					padding: 5px 12px;
					flex: 1;
				}

				button {
					width: 35px;
					height: 35px;
					margin-left: 10px;
					background: #f0f0f0;
					border: none;
				}
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

		&.open {
			& > .top {
				//min-height: auto;
			}
		}
	}
</style>
