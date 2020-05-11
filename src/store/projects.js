export const state = () => ({
	projects: [],
	project: {},
	isLoaded: false
});

export const getters = {
	get(state) {
		return state.projects;
	},
	getProject(state) {
		return state.project;
	},
	status(state) {
		return state.isLoaded;
	}
};

export const actions = {
	async get({ commit }) {
		await commit("setStatus", false);
		await this.$axios
			//.get("https://dapi.revisionary.co/v1/projects")
			.get("https://jsonplaceholder.typicode.com/posts")
			.then(res => {
				if (res.status === 200) {
					//console.log(res.data);

					// Sample data
					const sampleData = [
						{
							project_ID: 0,
							project_title: "Marc Pridmore",
							project_description: "Lorem ipsum dolor sit amet.",
							project_image_url:
								"https://placeimg.com/640/480/any",
							project_user_ID: 6,
							project_order: 1
						}
					];

					//commit("set", res.data.splice(0, 6));
					commit("set", sampleData);
					commit("setStatus", true);
				}
			});
	},
	async getProject({ commit }, projectID) {
		await commit("setStatus", false);
		await this.$axios
			//.get(`https://dapi.revisionary.co/v1/projects/${projectID}`)
			.get(`https://jsonplaceholder.typicode.com/posts/${projectID}`)
			.then(res => {
				if (res.status === 200) {
					commit("setProject", res.data);
					commit("setStatus", true);
				}
			});
	},
	resetProject({ commit }) {
		commit("setProject", {});
	},
	set({ commit }, project) {
		commit("set", project);
	}
};

export const mutations = {
	set(state, projects) {
		state.projects = projects;
	},
	setStatus(state, status) {
		state.isLoaded = status;
	},
	add(state, project) {
		merge(state.projects, project);
	},
	remove(state, { project }) {
		state.projects.splice(state.project.indexOf(project), 1);
	},
	setProject(state, project) {
		state.project = project;
	}
};
