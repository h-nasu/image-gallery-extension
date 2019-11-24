'use strict';

import commonConfig from './commonConfig.js'
import vuexIndexedDBPlugin from './plugins/vuexIndexedDBPlugin.js'

var db

const initDB = () => {
  if (window.indexedDB) {
    var openRequest = window.indexedDB.open(commonConfig.dbname, commonConfig.dbversion)

    openRequest.onerror = () => {
      console.log('Can not open db')
    }
    openRequest.onsuccess = (event) => {
      console.log('Open db')
      db = event.target.result
    }
  }
}

const getObjectStore = (storeName) => {
  let transaction = db.transaction([storeName], "readwrite")
  transaction.onerror = () => {
    console.log('transaction error')
  }
  return transaction.objectStore(storeName)
}

const checkDB = () => {
  if (!db) {
    initDB()
  }
}

chrome.runtime.onInstalled.addListener(function() {

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostContains: ''},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });

  // Init DB from vuex plugin if not set
  let store = {
    state: {},
    commit: (arg1, arg2)=>{},
    subscribe: (arg)=>{}
  }
  for (let obname in commonConfig.schema) {
    store.state[obname] = {
      schema: commonConfig.schema[obname]
    }
  }
  vuexIndexedDBPlugin(commonConfig.dbname, commonConfig.dbversion)(store)

  setTimeout(()=>{
    checkDB()
  },1000)


  chrome.contextMenus.create({
    id: 'save_image',
    title: 'Save Image',
    contexts: ['image'],
  });

  chrome.contextMenus.onClicked.addListener((info, tab) => {
    let objectStore = getObjectStore('images')
    let request = objectStore.add({
      url: info.srcUrl
    })
    request.onerror = () => {
      console.log('Can not save image')
    }
    request.onsuccess = (event) => {
      //
      console.log('Image saved')
      console.log(info.srcUrl)
    }

  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'getImages' && request.images) {
      console.log('Background Got Images')
      console.log(request.images)
      let objectStore = getObjectStore('images')
      request.images.forEach((image) => {

        // TODO: Check URL for same

        objectStore.add({
          url: image
        })
      })

      sendResponse({farewell: 'Got Images on Background!'})
    } else {
      sendResponse({farewell: 'No Images!'})
    }

  });

});
