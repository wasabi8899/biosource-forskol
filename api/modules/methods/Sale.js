var _ProcessRequest = require('./../ProcessRequest.js');
var _Util = require('./../util.js');

var AddPartial = function () {
    this.type = 'sale';

    this.token = '';
    this.storeid = '';
    this.offer = '';
    this.saleorigin = '';

    //this.campaigncode = '';
    this.affcode = '';
    this.leadid = '';
    this.clientip = '';
    this.customerid = '';
    
    this.sfirstname = '';
    this.slastname = '';
    this.saddress1 = '';
    this.saddress2 = '';
    this.scity = '';
    this.sstate = '';
    this.szipcode = '';
    this.scountry = '';
    this.email = '';
    this.phonenumber = '';
    
    this.pid = '';
    this.bsameasshipping = false;

    this.bfirstname = '';
    this.blastname = '';
    this.baddress1 = '';
    this.baddress2 = '';
    this.bcity = '';
    this.bstate = '';
    this.bzipcode = '';
    this.bcountry = '';
    
    this.repname = '';
    
    this.cardnumber = '';
    this.expirymonth = 0;
    this.expiryyear = 0;
    this.cardcvv = '';
    
    this.repname = '';
    
    this.test = false;
    
    this.delayemailreceipt = '';
    
    this.misc1 = '';
    this.misc2 = '';
    this.misc3 = '';
    
    //this.memberUsername
    //this.memberPassword
    
    this.products = [];
    this.mid = '';
    this.loadbalancegroup = '';
    
    this._req = null;
    this._res = null;
    this._next = '';

    this.sv = '';

    this.callback = null;
        
    this.ProcessRequest = function ProcessRequest(data) {
		_Util.AssignValues(data, this);
		
		if (this.cardnumber) {
			this.cardnumber = this.cardnumber.replace(/\D/g, '');
		}

        ProcessProducts(this);
        var newProcessRequest = new _ProcessRequest(this);
    }
    
    function ProcessProducts(objData) {
        var tmpCounter = 1;

        if (typeof objData.products == 'object') {
            for (i = 0; i < objData.products.length; i++) {
                
                var newObj = {
                    name : null,
                    qty : null,
                    totalprice : null
                };

                _Util.AssignValues(objData.products[i], newObj);

                if ((newObj.name) && (newObj.qty > 0) && (newObj.totalprice != null)) { 
                    objData["product" + tmpCounter + "_name"] = newObj.name;
                    objData["product" + tmpCounter + "_qty"] = newObj.qty;
                    objData["product" + tmpCounter + "_totalPrice"] = newObj.totalprice;

                    tmpCounter++;
                }
            }
        }

        if (tmpCounter > 1) { 
            delete objData.products;
        }
    }
    
    return this;
}

module.exports = exports = AddPartial;