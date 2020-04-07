module.exports = {
	privacy: function(req, res) {
		return res.view({
			pagetitle: 'Privacy Policy',
			metaDescription: 'Privacy Policy for Evolution Real Estate website.',
			canonicalUrl: 'http://evolution.ninja/info/privacy',
			pageActiveName: 'Privacy'
		})
	}
}
