// StreamFlix Media Catalog (Ported directly from CatalogData.kt)
const catalog = [
  {
    id: "stranger-things",
    title: "Stranger Things",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=1200&auto=format&fit=crop&q=80",
    description: "When a young boy vanishes, a small town uncovers a mystery involving secret experiments, terrifying supernatural forces and one strange little girl.",
    matchScore: 98,
    rating: "TV-MA",
    year: 2024,
    durationOrSeasons: "4 Seasons",
    genres: ["Sci-Fi", "Suspenseful", "Mind-Bending", "Horror"],
    cast: ["Winona Ryder", "David Harbour", "Millie Bobby Brown", "Finn Wolfhard"],
    director: "The Duffer Brothers",
    badge: "TOP 10 IN TV SHOWS TODAY",
    isOriginal: true,
    isBillboard: true,
    episodes: [
      {
        id: "st-s4-e1",
        number: 1,
        title: "Chapter One: The Hellfire Club",
        duration: "1h 16m",
        description: "El struggles to fit in at school in California, while Mike and Dustin join a new D&D club. A strange new horror begins to terrorize Hawkins.",
        thumbnailUrl: "https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=500&auto=format&fit=crop&q=80"
      },
      {
        id: "st-s4-e2",
        number: 2,
        title: "Chapter Two: Vecna's Curse",
        duration: "1h 17m",
        description: "A plane brings Mike to California and a dead body brings Hawkins to a halt. Nancy starts digging for answers.",
        thumbnailUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=500&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "squid-game",
    title: "Squid Game",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=1200&auto=format&fit=crop&q=80",
    description: "Hundreds of cash-strapped players accept a strange invitation to compete in children's games. Inside, a tempting prize awaits with deadly high stakes.",
    matchScore: 99,
    rating: "TV-MA",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Thriller", "Suspense", "Dystopian", "Dark"],
    cast: ["Lee Jung-jae", "Park Hae-soo", "Wi Ha-jun"],
    director: "Hwang Dong-hyuk",
    badge: "#1 IN MOVIES & SHOWS",
    isOriginal: true,
    episodes: [
      {
        id: "sg-e1",
        number: 1,
        title: "Bread and Lottery",
        duration: "58m",
        description: "Determined to dismantle the deadly games, Gi-hun sets off on a perilous undercover pursuit with surprising new allies.",
        thumbnailUrl: "https://images.unsplash.com/photo-1534447677768-be436bb09401?w=500&auto=format&fit=crop&q=80"
      }
    ]
  },
  {
    id: "cyberpunk-edgerunners",
    title: "Cyberpunk: Edgerunners",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1578632767115-351597cf2477?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&auto=format&fit=crop&q=80",
    description: "In a dystopia riddled with corruption and cybernetic implants, a talented but reckless street kid strives to become an outlaw mercenary.",
    matchScore: 97,
    rating: "TV-MA",
    year: 2023,
    durationOrSeasons: "1 Season",
    genres: ["Anime", "Action", "Cyberpunk", "Sci-Fi"],
    cast: ["KENN", "Aoi Yuuki", "Hiroki Touchi"],
    director: "Hiroyuki Imaishi",
    badge: "CRITICS CHOICE",
    isOriginal: true
  },
  {
    id: "wednesday",
    title: "Wednesday",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1509281373149-e957c6296406?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1514539079130-25950c84af65?w=1200&auto=format&fit=crop&q=80",
    description: "Smart, sarcastic and a little dead inside, Wednesday Addams investigates a murder spree while making new friends and foes at Nevermore Academy.",
    matchScore: 96,
    rating: "TV-14",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Fantasy", "Dark Comedy", "Mystery", "Teen"],
    cast: ["Jenna Ortega", "Gwendoline Christie", "Riki Lindhome"],
    director: "Tim Burton",
    badge: "NEW SEASON COMING",
    isOriginal: true
  },
  {
    id: "glass-onion",
    title: "Glass Onion: A Knives Out Mystery",
    type: "MOVIE",
    posterUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    description: "World-famous detective Benoit Blanc heads to Greece to peel back the layers of a mystery surrounding a tech billionaire and his eclectic crew of friends.",
    matchScore: 94,
    rating: "PG-13",
    year: 2023,
    durationOrSeasons: "2h 19m",
    genres: ["Mystery", "Comedy", "Whodunit", "Witty"],
    cast: ["Daniel Craig", "Edward Norton", "Janelle Monáe"],
    director: "Rian Johnson",
    badge: "AWARD WINNER",
    isOriginal: true
  },
  {
    id: "arcane",
    title: "Arcane: League of Legends",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1563089145-599997674d42?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1511512578047-dfb367046420?w=1200&auto=format&fit=crop&q=80",
    description: "Amid the discord of twin cities Piltover and Zaun, two sisters fight on rival sides of a war between magic technologies and incompatible convictions.",
    matchScore: 99,
    rating: "TV-14",
    year: 2024,
    durationOrSeasons: "2 Seasons",
    genres: ["Animation", "Sci-Fi", "Action", "Steampunk"],
    cast: ["Hailee Steinfeld", "Ella Purnell", "Kevin Alejandro"],
    director: "Pascal Charrue",
    badge: "MASTERPIECE",
    isOriginal: true
  },
  {
    id: "money-heist",
    title: "Money Heist",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1518676590629-3dcbd9c5a5c9?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=1200&auto=format&fit=crop&q=80",
    description: "Eight thieves take hostages and lock themselves in the Royal Mint of Spain as a criminal mastermind manipulates the police to carry out his plan.",
    matchScore: 97,
    rating: "TV-MA",
    year: 2023,
    durationOrSeasons: "5 Parts",
    genres: ["Crime", "Thriller", "Suspenseful"],
    cast: ["Úrsula Corberó", "Álvaro Morte", "Itziar Ituño"],
    director: "Álex Pina",
    badge: "GLOBAL PHENOMENON",
    isOriginal: true
  },
  {
    id: "the-queens-gambit",
    title: "The Queen's Gambit",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1529699211952-734e80c4d42b?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=1200&auto=format&fit=crop&q=80",
    description: "In a 1950s orphanage, a young girl reveals an astonishing talent for chess and begins an unlikely journey to stardom while grappling with addiction.",
    matchScore: 98,
    rating: "TV-MA",
    year: 2022,
    durationOrSeasons: "Limited Series",
    genres: ["Drama", "Cerebral", "Intimate"],
    cast: ["Anya Taylor-Joy", "Bill Camp", "Marielle Heller"],
    director: "Scott Frank",
    badge: "EMMY WINNER",
    isOriginal: true
  },
  {
    id: "black-mirror",
    title: "Black Mirror",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=1200&auto=format&fit=crop&q=80",
    description: "This sci-fi anthology series explores a twisted, high-tech near-future where humanity's greatest innovations and darkest instincts collide.",
    matchScore: 95,
    rating: "TV-MA",
    year: 2024,
    durationOrSeasons: "6 Seasons",
    genres: ["Dystopian", "Sci-Fi", "Psychological"],
    cast: ["Jesse Plemons", "Cristin Milioti", "Jimmi Simpson"],
    director: "Charlie Brooker",
    badge: "MIND BENDING",
    isOriginal: true
  },
  {
    id: "extraction-2",
    title: "Extraction II",
    type: "MOVIE",
    posterUrl: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "Back from the brink of death, highly skilled commando Tyler Rake takes on another high-stakes mission: rescuing the battered family of a ruthless gangster.",
    matchScore: 92,
    rating: "R",
    year: 2023,
    durationOrSeasons: "2h 3m",
    genres: ["Action", "Thriller", "Adrenaline"],
    cast: ["Chris Hemsworth", "Golshifteh Farahani", "Idris Elba"],
    director: "Sam Hargrave",
    badge: "NON-STOP ACTION",
    isOriginal: true
  },
  {
    id: "red-notice",
    title: "Red Notice",
    type: "MOVIE",
    posterUrl: "https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=1200&auto=format&fit=crop&q=80",
    description: "An FBI profiler pursuing the world's most wanted art thief becomes his reluctant partner in crime to catch an elusive crook.",
    matchScore: 91,
    rating: "PG-13",
    year: 2022,
    durationOrSeasons: "1h 58m",
    genres: ["Action", "Comedy", "Heist"],
    cast: ["Dwayne Johnson", "Ryan Reynolds", "Gal Gadot"],
    director: "Rawson Marshall Thurber",
    badge: "BLOCKBUSTER",
    isOriginal: true
  },
  {
    id: "dark",
    title: "Dark",
    type: "TV_SHOW",
    posterUrl: "https://images.unsplash.com/photo-1509198397868-475647b2a1e5?w=800&auto=format&fit=crop&q=80",
    backdropUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&auto=format&fit=crop&q=80",
    description: "A missing child sets four families on a frantic hunt for answers as they unearth a mind-bending mystery that spans three generations.",
    matchScore: 99,
    rating: "TV-MA",
    year: 2021,
    durationOrSeasons: "3 Seasons",
    genres: ["Sci-Fi", "Time Travel", "Mystery"],
    cast: ["Louis Hofmann", "Oliver Masucci", "Jördis Triebel"],
    director: "Baran bo Odar",
    badge: "CRITICALLY ACCLAIMED",
    isOriginal: true
  }
];

// State
let currentActiveMedia = catalog[0];
let myList = JSON.parse(localStorage.getItem("streamflix_mylist") || "[]");

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  setupNavbarScroll();
  renderBillboard(catalog[0]);
  renderContentRows();
  updateMyListBadge();
});

