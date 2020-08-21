export const state = () => ({
	isSideBarOpen: true,
	openTab: null,
	fetching: false,
	pageLoading: false,
	newNotificationsCount: 0
});

export const getters = {

};

export const actions = {

	// Check New Notifications Count
	async checkNotifications({ commit }) {

		await this.$axios.get('notifications/newcount', { progress: false }).then(({ status, data }) => {
			if (status === 200) {

				const count = data.new_count;
				console.log('NEW NOTIFICATIONS COUNT: ', count);

				commit("setNotificationsCount", count);

			}
		}).catch((error) => {

			console.log('ERROR: ', error);

		});


	},

};

export const mutations = {
	setFetching(state, status) {
		state.fetching = status;
	},
	toggleSideBar(state, forceState = null) {
		state.isSideBarOpen = !state.isSideBarOpen;
		if (forceState !== null) state.isSideBarOpen = forceState;
	},
	toggleTab(state, tabName) {
		if (state.openTab == tabName) state.openTab = null;
		else state.openTab = tabName;
	},
	setNotificationsCount(state, newCount) {
		state.newNotificationsCount = newCount;
	}
};
