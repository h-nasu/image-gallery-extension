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

const addImageToIndexedDB = (url) => {
  let objectStore = getObjectStore('images')
  let index = objectStore.index("url")
  let requestCheck = index.get(url)
  requestCheck.onerror = () => {
    console.log("No Image found in indexedDB");
  }
  requestCheck.onsuccess = (event) => {
    if (event.target.result) {
      console.log("Image already in Collection");
    } else {
      console.log("No Image found in indexedDB");

      let request = objectStore.add({
        url: url
      })
      request.onerror = () => {
        console.log('Can not save image')
      }
      request.onsuccess = (event) => {
        console.log('Image saved')
        console.log(url)

        // Send to Image Gallery
        chrome.runtime.sendMessage({type: "savedImageToIndexedDB"}, function(response) {
          //console.log(response.farewell);
        });

      }

    }
  }
}

const checkGalleryOpen = () => {
  chrome.tabs.getAllInWindow(null, function(checkTabs){
    for (var i = 0; i < checkTabs.length; i++) {
      if (checkTabs[i].title == 'image-gallery-extension - image-gallery-extension') {
        return
        break
      }
    }
    window.open('image-gallery/index.html')
  });
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
    if (info.menuItemId == 'save_image') {
      addImageToIndexedDB(info.srcUrl)
      checkGalleryOpen()
    }
  });

  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.type == 'getImages' && request.images) {
      console.log('Background Got Images')
      console.log(request.images)
      request.images.forEach((image) => {
        addImageToIndexedDB(image)
      })
      checkGalleryOpen()

      sendResponse({farewell: 'Got Images on Background!'})
    } else {
      sendResponse({farewell: 'No Images!'})
    }

  });

});
