define(['jquery','bootbox'], function($,bootbox){

	var lastbootbox;

	function bbox(title,message,buttons,theme){

		this.message = message,
		this.closeButton = false,
		this.buttons = buttons,
		this.title = title,
		this.theme = theme || 'plain',
		this.themes = {
					'plain' : {template:this.message},
					'info' : {template:'<div class="row" style="margin:0">  ' +
		                    '<div class="animation-corner" style="float:left"><div class="ball"></div><div class="ball1"></div></div>' +
        		            '<div class="col-xs-8" style="text-align:left;margin-top:20px;font-size:14px"><span style="font-size:20pt">' + this.title + '</span><br>' + this.message + '<span class="blink">...</span></div>' +
                		    '</div>'},
					'alert' : {template : '<div class="error message">' +
							  '<h3>' + this.title + '</h3>' + 
 							  '<p>' + this.message + '</p>' +
							  '</div>',class:"error-modal"},
					'regular' :{template: '<div class="message info">' +
							  '<h3>' + this.title + '</h3>' + 
 							  '<p>' + this.message + '</p>' +
							  '</div>',class:"info-modal"},
					'warning' :{template: '<div class="message warning">' +
							  '<h3>' + this.title + '</h3>' + 
 							  '<p>' + this.message + '</p>' +
							  '</div>',class:"warning-modal"},
					'success' :{template:'<div class="message success">' +
							  '<h3>' + this.title + '</h3>' + 
 							  '<p>' + this.message + '</p>' +
							  '</div>',class:"success-modal"}

		},
		this.bootbox = null
	}

	bbox.prototype = {
	
		launch : function(){

			// Set Theme & settings
			this.bootbox = require('bootbox');

			// Hide others
			this.bootbox.hideAll();

			this.bootbox.dialog({
				closeButton: this.closeButton,
				className: "message-modal " + this.themes[this.theme].class || "",
                message: this.themes[this.theme].template,
                title: (this.theme=='plain' ? this.title : ""),
                buttons : this.buttons
            });

            lastbootbox = this;
		},
		destroy : function(){
			this.bootbox.hideAll();
		}
	}
	
	
	return {
		alert : function(title,message,callback, buttoncaption){
			var obj = new bbox(title,message,{success: {label: buttoncaption || "OK", className: "btn-primary",callback:callback}},'alert');
			obj.launch();
			return obj;
		},
		custom : function(title,message,callback, buttoncaption,theme){
			var obj = new bbox(title,message,{success: {label: buttoncaption || "OK", className: "btn-primary",callback:callback}},theme);
			obj.launch();
			return obj;
		},
		plain : function(title,message,callback, buttoncaption){
			var obj = new bbox(title,message,{success: {label: buttoncaption || "OK", className: "btn-primary",callback:callback}},'plain');
			obj.launch();
			return obj;
		},
		pleaseWait : function(title,message){
			var obj = new bbox(title,message,null,"info");
			obj.launch();
			return obj;
		},
		destroy : function(){
			if(lastbootbox)
				lastbootbox.destroy();
		}
	}
});