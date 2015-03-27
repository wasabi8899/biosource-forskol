var _AddPartial = require('./modules/methods/AddPartial.js');
var _Sale = require('./modules/methods/Sale.js');

exports.AddPartial = function (objData) {
    var API = new _AddPartial();
    API.ProcessRequest(objData);
}

exports.Sale = function (objData) {
    var API = new _Sale()
    API.ProcessRequest(objData);
}




