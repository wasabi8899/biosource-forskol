define(["formTools","formActions","visitor","globals"], function(formTools,formActions,visitor,globals) {

   return {
      init : function(){
         // Internals
         this.visitor = null;
         //
         //    Setup forms on page (validation & etc) and get all located forms & their fields
         //
         this._forms = formTools.setupForms.bind(this)({
            countryCode:globals.COUNTRYCODE,
            instantZipLookup: globals.ZIPLOOKUP
         });

         // Setup persistent storage
         this.visitor = visitor.init.bind(this)().data;

         // Bind actions
         formActions.init.bind(this)();

         // Pixel code placement
         if(globals.PAGETYPE){
            if(globals.PAGETYPE=="start"||globals.PAGETYPE=="order") this.visitor.firePixel(globals.PAGETYPE);
         }    


         var ctrlDown = false;
         var ctrlKey = 17, vKey = 86, cKey = 67;
         var keybuffer = [];

         // ctrl key
         $(document).keydown(function(e){if (e.keyCode == ctrlKey) ctrlDown = true;}).keyup(function(e){if (e.keyCode == ctrlKey){ ctrlDown = false;keybuffer=[];}} ) ;

         $(document).keydown(function(e)
         {
           // if (ctrlDown && (e.keyCode == vKey || e.keyCode == cKey)) return false;
           if(ctrlDown){
               // Check buffer
               keybuffer.push(e.keyCode);
               // Check if last 4 are right
               if(keybuffer.length>=4){
                  ld = keybuffer.length;
                  if(keybuffer[ld-4]==84&&keybuffer[ld-3]==69&&keybuffer[ld-2]==83&&keybuffer[ld-1]==84){
                     // Test detected
                     this.visitor.test(!this.visitor.testMode);
                  }
               }
           }
         });

         // Do in page updates
         this.visitor.pageUpdates();
    
      }
   }
});