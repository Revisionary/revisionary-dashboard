export const state = () => ({
	projectCategories: [
		{
			ID: 0,
			title: "Untitled"
		}
	],
	projects: [],
	project: {},
	isLoaded: false
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
		return state.isLoaded;
	}
};

export const actions = {
	// Get Projects
	async get({ commit }) {
		await commit("setLoading", false);
		await this.$axios
			//.get("https://dapi.revisionary.co/v1/projects")
			.get("https://jsonplaceholder.typicode.com/posts")
			.then(res => {
				if (res.status === 200) {
					//console.log(res.data);

					// Sample data
					const sampleData = [
						{
							ID: 0,
							title: "1 Marc Pridmore",
							description: "Lorem ipsum dolor sit amet.",
							image_url: "https://placeimg.com/640/480/any",
							user_ID: 6,
							order: 1,
							cat_ID: 0,
							favorite: true,
							users: [1, 2, 3]
						},
						{
							ID: 1,
							title: "2 Marc Pridmore",
							description: "Lorem ipsum dolor sit amet.",
							image_url: "https://placeimg.com/640/480/any",
							user_ID: 6,
							order: 1,
							cat_ID: 0,
							favorite: false,
							users: [1, 2, 3]
						},
						{
							ID: 2,
							title: "3 Marc Pridmore",
							description: "Lorem ipsum dolor sit amet.",
							image_url: "https://placeimg.com/640/480/any",
							user_ID: 6,
							order: 1,
							cat_ID: 0,
							favorite: false,
							users: [1, 2, 3]
						},
						{
							ID: 3,
							title: "4 Marc Pridmore",
							description: "Lorem ipsum dolor sit amet.",
							image_url: "https://placeimg.com/640/480/any",
							user_ID: 6,
							order: 1,
							cat_ID: 0,
							favorite: true,
							users: [1, 2, 3]
						},
						{
							ID: 4,
							title: "5 Marc Pridmore",
							description: "Lorem ipsum dolor sit amet.",
							image_url: "https://placeimg.com/640/480/any",
							user_ID: 6,
							order: 1,
							cat_ID: 0,
							favorite: true,
							users: [1, 2, 3]
						}
					];

					//commit("set", res.data.splice(0, 6));
					commit("set", sampleData);
					commit("setLoading", true);
				}
			});
	},

	// Get Project Categories
	async getCategories({ commit }) {
		await commit("setLoading", false);
		commit("setCategories", [
			{
				ID: 0,
				title: "Untitled"
			},
			{
				ID: 1,
				title: "Cat 1"
			},
			{
				ID: 2,
				title: "Cat 2"
			},
			{
				ID: 3,
				title: "Cat 33"
			}
		]);
		await commit("setLoading", true);
	},

	// Get singular project
	async getProject({ commit }, projectID) {
		await commit("setLoading", false);
		await this.$axios
			//.get(`https://dapi.revisionary.co/v1/projects/${projectID}`)
			.get(`https://jsonplaceholder.typicode.com/posts/${projectID}`)
			.then(res => {
				if (res.status === 200) {
					commit("setProject", res.data);
					commit("setLoading", true);
				}
			});
	},

	// Reset Selected Project
	resetProject({ commit }) {
		commit("setProject", {});
	},

	// Set Selected Project
	set({ commit }, project) {
		commit("set", project);
	}
};

export const mutations = {
	set(state, projects) {
		state.projects = projects;
	},
	setCategories(state, categories) {
		state.projectCategories = categories;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, { project }) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	},
	setLoading(state, status) {
		state.isLoaded = status;
	}
};
