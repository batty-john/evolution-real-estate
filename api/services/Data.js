var rets = require('rets-client');
var accounting = require('accounting');

module.exports = {
	property: function(query, dmql, listNo) {
		// establish connection to RETS server which auto-logs out when we're done
		return rets.getAutoLogoutClient(Global.rets, function(client) {
			if(listNo) {
				dmql = '(listno=' + listNo + ')';
				query = '';
			} else {
				var dtlastmod = '2017-09-11T18:27:41';

				//query.select = 'lev1sqf,lev2sqf,lev3sqf,lev4sqf,levbsqf,totden,totdiningf,totfamroom,totdinings,totformalliving,totlaundry,listprice,subdivision,style,proptype,street,city,state,zip,totsqf,totbed,totRooms,totbath,agtfirst,agtlast,dtlastmod,listno,dtphoto';

				dmql = "(dtlastmod=" + dtlastmod + "+),(zip=84008,84026,84078,84035,84039,84063,84076,84079,84085,84001,84002,84007,84021,84027,84031,84051,84052,84053,84066,84072,84073)" + dmql;
			}

			console.log('FINAL DMQL');
			console.log(dmql);

		    return promise = new Promise(function(resolve, reject) {
		    	var getPropertyData = function() {
		    		return client.search.query('Property', 'tt_res', dmql, query)
					.then(function(searchData) {
						//console.log(searchData.results);
						resolve(searchData.results);
					}).catch(function(errorInfo) {
						var error = errorInfo.error || errorInfo;
		                reject(error);
					});
		    	};
		    	getPropertyData();
		    });

		}).catch(function(errorInfo) {
			var error = errorInfo.error || errorInfo;
			console.log(error);
		    reject(error);
		});
	},
	photo: function(query) {
		// get photos
		return rets.getAutoLogoutClient(Global.rets, function(client) {

			var dtlastmod = '2017-09-11T18:27:41';

			// query.select = 'lev1sqf,lev2sqf,lev3sqf,lev4sqf,levbsqf,totden,totdiningf,totfamroom,totdinings,totformalliving,totlaundry,listprice,subdivision,style,proptype,street,city,state,zip,totsqf,totbed,totRooms,totbath,agtfirst,agtlast,dtlastmod';

			return promise = new Promise(function(resolve, reject) {
				var getPhotoData = function() {
					return client.objects.getAllObjects("Property", "Photo", query.listno, {alwaysGroupObjects: true, ObjectData: '*', Location: 1})
					.then(function (photoResults) {

						if(photoResults.objects) {
							for(let photo of photoResults.objects) {
								if(photo.type === 'location') {
									photo.headerInfo.location = photo.headerInfo.location.replace(/640x480/g, '1024x768')
								}
							}
							resolve(photoResults.objects);
						}
						else reject({message: "No photos returned"});
						debugger;
					}).catch(function(errInfo) {
						var error = errInfo.error || errInfo;
						console.log(error);
		                reject(error);
					});
				};
				getPhotoData();
			});

		}).catch(function(errorInfo) {
			var error = errorInfo.error || errorInfo;
			console.log(error);
		});

	}

};
