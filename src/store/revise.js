export const state = () => ({
	device: {},
	fetching: false,
	Pins: [],
	fetchingPins: false,
	iframe: null,
	iframeScale: 1,
	iframeLoaded: false,
	currentPinType: "browse",
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

	// Fetch Pins
	async fetchPins({ commit }, { phaseID, deviceID, progress = true }) {
		commit("setPinsFetching", true);
		await this.$axios
			.get("phase/" + phaseID + "/pins/" + deviceID, { progress })
			.then(({ status, data }) => {
				if (status === 200) {
					console.log("PINS: ", data.pins);
					commit("setPins", data.pins);
					commit("setPinsFetching", false);
					//this.currentPinNumber = this.Pins.length + 1;
				}
			})
			.catch((error) => {
				console.log("ERROR: ", error);
				commit("setPinsFetching", false);
			});
	},

};

export const mutations = {
	set(state, device) {
		state.device = device;
	},
	setPins(state, pins) {
		state.Pins = pins;
	},
	setPinsFetching(state, status) {
		state.fetchingPins = status;
	},
	setIframe(state, iframe) {
		state.iframe = iframe;
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
