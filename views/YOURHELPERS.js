var hbs = require('hbs');function YOURPARTIALS(){};module.exports = new YOURPARTIALS;YOURPARTIALS.prototype.init = function(){


/***
 *      _____   _    _  _______  __     __ ____   _    _  _____        
 *     |  __ \ | |  | ||__   __| \ \   / // __ \ | |  | ||  __ \       
 *     | |__) || |  | |   | |     \ \_/ /| |  | || |  | || |__) |      
 *     |  ___/ | |  | |   | |      \   / | |  | || |  | ||  _  /       
 *     | |     | |__| |   | |       | |  | |__| || |__| || | \ \       
 *     |_|      \____/    |_|       |_|   \____/  \____/ |_|  \_\      
 *      _____          _____  _______  _____            _        _____ 
 *     |  __ \  /\    |  __ \|__   __||_   _|    /\    | |      / ____|
 *     | |__) |/  \   | |__) |  | |     | |     /  \   | |     | (___  
 *     |  ___// /\ \  |  _  /   | |     | |    / /\ \  | |      \___ \ 
 *     | |   / ____ \ | | \ \   | |    _| |_  / ____ \ | |____  ____) |
 *     |_|  /_/    \_\|_|  \_\  |_|   |_____|/_/    \_\|______||_____/ 
 *        _    _  ______  _____   ______                               
 *       | |  | ||  ____||  __ \ |  ____|                              
 *       | |__| || |__   | |__) || |__                                 
 *       |  __  ||  __|  |  _  / |  __|                                
 *       | |  | || |____ | | \ \ | |____                               
 *       |_|  |_||______||_|  \_\|______|                              
 *                                                                     
 *                                                                     
 */

    //
    // Image helper
    //
    hbs.registerHelper('img', function(options) {
      var attrs = [];
      for(var prop in options.hash) {
        if(prop!=="src")
          attrs.push(prop + '="' + options.hash[prop] + '"');
        else
          attrs.push('src="' + options.hash[prop] + '"');
      }
      return new hbs.SafeString(
        "<img " + attrs.join(" ") + "/>"
      );
    });


    //
    // Navigation Helper
    //
    hbs.registerHelper('navmenu', function(currentPage) {
      var links = [
        {url:"/",name:"Home"},
        // {url:"/testimonials",name:"Testimonials"},
        {url:"/faqs",name:"FAQ"},
        {url:"/contact",name:"Contact"},
      ];
      
      var ret = "<ul>";

      links.forEach(function(link){
        ret += "<li" + (currentPage==link.url ? " class='active'" : "") + "><a href='" + link.url + "'><span>" + link.name + "</span></a></li>"
      });

      return new hbs.SafeString(ret + "</ul>");
    });

/********************************************************************************/

}


