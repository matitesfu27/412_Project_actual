var admin = require('firebase-admin');
var serviceAccount = require('./serviceAccount.json')
const apikey = '63f62c19d1ef61582a28e1a591f5d1f9';  // key for first api
const loopLimit = 2;
var category;
const start = 2; //max of 8

const http = require('https');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

var summarizedText;
var articleTitle;
var articleUrl;

module.exports = { getArticle};

// from Gnews. The api returns a 2-D array of properties and resolves the url from a recent story upon completion. 
// 100 requests per day. Up to 10 results per query. Currently is configured to return 1. Delete break and change max in url to change
async function firstApi(num) {
  return new Promise((resolve,reject) => {

    const categoryArray = ['business', 'general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health']
    category = categoryArray[num];
    const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=1&apikey=' + apikey;

    fetch(url).then(function (response) {
      return response.json();
    })
    .then(function (data) {
      articles = data.articles;
      var textUrl;

      for (i = 0; i < articles.length; i++) {
        // articles[i].title
        console.log("Title: " + articles[i]['title']);
        // articles[i].description
        console.log("Description: " + articles[i]['description']);
        console.log("Content: " + articles[i]['content']);
        console.log("Url: " + articles[i]['url']);
        textUrl = articles[i]['url'];

        articleUrl = textUrl;
        articleTitle = articles[i]['title'];

        break;
      }
      resolve(textUrl);
    })
    .catch( (err) => {
      reject(new Error('something went wrong with first api function'));
      console.error(err.message);
    })

    

  })
}

// Extract News from Rapid Api. Resolves with the scraped content from the url provided by firstApi.
// 5 requests per hour apparently? Not sure how accurate that is tbh. 
async function secondApi(textUrl) {
return new Promise( (resolve, reject) => {
  
  const options = {
    method: 'GET',
    hostname: 'extract-news.p.rapidapi.com',
    port: null,
    path: `/v0/article?url=${textUrl}`,
    headers: {
      'X-RapidAPI-Key': 'c4de5f3199msh4fdb3f6628ba2f1p1fcd9fjsndd2d212ea28b',
      'X-RapidAPI-Host': 'extract-news.p.rapidapi.com'
    }
  };

  
  const req = http.request(options, (res) => {
    const chunks = [];
  
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
  
    res.on('end', function () {
      const body = Buffer.concat(chunks);
      const parsedBody = JSON.parse(body);
      articleText = parsedBody.article.text;
      console.log('This is the article text from api 2: ', articleText);
      resolve(articleText);

    });

    req.on('error', (error) => {
      reject(new Error('something went wrong with the second api function'))
      console.error('Request error:', error.message);
    });

  });
  
  req.end();

  

})
}

// From Text Analyis from Rapid Api. Resolves the summarized article text from secondApi. Can change percentage of article to keep with summary_percent
// 500,000 requests a month somehow. 
async function thirdApi(articleText){
return new Promise( (resolve, reject) => {

  const options2 = {
    method: 'POST',
    hostname: 'text-analysis12.p.rapidapi.com',
    port: null,
    path: '/summarize-text/api/v1.1',
    headers: {
      'content-type': 'application/json',
      'X-RapidAPI-Key': 'c4de5f3199msh4fdb3f6628ba2f1p1fcd9fjsndd2d212ea28b',
      'X-RapidAPI-Host': 'text-analysis12.p.rapidapi.com'
    }
  };
  
  const req2 = http.request(options2, function (res) {
    const chunks = [];
  
    res.on('data', function (chunk) {
      chunks.push(chunk);
    });
  
    res.on('end', function () {
      const body = Buffer.concat(chunks);
      const parsedBody = JSON.parse(body);
      summarizedText = parsedBody.summary;
      console.log('this is the third api', summarizedText);

      const data = {
        title: articleTitle,
        category: category,
        url: articleUrl,
        content: summarizedText,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      }
      db.collection("articles").doc(articleTitle).set(data);
      resolve();
    });

    req2.on('error', (error) => {
      reject(new Error('something went wrong with the third api function'))
      console.error('Request error:', error.message);
    })
  });
  
  req2.write(JSON.stringify({
    language: 'english',
    summary_percent: 50,
    text: String(articleText),
  }));
  req2.end();

})
}

//function to chain all the async functions together to make sure they start one after the other. 
function getArticle(num) {
 // runs = loopLimit;  // temp limit on how many times it can run
  
  

    console.log('Starting loop ' + num);
  
  firstApi(num)
  .then((urlParam) => {
    return secondApi(urlParam);
  })
  .then((articleTextParam) => {
    return thirdApi(articleTextParam);
  })
  .catch((err) => {
    console.error('Something went wrong:', err.message);
  });

  

 // return summarizedText;
}

// run
for (let i = start; i < start + loopLimit; i++) {
getArticle(i);
}