const functions = require("firebase-functions");
const { loginUser } = require("./loginUser");

module.exports = {
  hello: functions.https.onRequest(async (req, res) => {
    const {mail} = req.query || {};

    mail ? res.status(200).send({id: await loginUser(mail)});
  }),
};
