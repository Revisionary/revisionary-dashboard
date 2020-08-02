export const state = () => ({
	device: {},
	pins: [],
	iframeScale: 1,
	fetching: false
});

export const getters = {
	get(state) {
		return state.device;
	},
	getPins(state) {
		return state.pins;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Categories
	async fetchPins({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('projectcategories').then(({ status, data }) => {
			if (status === 200) {

				console.log('PROJECT CATS: ', data.categories);
				commit('setCategories', data.categories);
				commit("setFetching", false);

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

	// Fetch Projects
	async fetch({ commit, dispatch, state }, deviceID) {

		this.$axios.all = function all(promises) {
			return Promise.all(promises);
		};

		let actions = [
			this.$axios.get('device/' + deviceID)
		];

		// // If categories not already fetched
		// if (!state.projectCategories.length) {
		// 	actions.push(
		// 		this.$axios.get('projectcategories')
		// 	);
		// }


		commit("setFetching", true);

		await this.$axios.all(actions).then((res) => {

			const { status, data } = res[0];

			if (res.length > 1) {

				const catResp = res[1];
				if (catResp.status === 200) {

					console.log('PROJECT CATS: ', catResp.data.categories);
					commit('setCategories', catResp.data.categories);
					commit("setFetching", false);

				}

			}

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


	// Reset Selected Project
	resetProject({ commit }) {
		commit("setProject", {});
	},

	// Reset All Projects
	resetProjects({ commit }) {
		commit("set", []);
		commit("setCategories", []);
		commit("setProject", {});
	},

	// Reset Selected Project
	updateProject({ commit }, payload) {

		// DO IT ON BACKEND !!!

		// If successful
		commit("update", payload);

	}
};

export const mutations = {
	set(state, device) {
		state.device = device;
	},
	setPins(state, pins) {
		state.pins = pins;
	},
	setScale(state, scale) {
		state.iframeScale = scale;
	},
	update(state, { ID, name, value }) {

		// Get the current state of the projects
		let currentProjects = state.projects;

		// Find the index
		const index = currentProjects.findIndex(project => project.ID === ID);

		if (index > -1) {

			// Modify the project
			currentProjects[index][name] = value;

			// Commit the change
			state.projects = currentProjects;

			// If current project is this one
			if (state.project.ID == ID)
				state.project = currentProjects[index];

		}

	},
	setCategories(state, categories) {
		state.projectCategories = categories;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, project) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	},
	setFetching(state, status) {
		state.fetching = status;
	}
};
