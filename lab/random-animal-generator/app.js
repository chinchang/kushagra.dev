// DOM Elements
const generateBtn = document.getElementById("generate-btn");
const countInput = document.getElementById("count");
const categorySelect = document.getElementById("category");
const resultsContainer = document.getElementById("results");
const musicToggle = document.getElementById("music-toggle");

/*
forest calm NL 07 200529_0181.wav by klankbeeld -- https://freesound.org/s/622928/ -- License: Attribution 4.0
*/
const bgMusic = new Audio("/lab/random-animal-generator/bg.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.5; // Set to 50% volume

// add sfx to generate btn
const btnSfx = new Audio("/lab/random-animal-generator/frog.mp3");

let didUserStopMusic = false;

let areAnimalsGenerated = false;

// Animal images by category (local images)
const ANIMAL_IMAGES = {
  mammals: [
    "images/animals/lion.png",
    "images/animals/bengal-tiger.png",
    "images/animals/african-elephant.png",
    "images/animals/giraffe.png",
    "images/animals/gorilla.png",
  ],
  birds: [
    "images/animals/golden-eagle.png",
    "images/animals/scarlet-macaw.png",
    "images/animals/barn-owl.png",
    "images/animals/flamingo.png",
    "images/animals/emperor-penguin.png",
  ],
  fish: [
    "images/animals/great-white-shark.png",
    "images/animals/clownfish.png",
    "images/animals/blue-tang.png",
    "images/animals/manta-ray.png",
  ],
  reptiles: [
    "images/animals/chameleon.png",
    "images/animals/king-cobra.png",
    "images/animals/galapagos-tortoise.png",
    "images/animals/komodo-dragon.png",
    "images/animals/saltwater-crocodile.png",
  ],
};

// Sample animal data (our main data source now)
const ANIMAL_DATA = {
  mammals: [
    {
      name: "African Elephant",
      type: "Mammal",
      description:
        "The largest land animal, known for its long trunk and tusks. Diet: Herbivore. Habitat: Savannas, forests, deserts, and marshes. Lifespan: 60-70 years. Geographic Range: Sub-Saharan Africa.",
      image: "images/animals/african-elephant.png",
    },
    {
      name: "Bengal Tiger",
      type: "Mammal",
      description:
        "A powerful big cat with distinctive orange fur and black stripes. Diet: Carnivore. Habitat: Tropical forests, marshes, and tall grasslands. Lifespan: 8-10 years. Geographic Range: India, Bangladesh, Nepal.",
      image: "images/animals/bengal-tiger.png",
    },
    {
      name: "Giraffe",
      type: "Mammal",
      description:
        "The tallest living animal with a very long neck and spotted pattern. Diet: Herbivore. Habitat: Savannas, grasslands, and open woodlands. Lifespan: 25 years. Geographic Range: Sub-Saharan Africa.",
      image: "images/animals/giraffe.png",
    },
    {
      name: "Red Panda",
      type: "Mammal",
      description:
        "A small, arboreal mammal with reddish-brown fur and a bushy tail. Diet: Omnivore. Habitat: Temperate forests. Lifespan: 8-10 years. Geographic Range: Eastern Himalayas and southwestern China.",
      image: "images/animals/red-panda.png",
    },
    {
      name: "Koala",
      type: "Mammal",
      description:
        "An arboreal herbivorous marsupial native to Australia. Diet: Herbivore. Habitat: Eucalyptus forests. Lifespan: 13-15 years. Geographic Range: Eastern and southern Australia.",
      image: "images/animals/koala.png",
    },
    {
      name: "Lion",
      type: "Mammal",
      description:
        "The king of beasts, known for its majestic mane and powerful roar. Diet: Carnivore. Habitat: Grasslands and savannas. Lifespan: 10-14 years. Geographic Range: Sub-Saharan Africa and a small part of India.",
      image: "images/animals/lion.png",
    },
    {
      name: "Gorilla",
      type: "Mammal",
      description:
        "The largest living primates, known for their intelligence and strength. Diet: Herbivore. Habitat: Forests. Lifespan: 35-40 years. Geographic Range: Central Africa.",
      image: "images/animals/gorilla.png",
    },
    {
      name: "Kangaroo",
      type: "Mammal",
      description:
        "Marsupials known for their powerful hind legs and pouches. Diet: Herbivore. Habitat: Forests, grasslands, and deserts. Lifespan: 6-8 years. Geographic Range: Australia.",
      image: "images/animals/kangaroo.png",
    },
  ],
  birds: [
    {
      name: "Golden Eagle",
      type: "Bird",
      description:
        "One of the best-known birds of prey, with impressive hunting abilities. Diet: Carnivore. Habitat: Mountains, hills, and open country. Lifespan: 30 years. Geographic Range: North America, Europe, Asia, and parts of Africa.",
      image: "images/animals/golden-eagle.png",
    },
    {
      name: "Scarlet Macaw",
      type: "Bird",
      description:
        "A large, colorful parrot native to humid evergreen forests. Diet: Omnivore. Habitat: Tropical rainforests. Lifespan: 50 years. Geographic Range: Central and South America.",
      image: "images/animals/scarlet-macaw.png",
    },
    {
      name: "Emperor Penguin",
      type: "Bird",
      description:
        "The tallest and heaviest of all living penguin species. Diet: Carnivore. Habitat: Antarctic sea ice and waters. Lifespan: 20 years. Geographic Range: Antarctica.",
      image: "images/animals/emperor-penguin.png",
    },
    {
      name: "Barn Owl",
      type: "Bird",
      description:
        "Known for its distinctive heart-shaped face and silent flight. Diet: Carnivore. Habitat: Open countryside. Lifespan: 4 years. Geographic Range: Worldwide except Antarctica and some islands.",
      image: "images/animals/barn-owl.png",
    },
    {
      name: "Flamingo",
      type: "Bird",
      description:
        "Wading birds known for their pink coloration and standing on one leg. Diet: Omnivore. Habitat: Shallow lakes, lagoons, and wetlands. Lifespan: 20-30 years. Geographic Range: Americas, Caribbean, Africa, Asia, and Europe.",
      image: "images/animals/flamingo.png",
    },
  ],
  fish: [
    {
      name: "Great White Shark",
      type: "Fish",
      description:
        "A large predatory fish known for its size and powerful bite. Diet: Carnivore. Habitat: Coastal surface waters. Lifespan: 70 years. Geographic Range: Major oceans, particularly off the coast of South Africa, Australia, California, and Mexico.",
      image: "images/animals/great-white-shark.png",
    },
    {
      name: "Clownfish",
      type: "Fish",
      description:
        "A small, brightly colored fish that lives among sea anemones. Diet: Omnivore. Habitat: Coral reefs. Lifespan: 6-10 years. Geographic Range: Indian and Pacific Oceans.",
      image: "images/animals/clownfish.png",
    },
    {
      name: "Blue Tang",
      type: "Fish",
      description:
        "A vibrant blue fish that is popular in marine aquariums. Diet: Omnivore. Habitat: Coral reefs. Lifespan: 8-12 years. Geographic Range: Indo-Pacific region.",
      image: "images/animals/blue-tang.png",
    },
    {
      name: "Manta Ray",
      type: "Fish",
      description:
        "One of the largest rays, with a distinctive body shape. Diet: Omnivore. Habitat: Tropical and subtropical waters. Lifespan: 50 years. Geographic Range: Tropical and subtropical waters worldwide.",
      image: "images/animals/manta-ray.png",
    },
  ],
  reptiles: [
    {
      name: "Komodo Dragon",
      type: "Reptile",
      description:
        "The largest living lizard species, native to Indonesian islands. Diet: Carnivore. Habitat: Tropical savanna forests and grasslands. Lifespan: 30 years. Geographic Range: Indonesian islands.",
      image: "images/animals/komodo-dragon.png",
    },
    {
      name: "King Cobra",
      type: "Reptile",
      description:
        "The world's longest venomous snake, capable of raising its head high. Diet: Carnivore. Habitat: Forests, bamboo thickets, mangrove swamps. Lifespan: 20 years. Geographic Range: India, southern China, and Southeast Asia.",
      image: "images/animals/king-cobra.png",
    },
    {
      name: "Galapagos Tortoise",
      type: "Reptile",
      description:
        "One of the longest-lived animals, with a large dome-shaped shell. Diet: Herbivore. Habitat: Semi-arid environments. Lifespan: 100+ years. Geographic Range: Galapagos Islands.",
      image: "images/animals/galapagos-tortoise.png",
    },
    {
      name: "Chameleon",
      type: "Reptile",
      description:
        "Known for its ability to change color and its independently moving eyes. Diet: Carnivore. Habitat: Tropical forests and deserts. Lifespan: 3-10 years. Geographic Range: Africa, Madagascar, southern Europe, and Asia.",
      image: "images/animals/chameleon.png",
    },
    {
      name: "Saltwater Crocodile",
      type: "Reptile",
      description:
        "The largest of all living reptiles and a formidable predator. Diet: Carnivore. Habitat: Coastal brackish and freshwater regions. Lifespan: 70 years. Geographic Range: Indo-Pacific region.",
      image: "images/animals/saltwater-crocodile.png",
    },
  ],
};

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
  // Add event listener to generate button
  generateBtn.addEventListener("click", generateAnimals);

  // Add animation to logo
  const logo = document.getElementById("logo");
  if (logo) {
    logo.classList.add("animate__animated", "animate__bounce");
  }
});

