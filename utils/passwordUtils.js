const bcryptjs = require('bcryptjs');

// Function to securely hash a password
const securePassword = async (password) => {
  try {
    const passwordHash = await bcryptjs.hash(password, 10); // 10 rounds of salt
    return passwordHash;
  } catch (error) {
    throw new Error(error.message);
  }
};

// Function to compare a string with a hashed password
const matchPassword = async (string, password) => {
  try {
    return await bcryptjs.compare(string, password);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = { securePassword, matchPassword };
