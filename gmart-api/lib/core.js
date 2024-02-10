var bcrypt = require('bcrypt-nodejs')
var axios = require('axios');
var config = require('../config');

const comparePassword = (password, userPassword) => {
	return bcrypt.compareSync(password.toString(), userPassword);
}

const validateEmail = (email) => {
	var regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/; 
	return regex.test(email);
}

const validatePhone = (phone) => {
	var regex = /^\d{10}$/;
	return regex.test(phone);
}

const getLocation = async (address) => {
	try {
		const googleMapApiKey = config.google && config.google.apiKey ? config.google.apiKey : ''

        return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${googleMapApiKey}`, {
			headers: {
		        'Content-Type': 'application/json',
				'Accept': 'application/json'
		    }
		})
        .then(res => {
            return res?.data?.results?.[0]?.geometry?.location || ''
        })
        .catch(err => {
            return 
        })
	} catch(e) {
		return 
	}
}

module.exports = {
	comparePassword,
	validateEmail,
	validatePhone,
	getLocation
}