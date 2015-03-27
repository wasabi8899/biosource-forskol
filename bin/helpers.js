var accounting = require('accounting');
function helpers(){

}

helpers.prototype.init = function(){

	var hbs = require('hbs');
	hbs.registerPartials(appRoot + '/views/partials');


	// Initialize helpers	
	hbs.registerHelper('formatMoney', function(what) {
	  return new hbs.SafeString(accounting.formatMoney(what));
	});

	hbs.registerHelper('stringify', function(what) {
		if(what)
	  		return new hbs.SafeString(JSON.stringify(what));
	});


}


module.exports = new helpers;

