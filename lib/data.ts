export type ListingType = "apartment" | "house" | "car";
export type ActivityCategory = "outdoor" | "restaurant" | "excursion";

export interface Activity {
  id: string;
  category: ActivityCategory;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerPerson: number;
  duration: string;
  images: string[];
  included: string[];
  rating: number;
  reviewCount: number;
  owner: { name: string; phone: string; avatar: string };
  minPersons: number;
  maxPersons: number;
  available: boolean;
  deal?: number;
  idealFor: ("family" | "couple" | "group" | "solo")[];
  cuisine?: string;
  schedule?: string;
}

export interface Listing {
  id: string;
  type: ListingType;
  title: string;
  description: string;
  city: string;
  address: string;
  pricePerDay: number;
  pricePerMonth?: number;
  images: string[];
  amenities: string[];
  rating: number;
  reviewCount: number;
  owner: {
    name: string;
    phone: string;
    avatar: string;
  };
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  brand?: string;
  model?: string;
  year?: number;
  seats?: number;
  transmission?: string;
  available: boolean;
  deal?: number;
}

export const CITIES = [
  // Grand Casablanca-Settat
  "Casablanca", "Mohammedia", "Settat", "Berrechid", "Benslimane",
  "El Jadida", "Azemmour", "Sidi Bennour", "Bouznika", "Mediouna",

  // Rabat-Salé-Kénitra
  "Rabat", "Salé", "Témara", "Kenitra", "Skhirat",
  "Tiflet", "Khmisset", "Sidi Kacem", "Sidi Slimane",
  "Souk El Arbaa", "Mechra Bel Ksiri", "Ouazzane",

  // Tanger-Tétouan-Al Hoceima
  "Tanger", "Tétouan", "Al Hoceima", "Chefchaouen", "Larache",
  "Ksar el Kébir", "Asilah", "Fnideq", "M'diq", "Martil",
  "Oued Laou", "Bab Berred", "Targuist", "Imzouren",
  "Bni Bouayach", "Ajdir", "Bni Hadifa",

  // Fès-Meknès
  "Fès", "Meknès", "Taza", "Ifrane", "Khénifra", "Sefrou",
  "Boulemane", "El Hajeb", "Imouzzer Kandar", "Moulay Yacoub",
  "Ribat El Kheir", "Ain Leuh", "Missour", "Tahla",

  // Oriental
  "Oujda", "Nador", "Berkane", "Taourirt", "Jerada", "Guercif", "Driouch",
  "Zaio", "Aroui", "Selouane", "Zghanghan", "Saidia",
  "Ahfir", "Ras El Ma", "Ain Beni Mathar", "Tafoughalt",
  "Ben Taïeb", "Midar", "El Aïoun Sidi Mellouk", "Laaouinate",
  "Bni Drar", "Touissit", "Bou Arfa", "Figuig",

  // Marrakech-Safi
  "Marrakech", "Safi", "El Kelaa des Sraghna", "Essaouira", "Chichaoua",
  "Ben Guerir", "Youssoufia", "Ait Ourir", "Amizmiz", "Tahanaout",
  "Smimou", "Chemaia",

  // Souss-Massa
  "Agadir", "Inezgane", "Ait Melloul", "Tiznit", "Taroudant",
  "Oulad Teima", "Biougra", "Aoulouz", "Sebt El Guerdane",
  "Tata", "Igherm", "Tafraout", "Massa", "Chtouka Ait Baha",

  // Béni Mellal-Khénifra
  "Beni Mellal", "Khouribga", "Fquih Ben Salah", "Azilal",
  "Kasba Tadla", "Souk Sebt Oulad Nemma", "Oued Zem",
  "Boujniba", "Hattane", "Afourer", "Demnate",

  // Drâa-Tafilalet
  "Errachidia", "Ouarzazate", "Zagora", "Tinghir", "Midelt",
  "Rissani", "Erfoud", "Goulmima", "Alnif", "Kelaat M'Gouna",
  "Boumalne Dadès", "Skoura", "Nkob", "Merzouga",

  // Guelmim-Oued Noun
  "Guelmim", "Tan-Tan", "Sidi Ifni", "Assa", "Zag", "Bouizakarne",

  // Laâyoune-Sakia El Hamra
  "Laâyoune", "Boujdour", "Smara", "Tarfaya", "Akhfennir",

  // Dakhla-Oued Ed-Dahab
  "Dakhla", "Bir Gandouz", "Aousserd",
];

