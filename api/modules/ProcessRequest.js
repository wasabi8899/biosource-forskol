var https = require('https');
var _Util = require('./util.js');
var _Response = require('./Response.js');

var ProcessRequest = function (objData) {
    
    var apiURL = 'https://api.safe-pay-online.com/gw/?';
    console.log(objData);
    //create data string
    var someData = '';
    for (tmpField in objData) {
        
        if (typeof objData[tmpField] != 'function') {
            if ( (tmpField.toLowerCase() !== "callback") 
                && ((typeof tmpField == 'string') && (tmpField.indexOf('_') !== 0)) ) {
                
                if (someData.length > 0) {
                    someData += '&';
                }
                
                someData += tmpField + '=' + objData[tmpField];
            }
        }
    }
    
    //generate URL
    apiURL += someData;
    
    console.log(apiURL);

    var req = https.get(apiURL, function (res) {
        var fullData = '';
        
        res.on('data', function (chunk) { 
            fullData += chunk;
        });
        
        res.on('end', function () {
            if (typeof objData.callback == 'function') {
                
                var arrData = fullData.split('&');
                
                var objResponse = new _Response(fullData);
                
                objResponse.next = objData._next;

                objData.callback(null, objResponse, objData._res, objData._req, objData.sv);
            }
        });
    });
   
    req.on('error', function (data) { 
        //result = data;
    });
}

module.exports = ProcessRequest;