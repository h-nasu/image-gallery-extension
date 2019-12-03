'use strict';

let getImages = document.getElementById('getImages')

getImages.onclick = el => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getImages"}, function(response) {
      console.log(response.images);
      alert('Added all Image to Gallery')
    });
  });

}

