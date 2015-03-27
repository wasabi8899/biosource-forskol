var express = require('express');
var router = express.Router();
var util = require('../bin/utilities.js');
var _API = require('../api/main.js');
var _Config = require('config');

/* JSON CALLS */
router.get('/states', function(req, res, next) {
	// Set headers for json
	util.SetAccessControl(res);

	if(req.query.countryCode){
		// Send states back to the caller
		res.end(JSON.stringify(util.getStates(req.query.countryCode)));
	}
	// If nothing was provided
  	res.end('{}');
});

router.get('/ziplookup', function(req, res, next) {
	// Set headers for json
	util.SetAccessControl(res);

	if(req.query.zip){
		var callback = function(err,result){
			if(err){
				console.log('error ' + err);
				res.end('{}');
			}else{
				if(result.city&&result.state){
					console.log('not');
					res.end(JSON.stringify(result));
				}
			}
		}

		GetCityStateInfo(req.query.zip,callback);
	}else{
		// If nothing was provided
	  	res.end('{}');
	  }
});

router.get('/lead', function(req, res, next) {
	// Set headers for json
	util.SetAccessControl(res);
    // console.log('LEAD Request from : ' + req.headers['referer']);

    
    
    if (req.query.sfirst) {
        
        var configCRM = _Config.get('CRM');
        var configOrderPage = _Config.get('ORDERPAGE');
        
        //TODO: temp fix
        req.query.scountry = configOrderPage.allowedCountries[0];
        
        var newData = {
            token: configCRM.apikey,// '2387eec8-036b-4ff9-87f4-1cd33a3b5323',

			offer: (configCRM.defaults.offer || "Default"),
			saleorigin: (req.query.landingPageId?req.query.landingPageId:'Unspecified'),
			affcode: (req.query.campaignCode?req.query.campaignCode : (configCRM.defaults.campaignCode || "Default")),


            storeid: configCRM.storeid,
            
            leadType: configCRM.leadtypeid, // 'S_LeadType',
            sfirstname: req.query.sfirst || "",
            slastname: req.query.slast || "",
            saddress1: req.query.saddress1 || "",
            scity: req.query.scity || "",
            sstate: req.query.sstate || "",
            scountry: req.query.scountry || "US", //TODO: add country
            szipcode: req.query.szip || "",
            phonenumber: req.query.sphone || "",
            email: req.query.semail || "",
            clientip: req.connection.remoteAddress,
            
            _res: res,
            _req: req,
            _next: "/order",
            callback : ProcessAPIResponse
        };
    
        _API.AddPartial(newData);

	}else{
		// If nothing was provided
        res.end('{}');
	  }
});

router.get('/sale', function(req, res, next) {
	// Set headers for json
	util.SetAccessControl(res);

	if(req.query.sfirst){
        
        console.log('Request from : ' + req.headers['referer']);

        var configCRM = _Config.get('CRM');
        var configOrderPage = _Config.get('ORDERPAGE');
        

		var qty = req.query.qty[0] || 1;//TODO: Add ability to process few packages
		var idxProduct = req.query.pid[0] || 0; //TODO: Add ability to process few packages
		
		if (idxProduct >= configOrderPage.products.length) { 
            idxProduct = 0;
		}
		
		var selectedPackage = configOrderPage.products[idxProduct];

		var newData = {
			token: configCRM.apikey,
			storeid: configCRM.storeid,
			
			//?caid=32092&caCode=test&nopop=0&stid=461&cid2=20752
			offer: (configCRM.defaults.offer || "Default"),
			saleorigin: (req.query.landingPageId?req.query.landingPageId:'Unspecified'),
			affcode: (req.query.campaignCode?req.query.campaignCode: (configCRM.campaignCode || "Default")),
			
			
			leadid : req.query.leadId || 0,
			customerid : req.query.customerId || 0,

            sfirstname: req.query.sfirst || "",
            slastname: req.query.slast || "",
            saddress1: req.query.saddress1 || "",
            scity: req.query.scity || "",
            sstate: req.query.sstate || "",
            scountry: req.query.scountry || "",
            szipcode: req.query.szip || "",
            phonenumber: req.query.sphone || "",
            email: req.query.semail || "",
            clientip: req.connection.remoteAddress,
            
            pid : selectedPackage.packageId || 0,
            bsameasshipping : req.query.billingShippingSame || true,
            
            bfirstname: req.query.bfirst || "",
            blastname: req.query.blast || "",
            baddress1: req.query.baddress1 || "",
            bcity: req.query.bcity || "",
            bstate: req.query.bstate || "",
            bcountry: req.query.bcountry || "",
            bzipcode: req.query.bzip || "",
            
            cardnumber : req.query.cardnumber || "",
            expirymonth : req.query.expirymonth || 1,
            expiryyear : req.query.expiryyear || 2000,
            cardcvv : req.query.cvv | "",
            
            // TODO : after launch set to
            // test : (req.query.t ? (req.query.t=='1' ? true : false) : false),
            test : true,// false;
            
            misc1 : req.query.misc1 || "",
            misc2 : req.query.misc2 || "",
            misc3 : req.query.misc3 || "",
            


            mid : req.query.mid || "",
            loadbalancegroup : req.query.loadbalancegroup || "",

            products : [],
            
            _res: res,
            _req: req,
            _next: "/thankyou",
            callback : ProcessAPIResponse,
            sv : "purchased"

        };
		
		
		//add manual products
		var arrProducts = [];

		if (typeof selectedPackage.products == 'string') {
			arrProducts[0] = selectedPackage.products;
		}
		else if (typeof selectedPackage.products == 'object') {
			arrProducts = selectedPackage.products;
		}
		
		for (i=0;i<arrProducts.length;i++) {
			var tmpItem = arrProducts[i];
			newData.products.push({
				name: tmpItem.productId,
				qty: qty,
				totalPrice: (tmpItem.itemPrice * qty + ((tmpItem.shippingTotal || 0) > 0 ? tmpItem.shippingTotal : (tmpItem.itemShipping || 0) * qty))
			});
		}
		
		_API.Sale(newData);
        
	}else{
		// If nothing was provided
	  	res.end('{}');
	  }
});


