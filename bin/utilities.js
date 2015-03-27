var util = require('util');
var EventEmitter = require('events').EventEmitter;
var memoize = require('memoizee');

// Constructor
function utilities(){
	EventEmitter.call(this);

}

// Copy emmitter to our object
util.inherits(utilities, EventEmitter);
module.exports = new utilities;


// Headers for JSON responses
utilities.prototype.SetAccessControl = function(res){
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');
    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Content-Type','application/json');
}

// Get States by Country
utilities.prototype.getStates = function(countryCode){

			// Finds index of the state in the return list
			var getIndex = function(arr,stateCode){
				if(arr){
					for(var i=0;i<arr.length;i++){
						var item = arr[i];
						if(item.code==stateCode){
							return i;
						}
					}
				}	
				return -1;
			}

			var getStates = function(countryCode){
				var fs = require('fs');
				allCountries = JSON.parse(fs.readFileSync('./config/countries.json'));
				var ret = {}
				if(allCountries){
					allCountries.countries.forEach(function(country){
						if(country.code == countryCode){
							// Found it
							ret = country.states;
							// See if we're filtering things out
							var config = require('config');
							var excludeConfig = config.get('ORDERPAGE.excludedStates');
							if(excludeConfig){

								var items = excludeConfig.filter(function(item){
									return item.countryCode == countryCode;
								});

								if(items)
									if(items.length>0){
										// Remove all items
										items[0].states.forEach(function(item){
											while (getIndex(ret,item) !== -1) {
											  ret.splice(getIndex(ret,item), 1);
											}
										});
									}
							}
							return;
						}
					});

				
				}
				return ret.sort(
			        function(a, b) {
			          return +(a.name > b.name) || +(a.name === b.name) - 1;
			        }
			    );				
			}

			cachedStates = memoize(getStates);

			return cachedStates(countryCode);

}
