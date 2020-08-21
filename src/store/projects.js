export const state = () => ({
	projectCategories: [],
	projects: [],
	project: {},
	fetching: false
});

export const getters = {
	get(state) {
		return state.projects;
	},
	getCategories(state) {
		return state.projectCategories;
	},
	getProject(state) {
		return state.project;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Categories
	async fetchCategories({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('projectcategories').then(({ status, data }) => {
			if (status === 200) {

				console.log('PROJECT CATS: ', data.categories);
				commit('setCategories', data.categories);
				commit("setFetching", false);

			}
		}).catch((error) => {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

	// Fetch Projects
	async fetch({ commit, dispatch, state }) {

		this.$axios.all = function all(promises) {
			return Promise.all(promises);
		};

		let actions = [
			this.$axios.get('projects')
		];

		// If categories not already fetched
		if (!state.projectCategories.length) {
			actions.push(
				this.$axios.get('projectcategories')
			);
		}


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

				const projects = data.projects;
				console.log('PROJECTS: ', projects);

				commit('set', projects);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [];
				projects.forEach(function (project) {
					usersToFetch.push(project.user_ID);

					project.users.forEach(user => {
						usersToFetch.push(parseInt(user));
					});

				});
				usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


				// Get the users info
				dispatch("users/fetch", usersToFetch, { root: true });

			}
		}).catch((error) => {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	},

	// Get singular project
	async fetchProject({ commit, state, dispatch }, projectID) {


		// Find the project from store
		const projectFound = state.projects.find(function (project) {
			return project.ID == projectID;
		});

		if (projectFound) {
			commit("setProject", projectFound);
			return;
		}



		commit("setFetching", true);

		await this.$axios.get('project/' + projectID).then(({ status, data }) => {

			if (status === 200) {

				const project = data.project;
				console.log('SINGLE PROJECT: ', project);

				commit('setProject', project);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [project.user_ID];
				project.users.forEach(user => {
					usersToFetch.push(parseInt(user));
				});
				usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


				// Get the users info
				dispatch("users/fetch", usersToFetch, { root: true });

			}
		}).catch((error) => {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});



	},

	// Fetch Project Categories
	async fetchProjectCategories({ commit }, projectID) {

		commit("setFetching", true);

		await this.$axios.get('project/' + projectID + '/categories').then(({ status, data }) => {
			if (status === 200) {

				console.log('PAGE CATS: ', data.categories);
				commit('setCategories', data.categories);
				commit("setFetching", false);

			}
		}).catch((error) => {

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
	set(state, projects) {
		state.projects = projects;
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
