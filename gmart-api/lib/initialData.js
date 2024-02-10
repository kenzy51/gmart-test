var Users = require("../routes/user/user.model");
var config = require('../config');

const addInitData = async () => {
    const totalUsers = await Users.find().count()
    if (totalUsers === 0) {
        const userData = {
            email: config.admin.email,
            password: config.admin.password,
            profile: { firstName: config.admin.firstName },
            role: 'admin'
        }
  
        //save the user and check for errors
        var user = new Users(userData);
        await user.save();
    }
  }
  
  exports.addInitData = addInitData;