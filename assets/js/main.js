// DOM elements
const recitersList = document.querySelector("[data-reciters-list]");
const inputReciterSearch = document.querySelector(
  "[data-input-reciter-search]"
);
// fetch reciters
const RECITERS_URL =
  "https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn_surah_audio.json";

const fetchReciters = async () => {
  try {
    const response = await fetch("assets/data/reciters.json");
    const data = await response.json();

    createReciterCards(data);
  } catch (error) {
    console.log("Error: " + error);
  }
};

// create reciter cards
const reciterImage = `<div class="reciter__image">
<img src="assets/images/reciters/alafasy.png"  loading="lazy" />
</div>`;
const createReciterCards = (data) => {
  data.forEach((reciter, idx) => {
    //   let { englishName, identifier } = reciter;
    const { name, identifier } = reciter;
    // remove the first 3 letters from the identifier
    //   identifier = identifier.substr(3, reciter.length);

    const reciterCard = `
          <a href="/reciter.html?id=${
            idx + 1
          }&reciter=${identifier}" class="reciter__link" data-identifier="${identifier}" data-name="${name}">
            <li class="reciter__card">
            <div class="reciter__image">
                <img src="assets/images/reciters/${identifier}.webp" loading="lazy" />
            </div>
              <div class="reciter__info">
                <div class="reciter__name">${name}</div>
                <div class="recite__type"></div>
              </div>
            </li>
          </a>`;

    recitersList.insertAdjacentHTML("beforeend", reciterCard);
  });

  // get all reciters
  const reciters = document.querySelectorAll(".reciter__link");
  reciters.forEach((reciter) => {
    reciter.addEventListener("click", () => {
      localStorage.setItem("reciterName", reciter.dataset.name);
    });
  });
  // call the search reciters
  searchReciter(reciters);
};

// search reciter
const searchReciter = (reciters) => {
  reciters.forEach((reciter) => {
    const reciterIdentifier = reciter.dataset.identifier.toLowerCase();
    const reciterName = reciter.dataset.name.toLowerCase();

    inputReciterSearch.addEventListener("input", (e) => {
      const searchValue = e.target.value;
      if (
        reciterIdentifier.includes(searchValue) ||
        reciterName.includes(searchValue)
      ) {
        reciter.style.display = "";
      } else {
        reciter.style.display = "none";
      }
    });
  });
};

// fetch the reciters
fetchReciters();
