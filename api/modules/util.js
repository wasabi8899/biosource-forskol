var _UrlEncode = require('urlencode2');

exports.AssignValues = function (objData, objObject, IsResponse) {
	for (tmpItem in objData) {
		if (typeof objObject[tmpItem.toLowerCase()] != 'undefined') {
			if (typeof objObject[tmpItem.toLowerCase()] == 'string') {
				if (IsResponse) {
					objObject[tmpItem.toLowerCase()] = _UrlEncode.decode(objData[tmpItem].replace(/\+/g, ' '));
				}
				else {
					if (tmpItem.indexOf("_") === 0) {
						objObject[tmpItem.toLowerCase()] = objData[tmpItem];
					}
					else {
						objObject[tmpItem.toLowerCase()] = _UrlEncode(objData[tmpItem]);
					}
				}
			}
			else {
				if (objData[tmpItem] != null) {
					objObject[tmpItem.toLowerCase()] = objData[tmpItem];
				}
				else {
					objObject[tmpItem.toLowerCase()] = '';
				}
			}
		}
	}
}