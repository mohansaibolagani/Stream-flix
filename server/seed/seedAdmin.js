const bcrypt = require("bcryptjs");
const User = require("../models/User");
const Movie = require("../models/Movie");
const config = require("../config/config");
const { connectDB } = require("../config/db");

const initialCatalog = [
  {
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

async function seedDatabase() {
  await connectDB();

  // 1. Check & Seed First Admin
  const adminCount = await User.countDocuments({ role: "ADMIN" });
  if (adminCount === 0) {
    console.log("[Bootstrap] No administrator found. Bootstrapping first admin account...");
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(config.adminPassword, salt);

    await User.create({
      fullName: config.adminFullName,
      email: config.adminEmail.toLowerCase().trim(),
      username: config.adminUsername.toLowerCase().trim(),
      passwordHash,
      phone: "+1 555-0199",
      profileImage: "🛡️",
      role: "ADMIN",
      status: "ACTIVE"
    });

    console.log(`[Bootstrap] Initial admin created: ${config.adminEmail}`);
  } else {
    console.log(`[Bootstrap] Administrator account already exists (${adminCount} admin(s) present).`);
  }

  // 2. Check & Seed Catalog
  const movieCount = await Movie.countDocuments();
  if (movieCount === 0) {
    console.log("[Bootstrap] Seeding initial movie and series catalog...");
    for (const item of initialCatalog) {
      await Movie.create(item);
    }
    console.log(`[Bootstrap] Seeded ${initialCatalog.length} catalog titles.`);
  }
}

// Allow direct CLI execution
if (require.main === module) {
  seedDatabase()
    .then(() => {
      console.log("[Seed] Completed successfully.");
      process.exit(0);
    })
    .catch(err => {
      console.error("[Seed] Error:", err.message);
      process.exit(1);
    });
}

module.exports = { seedDatabase };
