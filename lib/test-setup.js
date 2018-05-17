const sinon = require("sinon");
const AWS = require("aws-sdk");
const request = require("request-promise-native");

global.env = {
  CREDENTIALS_TABLE: "test-credentials",
  QUEUE_NAME: "test-queue",
  CONTENT_BUCKET: "test-bucket",
  UPSTREAM_SERVICE_URL: "https://api.example.com/v1.0/Match",
  UPSTREAM_SERVICE_KEY: "1234567890"
};

global.constants = {
  ETag: '"ae1e7accaab42504a930ecc6e6aa34c2"',
  QueueUrl: "https://example.com/sqs/",
  MessageId: "abba123",
  requestId: "8675309",
  ReceiptHandle: "5551212",
  defaultS3GetObjectResponse: {
    AcceptRanges: "bytes",
    Expiration:
      'expiry-date="Sat, 09 Jun 2018 00:00:00 GMT", rule-id="DailyCleanup"',
    LastModified: "2018-05-09T22:56:51.000Z",
    ContentLength: 20,
    ETag: '"ae1e7accaab42504a930ecc6e6aa34c2"',
    ContentType: "image/jpeg",
    Metadata: {},
    Body: new Buffer("THIS IS NOT AN IMAGE")
  }
};

global.mocks = {
  deleteMessage: (AWS.SQS.prototype.deleteMessage = sinon.stub()),
  getItem: (AWS.DynamoDB.DocumentClient.prototype.get = sinon.stub()),
  getQueueUrl: (AWS.SQS.prototype.getQueueUrl = sinon.stub()),
  getSignedUrl: (AWS.S3.prototype.getSignedUrl = sinon.stub()),
  putObject: (AWS.S3.prototype.putObject = sinon.stub()),
  requestPost: (request.post = sinon.stub()),
  sendMessage: (AWS.SQS.prototype.sendMessage = sinon.stub())
};

global.makePromiseFn = out => ({ promise: () => Promise.resolve(out) });

global.resetMocks = () => {
  const {
    mocks,
    makePromiseFn,
    constants: { QueueUrl, MessageId, ETag }
  } = global;

  Object.assign(process.env, global.env);

  Object.values(global.mocks).forEach(mock => mock.resetHistory());

  mocks.requestPost.resolves({});

  mocks.deleteMessage.returns(makePromiseFn({}));
  mocks.getItem.returns(makePromiseFn({}));
  mocks.getQueueUrl.returns(makePromiseFn({ QueueUrl }));
  mocks.getSignedUrl.returns("");
  mocks.putObject.returns(makePromiseFn({ ETag }));
  mocks.sendMessage.returns(makePromiseFn({ MessageId }));
};