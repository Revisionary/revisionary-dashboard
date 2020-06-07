export default async function ({ store, redirect, route, $axios, $auth }) {


	console.log('Authenticated: ', $auth.loggedIn);



	// If the user is not authenticated, open the login page !!! WITH REDIRECT URL
	if (!$auth.loggedIn && route.name !== 'login' && route.name !== 'signup' && route.name !== 'lost-password')
		return redirect('/login/');


	// Redirect to projects
	if ($auth.loggedIn && (route.name === 'login' || route.name === 'signup' || route.name === 'lost-password'))
		return redirect('/');


	// Redirect to projects
	if (route.name === 'index')
		return redirect('/projects/');

}
