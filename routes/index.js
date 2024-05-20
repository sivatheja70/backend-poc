var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/Home', (req, res)=>{ 
  res.status(200); 
  res.send("Welcome to root URL of Server");

}); 
module.exports = router;
