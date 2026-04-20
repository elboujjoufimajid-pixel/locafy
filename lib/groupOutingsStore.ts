import type { GroupOuting } from "./data";

const KEY = "Rachra_groupOutings";

const defaultOutings: GroupOuting[] = [
  {
    id: "go1",
    title: "Plage de Saidia — Sortie weekend",
    description: "On se retrouve à Saidia pour une journée à la plage ! Baignade, volleyball, barbecue sur place. Ambiance détendue, tout le monde est bienvenu.",
    category: "plage",
    city: "Berkane",
    meetingPoint: "Parking principal Plage de Saidia",
    date: "2026-04-20",
    time: "09:00",
    maxParticipants: 15,
    participants: ["user1@ex.com", "user2@ex.com", "user3@ex.com"],
    organizer: { name: "Karim A.", avatar: "KA", phone: "0600287382" },
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800",
    price: 0,
    tags: ["plage", "barbecue", "volleyball"],
    createdAt: "2026-04-10T10:00:00Z",
  },
  {
    id: "go2",
    title: "Randonnée Gorges de Zegzel",
    description: "Randonnée guidée dans les gorges de Zegzel. Niveau facile à moyen. On s'arrête à la grotte et on déjeune ensemble avec des oranges de Berkane.",
    category: "randonnee",
    city: "Berkane",
    meetingPoint: "Entrée des Gorges de Zegzel, Route de Tafoughalt",
    date: "2026-04-19",
    time: "07:30",
    maxParticipants: 12,
    participants: ["user4@ex.com", "user5@ex.com"],
    organizer: { name: "Sara M.", avatar: "SM" },
    image: "https://images.unsplash.com/photo-1551632811-561732d1e306?w=800",
    price: 0,
    tags: ["nature", "randonnée", "gorges"],
    createdAt: "2026-04-09T08:00:00Z",
  },
  {
    id: "go3",
    title: "Iftar collectif — Restaurant Al Andalous",
    description: "Iftar en groupe au restaurant Al Andalous. Menu traditionnel marocain. On réserve une grande table, prix partagé entre tous.",
    category: "resto",
    city: "Oujda",
    meetingPoint: "Restaurant Al Andalous, Boulevard Allal Ben Abdallah",
    date: "2026-04-18",
    time: "18:30",
    maxParticipants: 20,
    participants: ["user6@ex.com", "user7@ex.com", "user8@ex.com", "user9@ex.com", "user10@ex.com"],
    organizer: { name: "Hamza B.", avatar: "HB" },
    image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800",
    price: 120,
    tags: ["iftar", "traditionnel", "groupe"],
    createdAt: "2026-04-08T12:00:00Z",
  },
  {
    id: "go4",
    title: "Road Trip — Nador à Figuig",
    description: "Road trip épique de Nador jusqu'à Figuig ! On traverse l'Oriental, on découvre des villages perchés, on campe une nuit sous les étoiles.",
    category: "roadtrip",
    city: "Nador",
    meetingPoint: "Station Total, Sortie Nador direction Oujda",
    date: "2026-04-26",
    time: "06:00",
    maxParticipants: 8,
    participants: ["user11@ex.com"],
    organizer: { name: "Youssef T.", avatar: "YT" },
    image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800",
    price: 200,
    tags: ["road trip", "camping", "désert"],
    createdAt: "2026-04-07T15:00:00Z",
  },
  {
    id: "go5",
    title: "Gaming Night — Café Gamer Oujda",
    description: "Soirée gaming au café ! FIFA, Tekken, ou jeux de société pour ceux qui préfèrent. Ambiance cool, on reste jusqu'à minuit.",
    category: "gaming",
    city: "Oujda",
    meetingPoint: "Café Gamer Zone, Hay Salam Oujda",
    date: "2026-04-17",
    time: "20:00",
    maxParticipants: 10,
    participants: ["user12@ex.com", "user13@ex.com", "user14@ex.com"],
    organizer: { name: "Reda K.", avatar: "RK" },
    image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800",
    price: 30,
    tags: ["gaming", "FIFA", "soirée"],
    createdAt: "2026-04-06T18:00:00Z",
  },
  {
    id: "go6",
    title: "Volleyball — Plage Ras El Ma",
    description: "Match de volleyball sur la plage de Ras El Ma. 2 équipes mixtes, tout niveau. Après le match on se baigne et on mange ensemble.",
    category: "sport",
    city: "Berkane",
    meetingPoint: "Plage Ras El Ma, filet central",
    date: "2026-04-21",
    time: "10:00",
    maxParticipants: 14,
    participants: ["user15@ex.com", "user16@ex.com", "user17@ex.com", "user18@ex.com"],
    organizer: { name: "Imane R.", avatar: "IR" },
    image: "https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800",
    price: 0,
    tags: ["sport", "volleyball", "plage"],
    createdAt: "2026-04-05T09:00:00Z",
  },
];

export function getOutings(): GroupOuting[] {
  if (typeof window === "undefined") return defaultOutings;
  const s = localStorage.getItem(KEY);
  return s ? JSON.parse(s) : defaultOutings;
}

export function saveOuting(outing: GroupOuting) {
  const all = getOutings();
  const idx = all.findIndex((o) => o.id === outing.id);
  if (idx >= 0) all[idx] = outing;
  else all.unshift(outing);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function joinOuting(outingId: string, userKey: string): boolean {
  const all = getOutings();
  const outing = all.find((o) => o.id === outingId);
  if (!outing) return false;
  if (outing.participants.includes(userKey)) return false;
  if (outing.participants.length >= outing.maxParticipants) return false;
  outing.participants.push(userKey);
  localStorage.setItem(KEY, JSON.stringify(all));
  return true;
}

export function leaveOuting(outingId: string, userKey: string): boolean {
  const all = getOutings();
  const outing = all.find((o) => o.id === outingId);
  if (!outing) return false;
  outing.participants = outing.participants.filter((p) => p !== userKey);
  localStorage.setItem(KEY, JSON.stringify(all));
  return true;
}

export function isJoined(outingId: string, userKey: string): boolean {
  return getOutings().find((o) => o.id === outingId)?.participants.includes(userKey) ?? false;
}
