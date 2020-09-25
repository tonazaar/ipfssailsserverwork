var _ = require('lodash');
crypto = require('crypto');



module.exports = {

  signup: async function (req, res) {
       console.log("in signup"+ req.body);
  var buf = crypto.randomBytes(5);
  var rand = buf.toString('hex');
    var userid = req.body.username + rand;
        var username = req.body.username ;
	   var role = req.body.role;


       var user = await User.find({email: req.body.email}).limit(1);
         var payrec = [];
         if(user && user.length > 0){

          return ResponseService.json(400, res, "User already exists ");

         }

	  var numRecords = await User.count({});

	   var rec = {
            email: req.body.email,
            password: req.body.password,
	     userid : userid,
	     role : role,
	     account: numRecords,
            username : username 
         };

         var newuser = await User.create(rec
         ).fetch();


      var userInfo = setUserInfo(newuser);
	      var responseData = {
          token: 'JWT ' + generateToken(newuser.id),
                user: userInfo,
     }
        return res.json(responseData)


   },

   login: async function (req, res) {

	          console.log("in login");
    var user = await User.find({email: req.body.email}).limit(1);
     if (!user) {
        return invalidEmailOrPassword(res);
      }


      if(user.length == 0){
          return ResponseService.json(400, res, "User does not exist ");
      }


    User.comparePassword(req.body.password, user[0]).then(
    function (valid) {
      if (!valid) {
        return this.invalidEmailOrPassword();
      } else {

      var userInfo = setUserInfo(user[0]);

        var responseData = {
          token: 'JWT ' + generateToken(user[0].id),
		user: userInfo
        }
        return res.json(responseData)
      }
    }
  ).catch(function (err) {
    return ResponseService.json(403, res, "Forbidden")
  })



   },


	forgetpassword: async function (req, res) {

       console.log("in forgetpassword");
     var user = await User.find({email: req.body.email}).limit(1);
     if (!user) {
        return invalidEmailOrPassword(res);
      }


      if(user.length == 0){
          return ResponseService.json(400, res, "User does not exist ");
      }


      return ResponseService.json(200, res, "Reset link sent to email-id ");

   },

   resetpassword: async function (req, res) {

       console.log("in resetpassword");

       return res.json({});
   },

   logout: async function (req, res) {

       // res.clearCookie('sailsjwt')
        req.user = null
        return res.ok()

   },
   test: async function (req, res) {

       console.log("in test");


	       return res.json({});
   },

   check: async function (req, res) {

       console.log("in test");

       return res.json({});
   }
}

function generateToken(user_id) {
  return JwtService.issue({id: user_id})
};

function invalidEmailOrPassword(res){
  return ResponseService.json(401, res, "Invalid email or password")
};

function verifyParams(res, email, password){
  if (!email || !password) {
    return ResponseService.json(401, res, "Email and password required")
  }
};

function setUserInfo(request){
        return {
                _id: request._id,
                email: request.email,
                userid: request.userid,
                username: request.username,
                role: request.role
        };
}



