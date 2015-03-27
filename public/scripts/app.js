requirejs.config({
    "baseUrl": "/scripts/lib",
    "paths": {
      "app" : "../app",
      "jquery": "jquery.min",
      "bootstrap": "bootstrap.min",
      "bootbox" : "bootbox.min",
      "phoenix" : "jquery.phoenix.min",
      "ezstorage" : "jquery.ezstorage",
      "jquery.validate" : "jquery.validate.min",
      "jquery.maskedinput" : "jquery.maskedinput",
      "additional-methods" : "additional-methods.min",
      "cookie" : "jquery.cookie",
      "underscore" : "underscore-min",
      "jquery.creditCardValidator" : "jquery.creditCardValidator",
      "accounting" : "accounting.min",
      "common" : "common"
      },
      shim: {
            'cookie' : {
                deps: [
                  'jquery'
                ]
            },   
           'jquery.creditCardValidator' : {
                deps: [
                  'jquery'
                ]
            },                     
            'jquery.validate' : {
                deps: [
                  'jquery'
                ]
            },
            'jquery.maskedinput' : {
                deps: [
                  'jquery'
                ]
            },
            'additional-methods' : {
                deps: [
                  'jquery.validate'
                ]
            },
            'phoenix' : {
                deps: [
                  'jquery'
                ]
            },
            'bootstrap': {
                deps: [
                    'jquery'
                ]
            },
            'ezstorage': {
                deps: [
                    'jquery','cookie'
                ]
            }   
          }
});

// Load the main app module to start the app
requirejs(["../app/main"]);
