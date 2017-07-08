var getUserInfo = function(userToken){
  var GoogleAuth = require('google-auth-library');
  var auth = new GoogleAuth;
  let CLIENT_ID = "100583282236-a5v13vjhvdubiqauacl8lvpkn61q5bv2.apps.googleusercontent.com";
  var client = new auth.OAuth2(CLIENT_ID, '', '');
  var userInfo = {};
  var result = client.verifyIdToken(
      "eyJhbGciOiJSUzI1NiIsImtpZCI6IjA2OWE4NjY3ZmRhMDY4ODgyYTg2OGQ1YTA5MGRiYzRjY2ZmMThhY2MifQ.eyJhenAiOiIxMDA1ODMyODIyMzYtYTV2MTN2amh2ZHViaXFhdWFjbDhsdnBrbjYxcTVidjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiIxMDA1ODMyODIyMzYtYTV2MTN2amh2ZHViaXFhdWFjbDhsdnBrbjYxcTVidjIuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDc5NDM2MDYwMjk2NzA0MjU0MzEiLCJoZCI6ImJlcmtlbGV5LmVkdSIsImVtYWlsIjoiamllbWluZ0BiZXJrZWxleS5lZHUiLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6Ik5yaVVIQ2xpMU0tdlB5dkpKb1M4NlEiLCJpc3MiOiJhY2NvdW50cy5nb29nbGUuY29tIiwiaWF0IjoxNDk5MTI5MDI1LCJleHAiOjE0OTkxMzI2MjUsIm5hbWUiOiJKSUVNSU5HIFdFSSIsInBpY3R1cmUiOiJodHRwczovL2xoNS5nb29nbGV1c2VyY29udGVudC5jb20vLW5mTm1PTGZZSXZrL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FJNnlHWHg3aFEtQkhXa3ZHekhfU1JoSlBVa1YyV0lPV3cvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkpJRU1JTkciLCJmYW1pbHlfbmFtZSI6IldFSSIsImxvY2FsZSI6ImVuIn0.WGHy3SPV-dVBm_7UF4gk0ARfAOAYkHC8Rkby1F0owcKKuuKdBu-eTYKaDxXB9Y6_2ai_UwjKZWz8BNM9EC2LMXan-NUq9CugQ1M-reLwMQw1I6RUZgN2LhR86OEDuLFGU9gNU-pw6vL3AjHv5aD3J1FLWBxZmQI6uQpac_N8reccCXK7Jd1jGPchjorIlUQNoGF-BloSf8HD-jDVAZxGFZ2-XwOKRpI9rAagd3dRseXafVYSwR3AhxD0hANNqVGFXLcfwa7yZ_zyRhEN46uQ93ew8RTg3utZR081eClRTsABtFQFha6BAYDGtvMzCyPZZ-ANIZeOcTIHTzgjCx_QCw",
      CLIENT_ID,
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3],
      function(e, login) {
        var payload = login.getPayload();
        console.log(payload);
        userInfo.userid = payload['sub'];
        userInfo.email = payload.email;
        userInfo.name = payload.name;
        userInfo.picture = picture.picture;
        console.log(userid);
        // If request specified a G Suite domain:
        //var domain = payload['hd'];
      });
    return userInfo;
}
