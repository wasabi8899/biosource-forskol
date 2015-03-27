define(["jquery","communication","messages"], function($,communication,messages) {

	function sendData(requestType,visitor,callback){


		// Dummy call back ERROR
		// var result = {success:false,message:"Your transaction declined. Please try again"};
		// setTimeout(function(){callback(result)},1200);
		// return;


	 	switch(requestType){
	         case "ADDLEAD" : 
	             // Post data
                $.getJSON("json/lead?" + visitor.toURL(), function (data) {
                    
                    if ((data.success) && (data.leadid)) {
						visitor.leadId = data.leadid;
                        visitor.save();
                    }

					setTimeout(function(){			  	
							callback({success:(data.success=='Yes'?true:false),next:data.next,leadId: data.leadid, message:data.message});
					},2500);
				}).fail(function() {
				    // Error happened
				    messages.alert("Error","Could not process your request. Please contact customer service");
				});
	         break;
	         case "SALE" :
                $.getJSON("json/sale?" + visitor.toURL(true), function (data) {
                    
					if ((data.success) && (data.mid)) {
						// visitor.orderId = [];
						visitor.orderId = data.orderid;
						visitor.customerId = data.customerid;
                        visitor.mid = data.mid;
                        visitor.save();
                    }

					setTimeout(function(){			  	
							callback({success:data.issuccess,next:data.next,customerId: data.customerid, orderId: data.orderid, message:data.message});
					},2500);
				}).fail(function() {
				    // Error happened
				    messages.alert("Error","Could not process your request. Please contact customer service");
				});
	         break;
	         case "UPSELL" : 
	         break;
	         case "1KUPSELL" : 
	         break;
	         case "1KUPSELL" : 
	         break;
	    }		

	}

	return {
		sendData: sendData
	}
});