// Navbar background on scroll
function setupNavbarScroll() {
  const navbar = document.getElementById("navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 40) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });
}

// Billboard rendering
function renderBillboard(item) {
  currentActiveMedia = item;
  document.getElementById("billboard-backdrop").style.backgroundImage = `url('${item.backdropUrl}')`;
  document.getElementById("billboard-title").textContent = item.title;
  document.getElementById("billboard-desc").textContent = item.description;
  document.getElementById("billboard-badge").textContent = item.badge || "STREAMFLIX ORIGINAL";
  document.getElementById("billboard-match").textContent = `${item.matchScore}% Match`;
  document.getElementById("billboard-rating").textContent = item.rating;
  document.getElementById("billboard-duration").textContent = item.durationOrSeasons;
  document.getElementById("billboard-genres").textContent = item.genres.slice(0, 3).join(" • ");

  updateBillboardMyListButton();
}

function updateBillboardMyListButton() {
  const btn = document.getElementById("billboard-mylist-btn");
  const isSaved = myList.includes(currentActiveMedia.id);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }
}

function toggleBillboardMyList() {
  toggleMediaInList(currentActiveMedia.id);
  updateBillboardMyListButton();
}

function playBillboard() {
  openVideoPlayer(currentActiveMedia.title);
}

function openBillboardDetail() {
  openMediaDetail(currentActiveMedia);
}

