define(["jquery","communication","messages"], function($,communication,messages) {

   var visitor; 

   function attachEvent(item,eventType){
      if(item)
         $(item).on("click",function(e){
            // Check if we're submitting a form or not
            if(item.data("action") == 'billingsame'&&item.data("container")){

               // On page events vs form submits
               var container = $(item.data("container"));

               if(container){
                  if(!item.data('value')){
                     // Show 
                     container.show();
                  }else{
                     // Hide
                     container.hide();
                     // Copy shipping info into billing
                     if(visitor.shippingInfo){
                        visitor.copy(visitor.shippingInfo,visitor.billingInfo);
                     }
                  }
               }

            }else{
               //  Stop further actions
               e.preventDefault();

               // Make sure form is valid
               if(item.closest("form").valid()){
                  sendRequest(item.data('action').toUpperCase());
               }

               // Copy validation status on each item
               ['billingInfo','shippingInfo','paymentInfo'].forEach(function(info){
                  var info = visitor[info];
                  var valid = true;
                  for (var prop in info) {
                     if (info.hasOwnProperty(prop)) {
                        if(!$.isEmptyObject(info[prop].origin)){
                           info[prop].valid  = info[prop].origin.origin.valid();
                           if(!info[prop].valid) valid = false;
                        }
                     }
                  }
                  info.valid = valid;
                  visitor.save();
               });
            }
      });
   }

   function sendRequest(requestType){
 
      var message = "";

      switch(requestType){
         case "ADDLEAD" : 
             message = "Checking if offer is availabe in " + visitor.shippingInfo.city.value;
         break;
         case "SALE" :
             message = "We are processing your order";
             // Make sure there's at least 1 item selected
             var itemfound = false;
             if(visitor.shoppingCart)
               if(visitor.shoppingCart.length>0) itemfound = true
            if(!itemfound){
               // No items found in shopping cart
               messages.alert('Woops','Please select at least one product before continuing');
               return;
            }
         break;
         case "UPSELL" : 
         break;
         case "1KUPSELL" : 
         break;
         case "1KUPSELL" : 
         break;
      }

      if(message.length>0){
         // Display please wait message
         messages.pleaseWait("Please wait",message);
      }

      var callback = function(result){
         if(result)
            if(result.success){
               // Is there next page
               if(result.next){
                  // Close modal
                  messages.destroy();
                  document.location.href = result.next;
               }
            }else{
               // Error happened display message
               messages.alert('Error',result.message);
            }
      }

      var result = communication.sendData(requestType,visitor,callback);
   }		


   return {
      init : function(){

         visitor = this.visitor;
         
         // Attach to all buttons
         $('[data-action]').each(function(){
            var item = $(this);
            // Check if has an action
            var actionType = item.data("action");
            if(actionType){
               actionType = actionType.toUpperCase();
               // Attach the action
               attachEvent(item,actionType);
            }
         });
      }
   }
});