export const listings: Listing[] = [
  {
    id: "1",
    type: "apartment",
    title: "Appartement Moderne Centre Oujda",
    description:
      "Bel appartement entièrement meublé au cœur d'Oujda. Proche de tous les commerces, restaurants et transports. Idéal pour séjour courte ou longue durée. Vue magnifique sur la ville.",
    city: "Oujda",
    address: "Boulevard Mohammed V, Centre Ville",
    pricePerDay: 350,
    pricePerMonth: 4500,
    images: [
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    ],
    amenities: ["WiFi", "Climatisation", "Parking", "Ascenseur", "Balcon", "Machine à laver"],
    rating: 4.8,
    reviewCount: 24,
    owner: { name: "Khalid Benali", phone: "0600287382", avatar: "KB" },
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    available: true,
    deal: 15,
  },
  {
    id: "2",
    type: "apartment",
    title: "Studio Meublé Nador Plage",
    description:
      "Studio moderne à 5 min de la plage de Nador. Équipé avec tout le nécessaire. Parfait pour vacances ou déplacement professionnel.",
    city: "Nador",
    address: "Rue de la Corniche, Quartier Beni Nsar",
    pricePerDay: 250,
    pricePerMonth: 3000,
    images: [
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
    ],
    amenities: ["WiFi", "Climatisation", "Vue mer", "Cuisine équipée"],
    rating: 4.5,
    reviewCount: 18,
    owner: { name: "Fatima Ziani", phone: "0600287382", avatar: "FZ" },
    bedrooms: 1,
    bathrooms: 1,
    area: 45,
    available: true,
    deal: 10,
  },
  {
    id: "3",
    type: "house",
    title: "Villa Spacieuse avec Piscine — Berkane",
    description:
      "Magnifique villa avec piscine privée dans un quartier résidentiel calme de Berkane. Jardin aménagé, terrasse, garage. Parfaite pour familles ou groupes.",
    city: "Berkane",
    address: "Quartier des Orangers",
    pricePerDay: 800,
    pricePerMonth: 12000,
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
    ],
    amenities: ["Piscine", "Jardin", "Parking", "WiFi", "Barbecue", "Climatisation", "Garage"],
    rating: 4.9,
    reviewCount: 31,
    owner: { name: "Hassan Filali", phone: "0600287382", avatar: "HF" },
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    available: true,
  },
  {
    id: "4",
    type: "house",
    title: "Maison Traditionnelle Riad — Oujda Médina",
    description:
      "Authentique riad au cœur de la médina d'Oujda. Architecture traditionnelle marocaine, patio avec fontaine, décoration artisanale. Expérience unique.",
    city: "Oujda",
    address: "Médina, Derb Sidi Ziane",
    pricePerDay: 600,
    pricePerMonth: 8000,
    images: [
      "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800",
      "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800",
    ],
    amenities: ["Patio", "Terrasse", "WiFi", "Cuisine traditionnelle", "Salon marocain"],
    rating: 4.7,
    reviewCount: 15,
    owner: { name: "Amina Sqalli", phone: "0600287382", avatar: "AS" },
    bedrooms: 3,
    bathrooms: 2,
    area: 200,
    available: true,
  },
  {
    id: "5",
    type: "car",
    title: "Dacia Logan 2022 — Automatique",
    description:
      "Voiture récente, bien entretenue, climatisée. Kilométrage illimité pour la région Oriental. Documents en règle, assurance incluse.",
    city: "Oujda",
    address: "Agence Centre Ville Oujda",
    pricePerDay: 250,
    images: [
      "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=800",
      "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800",
    ],
    amenities: ["Climatisation", "Bluetooth", "GPS", "Assurance incluse", "Kilométrage illimité"],
    rating: 4.6,
    reviewCount: 42,
    owner: { name: "Youssef Tazi", phone: "0600287382", avatar: "YT" },
    brand: "Dacia",
    model: "Logan",
    year: 2022,
    seats: 5,
    transmission: "Manuelle",
    available: true,
    deal: 20,
  },
  {
    id: "6",
    type: "car",
    title: "Hyundai Tucson 2023 — SUV",
    description:
      "SUV moderne et confortable. Parfait pour les routes de l'Oriental. GPS intégré, caméra de recul, régulateur de vitesse.",
    city: "Nador",
    address: "Aéroport Nador / Centre Ville",
    pricePerDay: 450,
    images: [
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800",
    ],
    amenities: ["GPS", "Climatisation", "Caméra recul", "Bluetooth", "Assurance incluse"],
    rating: 4.9,
    reviewCount: 28,
    owner: { name: "Rachid Moulay", phone: "0600287382", avatar: "RM" },
    brand: "Hyundai",
    model: "Tucson",
    year: 2023,
    seats: 5,
    transmission: "Automatique",
    available: true,
  },
  {
    id: "7",
    type: "apartment",
    title: "Appartement Vue Mer — Nador",
    description:
      "Superbe appartement avec vue panoramique sur la lagune de Nador. Terrasse spacieuse, 3 chambres. Idéal pour famille.",
    city: "Nador",
    address: "Résidence Al Amal, Front de Mer",
    pricePerDay: 500,
    pricePerMonth: 6500,
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    ],
    amenities: ["Vue mer", "Terrasse", "WiFi", "Climatisation", "Parking", "Ascenseur"],
    rating: 4.7,
    reviewCount: 19,
    owner: { name: "Sara Benkirane", phone: "0600287382", avatar: "SB" },
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    available: true,
  },
  {
    id: "8",
    type: "car",
    title: "Renault Clio 2021 — Économique",
    description:
      "Petite voiture économique, parfaite pour la ville. Consommation faible, facile à garer. Idéale pour visiter Oujda et ses environs.",
    city: "Oujda",
    address: "Gare ONCF Oujda",
    pricePerDay: 180,
    images: [
      "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800",
    ],
    amenities: ["Climatisation", "Bluetooth", "Assurance incluse"],
    rating: 4.4,
    reviewCount: 56,
    owner: { name: "Omar Chraibi", phone: "0600287382", avatar: "OC" },
    brand: "Renault",
    model: "Clio",
    year: 2021,
    seats: 5,
    transmission: "Manuelle",
    available: true,
  },
  // ─── Casablanca ───────────────────────────────────────────────
  {
    id: "9",
    type: "apartment",
    title: "Appartement Luxe — Maarif Casablanca",
    description: "Magnifique appartement dans le quartier huppé du Maarif. Entièrement rénové, meublé avec goût. Proche des restaurants, cafés et du centre d'affaires. Idéal pour séjour professionnel ou touristique.",
    city: "Casablanca",
    address: "Rue Soumaya, Maarif",
    pricePerDay: 550,
    pricePerMonth: 7500,
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=800",
      "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=800",
      "https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800",
    ],
    amenities: ["WiFi Fibre", "Climatisation", "Parking sécurisé", "Conciergerie", "Ascenseur", "Balcon"],
    rating: 4.9,
    reviewCount: 47,
    owner: { name: "Nadia Alaoui", phone: "0600287382", avatar: "NA" },
    bedrooms: 2,
    bathrooms: 2,
    area: 95,
    available: true,
    deal: 10,
  },
  {
    id: "10",
    type: "house",
    title: "Villa Moderne — Ain Diab Casablanca",
    description: "Splendide villa contemporaine face à l'Atlantique à Ain Diab. Piscine chauffée, terrasse panoramique, domotique. Quartier résidentiel prisé à 5 min de la corniche. Cachet unique.",
    city: "Casablanca",
    address: "Boulevard de la Corniche, Ain Diab",
    pricePerDay: 2200,
    pricePerMonth: 35000,
    images: [
      "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
      "https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800",
    ],
    amenities: ["Piscine chauffée", "Vue mer", "Terrasse", "Domotique", "Salle de sport", "Jacuzzi", "Garage double"],
    rating: 5.0,
    reviewCount: 12,
    owner: { name: "Mehdi Fassi", phone: "0600287382", avatar: "MF" },
    bedrooms: 5,
    bathrooms: 4,
    area: 450,
    available: true,
  },
  {
    id: "11",
    type: "car",
    title: "BMW Série 3 2023 — Casablanca",
    description: "Berline premium récente, idéale pour vos déplacements professionnels à Casablanca. GPS, siège cuir, toit ouvrant. Livraison à l'aéroport Mohammed V disponible.",
    city: "Casablanca",
    address: "Aéroport Mohammed V / Centre ville",
    pricePerDay: 750,
    images: [
      "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800",
      "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=800",
    ],
    amenities: ["GPS", "Siège cuir", "Toit ouvrant", "Bluetooth", "Assurance incluse", "Livraison aéroport"],
    rating: 4.8,
    reviewCount: 33,
    owner: { name: "Karim Benjelloun", phone: "0600287382", avatar: "KB" },
    brand: "BMW",
    model: "Série 3",
    year: 2023,
    seats: 5,
    transmission: "Automatique",
    available: true,
  },
  // ─── Marrakech ────────────────────────────────────────────────
  {
    id: "12",
    type: "house",
    title: "Riad Authentique — Médina Marrakech",
    description: "Riad traditionnel entièrement restauré au cœur de la médina de Marrakech. 4 chambres avec salle de bain privée, patio, toit-terrasse et plunge pool. Une expérience marocaine inoubliable.",
    city: "Marrakech",
    address: "Derb El Cadi, Médina",
    pricePerDay: 1800,
    pricePerMonth: 28000,
    images: [
      "https://images.unsplash.com/photo-1539437829697-1b4ed5aebd86?w=800",
      "https://images.unsplash.com/photo-1548013146-72479768bada?w=800",
      "https://images.unsplash.com/photo-1515542622106-78bda8ba0e5b?w=800",
    ],
    amenities: ["Patio", "Plunge pool", "Toit-terrasse", "Hammam", "Petit-déjeuner inclus", "WiFi", "Climatisation"],
    rating: 4.9,
    reviewCount: 89,
    owner: { name: "Aicha Senhaji", phone: "0600287382", avatar: "AS" },
    bedrooms: 4,
    bathrooms: 4,
    area: 320,
    available: true,
    deal: 5,
  },
  {
    id: "13",
    type: "apartment",
    title: "Appartement Guéliz — Marrakech Centre",
    description: "Bel appartement moderne dans le quartier branché de Guéliz. À deux pas des restaurants, galeries et du tramway. Décoré avec soin, lumineux et confortable.",
    city: "Marrakech",
    address: "Avenue Mohammed VI, Guéliz",
    pricePerDay: 420,
    pricePerMonth: 5800,
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    amenities: ["WiFi", "Climatisation", "Piscine résidence", "Parking", "Sécurité 24h"],
    rating: 4.6,
    reviewCount: 34,
    owner: { name: "Yassine Ouali", phone: "0600287382", avatar: "YO" },
    bedrooms: 2,
    bathrooms: 1,
    area: 80,
    available: true,
  },
  // ─── Agadir ───────────────────────────────────────────────────
  {
    id: "14",
    type: "apartment",
    title: "Studio Balnéaire — Agadir Plage",
    description: "Studio climatisé à 100 mètres de la célèbre plage d'Agadir. Vue mer depuis le balcon, accès direct à la plage. Idéal pour couples ou solo. Parking et piscine inclus.",
    city: "Agadir",
    address: "Résidence Océan, Boulevard Mohammed V",
    pricePerDay: 380,
    pricePerMonth: 4800,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800",
    ],
    amenities: ["Vue mer", "Piscine", "Balcon", "WiFi", "Climatisation", "Accès plage"],
    rating: 4.7,
    reviewCount: 61,
    owner: { name: "Houssam Kadiri", phone: "0600287382", avatar: "HK" },
    bedrooms: 1,
    bathrooms: 1,
    area: 42,
    available: true,
    deal: 20,
  },
  {
    id: "15",
    type: "car",
    title: "Range Rover Evoque 2022 — Agadir",
    description: "SUV premium pour explorer le Sud marocain : Anti-Atlas, Souss, désert. Idéal pour excursions. Kilométrage illimité. Livraison hôtel possible.",
    city: "Agadir",
    address: "Aéroport Al Massira / Centre Agadir",
    pricePerDay: 850,
    images: [
      "https://images.unsplash.com/photo-1563720223185-11003d516935?w=800",
      "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=800",
    ],
    amenities: ["GPS", "4x4", "Kilométrage illimité", "Assurance tous risques", "Livraison hôtel"],
    rating: 4.9,
    reviewCount: 25,
    owner: { name: "Driss Ouarzazi", phone: "0600287382", avatar: "DO" },
    brand: "Range Rover",
    model: "Evoque",
    year: 2022,
    seats: 5,
    transmission: "Automatique",
    available: true,
  },
  // ─── Tanger ───────────────────────────────────────────────────
  {
    id: "16",
    type: "apartment",
    title: "Penthouse Vue Détroit — Tanger",
    description: "Penthouse exceptionnel avec vue panoramique sur le Détroit de Gibraltar et l'Espagne. Terrasse privée, décoration contemporaine. Accès rapide à la médina et au port.",
    city: "Tanger",
    address: "Quartier California, Malabata",
    pricePerDay: 900,
    pricePerMonth: 13000,
    images: [
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800",
    ],
    amenities: ["Vue détroit", "Terrasse panoramique", "WiFi Fibre", "Climatisation", "Parking sécurisé", "Conciergerie"],
    rating: 4.8,
    reviewCount: 22,
    owner: { name: "Zineb Laroussi", phone: "0600287382", avatar: "ZL" },
    bedrooms: 3,
    bathrooms: 2,
    area: 140,
    available: true,
  },
  // ─── Rabat ────────────────────────────────────────────────────
  {
    id: "17",
    type: "apartment",
    title: "Appartement Hay Riad — Rabat",
    description: "Appartement spacieux dans le quartier diplomatique de Hay Riad. Proche des ambassades, ministères et centre commercial. Idéal pour séjour professionnel longue durée.",
    city: "Rabat",
    address: "Avenue Annakhil, Hay Riad",
    pricePerDay: 480,
    pricePerMonth: 6500,
    images: [
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800",
    ],
    amenities: ["WiFi", "Climatisation", "Parking", "Gardien", "Ascenseur", "Cuisine équipée"],
    rating: 4.6,
    reviewCount: 38,
    owner: { name: "Mostafa Alami", phone: "0600287382", avatar: "MA" },
    bedrooms: 3,
    bathrooms: 2,
    area: 110,
    available: true,
  },
  // ─── Fès ──────────────────────────────────────────────────────
  {
    id: "18",
    type: "house",
    title: "Dar Traditionnelle — Fès El Bali",
    description: "Magnifique dar restaurée dans la médina de Fès, classée UNESCO. Zellige, stuc, cèdre sculpté. 3 chambres climatisées, patio ombragé, terrasse avec vue sur la médina. Un trésor du patrimoine marocain.",
    city: "Fès",
    address: "Médina de Fès El Bali, Talaa Kbira",
    pricePerDay: 950,
    pricePerMonth: 15000,
    images: [
      "https://images.unsplash.com/photo-1539437829697-1b4ed5aebd86?w=800",
      "https://images.unsplash.com/photo-1547618811-9ec76a8ebb7e?w=800",
    ],
    amenities: ["Patio", "Terrasse", "Hammam privé", "WiFi", "Petit-déjeuner", "Guide disponible"],
    rating: 4.9,
    reviewCount: 54,
    owner: { name: "Abdelkader Sqalli", phone: "0600287382", avatar: "AK" },
    bedrooms: 3,
    bathrooms: 3,
    area: 250,
    available: true,
    deal: 8,
  },
  // ─── Essaouira ───────────────────────────────────────────────
  {
    id: "19",
    type: "apartment",
    title: "Appartement Médina — Essaouira",
    description: "Charmant appartement dans la médina d'Essaouira, la 'Cité des Vents'. À 300m de la plage, proche des remparts et du port. Décoration bohème chic, terrasse privée.",
    city: "Essaouira",
    address: "Rue Skala, Médina",
    pricePerDay: 350,
    pricePerMonth: 4500,
    images: [
      "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800",
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800",
    ],
    amenities: ["Vue mer", "Terrasse", "WiFi", "Cuisine équipée", "Cheminée"],
    rating: 4.7,
    reviewCount: 29,
    owner: { name: "Leila Chraibi", phone: "0600287382", avatar: "LC" },
    bedrooms: 2,
    bathrooms: 1,
    area: 70,
    available: true,
  },
  // ─── Dakhla ──────────────────────────────────────────────────
  {
    id: "20",
    type: "house",
    title: "Villa Lagon — Dakhla",
    description: "Villa face au célèbre lagon de Dakhla, paradis du kitesurf et de la planche à voile. Grande terrasse, accès direct à la plage, kit surf disponible. Couchers de soleil inoubliables.",
    city: "Dakhla",
    address: "Route de la Mer, Lagune de Dakhla",
    pricePerDay: 1200,
    pricePerMonth: 18000,
    images: [
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    amenities: ["Lagon", "Terrasse", "Équipement kitesurf", "WiFi", "Barbecue", "Parking", "Climatisation"],
    rating: 4.8,
    reviewCount: 17,
    owner: { name: "Ahmed Sahrawi", phone: "0600287382", avatar: "AS" },
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    available: true,
    deal: 15,
  },
];

