export const state = () => ({
	pageCategories: [],
	pages: [],
	fetching: false
});

export const getters = {
	get(state) {
		return state.pages;
	},
	getCategories(state) {
		return state.pageCategories;
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
		}).catch((error) => {

			console.log('ERROR: ', error);
			commit("setFetching", false);

		});

	},

	// Fetch Pages
	async fetch({ commit, dispatch, state }, projectID) {

		this.$axios.all = function all(promises) {
			return Promise.all(promises);
		};

		let actions = [
			this.$axios.get('project/' + projectID + '/pages')
		];

		// If categories not already fetched
		if (!state.pageCategories.length || state.pageCategories[0].project_ID != projectID) {
			actions.push(
				this.$axios.get('project/' + projectID + '/categories')
			);
		}

		commit("setFetching", true);

		await this.$axios.all(actions).then((res) => {

			const { status, data } = res[0];

			if (res.length > 1) {

				const catResp = res[1];
				if (catResp.status === 200) {

					console.log('PAGE CATS: ', catResp.data.categories);
					commit('setCategories', catResp.data.categories);
					commit("setFetching", false);

				}

			}

			if (status === 200) {

				const pages = data.pages;
				console.log('PAGES: ', pages);

				commit('set', pages);
				commit("setFetching", false);


				// Take users to batch fetch
				let usersToFetch = [];
				pages.forEach(page => {
					usersToFetch.push(page.user_ID);

					page.users.forEach(user => {
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

	// Reset Pages
	resetPages({ commit }) {
		commit("set", []);
		commit("setCategories", []);
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
	setFetching(state, status) {
		state.fetching = status;
	}
};
