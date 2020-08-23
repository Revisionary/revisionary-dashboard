export const state = () => ({
	device: {},
	fetching: false,
	iframeScale: 1,
	iframeLoaded: false,
	currentPinType: "comment",
	currentPinPrivate: 0
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
		}).catch((error) => {

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
	setLoaded(state, status) {
		state.iframeLoaded = status;
	},
	setCurrentPinType(state, type) {
		state.currentPinType = type;
	},
	setCurrentPinPrivate(state, status) {
		state.currentPinPrivate = status;
	},
	setFetching(state, status) {
		state.fetching = status;
	},
};
