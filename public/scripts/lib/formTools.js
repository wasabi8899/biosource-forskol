define(['jquery','messages','utilities','jquery.creditCardValidator','jquery.validate','additional-methods','jquery.maskedinput'], function($,messages,utilities){

	var forms = [];
	var expiryInputs = {};
	var visitor;

	var pageForm = function(formobj){
		// Save reference to the form
		var form = formobj;

		// Determine form type (default to lead)
		var formType = (form.data('type') ? form.data('type') : 'lead');
		if(['lead','billing'].filter(function(item){return item.toUpperCase() == formType.toUpperCase()}).length==0){
			// Invalid form
			utilities.log('ERROR : Invalid form type provided');
			return;
		}else{
			// Make sure there's no other forms competing on same page
			if(forms.filter(function(item){return item.formType.toUpperCase()==formType.toUpperCase();}).length>0){
				// Duplicate competing form
				utilities.log('ERROR : Competing form type detected, please check data-type on <form> variables. Duplicate detected : "' + formType + '" > ' + form.html());
				return;
			}
		}

		// Array of form fields & their messages
		var fields = [
			{
				name : ["NAMEONCARD"],
				messages : {required:"Enter name on card"},
				rules : {required:true}
			},
			{
				name : ["EXPIRYYEAR","YEAREXPIRY"],
				messages : {required:"Specify expiraton year"},
				type: "expiry",
				rules : {required:true}
			},
			{
				name : ["EXPIRYMONTH","MONTHEXPIRY"],
				messages : {required:"Specify expiration month",expiry:"Please check expiration date"},
				type: "expiry",
				rules : {required:true,expiry:true}
			},
			{
				name : ["FIRSTNAME","FIRST"],
				messages : {required:"Enter your first name"},
				rules : {required:true}
			},
			{
				name : ["LASTNAME","LAST"],
				messages : {required:"Enter your last name"},
				rules : {required:true}
			}
			,
			{
				name : ["ADDRESS1","ADDRESS"],
				messages : {required:"Enter your address"},
				rules : {required:true}
			},
			{
				name : ["CITY"],
				messages : {required:"Enter your city"},
				rules : {required:true},
				type : "city"
			},
			{
				name : ["PHONE","CELL","MOBILE","TELEPHONE"],
				messages : {required:"Enter your phone"},
				rules : {required:true},
				masks: [{countryCode: ["US","CA"], mask: '(999) 999-9999', placeholder:'X'}]
			},
			{
				name : ["EMAIL"],
				messages : {required:"Enter your email",email:"Enter a valid email address"},
				rules : {required:true,email:true}
			},
			{
				name : ["AGREETOTERMS","AGREE","TERMS"],
				messages : {required:"<span style='font-size:12pt;font-weight:500;padding:10px;font-style:none;text-align:center;color:brown'>If you wish to proceed,<br>you must agree to<br>terms & conditions</span>"},
				rules : {required:true}
			},			
			{
				name : ["STATE","STATES","PROVINCES","PROVINCE"],
				type : "state",
				messages : {required:"Select your state"},
				rules : {required:true}
			},
			{
				name : ["COUNTRY"],
				messages : {required:"Select your country"},
				rules : {required:true}
			},
			{
				name : ["CARDNUMBER"],
				messages : {required:"Specify credit card number",creditcard:"Invalid credit card # provided"},
				rules : {required:true,creditcard:true},
				masks : [{mask:'9999-9999-9999-9999'}],
				type: 'cardnumber'
			},
			{
				name : ["ZIP","ZIPCODE","POSTALCODE","POSTAL"],
				messages : {required:"Enter your zip"},
				rules : {required:true},
				masks: [{countryCode: ["US"], mask:'99999',placeholder:'X'},
					    {countryCode: ["CA"], mask:'t9t-9t9',placeholder:'X'}
					   ],
				type : "zip"
			},
			{
				name : ["CARDCVV","CVV","CVVCODE"],
				messages : {required:"Specify security code",number:"Invalid security code"},
				rules : {required:true,number:true}
			},
		];


		return {
			fields : fields,
			form : form,
			formType : formType,
			inputs : []
		}
	};



	// Messages setup accepts array of inputs
	function setupValidators(inputs,options,fields){
		var settings = options || {};
		var retMessages = {};
		var retValidators = {};
		var that = this;
		// Specify mask definitions
		$.mask.definitions['f'] = "[A-Za-z0-9]"; 
		$.mask.definitions['t'] = "[A-Za-z]"; 

		if(inputs)
			if(inputs.length>0){
				inputs.forEach(function(item){
					var inputItem = $(item);
					var inputName = inputItem.attr('id') || inputItem.attr('name');
					var input = utilities.getParams(inputName,fields);
					// Update reference
					input['origin'] = inputItem;

					// get validation rule
					if(input.rules)
						retValidators[inputName] = input.rules;
					// get validation message
					if(input.messages)
						retMessages[inputName] = input.messages;
					// setup masking
					if(input.masks)
						if(input.masks.length>0){
							// Check if there's country specific mask
							var mask;
							var placeholder;
							input.masks.forEach(function(maskItem){
								if(!maskItem.countryCode){
									// Default item
									if(!mask) mask = maskItem.mask;
									placeholder = maskItem.placeholder;
								}else{
									// Only check if country code is specified
									if(settings.countryCode){
										// Check if we have a match
										if(maskItem.countryCode.filter(function(item){return item.toUpperCase() == settings.countryCode.toUpperCase();}).length>0) {
											// Found a match
											mask = maskItem.mask;
											placeholder = maskItem.placeholder;
											return;
										}
									}
								}
							});

							// If mask is present
							if(mask){
								inputItem.mask(mask,{placeholder:placeholder||'X'});
							}

						}

					// Setup instant lookup
					if(settings.countryCode=='US'&&input.type=='zip'&&settings.instantZipLookup){
						// Attach on change event
						inputItem.change(function() {
							// Make sure it's at least 5 digits
							val = inputItem.val();
							if(val.length>=5){
								// Run Zipcode check
								var callback = function(results){
									if(results.valid){
										// Received valid results update value
										var state = utilities.getParams('state',fields);
										if(state.origin){
											state.origin.val(results.state);
											if(that.visitor) that.visitor.currentInfo.state.set(results.state);
										}
										var city = utilities.getParams('city',fields);
										if(city.origin){
											city.origin.val(results.city);
											if(that.visitor) that.visitor.currentInfo.city.set(results.city);
										}

										// Save
										that.visitor.save();
									}
								}
								var lookupResults = GetCityStateInfo(val,callback);
							}
						});
					}

					// Setup card instant validator
					if(input.type=='cardnumber'){
						//Attach on click event
						inputItem.keydown(function(){
							 inputItem.validateCreditCard(function(result) {
							 	// Remove additional classes
							 	['visa','visa_electron','mastercard','maestro','discover'].forEach(function(item){
							 		inputItem.removeClass(item);
							 	});
							 	if(result.card_type)
							 		// Add new type
							 		inputItem.addClass(result.card_type.name);
					        });
						});
					}

					// Setup expiry validation
					if(input.type=='expiry'){
						// Add data group for grouped validation
						inputItem.addClass('card-expiry').addClass('validation-group');

						// Check if it's year
						if(input.name.filter(function(item){return item.indexOf('YEAR')>=0;}).length>0){
							// Add years to it
							for(var i=new Date().getFullYear();i<new Date().getFullYear()+7;i++){
								 inputItem
							         .append($("<option></option>")
							         .attr("value",i)
							         .text(i)); 
						     } 

						     // Add year if 1 doesn't exist
						     if(!expiryInputs.year){
						     	expiryInputs['year'] = inputItem;
						     }else{
						     	utilities.log('WARNING : Detected multiple expiry year elements');
						     }
						}

						if(input.name.filter(function(item){return item.indexOf('MONTH')>=0;}).length>0){
							// Add months to it
							var monthName = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
							for(var i=1;i<=12;i++){
								var month = (i<10?'0'+i:i);
								 inputItem
							         .append($("<option></option>")
							         .attr("value",month)
							         .text('(' + month + ')  ' + monthName[i-1])); 
						     } 
						     if(!expiryInputs.month){
						     	expiryInputs['month'] = inputItem;
						     }else{
						     	utilities.log('WARNING : Detected multiple expiry month elements');
						     }

						}					
					}

				});
			}

		return {messages:retMessages,rules:retValidators};
	}


	function GetCityStateInfo(zipcode,callback) {
			var  userId = "017HERIM0038";
		    var zip5 = zipcode
		    var array = zip5.split("-");
		    var city = "";
		    var state = "";
		    var valid = false;

		    if (array.length > 1) {
		        zip5 = array[0];
		    }

			$.getJSON( "/json/ziplookup?zip=" + zipcode, function( data ) {
			  	if(data){
			  		if(data.city)
			  			city = data.city;
			  		if(data.state)
			  			state = data.state;
			  		valid = true;
			  	}
			  	callback({valid: valid, city: city, state: state});
			});

	}

	return {
		GetCityStateInfo : GetCityStateInfo ,
		setupForms: function(options){
			/*

				Setups on page validation

			*/

			var settings = {};

			var that = this;

			// 	GET ALL FORMS
			$("form").each(function() {
				var form = $(this);
				var objForm = new pageForm(form);
				// Make sure it's a valid form
				if(objForm.fields){
					// GET ALL FIELDS
					form.find('input, select').each(function(index){
						var input = $(this);
						objForm.inputs.push(input);
						// Check if the field is missing name variable and issue a warning
						var attr = input.attr('name');
						if (typeof attr == typeof undefined) {
							fieldHtml = input.get(0).outerHTML;
						    utilities.log('Validation won\'t work, input missing "name" attribute. ' + fieldHtml.substring(0,100) + (fieldHtml.length>100?'...':''));
						}
					});
					if(objForm.inputs)
						if(objForm.inputs.length>0){

							//
							// Add custom validators
							//
							jQuery.validator.addMethod("expiry", function(value, element) {
								var ret = true;
								if(expiryInputs){
									if(expiryInputs.month&&expiryInputs.year){
										var expiryYear = expiryInputs.year.val();
										var expiryMonth = expiryInputs.month.val();

										if(!isNaN(expiryYear)&&!isNaN(expiryMonth)){
											return Date.parse(expiryYear + '-' + expiryMonth + '-01') > new Date();
										}
									}
								}
							
								return ret;

							  //return this.optional(element) || /^http:\/\/mycorporatedomain.com/.test(value);
							}, "Please check expiration date");


							// Setup validation
							var validator = setupValidators.bind(that)(objForm.inputs,options,objForm.fields);
							form.validate({
								errorClass: "state-error",
								validClass: "state-success",
								errorElement: "em",
								rules: validator.rules,
								messages:validator.messages,
								highlight: function(element, errorClass, validClass) {
										$(element).closest('.field').addClass(errorClass).removeClass(validClass);
								},
								unhighlight: function(element, errorClass, validClass) {
										$(element).closest('.field').removeClass(errorClass).addClass(validClass);
								},
								errorPlacement: function(error, element) {
								   if (element.is(":radio") || element.is(":checkbox")) {
											element.closest('.option-group').after(error);
											return;
								   }
								   // if (element.is("select") && element.hasClass("validation-group")) {
								   // 		if(!element.closest('div').has( "em" ).hasClass( "state-error"))
											// element.closest('div').append(error);
											// return;
								   // }

									error.insertAfter(element);
								},
								invalidHandler: function(event, validator) {
								    // 'this' refers to the form
								    var errors = validator.numberOfInvalids();
								    if (errors) {
								    	messages.plain("Ooops, something is missing","Please check the form and try again",function(){
								    		if($(validator.errorList))
								    			setTimeout(function(){
								    				if(validator.errorList[0])
								    					$(validator.errorList[0].element).focus();
								    			},100);
								    	});
								    }
								}									
							});	
						}
					// Add form to array
					forms.push(objForm);
				}
			});

			// Return fields collection which contain origin (found items)
			return forms;
		},
		forms : forms
	}
});
