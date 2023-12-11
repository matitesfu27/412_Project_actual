//import firebase from "firebase/compat/app";
// Required for side-effects
//import "firebase/firestore";
import {initializeApp} from 'firebase/app';
import {
    getFirestore, collection, onSnapshot, addDoc, deleteDoc, doc, query, where, orderBy, serverTimestamp, getDoc
} from 'firebase/firestore'

import {
  getAuth, createUserWithEmailAndPassword, signOut, signInWithEmailAndPassword, onAuthStateChanged
} from 'firebase/auth'


//import {getArticle} from './newsApi.js'

 //const http = require('https');
 //const express = require('express');
 //const port = 1337;


 //const app = express();

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

  //init firebase app
  initializeApp(firebaseConfig)

  
 

  // init services
  const db = getFirestore()
  const auth =getAuth()

  // collection ref
  const colRef = collection(db, 'articles')

  //queries
  const q = query(colRef, orderBy('createdAt', 'desc'))

  const dataList = document.getElementById('article-list');
  //const dataList = document.querySelector()

  //get realtime collection data

  onSnapshot(q, (snapshot) => {
    let articles = []
    snapshot.docs.forEach( (doc) => {
        articles.push({...doc.data(), id: doc.id})
        const data = doc.data();
        
        const listItem = document.createElement('li');
        listItem.textContent = `${data.title} - ${data.content}`;
        dataList.appendChild(listItem);
  })
  console.log(articles)
})

  //adding documents
  const addArticleForm = document.querySelector('.add')
  addArticleForm.addEventListener('submit', (e) => {
    e.preventDefault()

    
    addDoc(colRef, {
        title: addArticleForm.title.value,
        content: addArticleForm.content.value,
        createdAt: serverTimestamp()
    }).then( () => {
        addArticleForm.reset()
        
    })
  })

  //deleting documents
  const deleteArticleForm = document.querySelector('.delete');
  deleteArticleForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'articles', deleteArticleForm.id.value)

    deleteDoc(docRef).then(() => {
        deleteArticleForm.reset()
    })
  })

//get a single document

const docRef = doc(db, 'articles', 'NC8WctbGCl9pwwzkx6DD')

getDoc(docRef).then( (doc) => {
    console.log(doc.data(), doc.id)
})

//signing a user up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = signupForm.email.value
  const password = signupForm.password.value

  createUserWithEmailAndPassword(auth,email, password ).then( (cred) => {
    console.log('user created: ', cred.user)
    signupForm.reset()
  }).catch((err) => {
    console.log(err.message)
  })
})


//log in and log out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', () => {
signOut(auth).then(() => {
  console.log('user signed out')
}).catch((err) => {
  console.log(err.message)
})
})

const loginForm= document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
  e.preventDefault()
  

  const email = loginForm.email.value
  const password = loginForm.password.value

  signInWithEmailAndPassword(auth, email,password).then((cred) => {
    console.log('user logged in', cred.user)
  }).catch((err) => {
    console.log(err.message)
  })
})

const loginButton = document.getElementById('loginButton');
loginButton.addEventListener('click',(e) => {
  window.location.href = '/login.html';
} )


onAuthStateChanged(auth, (user) => {
  console.log(user);
})

/*
const newsForm = document.querySelector('.newsButton')
newsForm.addEventListener('submit', (e) => {
  e.preventDefault()

  const article = getArticle();
  console.log(article);
})

*/