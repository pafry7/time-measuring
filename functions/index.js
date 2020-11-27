const functions = require("firebase-functions");
import {loginUser} from "./loginUser"

module.exports = {
  hello: functions.https.onRequest(async (req, res) => {
    const { mail } = req.query || {};

    res.send(mail ? await loginUser(mail) : "please provide mail address");
  }),
};
