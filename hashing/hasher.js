const bcrypt = require("bcrypt");

async function hashPassword(plaintextPassword) {
  const hash = await bcrypt.hash(plaintextPassword, 10);
  return hash;
}

async function comparePassword(plaintextPassword, hash) {
  const result = await bcrypt.compare(plaintextPassword, hash);
  console.log("Compare Password: ",result);
  return result;
}

module.exports = {
  "hashPassword": hashPassword,
  "comparePassword": comparePassword
};
