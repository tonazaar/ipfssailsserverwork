module.exports = function (req, res, next) {
  let token;
  console.log("Apiallowed");
  if (req.headers && req.headers.authorization) {
    var parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      var scheme = parts[0],
        credentials = parts[1];

      if (/^ApiKey$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return ResponseService.json(401, res, "Format is Authorization: ApiKey [token]");
    }
  } else if (req.param('token')) {
    token = req.param('token');

    delete req.query.token;
  } else {
 return ResponseService.json(401, res, "No API authorization header was found");
  }


 ApiJwtService.verify(token, function(err, decoded){
    if (err) return ResponseService.json(401, res, "Invalid Token!");
    req.token = token;

     next();

 })

}


