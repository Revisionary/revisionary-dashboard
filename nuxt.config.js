const webpack = require("webpack");

export default {
	srcDir: "src/",
	mode: "spa",
	// server: {
	// 	https: {
	// 		key: fs.readFileSync(path.resolve(__dirname, '../proxy/certificates/revisionary.co.key')),
	// 		cert: fs.readFileSync(path.resolve(__dirname, '../proxy/certificates/revisionary.co.crt'))
	// 	}
	// },
	/*
	 ** Headers of the page
	 */
	head: {
		title: "Dashboard | Revisionary App",
		meta: [
			{ charset: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{
				hid: "description",
				name: "description",
				content: process.env.npm_package_description || ""
			}
		],
		link: [
			{ rel: "icon", type: "image/x-icon", href: "/favicon.png" },
			//{ rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" }
		]
	},
	router: {
		prefetchLinks: false,
		middleware: ['auth', 'dropdown-closer']
	},
	/*
	 ** Customize the progress-bar color
	 */
	//loading: '~/components/Loading.vue',
	loading: {
		color: "#037ef3",
		height: '2px',
		trottle: 200,
		duration: 1000,
		continuous: true
	},
	/*
	 ** Global CSS
	 */
	styleResources: {
		scss: ['~/assets/style/variables.scss']
	},
	css: ["~/assets/style/global"],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: ['~/plugins/date-time.client.js'],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		"@nuxtjs/style-resources",
		"@nuxtjs/axios",
		"@nuxtjs/proxy",
		'@nuxtjs/auth',
		"@nuxtjs/pwa",
		"nuxt-svg-loader"
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {
		// https: true,
		// host: "dapi.revisionary.co",
		// baseURL: "http://backend/v1/",
		baseURL: process.env.API_ENDPOINT || 'https://npi.revisionary.co/v1/',
		//baseURL: "/v1/",
		// browserBaseURL: "https://new.revisionaryapp.com/v1/",
		port: 80,
		//prefix: "/v1/",
		//retry: { retries: 3 },
		//proxy: true,
		//proxyHeaders: false
	},
	auth: {
		redirect: {
			login: '/login/',
			logout: false,
			home: '/projects/'
		},
		strategies: {
			local: {
				endpoints: {
					login: { url: 'session', method: 'post', propertyName: 'token' },
					logout: { url: 'session', method: 'delete' },
					user: { url: 'session', method: 'get', propertyName: 'user' }
				},
				// tokenRequired: true,
				// tokenType: 'bearer',
				// globalToken: true,
				autoFetchUser: false
			}
		}
	},
	// proxy: {
	// 	'/v1/': {
	// 		//ws: false,
	// 		//target: process.env.API_ENDPOINT || 'https://new.revisionaryapp.com/'
	// 		target: 'https://dapi.revisionary.co/v1/' // Local
	// 		//target: 'https://new.revisionaryapp.com/' // Live
	// 	}
	// },
	// proxy: {
	// 	'/v1/': 'https://dapi.revisionary.co'
	// },
	/*
	 ** Build configuration
	 */
	build: {
		plugins: [
			new webpack.ProvidePlugin({
				$: "jquery"
			})
		],
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) { }
	}
};
