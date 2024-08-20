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

const audioJsonUrl = "media/audio.json";

var audioContent = {};
setAudioContent = function(content) {
  audioContent = content;
};


class MediaContent {
  constructor(name, url) {
    let split_name = name.split(" - ");
    this.title = split_name[0];
    this.description = split_name[1];
    this.url = url;
  }

  play(){
    mediaPlayerSrc.src = this.url;
    mediaPlayer.load();
    mediaTitle.innerHTML = this.title;
    mediaDesc.innerHTML = this.description;
  }
}

const playnow = (adoKey) => {
    let contentToPlay = new MediaContent(adoKey, audioContent[adoKey]);
    console.log(contentToPlay);
    // playlistDialog.style.display = 'none';
    contentToPlay.play();
    mediaPlayer.play();
};

function createPlaylistEntryNode(adoIdx, ado) {
  let li = document.createElement('li');
  li.className = 'playlist-entry';
  li.setAttribute("id", "audio-"+adoIdx);
  li.setAttribute("data-url", audioContent[ado]);
  let lineHTML = `<div class="playlist-playnow" onclick="playnow('${ado}');">
      <svg class="playlist-playbtn" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--!Font Awesome Free 6.6.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.--><path d="M0 256a256 256 0 1 1 512 0A256 256 0 1 1 0 256zM188.3 147.1c-7.6 4.2-12.3 12.3-12.3 20.9l0 176c0 8.7 4.7 16.7 12.3 20.9s16.8 4.1 24.3-.5l144-88c7.1-4.4 11.5-12.1 11.5-20.5s-4.4-16.1-11.5-20.5l-144-88c-7.4-4.5-16.7-4.7-24.3-.5z"/></svg>
    </div> ${ado}`;
  li.innerHTML = lineHTML;
  return li;
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
      let contentToPlay = new MediaContent(firstSongKey, audioContent[firstSongKey]);
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


function logEvent(event) {
  console.log(`Media Event: ${event.type}\n`);
  console.log(event);
}
mediaPlayer.addEventListener("error", logEvent);
