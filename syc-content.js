const availablePages = ["/watch"]

let stop = true,
    commentsScrollIsEnabled = false

function enableCommentsScroll(bool) {
  const belowPlayer = document.getElementById("below"),
        comments = document.getElementsByTagName("ytd-comments")[0],
        secondaryInner = document.getElementById("secondary-inner"),
        commentsWrapperId = "syc-comments-wrapper"

  if (bool) {
    const commentsWrapper = document.createElement("div")
    commentsWrapper.id = commentsWrapperId
    commentsWrapper.style = "height: 90vh; margin-bottom: 16px; overflow-y: scroll;"
    commentsWrapper.appendChild(comments)

    secondaryInner.prepend(commentsWrapper)
    commentsScrollIsEnabled = true

  } else {
    const commentsWrapper = document.getElementById(commentsWrapperId)
    belowPlayer.appendChild(comments)
    commentsWrapper.remove()
    commentsScrollIsEnabled = false
  }
}

const sendMessageToBackground = (msgObj) => chrome.runtime.sendMessage(msgObj)

function action() {
  if (availablePages.includes(location.pathname))
    stop = false
  else {
    stop = true
    // restore comments if page is not available
    if (commentsScrollIsEnabled) enableCommentsScroll(false)
  }

  sendMessageToBackground({ stop, commentsScrollIsEnabled })

  chrome.runtime.onMessage.addListener(msg => {
    if (msg.sync) sendMessageToBackground({ stop, commentsScrollIsEnabled })
    if ([true, false].includes(msg.enableCommentsScroll))
      enableCommentsScroll(msg.enableCommentsScroll)
  })
}

document.addEventListener("yt-page-type-changed", action)
if (document.body) action()
else document.addEventListener("DOMContentLoaded", action)