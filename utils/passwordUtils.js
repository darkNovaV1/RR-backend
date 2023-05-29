const bcryptjs  = require('bcryptjs');

const securePassword = async(password)=>{
    try {
        
       const passwordHash = bcryptjs.hash(password,10); // 10 salt
        return passwordHash 
    } catch (error) {
        res.status(400).send(error.message);
    }
}

module.exports = securePassword;