// Render dynamic rows
function renderContentRows() {
  const container = document.getElementById("main-content");
  container.innerHTML = "";

  const sections = [
    { title: "Trending Now", items: catalog },
    { title: "Top 10 in Your Country Today", items: catalog.slice(0, 8), isTop10: true },
    { title: "Popular TV Shows", items: catalog.filter(m => m.type === "TV_SHOW") },
    { title: "Blockbuster Movies", items: catalog.filter(m => m.type === "MOVIE") },
    { title: "Sci-Fi & Cyberpunk", items: catalog.filter(m => m.genres.some(g => g.includes("Sci-Fi") || g.includes("Cyberpunk"))) },
    { title: "Action & Thrillers", items: catalog.filter(m => m.genres.some(g => g.includes("Action") || g.includes("Thriller"))) }
  ];

  sections.forEach((sec, idx) => {
    if (sec.items.length === 0) return;

    const secEl = document.createElement("section");
    secEl.className = "media-section";

    secEl.innerHTML = `
      <h2 class="section-heading">${sec.title}</h2>
      <div class="carousel-wrapper">
        <button class="carousel-nav-btn carousel-prev" onclick="scrollCarousel('track-${idx}', -400)">‹</button>
        <div class="carousel-track" id="track-${idx}">
          ${sec.isTop10 ? renderTop10Cards(sec.items) : renderCards(sec.items)}
        </div>
        <button class="carousel-nav-btn carousel-next" onclick="scrollCarousel('track-${idx}', 400)">›</button>
      </div>
    `;

    container.appendChild(secEl);
  });
}

