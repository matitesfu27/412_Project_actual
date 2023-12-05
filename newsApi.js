//const { initializeApp, applicationDefault, cert } = require('firebase-admin/app');
//const { getFirestore, serverTimestamp, addDoc, collection, FieldValue } = require('firebase-admin/firestore');
//const { firestore } = require( 'firebase-admin');
//const admin = require('firebase-admin');

const apikey = '63f62c19d1ef61582a28e1a591f5d1f9';
const category = 'general';
const url = 'https://gnews.io/api/v4/top-headlines?category=' + category + '&lang=en&country=us&max=1&apikey=' + apikey;

const http = require('https');

const firebaseConfig = {
  apiKey: "AIzaSyAS649QFsuYGyOxcblA0bLM3O-MTobxPPk",
  authDomain: "cosc-412-c4189.firebaseapp.com",
  databaseURL: "https://cosc-412-c4189-default-rtdb.firebaseio.com",
  projectId: "cosc-412-c4189",
  storageBucket: "cosc-412-c4189.appspot.com",
  messagingSenderId: "446989331804",
  appId: "1:446989331804:web:96a73809e081fb72546599",
  measurementId: "G-WWEQEW5RQW"
};

var summarizedText;
var articleTitle;
var articleUrl;

//admin.initializeApp();

//const db = admin.firestore();
//const colRef = collection(db, 'articles');
//var articleText;
module.exports = { getArticle};

async function firstApi() {
  return new Promise((resolve,reject) => {

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

      //const docRef = db.collection('articles').doc(articleText);
       /*docRef.set({
        title: articleTitle,
        url: articleUrl,
        content: summarizedText,
        createdAt: FieldValue.serverTimestamp()
      }, {merge: true}) */
      resolve();
    });

    req2.on('error', (error) => {
      reject(new Error('something went wrong with the third api function'))
      console.error('Request error:', error.message);
    })
  });
  
  req2.write(JSON.stringify({
    language: 'english',
    summary_percent: 10,
    text: String(articleText),
  }));
  req2.end();

})
}


function getArticle() {

  firstApi()
  .then((urlParam) => {
    return secondApi(urlParam);
  })
  .then((articleTextParam) => {
    return thirdApi(articleTextParam);
  })
  .catch((err) => {
    console.error('Something went wrong:', err.message);
  });

  

  return summarizedText;
}


getArticle();





/*

function getArticle() {
  //Api 1. It gets a current article url
  fetch(url)
  .then(function (response) {
    return response.json();
  })
  .then(function (data) {
    articles = data.articles;

    for (i = 0; i < articles.length; i++) {
      // articles[i].title
      console.log("Title: " + articles[i]['title']);
      // articles[i].description
      console.log("Description: " + articles[i]['description']);
      console.log("Content: " + articles[i]['content']);
      console.log("Url: " + articles[i]['url']);
      textUrl = articles[i]['url']

      break;
      //const url = 'https://extract-news.p.rapidapi.com/v0/article?url=https%3A%2F%2Fwww.theverge.com%2F2020%2F4%2F17%2F21224728%2Fbill-gates-coronavirus-lies-5g-covid-19';
    }

    //Api 2. It gets the article from the url provided
    console.log('This is the end of api 1');
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
      });
    });
    
    req.end();

    
//Api 3. It summarizes the article
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
		console.log('this is the third api', body.toString());
	});
});

req2.write(JSON.stringify({
  language: 'english',
  summary_percent: 10,
  text: articleText,
}));
req2.end();


  });
console.log('end');
  return articleText;
}
   
getArticle();
 */