export const activities: Activity[] = [
  {
    id: "act1",
    category: "outdoor",
    title: "Balade Quad & ATV — Pistes d'Oujda",
    description: "Vivez une expérience unique à bord de quads tout-terrain dans les pistes autour d'Oujda. Parcours de 2h avec guide expérimenté. Casque et équipement de sécurité fournis. Idéal pour groupes et familles.",
    city: "Oujda",
    address: "Route de Figuig, Km 15",
    pricePerPerson: 150,
    duration: "2h",
    images: [
      "https://images.unsplash.com/photo-1533470192478-9897d90d5461?w=800",
      "https://images.unsplash.com/photo-1596429538440-6c01de7b6427?w=800",
    ],
    included: ["Quad fourni", "Casque & équipement", "Guide professionnel", "Eau minérale"],
    rating: 4.8,
    reviewCount: 64,
    owner: { name: "Karim Adventures", phone: "0600287382", avatar: "KA" },
    minPersons: 1,
    maxPersons: 8,
    available: true,
    deal: 10,
    idealFor: ["family", "couple", "group"],
  },
  {
    id: "act2",
    category: "outdoor",
    title: "Jet Ski & Sports Nautiques — Saidia",
    description: "Profitez des eaux turquoise de la plage de Saidia avec nos jets ski et activités nautiques. Session de 30 min avec moniteur certifié. La mer Méditerranée à portée de main.",
    city: "Berkane",
    address: "Plage de Saidia — Marina",
    pricePerPerson: 200,
    duration: "30 min",
    images: [
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800",
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    ],
    included: ["Jet ski", "Gilet de sauvetage", "Moniteur certifié", "Casier vestiaire"],
    rating: 4.7,
    reviewCount: 38,
    owner: { name: "Saidia Watersports", phone: "0600287382", avatar: "SW" },
    minPersons: 1,
    maxPersons: 2,
    available: true,
    idealFor: ["couple", "solo", "group"],
  },
  {
    id: "act3",
    category: "restaurant",
    title: "Restaurant Al Andalous — Oujda",
    description: "Restaurant gastronomique marocain au cœur d'Oujda. Cuisine traditionnelle préparée à base de produits locaux frais. Cadre élégant avec décoration andalouse. Idéal pour un repas en famille ou en couple.",
    city: "Oujda",
    address: "Boulevard Allal Ben Abdallah, Centre Ville",
    pricePerPerson: 120,
    duration: "2–3h",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800",
    ],
    included: ["Menu 3 plats", "Thé à la menthe", "Pain marocain", "Fruits de saison"],
    rating: 4.9,
    reviewCount: 127,
    owner: { name: "Restaurant Al Andalous", phone: "0562345001", avatar: "AA" },
    minPersons: 1,
    maxPersons: 20,
    available: true,
    idealFor: ["family", "couple", "group"],
    cuisine: "Marocaine traditionnelle",
    schedule: "12h–15h / 19h–23h",
  },
  {
    id: "act4",
    category: "restaurant",
    title: "La Corniche — Vue sur Lagune de Nador",
    description: "Restaurant avec vue imprenable sur la lagune de Nador. Spécialisé dans les fruits de mer frais et la cuisine méditerranéenne. Terrasse en bord de mer, ambiance romantique.",
    city: "Nador",
    address: "Corniche, Bord de la Lagune",
    pricePerPerson: 180,
    duration: "2–3h",
    images: [
      "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=800",
      "https://images.unsplash.com/photo-1537047902294-62a40c20a6ae?w=800",
    ],
    included: ["Entrée maison", "Plat principal", "Dessert marocain", "Café ou thé"],
    rating: 4.6,
    reviewCount: 89,
    owner: { name: "La Corniche", phone: "0536345002", avatar: "LC" },
    minPersons: 1,
    maxPersons: 30,
    available: true,
    idealFor: ["family", "couple"],
    cuisine: "Fruits de mer & Méditerranéenne",
    schedule: "12h–15h / 19h–23h30",
  },
  {
    id: "act5",
    category: "excursion",
    title: "Gorges de Zegzel — Excursion Guidée",
    description: "Découvrez les majestueuses gorges de Zegzel près de Berkane. Randonnée dans un cadre naturel exceptionnel avec guide local. Visite de la grotte de Chameau et dégustation d'oranges de Berkane.",
    city: "Berkane",
    address: "Gorges de Zegzel, Route de Tafoughalt",
    pricePerPerson: 180,
    duration: "Journée (6h)",
    images: [
      "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    ],
    included: ["Guide local", "Transport depuis Berkane", "Déjeuner traditionnel", "Eau & snacks"],
    rating: 4.9,
    reviewCount: 52,
    owner: { name: "Zegzel Guides", phone: "0600287382", avatar: "ZG" },
    minPersons: 2,
    maxPersons: 15,
    available: true,
    idealFor: ["family", "group", "solo"],
  },
  {
    id: "act6",
    category: "outdoor",
    title: "Randonnée Jbel Grouz — Coucher de Soleil",
    description: "Randonnée guidée au Jbel Grouz (1778m) avec coucher de soleil panoramique sur la région Oriental. Départ en fin d'après-midi, arrivée au sommet au crépuscule. Vue imprenable.",
    city: "Oujda",
    address: "Jbel Grouz, Route de Tafoughalt",
    pricePerPerson: 100,
    duration: "4h",
    images: [
      "https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?w=800",
      "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800",
    ],
    included: ["Guide certifié", "Équipement randonnée", "Collation", "Photos souvenirs"],
    rating: 4.7,
    reviewCount: 41,
    owner: { name: "Oriental Trekking", phone: "0600287382", avatar: "OT" },
    minPersons: 2,
    maxPersons: 12,
    available: true,
    idealFor: ["group", "solo", "couple"],
  },
  {
    id: "act7",
    category: "restaurant",
    title: "Dar Zitoun — Orangeraies de Berkane",
    description: "Restaurant familial en plein cœur des orangeraies de Berkane. Cuisine marocaine authentique dans un cadre naturel. Spécialité : poulet aux olives et couscous maison du vendredi.",
    city: "Berkane",
    address: "Route des Orangeraies, Km 3",
    pricePerPerson: 130,
    duration: "2h",
    images: [
      "https://images.unsplash.com/photo-1567360425618-1594206637d2?w=800",
      "https://images.unsplash.com/photo-1424847651672-bf20a4b0982b?w=800",
    ],
    included: ["Plat du jour", "Salade marocaine", "Pain maison", "Boisson fraîche"],
    rating: 4.8,
    reviewCount: 73,
    owner: { name: "Dar Zitoun", phone: "0536345007", avatar: "DZ" },
    minPersons: 1,
    maxPersons: 25,
    available: true,
    deal: 15,
    idealFor: ["family", "group"],
    cuisine: "Marocaine traditionnelle",
    schedule: "12h–15h / 18h–22h",
  },
  {
    id: "act8",
    category: "outdoor",
    title: "Pack Famille Plage Saidia — Journée",
    description: "Journée complète d'animations sur la plage de Saidia. Volleyball, pédalo, bouées et barbecue en bord de mer. Plage privée avec transats et parasols. Le paradis des familles.",
    city: "Berkane",
    address: "Plage Saidia, Secteur Animations",
    pricePerPerson: 80,
    duration: "Journée (8h)",
    images: [
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
      "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=800",
    ],
    included: ["Plage privée", "Parasol & transats", "Pédalo 1h", "Barbecue midi"],
    rating: 4.5,
    reviewCount: 95,
    owner: { name: "Saidia Beach Club", phone: "0600287382", avatar: "SB" },
    minPersons: 2,
    maxPersons: 20,
    available: true,
    idealFor: ["family"],
  },
  {
    id: "act9",
    category: "excursion",
    title: "Désert Figuig — Bivouac 2 Jours",
    description: "Découvrez les paysages désertiques de Figuig et ses palmeraies ancestrales. 2 jours avec nuit en bivouac sous les étoiles, randonnée dromadaire et feu de camp. Une expérience inoubliable.",
    city: "Jerada",
    address: "Figuig, via Bouarfa",
    pricePerPerson: 450,
    duration: "2 jours",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    included: ["Transport 4x4", "Guide", "Hébergement bivouac", "Repas (2j)", "Dromadaire", "Feu de camp"],
    rating: 5.0,
    reviewCount: 28,
    owner: { name: "Desert Oriental Tours", phone: "0600287382", avatar: "DO" },
    minPersons: 2,
    maxPersons: 10,
    available: true,
    idealFor: ["group", "couple", "solo"],
  },
  // ─── Activités nationales ─────────────────────────────────────
  {
    id: "act10",
    category: "excursion",
    title: "Tour Médina de Marrakech — Guide Officiel",
    description: "Découvrez les secrets de la médina de Marrakech avec un guide officiel : Jemaa El Fna, souks, Koutoubia, Bahia. Une plongée dans l'histoire et l'artisanat marocain.",
    city: "Marrakech",
    address: "Place Jemaa El Fna, Médina",
    pricePerPerson: 200,
    duration: "3h",
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?w=800",
      "https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800",
    ],
    included: ["Guide officiel", "Entrée Palais Bahia", "Thé à la menthe", "Dégustation épices"],
    rating: 4.9,
    reviewCount: 112,
    owner: { name: "Marrakech Découverte", phone: "0600287382", avatar: "MD" },
    minPersons: 1,
    maxPersons: 12,
    available: true,
    idealFor: ["family", "couple", "solo", "group"],
    deal: 10,
  },
  {
    id: "act11",
    category: "outdoor",
    title: "Kitesurf & Windsurf — Lagon de Dakhla",
    description: "Initiation ou perfectionnement kitesurf sur le lagon mythique de Dakhla. Conditions exceptionnelles : vent constant, eau plate, instructeurs certifiés. Le spot N°1 d'Afrique.",
    city: "Dakhla",
    address: "Dakhla Attitude Camp, Lagune",
    pricePerPerson: 600,
    duration: "3h",
    images: [
      "https://images.unsplash.com/photo-1531722569936-825d4ebd12f4?w=800",
      "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
    ],
    included: ["Équipement complet", "Instructeur certifié", "Assurance", "Transfert plage"],
    rating: 5.0,
    reviewCount: 76,
    owner: { name: "Dakhla Kite Center", phone: "0600287382", avatar: "DK" },
    minPersons: 1,
    maxPersons: 6,
    available: true,
    idealFor: ["couple", "group", "solo"],
  },
  {
    id: "act12",
    category: "restaurant",
    title: "Rick's Café — Casablanca",
    description: "Dîner dans l'iconique Rick's Café de Casablanca, inspiré du film Casablanca. Cuisine marocaine et internationale, ambiance jazz live, décoration années 40. Une soirée magique face au port.",
    city: "Casablanca",
    address: "248 Blvd Sour Jdid, Ancienne Médina",
    pricePerPerson: 350,
    duration: "2h",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800",
    ],
    included: ["Menu 3 services", "Musique live", "Verre de bienvenue"],
    rating: 4.8,
    reviewCount: 203,
    owner: { name: "Rick's Café Casablanca", phone: "0600287382", avatar: "RC" },
    minPersons: 2,
    maxPersons: 20,
    available: true,
    idealFor: ["couple", "family", "group"],
    cuisine: "Marocaine & Internationale",
    schedule: "18:00 - 00:00",
    deal: 5,
  },
  {
    id: "act13",
    category: "excursion",
    title: "Merzouga — Nuit en Bivouac Saharien",
    description: "Chevauchée en dromadaire jusqu'aux dunes de l'Erg Chebbi, nuit sous les étoiles dans un campement de luxe. Coucher et lever de soleil sur les dunes, musique gnawa, tajine au feu de bois.",
    city: "Merzouga",
    address: "Erg Chebbi, Merzouga",
    pricePerPerson: 550,
    duration: "24h",
    images: [
      "https://images.unsplash.com/photo-1509316785289-025f5b846b35?w=800",
      "https://images.unsplash.com/photo-1547471080-7cc2caa01a7e?w=800",
    ],
    included: ["Dromadaire A/R", "Tente luxe", "Dîner & petit-déj", "Musique", "Guide"],
    rating: 5.0,
    reviewCount: 89,
    owner: { name: "Sahara Dream Tours", phone: "0600287382", avatar: "SD" },
    minPersons: 1,
    maxPersons: 8,
    available: true,
    idealFor: ["couple", "family", "group", "solo"],
  },
  {
    id: "act14",
    category: "outdoor",
    title: "Surf à Taghazout — Cours & Session",
    description: "Cours de surf sur la plage mythique de Taghazout, près d'Agadir. Vagues adaptées à tous niveaux. Instructeurs certifiés ISA. Location matériel incluse. Spot mondialement reconnu.",
    city: "Agadir",
    address: "Taghazout Beach, 20km d'Agadir",
    pricePerPerson: 250,
    duration: "2h30",
    images: [
      "https://images.unsplash.com/photo-1531722569936-825d4ebd12f4?w=800",
      "https://images.unsplash.com/photo-1502680390469-be75c86b636f?w=800",
    ],
    included: ["Cours avec moniteur ISA", "Planche & combinaison", "Assurance", "Vidéo session"],
    rating: 4.8,
    reviewCount: 145,
    owner: { name: "Taghazout Surf School", phone: "0600287382", avatar: "TS" },
    minPersons: 1,
    maxPersons: 10,
    available: true,
    idealFor: ["solo", "couple", "group"],
    deal: 15,
  },
  {
    id: "act15",
    category: "restaurant",
    title: "Dar Roumana — Fès Médina",
    description: "Dîner gastronomique dans le riad Dar Roumana, niché dans la médina de Fès. Cuisine marocaine moderne revisitée par un chef étoilé. Vue sur les toits de la médina. Réservation indispensable.",
    city: "Fès",
    address: "30 Derb El Amer, Médina de Fès",
    pricePerPerson: 400,
    duration: "2h30",
    images: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800",
    ],
    included: ["Menu dégustation 5 services", "Thé à la menthe", "Amuse-bouches"],
    rating: 4.9,
    reviewCount: 67,
    owner: { name: "Dar Roumana Restaurant", phone: "0600287382", avatar: "DR" },
    minPersons: 2,
    maxPersons: 16,
    available: true,
    idealFor: ["couple", "family"],
    cuisine: "Gastronomique Marocaine",
    schedule: "19:00 - 23:00",
  },
  {
    id: "act16",
    category: "excursion",
    title: "Cap Spartel & Grottes d'Hercule — Tanger",
    description: "Excursion au Cap Spartel, point de rencontre entre l'Atlantique et la Méditerranée. Visite des mystérieuses Grottes d'Hercule. Vue imprenable sur le Détroit de Gibraltar.",
    city: "Tanger",
    address: "Cap Spartel, Tanger",
    pricePerPerson: 180,
    duration: "4h",
    images: [
      "https://images.unsplash.com/photo-1553697388-94e804e2f0f6?w=800",
      "https://images.unsplash.com/photo-1579033461380-adb47c3eb938?w=800",
    ],
    included: ["Transport aller-retour", "Guide", "Entrée grottes", "Thé"],
    rating: 4.7,
    reviewCount: 93,
    owner: { name: "Tanger Explorer", phone: "0600287382", avatar: "TE" },
    minPersons: 1,
    maxPersons: 15,
    available: true,
    idealFor: ["family", "couple", "solo", "group"],
  },
];

export function getActivityById(id: string) {
  return activities.find((a) => a.id === id);
}

export function filterActivities(params: {
  category?: string;
  city?: string;
  search?: string;
}) {
  return activities.filter((a) => {
    if (params.category && params.category !== "all" && a.category !== params.category) return false;
    if (params.city && params.city !== "all" && a.city !== params.city) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (
        !a.title.toLowerCase().includes(q) &&
        !a.city.toLowerCase().includes(q) &&
        !a.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}

export function getListingById(id: string) {
  return listings.find((l) => l.id === id);
}

export function filterListings(params: {
  type?: string;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}) {
  return listings.filter((l) => {
    if (params.type && params.type !== "all" && l.type !== params.type) return false;
    if (params.city && params.city !== "all" && l.city !== params.city) return false;
    if (params.minPrice && l.pricePerDay < params.minPrice) return false;
    if (params.maxPrice && l.pricePerDay > params.maxPrice) return false;
    if (params.search) {
      const q = params.search.toLowerCase();
      if (
        !l.title.toLowerCase().includes(q) &&
        !l.city.toLowerCase().includes(q) &&
        !l.description.toLowerCase().includes(q)
      )
        return false;
    }
    return true;
  });
}
