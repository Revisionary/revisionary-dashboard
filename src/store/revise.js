export const state = () => ({
	device: {},
	fetching: false,
	iframeScale: 1,
	pinMode: "browse",
});

export const getters = {
	get(state) {
		return state.device;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Single Device Data
	async fetch({ commit }, deviceID) {

		commit("setFetching", true);
		await this.$axios.get('device/' + deviceID).then(({ status, data }) => {
			if (status === 200) {
				const device = data.device;
				console.log('DEVICE: ', device);

				commit('set', device);
				commit("setFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

};

export const mutations = {
	set(state, device) {
		state.device = device;
	},
	setScale(state, scale) {
		state.iframeScale = scale;
	},
	setPinMode(state, mode) {
		state.pinMode = mode;
	},
	setFetching(state, status) {
		state.fetching = status;
	},
};