function changeGenerateBtnText(text) {
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      generateBtn.textContent = text;
    });
  } else {
    generateBtn.textContent = text;
  }
}
// Function to generate random animals
function generateAnimals() {
  btnSfx.play();
  if (areAnimalsGenerated) {
    changeGenerateBtnText("Refreshing Animals...");
  } else {
    changeGenerateBtnText("Discovering Animals...");
  }
  // Get user inputs
  const count = parseInt(countInput.value) || 3;
  const category = categorySelect.value;

  // Clear previous results
  resultsContainer.innerHTML = "";

  // Show loading animation
  //   showLoading();

  // Simulate API call with a small delay for better UX
  setTimeout(() => {
    // Get animals from our local data
    const animals = getAnimals(category, count);

    // Display animals
    displayAnimals(animals);
    areAnimalsGenerated = true;
    changeGenerateBtnText("Refresh Animals");
  }, 800); // 800ms delay to show loading animation
}

// Function to get animals from our local data
function getAnimals(category, count) {
  let animals;

  // Get the appropriate category of animals
  switch (category) {
    case "mammals":
      animals = ANIMAL_DATA.mammals;
      break;
    case "birds":
      animals = ANIMAL_DATA.birds;
      break;
    case "fish":
      animals = ANIMAL_DATA.fish;
      break;
    case "reptiles":
      animals = ANIMAL_DATA.reptiles;
      break;
    default:
      // For 'all', combine all categories
      animals = [
        ...ANIMAL_DATA.mammals,
        ...ANIMAL_DATA.birds,
        ...ANIMAL_DATA.fish,
        ...ANIMAL_DATA.reptiles,
      ];
  }

  // Shuffle the array to get random animals
  const shuffled = [...animals].sort(() => 0.5 - Math.random());

  // Take only the requested count (or all if we don't have enough)
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

// Function to get a readable category name
function getCategoryName(category) {
  switch (category) {
    case "mammals":
      return "Mammal";
    case "birds":
      return "Bird";
    case "fish":
      return "Fish";
    case "reptiles":
      return "Reptile";
    default:
      return "Animal";
  }
}

// Function to display animals in the UI
function displayAnimals(animals) {
  // Clear loading animation
  resultsContainer.innerHTML = "";

  // Create and append animal cards
  animals.forEach((animal, index) => {
    // Create animal card with animation delay
    const card = document.createElement("div");
    card.className = "animal-card animate__animated animate__zoomIn";
    card.style.animationDelay = `${index * 0.2}s`;
    card.style.viewTransitionName = `animal-card-${index}`;

    // Create card HTML
    card.innerHTML = `
      <img src="/lab/random-animal-generator/${animal.image}" alt="${animal.name}" class="animal-image">
      <div class="animal-info">
        <h3 class="animal-name">${animal.name}</h3>
        <span class="animal-type" data-type="${animal.type}">${animal.type}</span>
        <p class="animal-description">${animal.description}</p>
      </div>
    `;

    // Add card to results container
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        resultsContainer.appendChild(card);
      });
    } else {
      resultsContainer.appendChild(card);
    }
  });
}

