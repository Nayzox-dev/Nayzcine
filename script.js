document.addEventListener("DOMContentLoaded", async () => {
  const filmURL = "fsa-film.json";
  const serieURL = "fsa-serie.json";
  const animeURL = "fsa-anime.json";

  const filmsContainer = document.getElementById("films");
  const seriesContainer = document.getElementById("series");
  const animesContainer = document.getElementById("animes");
  const newReleasesContainer = document.getElementById("new-releases");
  const searchInput = document.getElementById("search");
  const searchResults = document.getElementById("search-results");
  const popup = document.getElementById("popup");
  const popupContent = document.getElementById("popup-content");

  const displayedTitles = new Set();
  let allData = [];

  function cleanTitle(title) {
    return title
      .toLowerCase()
      .replace(/saison\s*\d+/gi, "")
      .replace(/s\d+/gi, "")
      .replace(/épisode\s*\d+/gi, "")
      .replace(/ep\d+/gi, "")
      .replace(/episode\s*\d+/gi, "")
      .replace(/\d+$/, "")
      .trim();
  }

  function extractLink(description) {
    if (!description) return null;
    const match = description.match(/https:\/\/uqload\.net\/embed-[\w\d]+\.html/);
    return match ? match[0] : null;
  }

  function extractEpisodes(description) {
    if (!description) return [];
    const matches = [...description.matchAll(/https:\/\/(mega\.nz|uqload\.net)\/[^\s]+/g)];
    return matches.map(m => m[0]);
  }

  async function fetchData(url) {
    const res = await fetch(url);
    return await res.json();
  }

  function shuffleArray(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  function openPopup(title, episodes) {
    popupContent.innerHTML = `
      <h3 class="popup-title">${title}</h3>
      <div class="episode-buttons"></div>
      <button class="popup-close-btn" id="popup-close-inside">Fermer</button>
    `;

    const buttonsContainer = popupContent.querySelector(".episode-buttons");

    episodes.forEach((url, index) => {
      const btn = document.createElement("button");
      btn.classList.add("episode-btn");
      btn.textContent = `Lien ${index + 1}`;

      btn.addEventListener("click", () => {
        if (url.includes("uqload.net")) {
          const redirectURL = `film.html?title=${encodeURIComponent(`${title} - Épisode ${index + 1}`)}&link=${encodeURIComponent(url)}`;
          window.location.href = redirectURL;
        } else {
          window.open(url, "_blank");
        }
      });

      buttonsContainer.appendChild(btn);
    });

    popup.style.display = "flex";

    document.getElementById("popup-close-inside").addEventListener("click", () => {
      popup.style.display = "none";
    });
  }

  function createCard(item) {
    const card = document.createElement("div");
    card.classList.add("movie-card");

    const img = document.createElement("img");
    img.onerror = () => card.remove();
    img.src = item.media;

    const title = document.createElement("h3");
    title.textContent = item.title;

    card.append(img, title);

    card.addEventListener("click", () => {
      if (item.category === "film" && item.link) {
        const url = `film.html?title=${encodeURIComponent(item.title)}&link=${encodeURIComponent(item.link)}`;
        window.location.href = url;
      } else if (item.category === "serie" && item.episodes?.length > 1) {
        openPopup(item.title, item.episodes);
      } else if (item.category === "anime") {
        const episodes = extractEpisodes(item.description);
        if (episodes.length > 1) {
          openPopup(item.title, episodes);
        } else if (episodes.length === 1) {
          const url = episodes[0];
          if (url.includes("uqload.net")) {
            const redirectURL = `film.html?title=${encodeURIComponent(item.title)}&link=${encodeURIComponent(url)}`;
            window.location.href = redirectURL;
          } else {
            window.open(url, "_blank");
          }
        } else {
          alert("Aucun lien disponible pour cet animé.");
        }
      }
    });

    return card;
  }

  function renderList(container, items) {
    container.innerHTML = "";
    items.forEach(item => {
      const title = item.title?.trim().toLowerCase();
      if (!title || displayedTitles.has(title)) return;
      if (!item.media || item.media.trim() === "") return;

      container.appendChild(createCard(item));
      displayedTitles.add(title);
    });
  }

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim().toLowerCase();
    searchResults.innerHTML = "";

    if (!query) {
      searchResults.style.display = "none";
      return;
    }

    const results = allData.filter(item =>
      item.title?.toLowerCase().includes(query)
    );

    results.forEach(item => {
      if (!item.media || item.media.trim() === "") return;

      const row = document.createElement("div");
      row.classList.add("search-item");

      const thumb = document.createElement("img");
      thumb.onerror = () => row.remove();
      thumb.src = item.media;
      thumb.classList.add("small-thumbnail");

      const name = document.createElement("span");
      name.textContent = item.title;

      row.append(thumb, name);

      row.addEventListener("click", () => {
        if (item.category === "film" && item.link) {
          const url = `film.html?title=${encodeURIComponent(item.title)}&link=${encodeURIComponent(item.link)}`;
          window.location.href = url;
        } else if (item.category === "serie" && item.episodes?.length > 1) {
          openPopup(item.title, item.episodes);
        } else if (item.category === "anime") {
          const episodes = extractEpisodes(item.description);
          if (episodes.length > 1) {
            openPopup(item.title, episodes);
          } else if (episodes.length === 1) {
            const url = episodes[0];
            if (url.includes("uqload.net")) {
              const redirectURL = `film.html?title=${encodeURIComponent(item.title)}&link=${encodeURIComponent(url)}`;
              window.location.href = redirectURL;
            } else {
              window.open(url, "_blank");
            }
          } else {
            alert("Aucun lien disponible pour cet animé.");
          }
        }
      });

      searchResults.appendChild(row);
    });

    searchResults.style.display = searchResults.children.length ? "flex" : "none";
  });

  const [films, series, animes] = await Promise.all([
    fetchData(filmURL),
    fetchData(serieURL),
    fetchData(animeURL),
  ]);

  films.forEach(f => {
    f.category = "film";
    f.link = extractLink(f.description);
  });

  series.forEach(s => {
    s.category = "serie";
    s.episodes = extractEpisodes(s.description);
  });

  animes.forEach(a => {
    a.category = "anime";
  });

  allData = [...films, ...series, ...animes];

  const newReleases = allData
    .filter(item => item.date && item.media && item.title)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(item => !displayedTitles.has(item.title.trim().toLowerCase()))
    .slice(0, 20);

  renderList(newReleasesContainer, newReleases);

  renderList(
    filmsContainer,
    shuffleArray(films).filter(f => !displayedTitles.has(f.title.trim().toLowerCase())).slice(0, 20)
  );

  const seenSeries = new Set();
  renderList(
    seriesContainer,
    shuffleArray(series).filter(s => {
      const base = cleanTitle(s.title);
      if (seenSeries.has(base)) return false;
      seenSeries.add(base);
      return !displayedTitles.has(s.title.trim().toLowerCase());
    }).slice(0, 20)
  );

  const seenAnimes = new Set();
  renderList(
    animesContainer,
    shuffleArray(animes).filter(a => {
      const base = cleanTitle(a.title);
      if (seenAnimes.has(base)) return false;
      seenAnimes.add(base);
      return !displayedTitles.has(a.title.trim().toLowerCase());
    }).slice(0, 20)
  );
});
