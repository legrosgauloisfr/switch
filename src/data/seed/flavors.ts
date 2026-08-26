import type { Flavor } from "@/types";

export const FLAVORS: Flavor[] = [
  "Fruité", "Frais", "Gourmand", "Classique", "Boisson", "Mentholé", "Agrumes", "Fruits rouges",
].map((name, i) => ({ id: `flavor-${i}`, name, active: true }));
