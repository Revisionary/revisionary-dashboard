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
	async fetchCategories({ commit }, projectID) {

		commit("setFetching", true);

		await this.$axios.get('project/' + projectID + '/categories').then(({ status, data }) => {
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
	async fetch({ commit, dispatch }, projectID) {

		commit("setFetching", true);

		await this.$axios.get('project/' + projectID + '/pages').then(({ status, data }) => {
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
	set(state, pages) {
		state.pages = pages;
	},
	update(state, { ID, name, value }) {

		// Get the current state of the projects
		let currentPages = state.pages;

		// Find the index
		const index = currentPages.findIndex(page => page.ID === ID);

		if (index > -1) {

			// Modify the project
			currentPages[index][name] = value;

			// Commit the change
			state.pages = currentPages;

			// If current project is this one
			if (state.page.ID == ID)
				state.page = currentPages[index];

		}

	},
	setCategories(state, categories) {
		state.pageCategories = categories;
	},
	add(state, page) {
		merge(state.pages, page);
	},
	remove(state, page) {
		state.pages.splice(state.page.indexOf(project), 1);
	},
	setPage(state, page) {
		state.page = page;
	},
	setFetching(state, status) {
		state.fetching = status;
	}
};
