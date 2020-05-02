export const state = () => ({
	isSideBarOpen: true
});

export const mutations = {
	toggleSideBar(state) {
		state.isSideBarOpen = !state.isSideBarOpen;
	}
};
