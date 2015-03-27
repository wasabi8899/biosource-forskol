define(['jquery','globals'], function($,globals){

	function getParams(fieldName,fieldSource){
		var ret = {};
		if(fieldSource)
			if(fieldSource.length>0){
				fieldSource.forEach(function(item){
					if(item.name)
						if(item.name.indexOf(fieldName.toUpperCase())>=0||(item.type ? item.type.indexOf(fieldName.toUpperCase())>=0 : false)) {
							// Item found
							ret = item;
							return;
						}
				});
			}
		return ret;
	}

	function querystring(name) {
	    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
	    var regex = new RegExp("[\\?&]" + name.toLowerCase() + "=([^&#]*)"),
	        results = regex.exec(location.search.toLowerCase());
	    return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, " "));
	}


	


	return {
		getParams : getParams,
		querystring : querystring,
		log : function(message){
			if(globals.DEBUG){
				console.log('DEBUG : ' + message);
			}
		}

	}
});
