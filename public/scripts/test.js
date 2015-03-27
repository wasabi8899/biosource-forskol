require(["formTools","formActions","visitor","globals"], function(formTools,formActions,visitor,globals) {

	return {
		init : function(){
		   	// Internals
   			this.visitor = null;
   			//
   			// 	Setup forms on page (validation & etc) and get all located forms & their fields
   			//
   			this._forms = formTools.setupForms.bind(this)({
				countryCode:globals.COUNTRYCODE,
				instantZipLookup: globals.ZIPLOOKUP
   			});

   			// Setup persistent storage
   			this.visitor = visitor.init.bind(this)().data;

   			// Bind actions
			formActions.init.bind(this)();
		}
	}
});