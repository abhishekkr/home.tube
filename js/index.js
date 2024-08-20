const mediaThumbnail = document.getElementById('media-thumbnail');
const mediaPlayer = document.getElementById('audio-player');
const mediaPlayerSrc = document.getElementById('audio-player-src');
const mediaTitle = document.getElementById('media-title');
const mediaDesc = document.getElementById('media-description');

const mediaSeeker = document.getElementById('media-seeker');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');

const playlistDialog = document.getElementById('playlist');
const playlistDlgList = document.getElementById('playlist-list');

const queuelistDialog = document.getElementById('queuelist-dlg');
const queuelistDlgList = document.getElementById('queuelist-list');

const audioJsonUrl = "media/audio.json";

var nowPlayingItem = false;

var audioContent = {};
setAudioContent = function(content) {
  audioContent = content;
};


class MediaContent {
  constructor(qid, name, url) {
    let split_name = name.split(" - ");
    this.title = split_name[0];
    this.description = split_name[1];
    this.url = url;
    this.qid = qid;
  }

  play(){
    mediaPlayerSrc.src = this.url;
    mediaPlayer.load();
    mediaTitle.innerHTML = this.title;
    mediaDesc.innerHTML = this.description;
  }
}

const playByElement = (elem) => {
  let mediaName = elem.getAttribute('data-name');
  let mediaUrl = elem.getAttribute('data-url');
  let inList = elem.getAttribute('data-list');
  let qid = -1;
  if (elem.getAttributeNames().includes('data-qid')) {
    qid = elem.getAttribute('data-qid');
  }
  let contentToPlay = new MediaContent(qid, mediaName, mediaUrl);
  // playlistDialog.style.display = 'none';
  mediaPlayer.pause();
  mediaPlayer.currentTime = 0;
  contentToPlay.play();
  mediaPlayer.play();
};

const playNow = (mediaId) => {
  let liElement = document.getElementById(mediaId);
  playByElement(liElement);
  nowPlayingItem = liElement;
};

const playNext = () => {
  if (!nowPlayingItem) {
    console.log("No queued list or playlist in action.");
    return;
  }
  let liElement = nowPlayingItem.nextElementSibling;
  if (liElement) {
    playByElement(liElement);
    nowPlayingItem = liElement;
  }
}

const prepareMediaId = (idx) => {
  return `media-${idx}`;
};

const queueAdd = (mediaId) => {
  console.log(`Queue Add: ${mediaId}`);
  let queuedCount = queuelistDlgList.getElementsByClassName('media-list-entry').length;
  let liElement = document.getElementById(mediaId);
  playlistDlgList.removeChild(liElement);
  // update li
  let mediaListQueueAdd = liElement.getElementsByClassName('media-list-queueadd')[0];
  mediaListQueueAdd.className = 'media-list-queuerm';
  mediaListQueueAdd.onclick = () => { queueRemove(`${mediaId}`); };
  let queueRmHtml = `<svg class="media-list-removebtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 512A256 256 0 1 0 256 0a256 256 0 1 0 0 512zM184 232l144 0c13.3 0 24 10.7 24 24s-10.7 24-24 24l-144 0c-13.3 0-24-10.7-24-24s10.7-24 24-24z"/></svg>`;
  mediaListQueueAdd.innerHTML = queueRmHtml;
  liElement.getElementsByClassName('media-list-queueadd')[0] = mediaListQueueAdd;
  liElement.setAttribute("data-qid", queuedCount);
  liElement.setAttribute("data-list", "queued");
  queuelistDlgList.appendChild(liElement);
};

const queueRemove = (mediaId) => {
  console.log(`Queue Remove: ${mediaId}`);
  let liElement = document.getElementById(mediaId);
  queuelistDlgList.removeChild(liElement);
  // update li
  let mediaListQueueRm = liElement.getElementsByClassName('media-list-queuerm')[0];
  mediaListQueueRm.className = 'media-list-queueadd';
  mediaListQueueRm.onclick = () => { queueAdd(`${mediaId}`); };
  let queueAddHtml = `<svg class="media-list-queuebtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>`;
  mediaListQueueRm.innerHTML = queueAddHtml;
  liElement.getElementsByClassName('media-list-queueadd')[0] = mediaListQueueRm;
  liElement.setAttribute("data-list", "playlist");
  playlistDlgList.appendChild(liElement);
};