function renderCards(items) {
  return items.map(item => `
    <div class="media-card" onclick="openMediaDetailById('${item.id}')">
      <img class="media-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" />
      ${item.badge ? `<span class="media-card-badge">${item.badge}</span>` : ""}
      <div class="media-card-overlay">
        <div class="card-title">${item.title}</div>
        <div class="card-meta">
          <span class="match-score">${item.matchScore}%</span>
          <span>${item.durationOrSeasons}</span>
          <span class="rating-tag">${item.rating}</span>
        </div>
      </div>
    </div>
  `).join("");
}

function renderTop10Cards(items) {
  return items.map((item, i) => `
    <div class="top-10-card" onclick="openMediaDetailById('${item.id}')">
      <div class="rank-number">${i + 1}</div>
      <img class="top-10-poster" src="${item.posterUrl}" alt="${item.title}" loading="lazy" />
    </div>
  `).join("");
}

function scrollCarousel(id, offset) {
  const track = document.getElementById(id);
  if (track) track.scrollBy({ left: offset, behavior: "smooth" });
}

// Media Detail Modal
let activeModalMedia = null;

function openMediaDetailById(id) {
  const item = catalog.find(m => m.id === id);
  if (item) openMediaDetail(item);
}

function openMediaDetail(item) {
  activeModalMedia = item;
  document.getElementById("modal-backdrop").src = item.backdropUrl;
  document.getElementById("modal-title").textContent = item.title;
  document.getElementById("modal-desc").textContent = item.description;
  document.getElementById("modal-match").textContent = `${item.matchScore}% Match`;
  document.getElementById("modal-year").textContent = item.year;
  document.getElementById("modal-rating").textContent = item.rating;
  document.getElementById("modal-duration").textContent = item.durationOrSeasons;
  document.getElementById("modal-cast").textContent = item.cast.join(", ");
  document.getElementById("modal-genres").textContent = item.genres.join(", ");
  document.getElementById("modal-director").textContent = item.director;

  updateModalMyListButton();

  // Episodes
  const epSection = document.getElementById("modal-episodes-section");
  const epList = document.getElementById("modal-episodes-list");
  if (item.episodes && item.episodes.length > 0) {
    epSection.style.display = "block";
    epList.innerHTML = item.episodes.map(ep => `
      <div class="episode-item" onclick="openVideoPlayer('${item.title}: ${ep.title}')">
        <div class="ep-num">${ep.number}</div>
        <img class="ep-thumb" src="${ep.thumbnailUrl}" alt="${ep.title}" />
        <div class="ep-info">
          <h4>${ep.title} (${ep.duration})</h4>
          <p>${ep.description}</p>
        </div>
      </div>
    `).join("");
  } else {
    epSection.style.display = "none";
  }

  document.getElementById("detail-modal").style.display = "flex";
}

