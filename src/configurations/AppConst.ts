// Group all constants into a single structure
const AppConst = {
	pulse: {
		RADIUS: 8, // Default radius in pixels
		APPEAR_DURATION: 200, // milliseconds to grow in before moving
		FADE_DURATION: 200, // milliseconds to shrink after arriving
		TRAVEL_DURATION: 1600, // milliseconds to move along path
		TRAIL_DURATION: 300, // milliseconds for fade of trail points
		COLOR: 'rgba(176, 196, 220, 0.8)', // Color of the pulse
	},
	noodle: {
		COLOR: 'steelblue', // Color of the connection line
		WIDTH: 4, // Width of the connection line in pixels
	},
	node: {
		width: 200, // width of a node
		headerHeight: 30, // height of header
		bodyMinHeight: 8, // sockets appear in the body
		footerHeight: 16, // height of footer
	},
	nodeGroup: {
		spacingBottom: 8,
	},
	socket: {
		radius: 8, // radius of the connector that the noodle connects to
		inset: 12, // how far inset the connector is into the node
		spacing: 4, // the amount of spacing between dockets
	},
} as const;

export default AppConst;
