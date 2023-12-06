$(document).ready(function() {
  // Handle section visibility
  $("#navbarSupportedContent").on("click", "a", function(e) {
      e.preventDefault();

      // Hide all sections
      $("section").hide();

      // Show the section corresponding to the clicked nav item
      const sectionToShow = $(this).attr('href').substring(1);
      $('#' + sectionToShow).show();

      // Visual highlighting of the active link
      $('#navbarSupportedContent ul li').removeClass("active");
      $(this).parent().addClass('active');
  });

  // Show default section on page load
  $("#landing").show();
  
  // Add active class on page load based on URL
  var path = window.location.pathname.split("/").pop();
  if (path == '' || path == 'index.html') {
      $('#navbarSupportedContent ul li').first().addClass('active');
  } else {
      var target = $('#navbarSupportedContent ul li a[href="' + path + '"]');
      target.parent().addClass('active');
  }
});

// Code Musicplayer
let audio = document.getElementById('audio');
let playPauseBtn = document.getElementById('playPause');
let progress = document.getElementById('progressBar');
let volumeSlider = document.getElementById('volume-slider');
let forwardBtn = document.getElementById('next');
let backwardBtn = document.getElementById('prev');
let songList = document.getElementById('songList');
let songs = ['sound/79_Short_History.mp3', 'sound/1492_Short_History.mp3', 'sound/1793_Short_History.mp3', 'sound/1989_Short_History.mp3'];
let currentSong = 0;
let lastTimestamp = -1;

audio.src = songs[currentSong];

audio.addEventListener('timeupdate', updateProgress);
audio.addEventListener('ended', nextSong);

setSongTitle();

playPauseBtn.addEventListener('click', function() {
  if (audio.paused) {
      audio.play();
  } else {
      audio.pause();
  }
  playPauseBtn.classList.toggle("paused");
});

forwardBtn.addEventListener('click', nextSong);
backwardBtn.addEventListener('click', prevSong);

volumeSlider.addEventListener('change', function() {
  audio.volume = this.value / 100;
});

function setSongTitle() {
  let songName = songs[currentSong].split('/').pop().replace('.mp3', '');
  document.getElementById('song-title').textContent = songName;
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  console.log("Now playing:", audio.src);
  audio.play();
  setSongTitle();
}

function prevSong() {
  currentSong--;
  if (currentSong < 0) {
      currentSong = songs.length - 1;
  }
  audio.src = songs[currentSong];
  audio.play();
  setSongTitle();
}

function updateProgress() {
  if (audio.duration) {
      let ratio = audio.currentTime / audio.duration;
      progress.style.width = ratio * 100 + '%';
  }
}

const progressContainer = document.getElementById('progressContainer');

progressContainer.addEventListener('click', setProgress);

//Code for Progress Bar
function setProgress(e) {
  const width = this.clientWidth;
  const clickX = e.offsetX;
  const duration = audio.duration;

  audio.currentTime = (clickX / width) * duration;
  lastTimestamp = -1;
  updateImageDisplay();
}



// Populate the songList from the songs array
for(let i = 0; i < songs.length; i++) {
  let listItem = document.createElement('li');
  let songName = songs[i].split('/').pop().replace('.mp3', '');
  listItem.textContent = songName;
  listItem.id = "song" + i;  // Give each song an ID

  // Play the song when its name is clicked
  listItem.addEventListener('click', function() {
      currentSong = i;
      audio.src = songs[currentSong];
      audio.play();
      setSongTitle();
      highlightPlayingSong();
  });

  songList.appendChild(listItem);
}

// Function to highlight the currently playing song
function highlightPlayingSong() {
  // Remove highlight from all songs
  for(let i = 0; i < songs.length; i++) {
      document.getElementById('song' + i).style.backgroundColor = "";
  }

  // Highlight the current song
  document.getElementById('song' + currentSong).style.backgroundColor = "lightblue";
}

function nextSong() {
  currentSong = (currentSong + 1) % songs.length;
  audio.src = songs[currentSong];
  audio.play();
  setSongTitle();
  highlightPlayingSong();
  resetImageDisplay();
}

function prevSong() {
  currentSong--;
  if (currentSong < 0) {
      currentSong = songs.length - 1;
  }
  audio.src = songs[currentSong];
  audio.play();
  setSongTitle();
  highlightPlayingSong();
  resetImageDisplay();
}

// Highlight song when it starts playing
audio.addEventListener('play', highlightPlayingSong);

// Structuring timestamp-image mappings for each song
const songsImages = {
  '79_Short_History': [
      { time: 0, image: 'img/Claudius1.png' },
      { time: 42, image: 'img/Claudius2.png' },
      { time: 102, image: 'img/Claudius3.png' },
      { time: 154, image: 'img/Claudius4.png' }
  
  ],
  '1492_Short_History': [
      { time: 0, image: 'img/Diego1.png' },
      { time: 42, image: 'img/Diego2.png' },
      { time: 117, image: 'img/Diego3.png' },
      { time: 137, image: 'img/Diego4.png' }
     
  ],
  '1793_Short_History': [
    { time: 0, image: 'img/Camille1.png' },
    { time: 39, image: 'img/Camille2.png' },
    { time: 98, image: 'img/Camille3.png' },
    { time: 153, image: 'img/Camille4.png' }
    
  ],
  '1989_Short_History': [
  { time: 0, image: 'img/Frida1.png' },
  { time: 64, image: 'img/Frida2.png' }, 
  { time: 90, image: 'img/Frida3.png' },
  { time: 158, image: 'img/Frida4.png' }
  
  ],
};

audio.addEventListener('timeupdate', updateImageDisplay);

function updateImageDisplay() {
  const currentTime = audio.currentTime;
  const currentSongName = getCurrentSongName();

  if (songsImages[currentSongName]) {
      for (let i = 0; i < songsImages[currentSongName].length; i++) {
          let item = songsImages[currentSongName][i];
          if (currentTime >= item.time && item.time > lastTimestamp) {
              displayImage(item.image);
              lastTimestamp = item.time; // Update the lastTimestamp
              break; // Break the loop once the image is updated
          }
      }
  }
}

function displayImage(imagePath) {
  const bilderDiv = document.getElementById('bilder');
  bilderDiv.innerHTML = `<img src="${imagePath}" alt="Timed Image">`;
}

function resetImageDisplay() {
  lastTimestamp = -1; // Reset the lastTimestamp
  updateImageDisplay(); // Update the image display
}

function getCurrentSongName() {
  return songs[currentSong].split('/').pop().replace('.mp3', '');
}

