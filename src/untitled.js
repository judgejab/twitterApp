client.get('users/show', {screen_name: 'theclearytheory'}, function(error, data, response){
    if (!error) {

        //Variables Used for me and my tweet section
        var profileImage = data.profile_image_url;
        var myName = data.name;
        var screenName = data.screen_name;
        var followerCount= data.followers_count;
        var banner = data.profile_banner_url;

    }
});


function userInfo() {
	client.get('users/show', {screen_name: 'theclearytheory'}, function(error, data, response){
	    if (!error) {

	        //Variables Used for me and my tweet section
	        var profileImage = data.profile_image_url;
	        var myName = data.name;
	        var screenName = data.screen_name;
	        var followerCount= data.followers_count;
	        var banner = data.profile_banner_url;

	        renderObject.profileImage = profileImage;
	        renderObject.myName = myName;
	        renderObject.screenName = screenName;
	        renderObject.followerCount = followerCount;
	        renderObject.banner = banner;
	    }
	});
}

app.get('/', userInfo, timeline, friends, messages, messages_sent, render);