function updateModalMyListButton() {
  const btn = document.getElementById("modal-mylist-btn");
  const isSaved = myList.includes(activeModalMedia.id);
  if (isSaved) {
    btn.classList.add("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  } else {
    btn.classList.remove("active");
    btn.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  }
}

function toggleModalMyList() {
  toggleMediaInList(activeModalMedia.id);
  updateModalMyListButton();
}

function closeModal() {
  document.getElementById("detail-modal").style.display = "none";
}

function closeModalOnBackdrop(e) {
  if (e.target.id === "detail-modal") closeModal();
}

function playCurrentModalMedia() {
  closeModal();
  openVideoPlayer(activeModalMedia.title);
}

// My List Management
function toggleMediaInList(id) {
  const idx = myList.indexOf(id);
  if (idx > -1) {
    myList.splice(idx, 1);
  } else {
    myList.push(id);
  }
  localStorage.setItem("streamflix_mylist", JSON.stringify(myList));
  updateMyListBadge();
}

function updateMyListBadge() {
  const el = document.getElementById("my-list-count");
  if (el) el.textContent = myList.length;
}

// Video Player
function openVideoPlayer(title) {
  document.getElementById("video-player-title").textContent = title || "Now Playing";
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  modal.style.display = "flex";
  video.currentTime = 0;
  video.play().catch(() => {});
}

function closeVideoPlayer() {
  const modal = document.getElementById("video-modal");
  const video = document.getElementById("main-video");
  video.pause();
  modal.style.display = "none";
}

// Navigation Filters
function filterBySection(type) {
  document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
  const activeBtn = document.querySelector(`.nav-btn[data-filter="${type}"]`);
  if (activeBtn) activeBtn.classList.add("active");

  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  searchResults.style.display = "none";
  mainContent.style.display = "block";
  billboard.style.display = "flex";

  if (type === "all") {
    renderContentRows();
  } else if (type === "tv") {
    const tvItems = catalog.filter(m => m.type === "TV_SHOW");
    renderBillboard(tvItems[0]);
    showFilteredGrid("TV Shows", tvItems);
  } else if (type === "movies") {
    const movieItems = catalog.filter(m => m.type === "MOVIE");
    renderBillboard(movieItems[0]);
    showFilteredGrid("Movies", movieItems);
  } else if (type === "upcoming") {
    showFilteredGrid("New & Upcoming Releases", catalog.slice(0, 6));
  } else if (type === "mylist") {
    const myItems = catalog.filter(m => myList.includes(m.id));
    if (myItems.length > 0) {
      showFilteredGrid("My List", myItems);
    } else {
      showFilteredGrid("My List (Empty - Add shows or movies using the + button)", []);
    }
  }
}

function showFilteredGrid(title, items) {
  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  billboard.style.display = "none";
  mainContent.style.display = "none";
  searchResults.style.display = "block";

  document.getElementById("search-heading").textContent = title;
  const grid = document.getElementById("search-grid");
  if (items.length === 0) {
    grid.innerHTML = `<p style="color: #888; grid-column: 1/-1;">No titles found.</p>`;
  } else {
    grid.innerHTML = renderCards(items);
  }
}

// Search
function handleSearch(query) {
  query = query.trim().toLowerCase();
  const billboard = document.getElementById("billboard");
  const mainContent = document.getElementById("main-content");
  const searchResults = document.getElementById("search-results");

  if (!query) {
    searchResults.style.display = "none";
    mainContent.style.display = "block";
    billboard.style.display = "flex";
    return;
  }

  billboard.style.display = "none";
  mainContent.style.display = "none";
  searchResults.style.display = "block";

  const matches = catalog.filter(m => 
    m.title.toLowerCase().includes(query) ||
    m.description.toLowerCase().includes(query) ||
    m.genres.some(g => g.toLowerCase().includes(query)) ||
    m.cast.some(c => c.toLowerCase().includes(query))
  );

  document.getElementById("search-heading").textContent = `Search Results for "${query}" (${matches.length})`;
  document.getElementById("search-grid").innerHTML = matches.length ? renderCards(matches) : `<p style="color: #888; grid-column: 1/-1;">No matching titles found.</p>`;
}

// Category dropdown select
function handleGenreSelect(genre) {
  if (!genre) {
    filterBySection("all");
    return;
  }
  const filtered = catalog.filter(m => m.genres.some(g => g.toLowerCase() === genre.toLowerCase()));
  showFilteredGrid(`${genre} Titles`, filtered);
}

// APK Download Modal
function showApkModal() {
  document.getElementById("apk-modal").style.display = "flex";
}

function closeApkModal() {
  document.getElementById("apk-modal").style.display = "none";
}

function closeApkModalOnBackdrop(e) {
  if (e.target.id === "apk-modal") closeApkModal();
}
