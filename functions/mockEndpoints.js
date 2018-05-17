"use strict";

module.exports.upstreamPost = async (event, context) => {
  console.log("upstream", event.body);
  return response(
    200,
    Object.assign(
      {},
      baseMatchResponse,
      // TODO: Find a more deterministic way to simulate pos/neg match
      { IsMatch: Math.random() < 0.5 }
    )
  );
};

module.exports.clientNegativePost = async (event, context) => {
  console.log("negative", event.body);
  return response(200, { status: "OK" });
};

module.exports.clientPositivePost = async (event, context) => {
  console.log("positive", event.body);
  return response(200, { status: "OK" });
};

function response(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: Object.assign({ "Content-Type": "application/json" }, headers),
    body: JSON.stringify(body)
  };
}

const baseMatchResponse = {
  Status: {
    Code: 3000,
    Description: "OK",
    Exception: null
  },
  ContentId: null,
  IsMatch: false,
  MatchDetails: {
    AdvancedInfo: [],
    MatchFlags: []
  },
  XPartnerCustomerId: null,
  TrackingId:
    "WUS_418b5903425346a1b1451821c5cd06ee_57c7457ae3a97812ecf8bde9_ddba296dab39454aa00cf0b17e0eb7bf",
  EvaluateResponse: null
};