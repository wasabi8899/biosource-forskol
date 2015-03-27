var _ProcessRequest = require('./../ProcessRequest.js');
var _Util = require('./../util.js');

var AddPartial = function () {
    this.type = 'addPartial';

    this.token = '';
    this.storeid = '';
    this.offer = '';
    this.saleorigin = '';

    this.leadtype = '';
    this.affcode = '';
    
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
    this.clientip = '';
    
    this._req = null;
    this._res = null;
    this._next = '';
    
    this.callback = null;
        
    this.ProcessRequest = function ProcessRequest(data) {
        _Util.AssignValues(data, this);
        var newProcessRequest = new _ProcessRequest(this);
    }
    
    return this;
}

module.exports = exports = AddPartial;