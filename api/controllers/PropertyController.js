var accounting = require('accounting');
var moment = require('moment');

var libs = {
	accounting: accounting,
	moment: moment
};

var take = 20;
var limit = 100;

module.exports = {
	index: function(req, res) {
		// get default properties

		var page = req.query && req.query.page ? parseInt(req.query.page) : 1;

		var promise = Data.property(req.query);
		promise.then((data) => {
			console.log(data.length);
			var count = data.length;
			var pages = parseInt(count / take);
			if(count % take > 1) pages++;

			var startIndex = (page - 1) * take;
			
			var qty;
			if(page === pages) {
				qty = count % take;
			} else {
				qty = take;
			}
			console.log('startIndex');
			console.log(startIndex);
			console.log('qty');
			console.log(qty);
			console.log('data.length');
			console.log(data.length);
			console.log('pages');
			console.log(pages);
			console.log('page');
			console.log(page);

			var listings = data.slice(startIndex, startIndex + qty);
			//console.log(listings);


			listings = typeof listings !== 'undefined' ? listings : [];
			res.view({
				pagetitle: 'Properties',
				data: listings,
				metaDescription: 'Properties page',
				libs: libs,
				pages: pages,
				page: page
			});
		}, (err) =>  {
			res.view({
				pagetitle: 'Properties',
				metaDescription: 'Properties page',
				data: [],
				libs: libs
			});
		});
	},
	listings: function(req, res) {
		var promise = Data.property(req.query);
		promise.then(listings => {
			return res.json(listings);
		}).catch(err => {
			return res.status(500).send(err);
		});
	}
};