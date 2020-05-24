export default function ({ store, redirect, route }) {


	// Login
	store.dispatch("generateToken");

	// // Logout
	//store.dispatch("invalidateToken");


	// First time opening
	if (store.state.token == null) {


		// Check local storage for token
		if (localStorage.getItem('revisionaryToken')) {

			// Set the token
			store.commit("setToken", localStorage.getItem('revisionaryToken'));


			// Try authentication
			store.dispatch("authenticate");


		}


	}



	console.log('AUTHENTICATED? ', store.state.authenticated);
	console.log('TOKEN? ', store.state.token);



	// If the user is not authenticated, open the login page !!! WITH REDIRECT URL
	if (!store.state.authenticated && route.name !== 'login' && route.name !== 'signup' && route.name !== 'lost-password')
		return redirect('/login/');


	// Redirect to projects
	if (store.state.authenticated && (route.name === 'login' || route.name === 'signup' || route.name === 'lost-password'))
		return redirect('/');


	// Redirect to projects
	if (route.name === 'index')
		return redirect('/projects/');

}
