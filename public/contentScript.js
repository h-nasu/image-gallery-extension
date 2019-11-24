

function getAllImages() {
  let images = []
  document.querySelectorAll('img').forEach((img) => {
    if (img.src.includes('http://') || img.src.includes('https://')) {
      images.push(img.src)
    }
  })
  return images
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ?
                "from a content script:" + sender.tab.url :
                "from the extension");

    if (request.type == 'getImages') {
      console.log('Get Images')
      let images = getAllImages()
      // popup
      sendResponse({images: images})
      // background
      chrome.runtime.sendMessage({type: "getImages", images: images}, function(response) {
        console.log(response.farewell);
      });
    }

  }
);


