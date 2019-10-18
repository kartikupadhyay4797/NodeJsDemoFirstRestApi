 var http = require("https");
 var express = require('express');
 var app = express();
 var mysql      = require('mysql');
 var bodyParser = require('body-parser');
 var path =require('path');

//mysql -u zd7UPrfeKV -p hUHbkNBabe -h remotemysql.com -P 3306 -D zd7UPrfeKV

var connection = mysql.createConnection({
  host     : 'remotemysql.com',
  user     : 'zd7UPrfeKV',
  password : 'hUHbkNBabe',
  database : 'zd7UPrfeKV'
});
 
 
connection.connect(function(err) {
  if (err) {
		console.log(err);
		//res.end('{"status":"error"}');
		}
  else console.log('You are now connected with mysql database...')
})  

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

 
  var host = "https://majorprojectkartik4797.herokuapp.com/";
//  var host= "127.0.0.1";

  var port = process.env.PORT || 5000;
//   var port= 3000;
var server = app.use(express.static(path.join(__dirname, 'public')))
  .set('views', path.join(__dirname, 'views'))
  .set('view engine', 'ejs')
.listen(port, function () {
  console.log("Example app listening at port : %s", port)
 
});

app.get('/',function(req,res){
res.end("started");
});

//rest api to get all customers
app.get('/customer', function (req, res) {
   connection.query('select * from customer', function (error, results, fields) {
  if (error) {
		console.log(error);
		res.end('{"status":"error"}');
		}
   else res.end(JSON.stringify(results));
 });
});

//rest api to create a new customer record into mysql database
app.post('/customer/register', function (req, res) {
   var params  = req.body;
   console.log(params);
   connection.query('INSERT INTO customer SET ?', params, function (error, results, fields) {
   if (error) {
		console.log(error);
		res.end('{"status":"error","msg":"failed to insert data"}');
   }
   else {
	  res.end('{"status":"success","msg":"registered sucessfully"}');
	}
 });
});

//rest api to log in
app.post('/customer/login', function(req,res){
  var Phone= req.body.Phone;
  var password = req.body.password;
  connection.query('SELECT * FROM customer WHERE Phone = ?',[Phone], function (error, results, fields) {
  if (error) {
    // console.log("error ocurred",error);
    res.end('{"status":"error","msg":"failed to fetch data"}');
  }else{
    // console.log('The solution is: ', results);
    if(results.length >0){
      if(results[0].Country == password){
        res.end('{"status":"success","msg":"login sucessfull"}');
      }
      else{
        res.end('{"status":"error","msg":"Phone and password does not match"}');
      }
    }
    else{
     res.end('{"status":"error","msg":"Phone does not exits"}');
    }
  }
  });
});

//rest api to get a single customer data
app.get('/customer/:id', function (req, res) {
   connection.query('select * from customer where Id=?', [req.params.id], function (error, results, fields) {
   if (error) {
		console.log(error);
		res.end('{"status":"error"}');
		}
   else res.end(JSON.stringify(results));
 });
});

//rest api to update record into mysql database
app.put('/customer', function (req, res) {
   connection.query('UPDATE customer SET Name=?,Address=?,Country=?,Phone=? where Id=?', [req.body.Name,req.body.Address, req.body.Country, req.body.Phone, req.body.Id], function (error, results, fields) {
   if (error) {
		console.log(error);
		res.end('{"status":"error"}');
		}
   else res.end(JSON.stringify(results));
 });
});


//rest api to delete record from mysql database
app.delete('/customer', function (req, res) {
   console.log(req.body);
   connection.query('DELETE FROM customer WHERE Id=?', [req.body.Id], function (error, results, fields) {
   if (error) {
		console.log(error);
		res.end('{"status":"error"}');
		}
   else res.end('{"status":"successful"}');
 });
});

