var Q = require('q');
var accounting = require('accounting');
var moment = require('moment');

var libs = {
	accounting: accounting,
	moment: moment
};

var pageActiveName = 'properties';

function powerset(set){

	// Helper function to convert decimal number to binary
	var  toBin = function(n){
		return parseInt(n, 10).toString(2);
	};

	// Declaring all variables
	var nSubsets = Math.pow(2, set.length), // 2^n
		array = [],
		str;

	// Looping 2^n times
	for(var i=0; i<nSubsets; i++){
		str = "";

		// Variable containing a binary number
		// formated with leading zeros and which
		// type is String.
		var actualBin = ((Array(set.length).join("0")) + toBin(i)).slice(set.length * -1);

		// This nested loop allow us to iterate
		// over each character of the binary string.
		// Every time we find the char "1", we get the symbol
		// corresponding to the position j in
		// the set array.
		for(var j=0; j<actualBin.length; j++) {
			if(actualBin[j] == "1"){
			str += ' ' + set[j];
			}
		}
		if(str) array.push(str.trim());
	}
	return array;
}

var limit = 10;

module.exports = {
	index: function(req, res) {
		searchString = req.query.search ? req.query.search : '';
		res.view({
			pagetitle: 'Properties',
			metaDescription: 'Listings in Vernal, UT',
			search: searchString,
			pageActiveName: pageActiveName,
			canonicalUrl: 'http://evolution.ninja/properties'
		});
	},
	shortsales: function(req, res) {
		res.view({
			pagetitle: 'Short Sales',
			metaDescription: 'Short Sales in Vernal, UT',
			pageActiveName: pageActiveName,
			canonicalUrl: 'http://evolution.ninja/properties/shortsales'
		});
	},
	featured: function(req, res) {
		res.view({
			pagetitle: 'Featured',
			metaDescription: 'Featured listings in Vernal, UT',
			pageActiveName: pageActiveName,
			canonicalUrl: 'http://evolution.ninja/properties/featured'
		});
	},
	listing: function(req, res) {
		console.log(req.params);
		if(req.params.id) {
			// get property with this id
			var promises = [];
			promises.push(Data.property(null, null, req.params.id));
			promises.push(Data.photo({listno: req.params.id}));
			Q.all(promises).then(data => {
				var listing = data[0][0];
				var photos = data[1];
				console.log('========= PHOTOS ==========');
				console.log(photos);
				return res.view({
					pagetitle: 'Listing: ' + listing.listno + ' - ' + (listing.subdivision ? listing.subdivision : (listing.style ? listing.style : (listing.proptype ? listing.proptype : listing.street))),
					metaDescription: listing.publicremarks,
					listing: listing,
					photos: photos,
					libs: libs,
					pageActiveName: pageActiveName,
					canonicalUrl: `http://evolution.ninja/properties/listing/${req.params.id}`
				})
			});
		}
	},
	get: function(req, res) {
		var query = {
			offset: req.query.offset,
			limit: req.query.limit ? req.query.limit : limit
		};
		var filter = req.query;
		var dmqlAND = [];

		console.log(filter);
		if(filter.addressCityZipMls) {
			var strs = filter.addressCityZipMls.split(' ');
			var arr = powerset(strs);
			dmql = '';

			var filteredListings = [];

			var promise = Data.property({}, dmql);
			promise.then(listings => {
				console.log(listings.length);
				_.each(arr, function(a) {
					console.log(a);
					var listNoFilter = _.filter(listings, function(l) {
						return String(l.listno).indexOf(String(a)) !== -1;
					});
					console.log(listNoFilter.length);
					var addressFilter = _.filter(listings, function(l) {
						return String(l.street).indexOf(String(a)) !== -1 || String(l.housenum).indexOf(String(a)) !== -1;
					});
					console.log(addressFilter.length);
					var cityZipFilter = _.filter(listings, function(l) {
						return String(l.zip).indexOf(String(a)) !== -1 || String(l.city).indexOf(String(a)) !== -1 || String(l.state).indexOf(String(a)) !== -1;
					});
					console.log(cityZipFilter.length);

					if(listNoFilter.length > 0) filteredListings = filteredListings.concat(listNoFilter);
					if(addressFilter.length > 0) filteredListings = filteredListings.concat(addressFilter);
					if(cityZipFilter.length > 0) filteredListings = filteredListings.concat(cityZipFilter);
				});

				filteredListings = filteredListings.slice(parseFloat(query.offset), parseFloat(query.offset) + parseFloat(query.limit));
				return res.json(filteredListings);
			}).catch(err => {
				return res.status(500).send(err);
			});

			// if(isNAN(str)) {
			// 	// non numeric
			// 	dmqlOR.push('(city=' + str.replace(/\*/g, '') + ')');
			// 	dmqlOR.push('(state=' + str.replace(/\*/g, '') + ')');
			// 	dmqlOR.push('(street=' + str.replace(/\*/g, '') + ')');
			// } else {
			// 	// numeric
			// 	dmqlOR.push('(housenum=' + str.replace(/\*/g, '') + ')');
			// 	dmqlOR.push('(listno=' + str.replace(/\*/g, '') + ')');
			// 	dmqlOR.push('(zip=' + str + ')');
			// }
		} else {

			if(filter.maxSqFt) dmqlAND.push('(totsqf=' + filter.maxSqFt + '-)');
			if(filter.minSqFt) dmqlAND.push('(totsqf=' + filter.minSqFt + '+)');
			if(filter.minPrice) dmqlAND.push('(listprice=' + filter.minPrice + '+)');
			if(filter.maxPrice) dmqlAND.push('(listprice=' + filter.maxPrice + '-)');
			console.log('category');
			console.log(filter.category);
			if(filter.category === 'shortsales') dmqlAND.push('~(shortsale=.EMPTY.)');

			if(filter.category && filter.category === 'featured') {
				dmqlAND.push('(office=70953)');

				// var agents = require('../../agents.json');
				// console.log(agents);

				// var agentIds = [];
				// _.each(agents, function(agent) {
				// 	agentIds.push(agent.id);
				// });

				// dmqlAND.push('(agent=' + agentIds.join(',') + ')');
				// console.log('(agent=' + agentIds.join(',') + ')');

				// dmqlAND.push('(agtfirst=Jeremy)');
				// dmqlAND.push('(agtlast=Peterson)');
			}

			dmql = dmqlAND.length > 0 ? ',' + dmqlAND.join(',') : '';

			console.log('query');
			console.log(query);
			console.log('dmql');
			console.log(dmql);

			var promise = Data.property(query, dmql);
			promise.then(listings => {
				return res.json(listings);
			}).catch(err => {
				return res.status(500).send(err);
			});
		}
	}
};
