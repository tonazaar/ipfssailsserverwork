var jwt = require('jsonwebtoken');
var jwtSecret = sails.config.secrets.apijwtSecret;

module.exports = {

  issueWithDuration: function (payload, days) {
    var daystr = days+"d";
    // token = jwt.sign(payload, jwtSecret, {expiresIn: daystr })
    // removed duration
    token = jwt.sign(payload, jwtSecret )

    return token
  },
  issue: function (payload) {
    token = jwt.sign(payload, jwtSecret, {expiresIn: 100000 * 180 * 60})

    return token
  },

  verify: function (token, callback) {
    return jwt.verify(token, jwtSecret, callback);
  }

}
