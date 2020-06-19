export const state = () => ({
	pageCategories: [],
	pages: [],
	page: {},
	fetching: false
});

export const getters = {
	get(state) {
		return state.pages;
	},
	getCategories(state) {
		return state.pageCategories;
	},
	getProject(state) {
		return state.page;
	},
	status(state) {
		return state.fetching;
	}
};

export const actions = {

	// Fetch Page Categories
	async fetchCategories({ commit }) {

		commit("setFetching", true);

		await this.$axios.get('pagecategories').then(({ status, data }) => {
			if (status === 200) {
				console.log('PAGE CATS: ', data.categories);
				commit('setCategories', data.categories);
				commit("setFetching", false);
			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

	// Fetch Pages
	async fetch({ commit, dispatch }) {

		commit("setFetching", true);

		await this.$axios.get('pages').then(({ status, data }) => {
			if (status === 200) {

				const pages = data.pages;
				console.log('PAGES: ', pages);

				commit('set', pages);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [];
				pages.forEach(function (page) {
					usersToFetch.push(page.user_ID);

					page.users.forEach(user => {
						usersToFetch.push(parseInt(user));
					});

				});
				usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


				// Get the users info
				dispatch("users/fetch", usersToFetch, { root: true });

			}
		}).catch(function (error) {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});


	},

	// Get singular project
	async fetchPage({ commit, state, dispatch }, pageID) {

		console.log('PAGE FETCHING');

		// Find the project
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
				console.log('PROJECT: ', project);

				commit('setProject', project);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [];
				project.users.forEach(user => {
					usersToFetch.push(parseInt(user));
				});
				usersToFetch = usersToFetch.filter((v, i, a) => a.indexOf(v) === i); // Make it unique


				// Get the users info
				dispatch("users/fetch", usersToFetch, { root: true });

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
