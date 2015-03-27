define(['jquery','utilities','globals','accounting','ezstorage'], function($,utilities,globals,accounting){

	var forms;
	var __keyname = "visitor";
	var _data;
	var campaignInfoChanged = false;


	function toQueryString(prefix,existing){
		var ret = (existing?existing:'');
		prefix = (prefix?prefix:'');

		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if(this[prop].value){
					if(typeof this[prop].value != "object"){
						ret += (ret.length>0?"&":"") + prefix + prop + "=" + encodeURIComponent(this[prop].value);
					}
				}else{
					if(typeof this[prop] != "object"){
						ret += (ret.length>0?"&":"") + prefix + prop + "=" + encodeURIComponent(this[prop]);
					}
				}
			}
		}
		return ret;	
	}


	function save(){
		if($.ezstorage.enabled()){
			if(_data){
				utilities.log('INFO : Saving into storage');
				var objToSave = _data.json();
				// Check if we have to copy data 
				if(_data.billingInfoSame)
					_data.copy(_data.shippingInfo,_data.billingInfo);
				// Save data
				objToSave['shippingInfo'] = _data.shippingInfo.json();
				objToSave['billingInfo'] = _data.billingInfo.json();
				objToSave['campaignInfo'] = _data.campaignInfo.json();

				$.ezstorage.set(__keyname,objToSave,{persist:true});
			}
		}
	}

	visitor.prototype.pixelFired = function(pixelType){
		if($.ezstorage.enabled()){
			// Check if it's in non persistent storage
			if($.ezstorage.get(__keyname + '-px-' + pixelType)){
				return true;
			}
		}
		return false;
	}

	visitor.prototype.firePixel = function(pixelType){
		if(!this.pixelFired(pixelType)&&this.campaignInfo.campaignCode){
			// insert pixel
			var pixelCode = '';
			var ret = "";
			var c = this.campaignInfo;
			var eType;
			switch (pixelType) 
			{
				case "start" :
					eType = 2;
				break;
				case "order" : 
					eType = 3
				break;
			}
			if(c&&eType)

				ret = "<!--pixelcode start--><img src='https://secure1.m57media.com/clients/p2c/u/pc/?cid1=0" 
					  + "&cid2=" + (c.landingPageId  || "") + "&cid3=0&cid4=0" 
					  + "&caid=" + (c.campaignId  || "")
					  + "&caCode=" + (c.campaignCode   || "")
					  + "&stID=" + (c.storeId  || "")
					  + "&eType=" + (eType  || "")
					  + "&misc1=" + (c.misc1 || "")
					  + "&misc2=" + (c.misc2 || "")
					  + "&misc3=" + (c.misc3 || "")
					  + "' style='height:1px;width:1px;border-width:0px;position:absolute'/><!--pixelcode end-->";
			// Append it to body
			$(ret).appendTo( "body");
			// prevent dupe firing
			if($.ezstorage.enabled()){
				// Session only
				if($.ezstorage.set(__keyname + '-px-' + pixelType,{persist:true}));
			}
		}
	}

	function getpixel(PAGETYPE,visitor){
		
	}

	visitor.prototype.toURL = function(includePaymentInfo){
		var url = "";
		if (_data) {
			// Get Data
			url += "billingShippingSame=" + (_data.billingShippingSame ? "yes" : "no");
			url += "&leadId=" + _data.leadId || 0;
			url += "&customerId=" + (!_data.customerId || _data.customerId == null ? 0 : _data.customerId);
			url += "&t=" + (_data.testMode==true ? true :false);
			url = _data.shippingInfo.querystring('s', url);
			url = _data.billingInfo.querystring('b', url);
			url = _data.campaignInfo.querystring('', url);
			if (includePaymentInfo) {
				url = _data.paymentInfo.querystring('', url);
				url = _data.cartquerystring(url);
			}
		}
		return url;
	}

	function visitor(){

		var that = this;
		// Shipping & Lead address
		this.shippingInfo = {};

		// Billing address
		this.billingInfo = {};

		// Shopping Cart items
		this.shoppingCart = [];

		// Billing info items
		this.paymentInfo = {};

		// Shipping same (default to YES)
		this.billingShippingSame = true;

		// Campaign info
		this.campaignInfo = new campaignInfo();

		// Test mode
		this.testMode = false;

		// API values
		this.initdate = new Date();
		this.leadId = null;
		this.customerId = null;
		this.orderId = [];

		// Attempt to read from the ez storage
		var instorage;
		if($.ezstorage.enabled()){
			// Check if we have this in storage
			instorage = $.ezstorage.get(__keyname);
			if(instorage){
				utilities.log('INFO : Visitor already in storage');
			}
		}
		
		 this.shippingInfo = new info();
		 this.billingInfo = new info();
		 this.paymentInfo = new paymentInfo();

		// GO through fields on page and connect the dots
		if(forms){
			var that = this;
			forms.forEach(function(form){
				// Default to shipping
				var info = that.shippingInfo;

				switch(form.formType){
					case "billing" :
						info = that.billingInfo;
					break;
				}
				// Save references
				that.currentInfo = info;

				if(form.fields)
					var formFields = form.fields.filter(function(item){return item.origin});
					if(formFields){
						// Go through regular info items
						for (var property in info) {
						    if (info.hasOwnProperty(property)) {
								var formField = utilities.getParams(property,formFields);
								if(formField){
									// Found it
									
									var obj = info[property];
									var changeEvent = function(obj){
										// Update variable
										return function() { 
											var newvalue = $(this).val();
											if(obj.value!=newvalue){
												obj.set(newvalue);
												// Save to storage
												console.log('this save');
												save();	
											}
										}									
									}

									// Save reference
									info[property].origin = formField;

									// attach on change event from form back to storage
									if(formField.origin)
										formField.origin.change(changeEvent(obj));
								}
						        
						    }
						}
					
						// Go through payment info items if it's billing
						if(form.formType=='billing'){
							info = that.paymentInfo;
							for (var property in info) {
							    if (info.hasOwnProperty(property)) {
									var formField = utilities.getParams(property,formFields);
									if(formField){
										// Found it
										var obj = info[property];
										var changeEvent = function(obj){
											// Update variable
											return function() { 
												var newvalue = $(this).val();
												if(obj.value!=newvalue) obj.set(newvalue);
											}									
										}

										// Save reference
										info[property].origin = formField;

										// attach on change event from form back to storage
										if(formField.origin)
											formField.origin.change(changeEvent(obj));
									}
							        
							    }
							}						
						}
					}
			});
		}

		// Check if items were in the storage
		if(instorage){
			// go through main properties
			for (var prop in instorage) {
				if (instorage.hasOwnProperty(prop)) {
					if(typeof instorage[prop] != "object"){
						// console.log({name:prop,value:this[prop]});
						that[prop] = instorage[prop];
						// Check for test mode
						if(prop=="testMode") this.test(instorage[prop]);
					}
				}
			}
			// Now save billing & shipping info
			['billingInfo','shippingInfo','campaignInfo'].forEach(function(item){
				var obj = instorage[item];
				if(obj)
				for (var prop in obj) {
					if (obj.hasOwnProperty(prop)) {
						if(that[item][prop]!=undefined)
							if(that[item][prop].set)
								that[item][prop].set(obj[prop]);
							else
								if(item=='campaignInfo'){
									if(obj[prop].length>0&&that[item][prop].length==0){
										// Only retrieve if data wasn't already set
										that[item][prop] = obj[prop];
									}
								}else{
									that[item][prop]=obj[prop];
								}
					}
				}
			});
		}
	}

	// For single item selections
	visitor.prototype.cartItemSelect = function(id){
		// Clear out existing items
		this.shoppingCart = [];
		// Set item
		var newitem = findItem(id);
		if(newitem){
			// Add Qty
			newitem['qty'] = 1;
		}
		
		this.shoppingCart.push(findItem(id));
		// Update totals
		this.cartUpdateTotals();
	}

	// Update totals
	visitor.prototype.cartUpdateTotals = function(){
		var shipping = 0;
		var total = 0;

		if (this.shoppingCart) {
			if (this.shoppingCart.length > 0) {
				this.shoppingCart.forEach(function (product) {
					if (product.price) {
						shipping += product.shipping * product.qty || 1;
						total += product.price * product.qty || 1;
					}
				});
			}
		}
		// Update html
		$("#scTotal").html(accounting.formatMoney(total));
		$("#scShipping").html(accounting.formatMoney(shipping));
		// Update 1st item if any
		$("#scSelectedProduct").html(this.cartFirstProduct().description);

	}

	// Page Updates
	visitor.prototype.pageUpdates = function(){
		var shipping = 0;
		var total = 0;
		var that = this;

		// Go through parent 
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if(typeof this[prop] != "object"){
					$("." + prop).html(this[prop]);
				}
			}
		}


		// Go through individual items
		['billingInfo','shippingInfo','campaignInfo'].forEach(function(item){
			// Now go through each item

			for (var prop in that[item]) {
				if (that[item].hasOwnProperty(prop)) {
					if(that[item][prop].value){
						if(typeof that[item][prop].value != "object"){
							$("." + item + "_" + prop).html(that[item][prop].value);
						}
					}else{
						if(typeof that[item][prop] != "object"){
							$("." + item + "_" + prop).html(that[item][prop]);
						}
					}
				}
			}
		});

	}	

	visitor.prototype.cartFirstProduct = function(){
		var ret = {description:'',price:0,shipping:0,packageId:0,productId:0};
		if(this.shoppingCart)
			if(this.shoppingCart.length>0){
				ret = this.shoppingCart[0];
			}

		return ret;
	}

	visitor.prototype.cartjson = function(){
		var ret = [];
		if(this.shoppingCart)
			this.shoppingCart.forEach(function(product){
				ret.push({description:product.description,price:product.price,shipping:product.shipping,packageId:product.packageId,productId:product.productId});
			});
		

		return JSON.stringify(ret);
	}

	visitor.prototype.cartquerystring = function(url){
		if(this.shoppingCart)
			this.shoppingCart.forEach(function(product){
				url += (url.length > 0?"&":"") + "pid[]=" + encodeURIComponent(product.id || 0) + "&qty[]=" + encodeURIComponent(product.qty || 1);
			});
		

		return url;
	}	

	function findItem(id){
		var ret = {};
		if (typeof globals.PRODUCTS == 'object') {
			var item = globals.PRODUCTS.filter(function(item){return item.productId == id || item.packageId == id});

			if (item)
				if(item.length>0){
					ret = item[0];
					ret.id = id;
				}
		}
		return ret;
	}

	visitor.prototype.addCartItem = function(id){
		//TODO: Add another item
	}

	visitor.prototype.json = function(){
		var ret = {};
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if(typeof this[prop] != "object"){
					// console.log({name:prop,value:this[prop]});
					ret[prop] = this[prop];
				}
			}
		}
		return ret;
	}

	visitor.prototype.save = save;

	function info(){
		this.first = new value(true);
		this.last = new value(true);
		this.address1 = new value(true);
		this.address2 = new value(false);
		this.city = new value(true);
        this.state = new value(true);
        this.country = new value(true); //TODO: make country working
		this.zip = new value(true);
		this.phone = new value(true);
		this.email = new value(true);
		this.valid = false;
		// Default country
		if(globals.COUNTRYCODE)
			this.country.set(globals.COUNTRYCODE);
	}

	function campaignInfo(){
		this.campaignCode = '';
		this.landingPageId = '';
		this.storeId = '';
		this.misc1 = '';
		this.misc2 = '';
		this.misc3 = '';
	}

	campaignInfo.prototype.querystring = toQueryString


	campaignInfo.prototype.json = function(){
		var ret = {};
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				ret[prop] = this[prop];
			}
		}
		return ret;
	}


	function paymentInfo(){
		this.nameoncard = new value(true,false);
		this.cardnumber = new value(true,false);
		this.expirymonth = new value(true,false);
		this.expiryyear = new value(true,false);
        this.cvv = new value(true, false);
        this.mid = new value(false, false);
        this.loadbalancegroup = new value(false, false);
	}	

	info.prototype.json = function(){
		var ret = {};
		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if(typeof this[prop].value == "string"){
					// console.log({name:prop,value:this[prop].value});
					ret[prop] = this[prop].value;
					if(ret[prop])
						if(ret[prop].length==0)
							// Back fix
							if(this[prop].origin)
								if(this[prop].origin.origin)
									ret[prop] = this[prop].origin.origin.val();
				}else{
					if (prop == 'valid') {
						ret['valid'] = this[prop];
					}
				}

			}
		}
		return ret;
	}

	info.prototype.querystring = toQueryString
	
	paymentInfo.prototype.querystring = toQueryString

	visitor.prototype.test = function(mode){
		if(mode){
            // Already in test mode so disable it
            $("#testMode").remove();
            utilities.log('INFO : Test mode OFF');
         }else{
            // Adding test mode
            utilities.log('INFO : Test mode ON');
            // Not in test mode, enable it
            $("<div id='testMode'>TEST MODE</div>").appendTo("body");
         }
         // Reset flag
         this.testMode = mode;
         // Save
         save();
	}

	function value(required,persist){
		this.value = "";
		// pointing to the field
		this.origin = null;
		// passed validation
		this.valid = false;
		this.required = required;
		this.persist = (persist?persist:true);
	}

	// Update value
	value.prototype.set = function(value){
		this.value = value;
		// Item changed, update origin (if one is present)
		if(this.origin){
			if(this.origin.origin){
				var obj = $(this.origin.origin);
				if(obj){
					// Set it backwards
					if(obj.val()!==value){
						obj.val(value);
						// Re-save
						save();
					}

				}
			}
		}
	}

	visitor.prototype.copy = function(from,to){
		// Function used to copy values only
		if (from && to) {
			for (var prop in from) {
				if (from.hasOwnProperty(prop)) {
					if (to[prop].set) {
						to[prop].set(from[prop].value);
					}
					else {
						to[prop] = from[prop];
					}
				}
			}
		}
	}

	return {
		init : function(){
		
			forms = this._forms;
			_data = new visitor();

			// Record last visit
			if(_data.lastVisit){
				// Compare if this is a new visit or not

			}
			_data['lastVisit'];

			// Read campaign details from querystring
			['caid:campaignId','cid2:landingPageId','caCode:campaignCode','stID:storeId','misc1:misc1','misc2:misc2','misc3:misc3'].forEach(function(item){
				var ra = item.split(":");

				if(utilities.querystring(ra[0])){
					// Save item only if it has been changed
					if(_data.campaignInfo[ra[1]]!=utilities.querystring(ra[0])){
						_data.campaignInfo[ra[1]] = utilities.querystring(ra[0]);
						campaignInfoChanged = true;
					}
				}
			});
			
			// Save campaign info if it was changed
			if(campaignInfoChanged) save();

			return {
				clear : function(){
					if($.ezstorage.enabled()){
						$.ezstorage.remove(__keyname);
						utilities.log('INFO : Visitor removed from storage');
					}
				}.bind(this),
				save : save.bind(this),
				data : _data
			}
		}
	}

});

	