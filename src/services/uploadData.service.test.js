const test = require("node:test");
const assert = require("node:assert/strict");
const { bufferToDataUri } = require("./uploadData.service");

test("converts file buffers into base64 data URIs", () => {
  const data = Buffer.from("hello");
  const uri = bufferToDataUri(data, "audio/mpeg");

  assert.equal(uri, "data:audio/mpeg;base64,aGVsbG8=");
});
