const functions = require("firebase-functions");
const { loginUser } = require("./loginUser");

module.exports = {
  hello: functions.https.onRequest(async (req, res) => {
    const { mail } = req.query || {};

    res.send(mail ? await loginUser(mail) : "please provide mail address");
  }),
};
