var express = require('express');
var fs = require('fs');
var crypto = require('crypto');
var handlebars = require('express-handlebars');

var router = express.Router();

// Crypto variables
var algorithm = 'aes-128-cbc',
		password = 'd6F3Efeq';

// Decrypt function 
function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm,password);
  var dec = decipher.update(text,'hex','utf8');
  dec += decipher.final('utf8');
  return dec;
}

// Encrypt function 
function encrypt(text) {
  var cipher = crypto.createCipher(algorithm,password);
  var crypted = cipher.update(text,'utf8','hex');
  crypted += cipher.final('hex');
  return crypted;
}


/* GET home page. */
router.get('/', function(req, res, next) {
	var text = fs.readFileSync('Bryan.txt', 'utf8');

	text = decrypt(text);

	crypted = encrypt(text);

  res.render('index', { title: 'Express', decrypted: text, encrypted: crypted });
});

module.exports = router;
