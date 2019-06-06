// Global Bootbox
$(document).ready(function () {
    // Setting a reference to the article container div where all the dynamic content will go.
    // Adding event listeners to any dynamically generated "save article" and "scrape new article" buttons.
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);
  
    // Once page is ready, run the initPage function to get things started
    initPage();
  
    function initPage() {
      // Empty the article container, run an AJAX request for any unsaved headlines
      articleContainer.empty();
      $.get("/api/headlines?saved=false")
        .then(function (data) {
          // If we have headlines, render them to the page
          if (data && data.length) {
            renderArticles(data);
          } else {
            // Otherwise render a message explaining there are no articles
            renderEmpty();
          }
        });
    }
  
    function renderArticles(articles) {
      // This function handles appending HTML containing the article data to the page
      // A JSON array is passed containing all available articles in the database
      var articlePanels = [];
      // We pass each article JSON object to the createPanel function which returns a bootstrap panel with our article data inside
      for (var i = 0; i < articles.length; i++) {
        articlePanels.push(createPanel(articles[i]));
      }
      // Once we have all the HTML for the articles stored in the articlePanels array, append them to the articles container
      articleContainer.append(articlePanels);
    }
  
    function createPanel(article) {
      // this function takes in a single JSON object for an article/headline
      // it constructs a jQuery element containing all the formatted HTML for the article panel
      var panel =
        $(["<div class='panel panel-default'>",
          "<div class='panel-heading'>",
          "<h3>",
          article.headline,
          "<a class='btn btn-success save'>",
          "Save Article",
          "</a>",
          "</div>",
          "<div class='panel-body'>",
          article.summary,
          "</div>",
          "</div>"
        ].join(""));
      // attach the article's id to the jQuery element
      // this is used when trying to figure out which article the user wants to save
      panel.data("_id", article._id);
      // return the constructed panel jQuery element
      return panel;
    }
  
    function renderEmpty() {
      // this function renders some HTML to the page explaining that there are no articles to view
      //using a joined array of HTML string data because it is easier to read/change than a concatenated string
      var emptyAlert =
        $(["<div class='alert alert-warning   text-center'>",
          "<h4>Oh no!! No new articles available to view.</h4>",
          "</div>",
          "<div class='panel panel-default'>",
          "<div class='panel-body text-center'>",
          "<h3>What Would You Like To Do?</h3>",
          "</div>",
          "<div class='panel-body text-center'>",
          "<h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
          "<h4><a href='/saved'>Go to Saved Articles</a></h4>",
          "</div>",
          "</div>"
        ].join(""));
      // appending this data to the page
      articleContainer.append(emptyAlert);
    }
  
    function handleArticleSave() {
      console.log("saving article");
      // This function is triggered when the user wants to save an article
      //When the article initially rendered a javascript object containing the headline id was attached to the element using the .data method. That is retrieved here.
      var articleToSave = $(this).parents(".panel").data();
      articleToSave.saved = true;
      // Using a patch method to be semantic since this an update to an existing  record in collection
      $.ajax({
          method: "PATCH",
          url: "/api/headlines",
          data: articleToSave
        })
        .then(function (data) {
          // If successful, mongoose will send back an object containing a key of "ok" with the value of 1 (which casts to 'true')
          if (data.ok) {
            // Run the initPage function again. This will reload the entire list of articles
            initPage();
          }
        });
    }
  
    function handleArticleScrape() {
      console.log("scraping article");
      // This function handles the user clicking any "scrape new article" buttons
      // $.get("/api/fetch")
      //   .then(function (data) {
      //     // If able to successfully scrape the NYTIMES and compare the articles to those already in collection, re-render the articles on the page and let the user know how many articles were saved
      //     initPage();
      //     bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "<h3>");
      //   });
  
      $.get("/api/fetch", function (data) {
        // $( ".result" ).html( data );
        // alert( "Load was performed." );
        console.log(data);
      });
    }
  });