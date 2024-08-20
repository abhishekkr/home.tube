const mediaThumbnail = document.getElementById('media-thumbnail');
const mediaPlayer = document.getElementById('media-player');

const mediaSeeker = document.getElementById('media-seeker');
const btnPlay = document.getElementById('btn-play');
const btnPause = document.getElementById('btn-pause');

let syncTheSeeker = false;

mediaPlayer.addEventListener('play', () => {
  mediaThumbnail.src = 'img/music.gif';
  btnPause.style.display = 'block';
  btnPlay.style.display = 'none';
  mediaSeeker.max = mediaPlayer.duration;
  var syncTheSeekerTimer = setInterval(() => {
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
  console.log('Media metadata loaded.');
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

mediaPlayer.addEventListener("loadstart", logEvent);
mediaPlayer.addEventListener("loadedmetadata", logEvent);
mediaPlayer.addEventListener("progress", logEvent);
mediaPlayer.addEventListener("canplay", logEvent);
mediaPlayer.addEventListener("canplaythrough", logEvent);
mediaPlayer.addEventListener("seeked", logEvent);
mediaPlayer.addEventListener("seeking", logEvent);
mediaPlayer.addEventListener("error", logEvent);
