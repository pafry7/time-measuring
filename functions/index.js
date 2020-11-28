const functions = require("firebase-functions");
const { challengesRef } = require("./common");
const { loginUser } = require("./loginUser");

module.exports = {
  hello: functions.https.onRequest(async (req, res) => {
    const { mail } = req.query || {};

    res.status(200).send({ id: await loginUser(mail) });
  }),
  challenge: functions.https.onRequest(async (req, res) => {
    const { httpMethod } = req;
    console.log(JSON.stringify(req))
    switch (httpMethod) {
      case "GET":
        const { id } = req.id;
        console.log("waiting for response from firebase...")
        const challenge = (await challengesRef.doc(query.id).get()).data();
        res.status(200).send({ ...challenge, id });
        break;
      case "POST":
        break;
    }
    res.send("")
  }),
};
