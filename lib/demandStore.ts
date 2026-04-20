export interface RentalDemand {
  id: string;
  type: "apartment" | "house" | "car" | "parking" | "local";
  city: string;
  budgetMin: number;
  budgetMax: number;
  budgetUnit: "day" | "month";
  duration: string;
  bedrooms?: number;
  description: string;
  contactName: string;
  contactPhone: string;
  createdAt: string;
}

const KEY = "Rachra_demands";

export function getDemands(): RentalDemand[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}

export function saveDemand(demand: Omit<RentalDemand, "id" | "createdAt">): RentalDemand {
  const demands = getDemands();
  const newDemand: RentalDemand = {
    ...demand,
    id: `demand_${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  demands.unshift(newDemand);
  localStorage.setItem(KEY, JSON.stringify(demands));
  return newDemand;
}
