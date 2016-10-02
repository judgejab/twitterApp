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

// set up server on Port 3000
app.listen(3000, function() {
    console.log("The frontend server is running on port 3000!");
});

//Log whether 
    var error = function (err, response, body) {
        console.log('ERROR [%s]', err);
    };
    var success = function (data) {
        console.log('Data [%s]', data);
    };


//Access keys to access twitter account
var config = {
    "consumer_key": "",
    "consumer_secret": "",
    "access_token_key": "",
    "access_token_secret": ""
};

//instantiate twitter client
var client = new Twitter(config);

client.get('users/show', {screen_name: 'theclearytheory'}, function(error, data, response){
    if (!error) {

        //Variables Used for me and my tweet section
        var profileImage = data.profile_image_url;
        var myName = data.name;
        var screenName = data.screen_name;
        var followerCount= data.followers_count;
        var banner = data.profile_banner_url;

    }

    client.get('statuses/user_timeline', {screen_name: 'theclearytheory', count: '5'}, function(error, tweets, response) {
        if (!error) {

            var tweetContent = [];
            var dateTweeted = [];
            var noOfRetweets = [];
            var noOfLikes = [];


            for(var i = 0; i < tweets.length; i++){
            tweetContent.push(tweets[i].text);
            dateTweeted.push(moment(tweets[i].created_at).fromNow());
            noOfRetweets.push(tweets[i].retweet_count);
            noOfLikes.push(tweets[i].favorite_count);
            }

            console.log(dateTweeted);
        }

        client.get('friends/list', {screen_name: 'theclearytheory', count: '5'}, function(error, friends, response){
            if(!error){

                //Variables used for last 5 people followed
                var profileImageFriends = [];
                var realName = [];
                var screenNameFriends = [];

                for(var i = 0; i < friends.users.length; i++){
                    profileImageFriends.push(friends.users[i].profile_image_url);
                    realName.push(friends.users[i].name);
                    screenNameFriends.push(friends.users[i].screen_name);
                }
            }

            client.get('direct_messages', {screen_name: 'theclearytheory', count: '3'}, function(error, messages, response){
                if(!error){
                    //Variables used for direct messages
                    var messagePersonName = [];
                    var profileImageMessage = [];
                    var messageBody = [];
                    var privateMessageTime = [];

                    for(var i=0; i < messages.length; i++){
                        messagePersonName.push(messages[i].sender_screen_name);
                        profileImageMessage.push(messages[i].sender.profile_image_url);
                        messageBody.push(messages[i].text);
                        privateMessageTime.push(moment(messages[i].created_at).fromNow());
                    }
                } else {
                    console.log(error)
                }

                client.get('direct_messages/sent', {screen_name: 'theclearytheory', count: '2'}, function(error, messages, response){
                if(!error){
                    //Variables for my sent messages
                    var myOwnSentMessages = [];
                    var timeISentMessage = [];

                    for(var i=0; i < messages.length; i++){
                        myOwnSentMessages.push(messages[i].text);
                        timeISentMessage.push(moment(messages[i].created_at).fromNow());
                    }
                } else {
                    console.log(error)
                }

                    //Tell app to render template
                    app.get('/', function(req, res){
                        res.render('index', {
                            myName: myName,
                            banner: banner,
                            profileImage: profileImage,
                            screenName: screenName,
                            followerCount: followerCount,
                            dateTweeted: dateTweeted,
                            tweetContent: tweetContent,
                            noOfRetweets: noOfRetweets,
                            noOfLikes: noOfLikes,
                            profileImageFriends: profileImageFriends,
                            realName: realName,
                            screenNameFriends: screenNameFriends,
                            profileImageMessage: profileImageMessage,
                            messageBody: messageBody,
                            privateMessageTime: privateMessageTime,
                            messagePersonName: messagePersonName,
                            myOwnSentMessages: myOwnSentMessages,
                            timeISentMessage: timeISentMessage
                        });
                    }) 
                }) 
            })        
        }) 
    });      
})







