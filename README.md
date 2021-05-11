# WebRTC Hello World Video
<a href="http://dev.bandwidth.com"><img src="https://s3.amazonaws.com/bwdemos/BW-VMP.png"/></a>

 # Table of Contents

<!-- TOC -->

* [WebRTC Hello World Video](#webrtc-hello-world-video)
* [Description](#description)
* [Pre-Requisites](#pre-requisites)
* [Environmental Variables](#environmental-variables)
* [Callback URLs](#callback-urls)
* [Running the Application](#running-the-application)
  * [Run](#run)
  * [Ngrok](#ngrok)

<!-- /TOC -->

# Description

A simple 1:1 WebRTC video application.

# Pre-Requisites

In order to use the Bandwidth API, users need to set up [API credentials](https://dev.bandwidth.com/guides/accountCredentials.html#top). WebRTC must be enabled for your account to run this sample. Please check with your account manager to ensure you are provisioned for WebRTC.

For more information about API credentials see [here](https://dev.bandwidth.com/guides/accountCredentials.html#top).

# Environmental Variables

The sample app uses the below environmental variables.
```sh
BW_ACCOUNT_ID                        # Your Bandwidth Account Id
BW_USERNAME                          # Your Bandwidth API Username
BW_PASSWORD                          # Your Bandwidth API Password
```

# Running the Application
## Run
Use the following commands to run the application:

```sh
npm install
node index.js
```

## Communicate!

Browse to [http://localhost:3000](http://localhost:3000) 