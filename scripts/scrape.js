// scrape script
//

// require request and cheerio allows scrapes
var request = require("request");
var cheerio = require("cheerio");

var scrape = function (cb) {
  request("https://www.altpress.com/", (err, res, body) => {
    if (!err && res.statusCode == 200) {
      var $ = cheerio.load(body);
      var articles = [];

      $(".td_module_11 td_module_wrap td-animation-stack").each(function (i, element) {

        var head = $(this).find(".entry-title td-module-title").text().trim();

        var sum = $(this).find(".td-excerpt").text().trim();

        var link = $(this).find("a").attr("href");
        console.log(head);
        console.log(sum);
        console.log(link);

        if (head && sum && link) {
          var headNeat = head.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();
          var sumNeat = sum.replace(/(\r\n|\n|\r|\t|\s+)/gm, " ").trim();

          var dataToAdd = {
            headline: headNeat,
            summary: sumNeat,
            link: link
          };

          console.log(dataToAdd);
          articles.push(dataToAdd);
        }
      });

      console.log(articles);
      cb(articles);
    };
  });
}

module.exports = scrape;