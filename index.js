var $ = require("cheerio");
var nodemailer = require("nodemailer");
var rc = require("rc");
var request = require("request");
var Slack = require('slack-node');
var util = require('util')

var config = rc("hetzner-notifier", {
    country: "US",
    ram: "",
    hdnr: "",
    hdsize: "",
    text: "",
    slack_webhook_url: "",
    threshold: 30
});

var url = "https://robot.your-server.de/order/market";
var countryUrl = url + "/country/" + config.country;

// We don't set the maxprice here, since we want to get the next lowest price when nothing under
// the threshold is found.
var formData = {
  ram: config.ram,
  hdnr: config.hdnr,
  hdsize: config.hdsize,
  maxprice: "",
  text: config.text,
  limit: "100"
};

if (!config.slack_webhook_url) {
  console.error("Please specity the Slack hook url");
  process.exit(1);
}

var jar = request.jar();
request = request.defaults({jar: jar});
slack = new Slack();
slack.setWebhook(config.slack_webhook_url);

// We go to the country page first, because the pricing is dependent on the country the visitor
// chooses. By going to the page, a cookie is set so that subsequent search gets the correct prices
request.get(countryUrl, function () {
  request.post(url, {form: formData}, function (error, response, body) {
    if (error || response.statusCode !== 200) {
      console.error("Error getting Hetzner webpage: " + body);
      process.exit(2);
    }
    var lowestPrice = $(body).find(".order_price").eq(2).text().split(" ")[1];
    if (Number(lowestPrice) <= config.threshold) {
      var msgOptions = {
          text: util.format("Hetzner server (ram: %s GB, hdnr: %s, hdsize: %s GB, text: %s) dropped under %s EUR",
            config.ram,
            config.hdnr,
            config.hdsize,
            config.text,
            config.threshold)

      };
      slack.webhook({
        channel: "#general",
        username: "hetzner-notifier",
        text: msgOptions.text
      }, function(err, response) {});
    } else {
      console.log("Nothing found. The cheapest deal is " + lowestPrice);
    }
  });
});
