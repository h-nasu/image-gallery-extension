'use strict';

let getImages = document.getElementById('getImages')

getImages.onclick = el => {
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {type: "getImages"}, function(response) {
      console.log(response.images);
    });
  });

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

