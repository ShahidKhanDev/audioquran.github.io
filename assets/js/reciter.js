// DOM elements
const reciterProfile = document.querySelector("[data-reciter-profile]");
const reciterTitleName = document.querySelector("[data-reciter-name]");
const chaptersList = document.querySelector("[data-chapters-list]");
const inputChapterSearch = document.querySelector(
  "[data-input-chapter-search]"
);
const audioPlayer = document.querySelector("[data-audio-player]");
const masterPlayBtn = document.querySelector("[data-master-play-btn]");
const masterPlayBtnIcon = masterPlayBtn.firstElementChild;
const audioInputRange = document.querySelector("[data-audio-input-range]");
const audioStartTimeElem = document.querySelector("[data-audio-start-time]");
const audioEndTimeElem = document.querySelector("[data-audio-end-time]");

// style the audio input range
audioInputRange.style.background = `linear-gradient(90deg, #000000,  ${audioInputRange.value}%, #e2e2e2 0%)`;

// get the reciter id from the URL
const getReciterId = () => {
  const urlParams = new URLSearchParams(window.location.search);

  return {
    id: urlParams.get("id"),
    name: urlParams.get("reciter"),
  };
};

const reciterId = getReciterId().id;
const reciterName = getReciterId().name;

// get the reciter profile image and name
reciterProfile.src = `assets/images/reciters/${reciterName}.webp`;
reciterTitleName.innerText = localStorage.getItem("reciterName");

// fetch chapters
const fetchChapters = async () => {
  try {
    const response = await fetch("assets/data/chapters.json");
    const data = await response.json();

    createChapterCards(data);
  } catch (error) {
    console.log("Error: " + error);
  }
};

// create chapter cards
const createChapterCards = (data) => {
  data.forEach((chapter) => {
    const { id, name, translation, transliteration } = chapter;

    const chapterCard = `
        <li class="chapter__card" id="${id}" data-name="${transliteration}" onclick="playAudio(this)">
            <div class="chapter__left">
              <span class="material-icons play-icon">play_arrow</span>
              <div class="chapter__details">
                <span class="chapter__num">${id}.</span>
                <span class="chapter__name">${translation}</span>
                <div class="ar__name">${name}</div>
              </div>
            </div>

            <div class="chapter__righ-btns">
              <button class="link-copy-btn" onclick="copyLink(event)">
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10 13a5.001 5.001 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                  <path
                    d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>

              <button class="chapter-download-btn" id="${id}" onclick="downloadAudio(event)">
                <svg
                  width="15"
                  height="15"
                  viewBox="0 0 15 15"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.5 1.05a.45.45 0 0 1 .45.45v6.914l2.232-2.232a.45.45 0 1 1 .636.636l-3 3a.45.45 0 0 1-.636 0l-3-3a.45.45 0 1 1 .636-.636L7.05 8.414V1.5a.45.45 0 0 1 .45-.45ZM2.5 10a.5.5 0 0 1 .5.5V12c0 .554.446 1 .996 1h7.005A.999.999 0 0 0 12 12v-1.5a.5.5 0 0 1 1 0V12c0 1.104-.894 2-1.999 2H3.996A1.997 1.997 0 0 1 2 12v-1.5a.5.5 0 0 1 .5-.5Z"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </div>
        </li>  `;

    chaptersList.insertAdjacentHTML("beforeend", chapterCard);
  });
  const chapters = document.querySelectorAll(".chapter__card");

  searchChapters(chapters);
};

// search chapters
const searchChapters = (chapters) => {
  chapters.forEach((chapter) => {
    const chapterId = chapter.id;
    const chapterNameWithChar = chapter.dataset.name.toLowerCase();
    const chapterNameWithoutChar = chapter.dataset.name
      .replace("-", "")
      .toLowerCase();
    const chapterNameWithSpace = chapter.dataset.name
      .replace("-", " ")
      .toLowerCase();

    inputChapterSearch.addEventListener("input", (e) => {
      const searchValue = e.target.value;
      if (
        chapterId.includes(searchValue) ||
        chapterNameWithChar.includes(searchValue) ||
        chapterNameWithoutChar.includes(searchValue) ||
        chapterNameWithSpace.includes(searchValue)
      ) {
        chapter.style.display = "";
      } else {
        chapter.style.display = "none";
      }
    });
  });
};

// play audio
let audio = new Audio("");

masterPlayBtn.addEventListener("click", () => {
  audio.paused || audio.currentTime <= 0 ? handlePlay() : handlePause();
});