function createPlaylistEntryNode(adoIdx, ado) {
  let mediaId = prepareMediaId(adoIdx);
  let li = document.createElement('li');
  li.className = 'media-list-entry';
  li.setAttribute("id", mediaId);
  li.setAttribute("data-name", ado);
  li.setAttribute("data-url", audioContent[ado]);
  let lineHTML = `<div class="media-list-playnow" onclick="playNow('${mediaId}');">
      <svg class="media-list-playbtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
    </div>
    <div class="media-list-queueadd" onclick="queueAdd('${mediaId}');">
      <svg class="media-list-queuebtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32l0 144L48 224c-17.7 0-32 14.3-32 32s14.3 32 32 32l144 0 0 144c0 17.7 14.3 32 32 32s32-14.3 32-32l0-144 144 0c17.7 0 32-14.3 32-32s-14.3-32-32-32l-144 0 0-144z"/></svg>
    </div> ${ado}`;
  li.innerHTML = lineHTML;
  return li;
}

function changeListEntryToQueue(mediaId, liElement) {
  return;
}

const request = new XMLHttpRequest();
try {
  request.open("GET", audioJsonUrl);
  request.responseType = "json";
  request.addEventListener("load", () => {
      // audioContent = JSON.parse(request.response);
      setAudioContent(request.response);
      let adoIdx = 0;
      for (ado in audioContent) {
        adoIdx += 1;
        console.log(adoIdx, ado);
        let li = createPlaylistEntryNode(adoIdx, ado);
        playlistDlgList.appendChild(li);
      }

      let firstSongKey = Object.keys(audioContent)[0];
      let contentToPlay = new MediaContent(-1, firstSongKey, audioContent[firstSongKey]);
      console.log(contentToPlay);
      contentToPlay.play();
  });
  request.addEventListener("error", () => console.error("XHR error"));
  request.send();
} catch (error) {
  console.error(`XHR error ${request.status}`);
}


var syncTheSeeker = false;
var syncTheSeekerTimer;

mediaPlayer.addEventListener('play', () => {
  mediaThumbnail.src = 'img/music.gif';
  btnPause.style.display = 'block';
  btnPlay.style.display = 'none';
  if (syncTheSeekerTimer) {
    clearInterval(syncTheSeekerTimer);
  }
  syncTheSeekerTimer = setInterval(() => {
      mediaSeeker.value = mediaPlayer.currentTime;
      if (syncTheSeeker) {
        clearInterval(syncTheSeekerTimer);
      }
    }, 500);
});

mediaPlayer.addEventListener('pause', () => {
  mediaThumbnail.src = 'img/vinyl-music-static.png';
  btnPause.style.display = 'none';
  btnPlay.style.display = 'block';
});

mediaPlayer.addEventListener('ended', () => {
  mediaThumbnail.src = 'img/vinyl-music-static.png';
  btnPause.style.display = 'none';
  btnPlay.style.display = 'block';
  playNext();
});

mediaPlayer.addEventListener('loadedmetadata', () => {
  console.log(`The duration of the video is ${mediaPlayer.duration} seconds.`);
  mediaSeeker.max = mediaPlayer.duration;
  mediaSeeker.value = mediaPlayer.currentTime;
});

mediaSeeker.addEventListener('change', () => {
  mediaPlayer.play();
  mediaPlayer.currentTime = mediaSeeker.value;
});

const playPause = function(){
  if (mediaPlayer.paused) {
    mediaPlayer.play();
  } else {
    mediaPlayer.pause();
  }
};

const playBackward = function() {
  mediaPlayer.currentTime -= 5;
};

const playForward = function() {
  mediaPlayer.currentTime += 5;
};

const showPlaylist = function() {
  playlistDialog.showModal();
};

const showQueueList = function() {
  queuelistDialog.showModal();
};


function logEvent(event) {
  console.log(`Media Event: ${event.type}\n`);
  console.log(event);
}
mediaPlayer.addEventListener("error", logEvent);
