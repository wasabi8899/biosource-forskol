var _Util = require('./util.js');

var Response = function (data) {

    this.success = 'No';
    this.message = '';
    this.customerid = 0;
    this.leadid = 0;
    this.orderid = 0;
    this.authcode = '';
    this.responsecode = '';
    this.referenceid = 0;
    this.pixelcode = '';
    this.mid = 0;
    this.billingid = 0;
   
    if (typeof data == 'string') {
        var tmpObj = [];
        var arrData = data.split('&');
        
        for (tmpItem in arrData) {
            var tmpName = arrData[tmpItem].match(/^[^=]+/g);
            if (tmpName.length > 0) {
                tmpName = tmpName[0];
            }
            
            var tmpValue = arrData[tmpItem].replace(/^[^=]+=/g, '');
            
            tmpObj[tmpName] = tmpValue;
        }
        
        _Util.AssignValues(tmpObj, this, true);
    }
    
    this.issuccess = (this.success.toLowerCase() == 'yes');
    
    return this;
}

module.exports = exports = Response;