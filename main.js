let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

// Create new audio element
let curr_track = document.createElement('audio');

// Define the tracks that have to be played
// pic prefers to be 250x250, depends on pnglog.com
// music depends on www.joy127.com
let track_list = [
  {
    name: "小さな海",
    artist: "後藤ひとり",
    image: "https://cdn-us.imgs.moe/2024/08/14/1_eTUKw51TqJ.jpg",
    path: "https://www.joy127.com/url/113350.mp3",
    color: "rgba(238,111,154,0.8)",
    //path30: "https://link.hhtjim.com/163/2003496924.mp3",
    //path1: "https://m10.music.126.net/20240813213529/3abdd36167e0ed40900f94af46cae55e/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/23504259304/0739/5421/3576/0384e5100d83158a85a52fa0df45f71b.mp3",
    //path2: "https://webfs.hw.kugou.com/202408132115/9f6ed55e0459ea572efc4ff24c83a7ca/v3/18438e543e4f6743686ccc14f85af089/yp/p_0_960127/ap1014_us0_mii0w1iw8z2ai2iphcu80ooo2ki81120_pi406_mx471820523_s2249124648.mp3"
  },
  {
    name: "なにが悪い",
    artist: "伊地知虹夏",
    image: "https://cdn-us.imgs.moe/2024/08/14/2_rlEb9ZS3wn.jpg",
    path:"https://www.joy127.com/url/113355.mp3",
    color: "rgba(247,180,26,0.8)",
    //path30: "https://link.hhtjim.com/163/1996323629.mp3",
    //path1: "https://files.freemusicarchive.org/storage-freemusicarchive-org/music/no_curator/Tours/Enthusiast/Tours_-_01_-_Enthusiast.mp3",
    //path2: "https://webfs.hw.kugou.com/202408132119/abf22dbbeacdf470651a822e5b0872a1/v3/2440f326527ce1328947f1ae8a18426b/yp/p_0_960129/ap1014_us0_mii0w1iw8z2ai2iphcu80ooo2ki81120_pi406_mx465082121_s2426868387.mp3"
  },
  {
    name: "カラカラ",
    artist: "山田リョウ",
    color: "rgba(26,123,194,0.8)",
    image: "https://cdn-us.imgs.moe/2024/08/14/3_hKLFMkrNpQ.jpg",
    path: "https://www.joy127.com/url/113351.mp3",
    path30: "https://link.hhtjim.com/163/1988861403.mp3",
  },
  {
    name: "ラブソングが歌えない",
    artist: "喜多郁代",
    color: "rgba(232,25,91,0.8)",
    image: "https://cdn-us.imgs.moe/2024/08/14/4_Bw9GOIya5y.jpg",
    path: "https://www.joy127.com/url/113352.mp3",
    path30: "https://link.hhtjim.com/163/2003496501.mp3",
  },
  {
    name: "ギターと孤独と蒼い惑星",
    artist: "結束バンド",
    color: "rgba(1,1,1,0.3)",
    image: "https://cdn-us.imgs.moe/2024/08/14/0_M68ZYhGuly.jpg",
    path: "https://www.joy127.com/url/113349.mp3",
    //path30: "https://link.hhtjim.com/163/1991012773.mp3",
    //path1: "https://m10.music.126.net/20240813205342/f6c2b4a84148ef545240e59439faec7b/ymusic/obj/w5zDlMODwrDDiGjCn8Ky/21822524190/5ae3/21e7/d62f/81b9fb8d6985317d49b31978903783cf.mp3",
    //path2: "https://webfs.tx.kugou.com/202408132049/460f53b6af79845be075d72348f994ba/v3/6414aa117e7ae275a524610f09907873/yp/p_0_960153/ap1014_us0_mi87a715d64b59c90143a274dafd5c1f01_pi406_mx457770753_s1063625965.mp3"
  },
  {
    name: "星座になれたら",
    artist: "結束バンド",
    color: "rgba(1,1,1,0.3)",
    image: "https://cdn-us.imgs.moe/2024/08/14/0_M68ZYhGuly.jpg",
    path: "https://www.joy127.com/url/113354.mp3",
  },
];

function random_bg_color() {

  // Get a number between 64 to 256 (for getting lighter colors)
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  // Construct a color withe the given values
  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  // Set the background to that color
  document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  //random_bg_color();
  document.body.style.background = track_list[track_index].color;
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

// Load the first track in the tracklist
loadTrack(track_index);

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';;
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}
// 获取URL中的参数
let params = new URLSearchParams(window.location.search);

// 获取type参数的值
let type = params.get('type');

// 根据type的值选择一开始显示的歌曲
if (type !== null) {
    track_index = parseInt(type)-1;
    loadTrack(track_index);
}

