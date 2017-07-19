var getUserInfo = function(userToken){
  var GoogleAuth = require('google-auth-library');
  var auth = new GoogleAuth;
  let CLIENT_ID = "100583282236-h0cdnerbrmtotdmfpvnl9rf0fdd8dc5n.apps.googleusercontent.com";
  var client = new auth.OAuth2(CLIENT_ID, '', '');
  var userInfo = {};
  var result = client.verifyIdToken(
      userToken,
      CLIENT_ID,
      function(e, login) {
        var payload = login.getPayload();
        userInfo = payload;
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
      });
    return userInfo;
}

exports.getUserInfo = getUserInfo;