// Function to get a random animal image if needed
function getRandomAnimalImage(animalType) {
  // Determine category for image selection
  let category;
  switch ((animalType || "").toLowerCase()) {
    case "mammal":
      category = "mammals";
      break;
    case "bird":
      category = "birds";
      break;
    case "fish":
      category = "fish";
      break;
    case "reptile":
      category = "reptiles";
      break;
    default:
      category = "mammals";
  }

  // Get random image from the category
  const images = ANIMAL_IMAGES[category];
  const randomIndex = Math.floor(Math.random() * images.length);

  return images[randomIndex];
}

// Function to show loading animation
function showLoading() {
  resultsContainer.innerHTML = `
    <div class="loading-container">
      <div class="loading-spinner"></div>
      <p>Discovering amazing animals...</p>
    </div>
  `;
}

// Add loading spinner styles to the document
const style = document.createElement("style");
style.textContent = `
  .loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    padding: 40px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
    border: 5px solid rgba(42, 125, 79, 0.3);
    border-radius: 50%;
    border-top-color: var(--primary-color);
    animation: spin 1s ease-in-out infinite;
    margin-bottom: 20px;
  }
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// Function to toggle background music
function toggleMusic(isUserAction = false) {
  const musicToggle = document.getElementById("music-toggle");

  if (bgMusic.paused) {
    bgMusic
      .play()
      .then(() => {
        musicToggle.innerHTML = "🔉";
      })
      .catch((err) => {
        console.error("Error playing music:", err);
      });
  } else {
    bgMusic.pause();
    didUserStopMusic = true;
    musicToggle.innerHTML = "🔇";
  }
}

musicToggle.addEventListener("click", () => {
  toggleMusic(true);
});
// toggle music on window click, if not already playing
window.addEventListener("click", () => {
  if (bgMusic.paused && !didUserStopMusic) {
    toggleMusic();
  }
});
