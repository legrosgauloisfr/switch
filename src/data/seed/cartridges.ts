import type { Cartridge, Resistance } from "@/types";

export const CARTRIDGES: Cartridge[] = [
  { id: "cart-a1", deviceId: "a", name: "Cartouche standard 2 ml", description: "Préremplie, clipsable.", active: true },
  { id: "cart-a1-xl", deviceId: "a", name: "Cartouche XL 3 ml", description: "Autonomie prolongée.", active: true },
];

export const RESISTANCES: Resistance[] = [
  { id: "res-b2-06", deviceId: "b", name: "Résistance 0.6 Ω", ohm: 0.6, description: "Tirage aéré.", active: true },
  { id: "res-b2-10", deviceId: "b", name: "Résistance 1.0 Ω", ohm: 1.0, description: "Tirage serré, plus économique.", active: true },
];
