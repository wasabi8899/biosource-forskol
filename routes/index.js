var express = require('express');
var router = express.Router();
var util = require('../bin/utilities.js');

/* GET home page. */
router.get('/', function(req, res, next) {
	// var exec = require('child_process').exec;
	// exec('ls', function (error, stdout, stderr) {
	//   // output is in stdout
	//   console.log(stdout);
	// });
  var util = require('../bin/utilities.js');

  res.render('index', 
    { page: '/' ,states :   util.getStates("US")
    }
  );
});

/* GET other pages */
router.get('/testimonials', function(req, res, next) {
  res.render('testimonials', { page: '/testimonials' });
});

router.get('/contact', function(req, res, next) {
  res.render('contact', { page: '/contact' });
});


router.get('/terms', function(req, res, next) {
  res.render('terms', { page: '/terms' });
});


router.get('/privacy', function(req, res, next) {
  res.render('privacy', { page: '/privacy' });
});

router.get('/faqs', function(req, res, next) {
  res.render('faqs', { page: '/faqs' });
});

// router.get('/science', function(req, res, next) {
//   res.render('science', { page: '/science' });
// });

router.get('/order', function(req, res, next) {
  var config = require('config');
  var configOrderPage = config.get('ORDERPAGE');
  var products = configOrderPage.products;

  res.render('order', { page: '/order' ,states : util.getStates("US"), products: products});
});

router.get('/thankyou', function(req, res, next) {
	// Check if they purchased
  if(req.session.purchased!=1) {
  		// Redirect if they did
  		res.writeHead(302,{ 'Location' : '/order'});
    	res.end();
        return;
  }
  res.render('thankyou', { page: '/thankyou'});
});


module.exports = router;

