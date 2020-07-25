<template>
	<div class="notification-icon">
		<svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
			<path
				d="M12.125 5.28858C12.125 4.10838 11.6562 2.97652 10.8216 2.14199C9.98709 1.30746 8.85521 0.838623 7.675 0.838623C6.49479 0.838623 5.36291 1.30746 4.52838 2.14199C3.69384 2.97652 3.225 4.10838 3.225 5.28858C3.225 10.4802 1 11.9635 1 11.9635H14.35C14.35 11.9635 12.125 10.4802 12.125 5.28858Z"
				stroke="#A8B1BF"
				stroke-width="1.3"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
			<path
				d="M8.95834 14.9302C8.82794 15.1549 8.64078 15.3415 8.41559 15.4712C8.1904 15.6009 7.93509 15.6692 7.67522 15.6692C7.41534 15.6692 7.16003 15.6009 6.93484 15.4712C6.70965 15.3415 6.52249 15.1549 6.39209 14.9302"
				stroke="#A8B1BF"
				stroke-width="1.3"
				stroke-linecap="round"
				stroke-linejoin="round"
			/>
		</svg>
		<div class="badge" v-if="count > 0">{{ count }}</div>
	</div>
</template>
<script>
	export default {
		props: {
			count: {
				type: Number,
				default: 0,
			},
		},
	};
</script>
<style lang="scss">
	.notification-icon {
		position: relative;

		& > svg {
			display: block;
		}

		& > .badge {
			position: absolute;
			right: -8px;
			top: -10px;
			width: 15px;
			height: 15px;
			border-radius: 50%;
			background-color: $color-orange;
			display: flex;
			justify-content: center;
			align-items: center;
			color: white;
			font-size: 9px;
			line-height: 15px;
			letter-spacing: 0;
		}
	}
</style>