function ProcessAPIResponse(err, data, res,req, sessionSuccessFlag) {
    if (err) {
        data = {
            success : false,
            message : err
        }
    }

    if(sessionSuccessFlag){
    	// Update session
		req.session[sessionSuccessFlag] = 1;
    }

    res.end(JSON.stringify(data));
}


function GetCityStateInfo(zipcode,callback) {
			var  userId = "017HERIM0038";
		    var zip5 = zipcode
		    var array = zip5.split("-");
		    var city = "";
		    var state = "";
		    var valid = false;

		    if (array.length > 1) {
		        zip5 = array[0];
		    }

		    var url = "http://production.shippingapis.com/";
		    xml2js = require('xml2js');
		    http = require('http');

		    var postRequest = {
			    host: "production.shippingapis.com",
			    path: "/ShippingAPI.dll?API=CityStateLookup&XML=" + encodeURIComponent("<CityStateLookupRequest USERID=\"" + userId + "\"><ZipCode ID= \"0\"><Zip5>" + zip5 + "</Zip5></ZipCode></CityStateLookupRequest>"),
			    port: 80,
			    method: "GET"
			};

			var buffer = "";

			var req = http.request( postRequest, function( res ){
			    var buffer = "";
			    res.on( "data", function( data ) { buffer = buffer + data; } );

			   	res.on( "end", function( data ) { 
			   		var parseString = require('xml2js').parseString;
			   		// console.log( buffer ); 
			   		parseString(buffer, function (err, result) {
			   			// Retrieve data
			   			if(!err){
			   				if(result.CityStateLookupResponse)
			   					if(result.CityStateLookupResponse.ZipCode){
			   						if(result.CityStateLookupResponse.ZipCode.length>0){
										var results = result.CityStateLookupResponse.ZipCode[0];
										if(results.City)
											if(results.City.length>0)
												city = results.City[0];
										if(results.State)
											if(results.State.length>0)
												state = results.State[0];
										callback(null,{city:city,state:state});
			   						}
			   					}
			   			}else{
			   				callback(err);
			   			}
					});
			    });

			});

			req.write('');
			req.end();

		    // $.get(url, {
		    //         API: "CityStateLookup",
		    //         XML: "<CityStateLookupRequest USERID=\"" + userId + "\"><ZipCode ID= \"0\"><Zip5>" + zip5 + "</Zip5></ZipCode></CityStateLookupRequest>"
		    //     },
		    //     function(data) {
		    //          $(data).find("ZipCode").each(function() {
		    //             var zipCode = $(this);
		    //             if ((zipCode.find("City").text()) != "") {
		    //                 city = zipCode.find("City").text();
		    //                 state = zipCode.find("State").text();
		    //                 valid = true;
		    //             }
		    //             callback({valid: valid, city: city, state: state});
		    //         });
		    //  });

	}


module.exports = router;