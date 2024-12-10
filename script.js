console.log("welcome to spotify");

// Variables
let songIndex = 0;
let audioElement = new Audio('1.mp3');
let masterplay = document.getElementById('masterplay');
let bar = document.getElementById('bar');
let next = document.getElementById('next');
let prev = document.getElementById('previous');
let bottomimg = document.getElementById('bottomimg');
let currname = document.querySelector('.currname');
let currimg = document.getElementById('currimg');
let songDivs = document.querySelectorAll('.song');
let addSongIcon = document.getElementById('addSongIcon');
let popupOverlay = document.getElementById('popupOverlay');
let closePopup = document.getElementById('closePopup');
let songDivsContainer = document.querySelector('.items'); // Reference to the song container

let songs = [
    { name: "Believer", path: "1.mp3", cover: "album.jpg" },
    { name: "Another Love", path: "2.mp3", cover: "anotherlove.jpeg" },
    { name: "Falling", path: "3.mp3", cover: "falling.jpeg" },
    { name: "Starboy", path: "4.mp3", cover: "starboy.jpg" },
    { name: "Memories", path: "5.mp3", cover: "memories.png" }
];

// Play/Pause/Next/Previous
masterplay.addEventListener('click', () => {
    if (audioElement.paused || audioElement.currentTime <= 0) {
        audioElement.play().catch(error => console.error("Audio play failed:", error));
        masterplay.src = "pause.png";
    } else {
        audioElement.pause();
        masterplay.src = "play.png";
    }
});

// Update seek bar as the song plays
audioElement.addEventListener('timeupdate', () => {
    let progress = (audioElement.currentTime / audioElement.duration) * 100;
    bar.value = progress; // Update the range input value
});

// Seek functionality: Allow users to change song position
bar.addEventListener('input', () => {
    let seekTime = (bar.value / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
});

// Handle when the song ends
audioElement.addEventListener('ended', () => {
    masterplay.src = "play.png"; // Reset to play icon when song ends
});

// Play a song
function playsong(index) {
    audioElement.src = songs[index].path;
    audioElement.play();
    masterplay.src = "pause.png";
    bar.value = 0; // Reset the seek bar to 0
}

// Next song functionality
next.addEventListener('click', () => {
    songIndex = (songIndex + 1) % songs.length;
    playsong(songIndex);
    bottomimg.src = songs[songIndex].cover;
    currimg.src = songs[songIndex].cover;
    currname.innerText = songs[songIndex].name;
});

// Previous song functionality
prev.addEventListener('click', () => {
    songIndex = (songIndex - 1 + songs.length) % songs.length;
    playsong(songIndex);
    bottomimg.src = songs[songIndex].cover;
    currimg.src = songs[songIndex].cover;
    currname.innerText = songs[songIndex].name;
});

// Song div click functionality
function attachSongClickEvents() {
    songDivs = document.querySelectorAll('.song'); // Update the songDivs NodeList
    songDivs.forEach((songDiv) => {
        songDiv.addEventListener('click', () => {
            songIndex = parseInt(songDiv.getAttribute('data-index'));
            playsong(songIndex);
            bottomimg.src = songs[songIndex].cover;
            currimg.src = songs[songIndex].cover;
            currname.innerText = songs[songIndex].name;
        });
    });
}

// Initial attachment of click events
attachSongClickEvents();

// Popup handling for adding new songs
addSongIcon.addEventListener('click', () => {
    popupOverlay.style.display = 'flex';
});

// Hide the popup when the close button is clicked
closePopup.addEventListener('click', () => {
    popupOverlay.style.display = 'none';
});

// Hide the popup if the user clicks outside the popup window
popupOverlay.addEventListener('click', (e) => {
    if (e.target === popupOverlay) {
        popupOverlay.style.display = 'none';
    }
});

// Handle form submission to add new songs
let uploadForm = document.getElementById('uploadForm');
uploadForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form values
    let mp3File = document.getElementById('mp3File').files[0];
    let songName = document.getElementById('songName').value;
    let artistName = document.getElementById('artistName').value;
    let coverImage = document.getElementById('coverImage').files[0];

    if (mp3File && songName && artistName && coverImage) {
        // Create object URLs for the song and cover image
        let songPath = URL.createObjectURL(mp3File);
        let coverPath = URL.createObjectURL(coverImage);

        // Add new song to the songs array
        songs.push({ name: songName, path: songPath, cover: coverPath });

        // Create a new song div
        let newSongDiv = document.createElement('div');
        newSongDiv.classList.add('song');
        newSongDiv.setAttribute('data-index', songs.length - 1);
        newSongDiv.innerHTML = `
            <div class="song-name">${songName}</div>
            <div class="artist-name">${artistName}</div>
            <img src="${coverPath}" class="dp">
        `;

        // Append the new song div to the container
        songDivsContainer.appendChild(newSongDiv);

        // Reattach click events to include the new song
        attachSongClickEvents();

        // Close the popup
        popupOverlay.style.display = 'none';

        // Reset the form
        uploadForm.reset();
    } else {
        alert('Please fill all fields and upload valid files.');
    }
});
