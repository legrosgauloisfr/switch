import type { Liquid } from "@/types";

// Ported from the `catalogue` map inside the prototype's renderVals(). Keyed by the flavor
// tag a user can pick in the quiz.
export const LIQUIDS: Liquid[] = [
  { id: "fruite", name: "Fruits du verger", flavorTag: "Fruité", universe: "Fruité", description: "Pomme et poire, rondeur douce sans sucre marqué.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "fruits-rouges", name: "Fruits rouges", flavorTag: "Fruits rouges", universe: "Fruité", description: "Fraise et framboise, l'entrée la plus consensuelle.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "agrumes", name: "Agrumes", flavorTag: "Agrumes", universe: "Fruité", description: "Citron et pamplemousse, vif et net en fin de bouffée.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "frais", name: "Fraîcheur légère", flavorTag: "Frais", universe: "Frais", description: "Une pointe de fraîcheur, utile après les repas.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "mentholee", name: "Menthe douce", flavorTag: "Mentholé", universe: "Frais", description: "Menthe nette, proche des sensations recherchées le matin.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "gourmand", name: "Vanille crème", flavorTag: "Gourmand", universe: "Gourmand", description: "Gourmand discret, à alterner avec un fruité.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "classique", name: "Classique blond", flavorTag: "Classique", universe: "Classique", description: "Le plus proche du goût du tabac, sans en être une copie.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
  { id: "boisson", name: "Café expresso", flavorTag: "Boisson", universe: "Boisson", description: "Note torréfiée, à réserver aux moments café.", specHint: "10 ml · ≈ 6 €", images: [], active: true },
];
