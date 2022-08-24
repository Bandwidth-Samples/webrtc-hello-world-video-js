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

const {Client: WebRTCClient, ApiController: WebRTCController} = BandwidthWebRTC;
const webrtcClient = new WebRTCClient({
  basicAuthUserName: username,
  basicAuthPassword: password
});
const webRTCController = new WebRTCController(webrtcClient);

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
      let sessionBody = { tag: `demo` };
      let sessionResponse = await webRTCController.createSession(
        accountId,
        sessionBody
      );
      sessionId = sessionResponse.result.id;
      sessions.set(sessionName, sessionId);
    }

    // setup the session and add this user into it
    const participantBody = {
      publishPermissions: ["AUDIO"],
      deviceApiVersion: "V3"
    };

    var participantResponse = await webRTCController.createParticipant(
      accountId,
      participantBody
    );
    
    const subscribeBody = {sessionId: sessionId};

    console.log(
      `params: s:${sessionId}, p:${participantResponse.result.participant.id}`
    );
    await webRTCController.addParticipantToSession(
      accountId,
      sessionId,
      participantResponse.result.participant.id,
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
    token: participantResponse.result.token,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}!`);
});
