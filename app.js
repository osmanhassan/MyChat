var express 		= require('express');
var bodyParser 		= require('body-parser');
var expressSession 	= require('express-session');


var login 		= require('./controller/loginController');
var signUp 		= require('./controller/signUpController');
var chat		= require('./controller/chatController');
var profile 	= require('./controller/profileController');
var friendList 	= require('./controller/friendListController');
var finFriend 	= require('./controller/finFriendController');
var frequests 	= require('./controller/requestsController');
var ajax 		= require('./controller/ajaxController');
var changePass 	= require('./controller/changePassController');
var logout 		= require('./controller/logoutController');

var app = express();


// CONFIGURATION

app.set('view engine', 'ejs');
var port = 80;

//MIDDLEWARE

app.use(bodyParser.urlencoded({extended:false}));
app.use(expressSession({secret: 'my top secret password', saveUninitialized: true, resave: false}));


app.use('/css', express.static(__dirname + '/public/css'));
app.use('/images', express.static(__dirname + '/public/images'));
app.use('/js', express.static(__dirname + '/public/js'));



//authentication function

function auth(request, response, next){
	if(! request.session.user){
		response.redirect('/');
	}
	else
		next();
}

//routing

app.use('/', login);
app.use('/signup', signUp);
//authenticated routes
app.use('/ajax', auth, ajax);
app.use('/chat', auth, chat);
app.use('/profile', auth, profile);
app.use('/friendlist', auth, friendList);
app.use('/findfriend', auth, finFriend);
app.use('/requests', auth, frequests);
app.use('/changepass', auth, changePass);
app.use('/logout', auth, logout);

//server
app.listen(port, function(){

	console.log('Server started at port ' + port);
});