const handlePlay = () => {
  audio.play();
  masterPlayBtn.classList.add("playing");

  // change all chapter icons to play except the target chapter
  chaptersList
    .querySelectorAll(".play-icon")
    .forEach((icon) => (icon.innerText = "play_arrow"));

  const targetChapter = chaptersList.querySelector(
    `[id="${masterPlayBtn.dataset.chapterId}"]`
  );

  targetChapter.querySelector(".play-icon").innerText = "pause";
};

const handlePause = () => {
  audio.pause();
  masterPlayBtn.classList.remove("playing");

  // change all chapter icons to play
  chaptersList
    .querySelectorAll(".play-icon")
    .forEach((icon) => (icon.innerText = "play_arrow"));
};

const playAudio = (chapter) => {
  // show the audio player
  audioPlayer.classList.add("show");
  // set the chapter id to the master play btn
  masterPlayBtn.setAttribute("data-chapter-id", chapter.id);
  // change all chapter icons to play
  chaptersList
    .querySelectorAll(".play-icon")
    .forEach((icon) => (icon.innerText = "play_arrow"));

  // Pause the existing audio playback if it's playing
  if (!audio.paused) {
    handlePause();
  }

  const chapterId = chapter.id;

  const URL = `https://cdn.islamic.network/quran/audio-surah/128/ar.${reciterName}/${chapterId}.mp3`;

  audio.src = URL;

  //   add the loading class to the master play btn
  masterPlayBtn.classList.add("loading", "playing");
  // Wait for the new audio source to load before triggering playback
  audio.addEventListener("loadedmetadata", () => {
    masterPlayBtn.click();
    masterPlayBtn.classList.remove("loading");
    // audio end time
    const minEnd = formatNumber(Math.floor(audio.duration / 60));
    const secEnd = formatNumber(Math.floor(audio.duration % 60));

    audioEndTimeElem.innerText = `${minEnd}:${secEnd}`;
  });
};

// download audio
const downloadAudio = (event) => {
  event.stopPropagation();
  const downloadBtn = event.currentTarget;

  const chapterId = downloadBtn.id;

  const url = `https://cdn.islamic.network/quran/audio-surah/128/ar.${reciterName}/${chapterId}.mp3`;

  const a = document.createElement("a");
  a.download = chapterId;
  a.href = url;
  a.click();
  a.remove();
};

// copy link
const copyLink = (event) => {
  event.stopPropagation();
  const copyBtn = event.currentTarget;
  console.log(copyBtn);
};

// audio and audio input range events
audio.addEventListener("loadstart", () => {
  audioInputRange.value = 0;
  audioInputRange.style.background = `linear-gradient(90deg, #000000,  ${audioInputRange.value}%, #e2e2e2 0%)`;
  audioEndTimeElem.innerText = "00:00";
});

audio.addEventListener("timeupdate", () => {
  const currentTime = audio.currentTime;
  const duration = audio.duration;

  audioInputRange.value = (currentTime / duration) * 100;
  audioInputRange.style.background = `linear-gradient(90deg, #000000,  ${audioInputRange.value}%, #e2e2e2 0%)`;

  // audio start time
  const minStart = formatNumber(Math.floor(currentTime / 60));
  const secStart = formatNumber(Math.floor(currentTime % 60));

  audioStartTimeElem.innerText = `${minStart}:${secStart}`;

  // audio end time
  const minEnd = formatNumber(Math.floor(duration / 60));
  const secEnd = formatNumber(Math.floor(duration % 60));

  audioEndTimeElem.innerText = `${minEnd}:${secEnd}`;

  // getAudioTime(currentTime, duration);
});

// const getAudioTime = (currentTime, duration) => {
//   // audio start time
//   const minStart = formatNumber(Math.floor(currentTime / 60));
//   const secStart = formatNumber(Math.floor(currentTime % 60));

//   audioStartTimeElem.innerText = `${minStart}:${secStart}`;

//   // audio end time
//   const minEnd = formatNumber(Math.floor(duration / 60));
//   const secEnd = formatNumber(Math.floor(duration % 60));

//   audioEndTimeElem.innerText = `${minEnd}:${secEnd}`;
// };

audio.addEventListener("ended", () => {
  handlePause();
  audioInputRange.style.background = `linear-gradient(90deg, #000000,  ${audioInputRange.value}%, #e2e2e2 0%)`;
});

audioInputRange.addEventListener("input", () => {
  audioInputRange.style.background = `linear-gradient(90deg, #000000,  ${audioInputRange.value}%, #e2e2e2 0%)`;

  audio.currentTime = (audioInputRange.value / 100) * audio.duration;
});

// format number
const formatNumber = (n) => (n > 9 ? n : "0" + n);

// fetch chapters
fetchChapters();
