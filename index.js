const BandwidthWebRTC = require("@bandwidth/webrtc");
const express = require("express");
require("dotenv").config();

const bodyParser = require("body-parser");
const app = express();
app.use(bodyParser.json());
app.use(express.static("public"));

// global vars
const port = process.env.LOCAL_PORT || 3000;
const accountId = process.env.BW_ACCOUNT_ID;
const username = process.env.BW_USERNAME;
const password = process.env.BW_PASSWORD;

// Check to make sure required environment variables are set
if (!accountId || !username || !password) {
  console.error(
      "ERROR! Please set the BW_ACCOUNT_ID, BW_USERNAME, and BW_PASSWORD environment variables before running this app"
  );
  process.exit(1);
}

BandwidthWebRTC.Configuration.basicAuthUserName = process.env.BW_USERNAME;
BandwidthWebRTC.Configuration.basicAuthPassword = process.env.BW_PASSWORD;
var webRTCController = BandwidthWebRTC.APIController;

// track the session Ids
var sessions = new Map();

app.get("/joinCall", async (req, res) => {
  try {
    let sessionName = req.query.room_id;
    let sessionId;

    // create the session or get it from the global map
    if (sessions.has(sessionName)) {
      sessionId = sessions.get(sessionName);
    } else {
      let sessionBody = new BandwidthWebRTC.Session({ tag: `demo` });
      let sessionResponse = await webRTCController.createSession(
        accountId,
        sessionBody
      );
      sessionId = sessionResponse.id;
      sessions.set(sessionName, sessionId);
    }

    // setup the session and add this user into it
    var participantBody = new BandwidthWebRTC.Participant({
      publishPermissions: ["AUDIO", "VIDEO"],
      deviceApiVersion: "V3"
    });

    var participantResponse = await webRTCController.createParticipant(
      accountId,
      participantBody
    );

    // return [createResponse.participant, participantResponse.token];

    var subscribeBody = new BandwidthWebRTC.Subscriptions({
      sessionId: sessionId,
    });

    console.log(
      `params: s:${sessionId}, p:${participantResponse.participant.id}`
    );
    await webRTCController.addParticipantToSession(
      accountId,
      sessionId,
      participantResponse.participant.id,
      subscribeBody
    );
  } catch (error) {
    console.log(`failed to setup participant: ${error.message}`);
    console.log(error);
    return res.status(500).send({ message: "failed to join session" });
  }

  // now that we have added them to the session,
  //  we can send back the token they need to join
  //  as well as info about the room they are in
  res.send({
    message: "created participant and setup session",
    token: participantResponse.token,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
