var https=require("https"),_Util=require("./util.js"),_Response=require("./Response.js"),ProcessRequest=function(e){var t="https://api.safe-pay-online.com/gw/?",s="";for(tmpField in e)"function"!=typeof e[tmpField]&&"callback"!==tmpField.toLowerCase()&&"string"==typeof tmpField&&0!==tmpField.indexOf("_")&&(s.length>0&&(s+="&"),s+=tmpField+"="+e[tmpField]);t+=s,console.log(t);var n=https.get(t,function(t){var s="";t.on("data",function(e){s+=e}),t.on("end",function(){if("function"==typeof e.callback){var t=s.split("&"),n=new _Response(s);n.next=e._next,console.log("got response "+e.sessionSuccessFlag),e.callback(null,n,e._res,e.sessionSuccessFlag)}})});n.on("error",function(e){})};module.exports=ProcessRequest;