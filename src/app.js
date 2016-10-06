'use strict';

//Require Express
var express = require('express');
var app = express();

//Require Pug
var pug = require('pug');

//Require Twitter
var Twitter = require('twitter');

//Require moment for timestamps
var moment = require('moment');

//Set view engine to serve middleware
app.set('view engine', 'pug');

//Set where to look for templates
app.set('views', __dirname + '/templates');

//Set up style sheets
app.use('/static', express.static(__dirname + '/public'));


//Access keys to access twitter account
var config = {
	"consumer_key": "",
	"consumer_secret": "",
	"access_token_key": "",
	"access_token_secret": ""
};


//instantiate twitter client
var client = new Twitter(config);

//get my profile information
function userInfo(req, res, next){
	client.get('users/show', {screen_name: 'theclearytheory'}, function(error, data, response){
		if(error){ 
			console.log(error);
			return next(error);
		}
		if (!error) {

			if(!req.renderObject) {
				req.renderObject = {};
			}

			//Variables Used for me and my tweet section
			req.renderObject.profileImage = data.profile_image_url;
			req.renderObject.myName = data.name;
			req.renderObject.screenName = data.screen_name;
			req.renderObject.followerCount = data.followers_count;
			req.renderObject.banner = data.profile_banner_url;

			next();
		}    
	});
}

//Get 5 last tweets
function timeLine(req, res, next){
	client.get('statuses/user_timeline', {screen_name: 'theclearytheory', count: '5'}, function(error, tweets, response) {
		 if(error){ 
			console.log(error);
			return next(error);
		}

		if (!error) {

			if(!req.renderObject) {
				req.renderObject = {};
			}

			var tweetContent = [];
			var dateTweeted = [];
			var noOfRetweets = [];
			var noOfLikes = [];

			for(var i = 0; i < tweets.length; i++){
				tweetContent.push(tweets[i].text);
				dateTweeted.push(moment(tweets[i].created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow());
				noOfRetweets.push(tweets[i].retweet_count);
				noOfLikes.push(tweets[i].favorite_count);
			}

			req.renderObject.tweetContent = tweetContent;
			req.renderObject.dateTweeted = dateTweeted;
			req.renderObject.noOfRetweets = noOfRetweets;
			req.renderObject.noOfLikes = noOfLikes;

			next();
		}     
	});
}      

//Get Friend info
function friends(req, res, next){
	client.get('friends/list', {screen_name: 'theclearytheory', count: '5'}, function(error, friends, response){
		 if(error){ 
			console.log(error);
			return next(error);
		}
		if(!error){

			if(!req.renderObject) {
				req.renderObject = {};
			}

			//Variables used for last 5 people followed
			var profileImageFriends = [];
			var realName = [];
			var screenNameFriends = [];

			for(var i = 0; i < friends.users.length; i++){
				profileImageFriends.push(friends.users[i].profile_image_url);
				realName.push(friends.users[i].name);
				screenNameFriends.push(friends.users[i].screen_name);
			}

			req.renderObject.profileImageFriends = profileImageFriends;
			req.renderObject.realName = realName;
			req.renderObject.screenNameFriends = screenNameFriends;

			next();
		}
	});
}

//Get messages sent TO me
function receivedMessages(req, res, next){
	client.get('direct_messages', {screen_name: 'theclearytheory', count: '3'}, function(error, messages, response){
		if(error){ 
			console.log(error);
			return next(error);
		}

		if(!error){

			if(!req.renderObject) {
				req.renderObject = {};
			}

			var messagePersonName = [];
			var profileImageMessage = [];
			var messageBody = [];
			var privateMessageTime = [];

			for(var i=0; i < messages.length; i++){
				messagePersonName.push(messages[i].sender_screen_name);
				profileImageMessage.push(messages[i].sender.profile_image_url);
				messageBody.push(messages[i].text);
				privateMessageTime.push(moment(messages[i].created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow());
			}

			req.renderObject.messagePersonName = messagePersonName;
			req.renderObject.profileImageMessage = profileImageMessage;
			req.renderObject.messageBody = messageBody;
			req.renderObject.privateMessageTime = privateMessageTime;

			next();
		} 
	}); 
}       

//Get messages I've sent
function sentMessages(req, res, next){
	client.get('direct_messages/sent', {screen_name: 'theclearytheory', count: '2'}, function(error, messages, response){
		 if(error){ 
			console.log(error);
			return next(error);
		}

		if(!error){

			if(!req.renderObject) {
				req.renderObject = {};
			}

			var myOwnSentMessages = [];
			var timeISentMessage = [];

			for(var i=0; i < messages.length; i++){
				myOwnSentMessages.push(messages[i].text);
				timeISentMessage.push(moment(messages[i].created_at, 'ddd MMM DD HH:mm:ss Z YYYY').fromNow());
			}

			req.renderObject.myOwnSentMessages = myOwnSentMessages;
			req.renderObject.timeISentMessage = timeISentMessage;

			next();
		} 
	});
} 

//Tell app to render template
function render(req, res, next){

		res.render('index', req.renderObject);
}

app.get('/', userInfo, timeLine, friends, receivedMessages, sentMessages, render);

app.use(function(req, res, next){
    var err = new Error("Page not found");
    err.status = 404;
    next(err);
});

app.use(function(err, req, res, next) {
    if(err.status == 500) {
      // still valid
      res.json({"error": "Server error occured"});
    }

    res.send("Sorry, page doesn't exist!");
});

// set up server on Port 3000
app.listen(3000, function() {
	console.log("The frontend server is running on port 3000!");
});