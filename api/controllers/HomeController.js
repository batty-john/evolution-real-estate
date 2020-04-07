var pageActiveName = 'home';

var defaultView = {
	pagetitle: 'Homes For Sale In Vernal Utah',
	metaDescription: 'Looking for homes for sale in Vernal Utah? We at Evolution Real Estate understand the local market in the Uintah Basin because we are natives. We let you browse through the Vernal Utah Real Estate listings with ease and confidence, providing you the most relevant information at your fingertips.',
	h1Header: 'Homes For Sale In Vernal Utah: Find Your Dream Home',
	pageActiveName: pageActiveName,
	canonicalUrl: 'http://evolution.ninja'
}

module.exports = {
	index: function(req, res) {
		return res.view(defaultView);
	}
}
