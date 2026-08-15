/**
 * Arugambay Safari – Site Configuration
 * ─────────────────────────────────────
 * WhatsApp: set country code + number only (no +, spaces, or dashes).
 *   Example Sri Lanka: "94771234567"
 *
 * Pricing: LKR totals by number of persons (1–7). Same tiers apply to all packages.
 *   For per-package prices later, add a `pricing` object on each package entry.
 *
 * Images: use local paths under images/. Add matching files (see images/README.md).
 *   If a local file is missing, `fallback` URLs are used automatically.
 */
const SITE_CONFIG = {
  whatsappNumber: "94771234567",

  pricing: {
    1: 20000,
    2: 25000,
    3: 30000,
    4: 35000,
    5: 40000,
    6: 45000,
    7: 50000,
  },

  aboutImage: {
    image: "images/about/guide.jpg",
    fallback:
      "https://images.unsplash.com/photo-1539650116574-75c0c7d73f6e?w=1000&q=80",
  },

  safariTypes: [
    {
      title: "Kumana National Park Safari",
      description:
        "Track elephants, leopards, and rare birds through one of Sri Lanka's most pristine wilderness reserves.",
      image: "images/safari-types/kumana.jpg",
      fallback:
        "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=1200&q=80",
    },
    {
      title: "Lagoon Safari",
      description:
        "Glide through tranquil lagoons at sunrise or sunset — crocodiles, birds, and golden light await.",
      image: "images/safari-types/lagoon.jpg",
      fallback:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&q=80",
    },
  ],

  heroSlides: [
    {
      image: "images/hero/jeep.jpg",
      fallback:
        "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=1920&q=85",
      subtitle: "Experience Wildlife Up Close",
    },
    {
      image: "images/hero/elephants.jpg",
      fallback:
        "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=1920&q=85",
      subtitle: "Meet Elephants in Their Natural Habitat",
    },
    {
      image: "images/hero/lagoon-boat.jpg",
      fallback:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85",
      subtitle: "Discover Peaceful Lagoon Adventures",
    },
    {
      image: "images/hero/birds.jpg",
      fallback:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&q=85",
      subtitle: "Birdwatching Paradise Awaits",
    },
    {
      image: "images/hero/crocodile.jpg",
      fallback:
        "https://images.unsplash.com/photo-1559251606-0fac72fe49b1?w=1920&q=85",
      subtitle: "Wildlife Along the Lagoon Shores",
    },
    {
      image: "images/hero/sunrise.jpg",
      fallback:
        "https://images.unsplash.com/photo-1564760055778-dfe772efdf87?w=1920&q=85",
      subtitle: "Ride Through The Wild",
    },
    {
      image: "images/hero/drone.jpg",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=85",
      subtitle: "Sunrise Over Sri Lankan Wilderness",
    },
  ],

  packages: [
    {
      id: "kumana-half",
      title: "Kumana Half Day Safari",
      description:
        "Morning or afternoon drive through Kumana National Park — elephants, birds, and untamed beauty.",
      duration: "4–5 Hours",
      image: "images/packages/kumana-half.jpg",
      fallback:
        "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=800&q=80",
      type: "Kumana National Park",
    },
    {
      id: "kumana-full",
      title: "Kumana Full Day Safari",
      description:
        "Full-day expedition deep into Kumana — maximum wildlife sightings with expert local guides.",
      duration: "8–10 Hours",
      image: "images/packages/kumana-full.jpg",
      fallback:
        "https://images.unsplash.com/photo-1564760055778-dfe772efdf87?w=800&q=80",
      type: "Kumana National Park",
    },
    {
      id: "lagoon-morning",
      title: "Lagoon Morning Safari",
      description:
        "Peaceful morning boat safari — crocodiles, migratory birds, and golden lagoon light.",
      duration: "3–4 Hours",
      image: "images/packages/lagoon-morning.jpg",
      fallback:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80",
      type: "Lagoon Safari",
    },
    {
      id: "lagoon-sunset",
      title: "Lagoon Sunset Safari",
      description:
        "Magical sunset cruise — reflections, wildlife, and the calm of Arugam Bay's lagoons.",
      duration: "3–4 Hours",
      image: "images/packages/lagoon-sunset.jpg",
      fallback:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1200&q=80",
      type: "Lagoon Safari",
    },
  ],

  gallery: [
    {
      image: "images/gallery/kumana-sunrise.jpg",
      fallback:
        "https://images.unsplash.com/photo-1516426122078-c23e178198bf?w=1920&q=85",
      caption: "Sunrise Safari at Kumana National Park",
      sub: "Kumana National Park",
    },
    {
      image: "images/gallery/lagoon-sunset.jpg",
      fallback:
        "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1920&q=85",
      caption: "Lagoon Sunset Experience",
      sub: "Lagoon Safari",
    },
    {
      image: "images/gallery/jeep-wilderness.jpg",
      fallback:
        "https://images.unsplash.com/photo-1564760055778-dfe772efdf87?w=1920&q=85",
      caption: "Safari Jeep Through the Wilderness",
      sub: "Private Tours",
    },
    {
      image: "images/gallery/elephants.jpg",
      fallback:
        "https://images.unsplash.com/photo-1589652717521-10c0d092dea9?w=1920&q=85",
      caption: "Elephants in the Wild",
      sub: "Wildlife Encounters",
    },
    {
      image: "images/gallery/birds.jpg",
      fallback:
        "https://images.unsplash.com/photo-1444464666168-49d633b86797?w=1920&q=85",
      caption: "Exotic Birds of the East Coast",
      sub: "Birdwatching",
    },
  ],
};
