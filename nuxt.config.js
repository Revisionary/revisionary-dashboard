// import path from 'path'
// import fs from 'fs'

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
		link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.ico" }]
	},
	router: {
		prefetchLinks: false,
		middleware: 'dropdown-closer'
	},
	/*
	 ** Customize the progress-bar color
	 */
	loading: '~/components/Loading.vue', // loading: { color: "#037ef3" },
	/*
	 ** Global CSS
	 */
	css: ["~/assets/style/global"],
	/*
	 ** Plugins to load before mounting the App
	 */
	plugins: [],
	/*
	 ** Nuxt.js dev-modules
	 */
	buildModules: [],
	/*
	 ** Nuxt.js modules
	 */
	modules: [
		// Doc: https://axios.nuxtjs.org/usage
		"@nuxtjs/axios",
		"@nuxtjs/proxy",
		'@nuxtjs/auth',
		"@nuxtjs/pwa",
		// Doc: https://github.com/nuxt-community/dotenv-module
		"@nuxtjs/dotenv"
	],
	/*
	 ** Axios module configuration
	 ** See https://axios.nuxtjs.org/options
	 */
	axios: {
		// https: true,
		// host: "dapi.revisionary.co",
		// baseURL: "http://backend/v1/",
		// browserBaseURL: "http://dapi.revisionary.co/v1/",
		// port: 80,
		prefix: "/v1/",
		retry: { retries: 3 },
		credentials: false,
		proxy: true,
		// proxyHeaders: false
	},
	auth: {
		redirect: {
			login: '/login',
			logout: '/login',
			home: '/projects'
		},
		strategies: {
			local: {
				endpoints: {
					login: { url: 'session', method: 'post', propertyName: 'token' },
					logout: { url: 'session', method: 'delete' },
					user: { url: 'session', method: 'get', propertyName: 'user' }
				},
				// tokenRequired: true,
				tokenType: '',
				// globalToken: true,
				autoFetchUser: false
			}
		}
	},
	proxy: {
		'/v1/': {
			//target: 'http://dapi.revisionary.co/' // Local
			target: 'https://new.revisionaryapp.com/' // Live
		}
	},
	// proxy: {
	// 	'/v1/': 'https://dapi.revisionary.co'
	// },
	/*
	 ** Build configuration
	 */
	build: {
		/*
		 ** You can extend webpack config here
		 */
		extend(config, ctx) { }
	}
};
