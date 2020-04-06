
 module.exports = function (req, res, next) {
  let token;
 
   console.log("isAuthorised");
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^JWT$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return ResponseService.json(401, res, "Format is Authorization: Bearer [token]");
    }
  } else if (req.param('token')) {
    token = req.param('token');

    delete req.query.token;
  } else {
    return ResponseService.json(401, res, "No authorization header was found");
  }


 JwtService.verify(token, function(err, decoded){
    if (err) return ResponseService.json(401, res, "Invalid Token!");
    req.token = token;
    console.log("Decoded="+JSON.stringify(decoded));
    User.findOne({id: decoded.id}).then(function(user){
      if(user) {
      console.log("User="+JSON.stringify(user));
      req.current_user = user;
      next();
      } else {
       return ResponseService.json(401, res, "user not found");
     }
    })
  });

}

