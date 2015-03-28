require(["jquery","formTools","formActions","visitor","globals","common","accounting","bootstrap","jquery.validate","additional-methods"], function($,formTools,formActions,visitor,globals,common) {
   		$(function() {

			// if (window.location.protocol != "https:")
			//     window.location.href = "https:" + window.location.href.substring(window.location.protocol.length);


   			// Common functions
   			common.init.bind(this)();

			var that = this;

			//
			//	Home apge
			//
			if(globals.PAGETYPE=='home'){

			}

			// 
			// Order form code
			//
			if(globals.PAGETYPE=='order'){

				// Check if shipping info is valid or not
				if(!this.visitor.shippingInfo.valid){
					// Go back a step
					document.location.href = '/';
				}

				// Set same shipping
				$("input[name=sameShipping][value=" + (this.visitor.billingShippingSame ? "YES" : "NO") + "]").trigger( "click" );

				// Check if billing info is not the same
				$(".offer.one .radioBtn").prop("checked", "checked");

				$(".offer").on("click", function(e){

					item = $(this);

					// Update stylesheets
					$(".offer").removeClass("selected");
					item.addClass("selected");
					item.find(".radioBtn").prop("checked","checked");

					// Get ID of item
					var packageId = item.data("id");

					if(packageId){
						// Update shopping cart
						that.visitor.cartItemSelect(packageId);
					}
					e.preventDefault();
					
				});

				
				// Check if we're adding default item
				var Id = 0;
				// if(globals.DEFAULTPRODUCTID>0){
				// 	Id = globals.DEFAULTPRODUCTID;
				// 	that.visitor.cartItemSelect(Id);
				// }else{
				// 	// Select 1s item on list of product
				// 	if(globals.PRODUCTS){
				// 		if(globals.PRODUCTS.length>0)
				// 			that.visitor.cartItemSelect(globals.PRODUCTS[0].productId || globals.PRODUCTS[0].packageId);
				// 	}
				// 	Id = that.visitor.cartFirstProduct.Id;
				// }
				// // Trigger click
				// $(".offer[data-id='" + Id + "']").click();

			}

			//
			// Thank you page code
			if(globals.PAGETYPE=='thankyou'){



			}

		
		});	

});