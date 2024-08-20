const mediaThumbnail = document.getElementById('media-thumbnail');
const mediaPlayer = document.getElementById('media-player');
const mediaPlayerSrc = document.getElementById('media-player-src');
const mediaTitle = document.getElementById('media-title');
const mediaDesc = document.getElementById('media-description');

const mediaSeeker = document.getElementById('media-seeker');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');

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

var audioContent = {};
var contentToPlay;
const request = new XMLHttpRequest();
try {
  request.open("GET", "media/audio.json");
  request.responseType = "json";
  request.addEventListener("load", () => {
      // audioContent = JSON.parse(request.response);
      audioContent = request.response;
      for (ado in audioContent) {
        console.log(ado);
        contentToPlay = new MediaContent(ado, audioContent[ado]);
        break;
        // all will be managed later; when Selection/Playlist is in play
      }
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


function logEvent(event) {
  console.log(`Media Event: ${event.type}\n`);
  console.log(event);
}
mediaPlayer.addEventListener("error", logEvent);
