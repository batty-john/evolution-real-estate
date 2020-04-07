const request = require('request-promise');
const blogUrl = 'https://public-api.wordpress.com/wp/v2/sites/evolutionrealestate.wordpress.com/'
const blogUrl2 = 'https://public-api.wordpress.com/rest/v1.1/sites/evolutionrealestate.wordpress.com/'

module.exports = {
	index: function(req, res) {
		let options = {
			uri: `${blogUrl}posts`,
			method: 'GET',
			json: true
		};

		request(options).then(function(posts) {
			console.log('----posts----');
			console.log(posts);
			console.log('-------------');
			return res.view({
				pagetitle: 'Blog',
				posts: posts,
				metaDescription: 'Evolution Real Estate Blog. Get the most relevant information on buying and selling your home.',
				pageActiveName: 'blog',
				canonicalUrl: 'http://evolution.ninja/blog'
			});
		}).catch(function(err) {
			console.log(err);
			return res.redirect('/errorinfo/notFound404');
		});
	},
	post: function({params}, res) {
		console.log('POST');
		console.log(params);
		if (params && params.slug) {
			let slug = params.slug;
			let uri = `${blogUrl2}posts/slug:${slug}`;
			console.log('------------URI----------');
			console.log(uri);
			const options = {
				uri: uri,
				method: 'GET',
				json: true
			};

			request(options).then(data => {
				console.log('-------------CONTENTS------------');
				console.log(data);
				return res.view({
					data: data,
					pagetitle: data.title,
					metaDescription: data.excerpt,
					pageActiveName: 'blog',
					canonicalUrl: `http://evolution.ninja/blog/post/${slug}`
				});
			}).catch(err => {
				return res.redirect('/404');
			});
		} else {
			return res.redirect('/404');
		}
	}
};
