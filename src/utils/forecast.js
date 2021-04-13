const request = require("request");

const forecast = (lat, long, callback) => {
  const url =
    "https://api.darksky.net/forecast/7d85fc2cc84be3fa339e4d463f746464/" +
    lat +
    "," +
    long;

  request({ url, json: true }, (error, { body }) => {
    if (error) {
      callback("No network");
    } else if (body.error === 0) {
      callback("Cant fetch data");
    } else {
      callback(undefined, body.daily.data[0].summary);
    }
  });
};

module.exports = forecast;
