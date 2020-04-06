var _ = require('lodash');


module.exports = {

  signup: async function (req, res) {
       console.log("in signup"+ req.body);
       var user = await User.find({email: req.body.email}).limit(1);
         var payrec = [];
         if(user && user.length > 0){

          return ResponseService.json(400, res, "User already exists ");

         }

	   var rec = {
            email: req.body.email,
            password: req.body.password,
         };

         var newuser = await User.create(rec
         ).fetch();


	      var responseData = {
          email: newuser.email,
          token: 'JWT ' + generateToken(newuser.id)
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
        var responseData = {
          email: user[0].email,
          token: 'JWT ' + generateToken(user[0].id)
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



