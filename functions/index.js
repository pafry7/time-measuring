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
    switch (httpMethod) {
      case "GET":
        const { id } = req.id;
        const challenge = {
          ...(await challengesRef.doc(query.id).get()).data(),
          id,
        };
        res.status(200).send({id})
        break;
      case "POST":
        break;
    }
  }),
};
