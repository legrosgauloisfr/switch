// One-time seed: pushes the same demo catalog the app has been running locally
// (src/data/seed/*.ts) into the real Supabase tables, so the app doesn't go blank the
// moment services/index.ts switches from the local store to Supabase.
//
// Run once: node scripts/seed-supabase.mjs
// Safe to re-run (deletes and re-inserts everything it manages) but pointless after the
// admin has made real edits in Supabase — it would wipe them.

import { readFileSync } from "node:fs";

function loadEnvLocal() {
  const text = readFileSync(new URL("../.env.local", import.meta.url), "utf8");
  const env = {};
  for (const line of text.split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m) env[m[1]] = m[2].trim();
  }
  return env;
}

const env = loadEnvLocal();
const URL_ = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.SUPABASE_SERVICE_ROLE_KEY;
if (!URL_ || !KEY) throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local");

const headers = {
  apikey: KEY,
  Authorization: `Bearer ${KEY}`,
  "Content-Type": "application/json",
};

async function rest(path, init) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    headers: { ...headers, ...(init?.headers ?? {}), Prefer: init?.method === "POST" ? "return=representation" : "" },
  });
  if (!r.ok) throw new Error(`${init?.method ?? "GET"} ${path} -> ${r.status}: ${await r.text()}`);
  const text = await r.text();
  return text ? JSON.parse(text) : null;
}
const insert = (table, rows) => rest(table, { method: "POST", body: JSON.stringify(rows) });
const clear = (table, keyCol = "id") => rest(`${table}?${keyCol}=not.is.null`, { method: "DELETE" });

console.log("Clearing existing catalog rows (safe on a fresh/demo project)...");
await clear("liquid_flavors", "liquid_id"); // composite PK, no id column
for (const t of [
  "device_specs", "device_images", "cartridges", "resistances", "liquid_images",
  "tutorial_steps", "devices", "liquids", "accessories", "tutorials", "faq_items", "advice_items",
  "articles", "notifications", "categories", "flavors", "brands",
]) {
  await clear(t);
}

console.log("Brands, categories, flavors...");
const [brand] = await insert("brands", [{ name: "Switch Select", description: "Sélection neutre assemblée par l'équipe Switch.", active: true }]);
await insert("categories", [
  { slug: "dispositifs", name: "Dispositifs", active: true },
  { slug: "e-liquides", name: "E-liquides", active: true },
  { slug: "accessoires", name: "Accessoires", active: true },
  { slug: "cartouches", name: "Cartouches", active: true },
  { slug: "resistances", name: "Résistances", active: true },
  { slug: "tutoriels", name: "Tutoriels", active: true },
]);
const flavorNames = ["Fruité", "Frais", "Gourmand", "Classique", "Boisson", "Mentholé", "Agrumes", "Fruits rouges"];
const flavors = await insert("flavors", flavorNames.map((name) => ({ name, active: true })));
const flavorIdByName = Object.fromEntries(flavors.map((f) => [f.name, f.id]));

console.log("Devices + specs...");
const devices = await insert("devices", [
  { name: "Pod Compact A1", brand_id: brand.id, kind: "Pod rechargeable · cartouches", price_eur: 39, running_cost_label: "≈ 12 € / mois de consommables", simplicity: 5, autonomy: 3, format_tag: "compact", simplicity_tag: "simple", budget_tier: "mid", active: true },
  { name: "Kit Équilibre B2", brand_id: brand.id, kind: "Kit rechargeable · réservoir", price_eur: 54, running_cost_label: "≈ 10 € / mois de consommables", simplicity: 4, autonomy: 4, format_tag: "standard", simplicity_tag: "customizable", budget_tier: "mid-high", active: true },
  { name: "Pod Essentiel C0", brand_id: brand.id, kind: "Pod rechargeable · cartouches", price_eur: 24, running_cost_label: "≈ 13 € / mois de consommables", simplicity: 5, autonomy: 2, format_tag: "compact", simplicity_tag: "simple", budget_tier: "low", active: true },
]);
const [a, b] = devices;

const specsByDevice = {
  [a.id]: [["Format", "Compact"], ["Batterie", "900 mAh"], ["Cartouches", "Préremplies, clipsables"], ["Tirage", "Serré"], ["Réglages", "Aucun — prêt à l'emploi"]],
  [b.id]: [["Format", "Standard"], ["Batterie", "1500 mAh"], ["Réservoir", "Rechargeable, 2 ml"], ["Tirage", "Serré à moyen"], ["Réglages", "Puissance ajustable"]],
  [devices[2].id]: [["Format", "Très compact"], ["Batterie", "650 mAh"], ["Cartouches", "Préremplies"], ["Tirage", "Serré"], ["Réglages", "Aucun"]],
};
const specRows = Object.entries(specsByDevice).flatMap(([device_id, pairs]) =>
  pairs.map(([key, value], i) => ({ device_id, key, value, sort_order: i }))
);
await insert("device_specs", specRows);

console.log("Cartridges + resistances...");
await insert("cartridges", [
  { device_id: a.id, name: "Cartouche standard 2 ml", description: "Préremplie, clipsable.", active: true },
  { device_id: a.id, name: "Cartouche XL 3 ml", description: "Autonomie prolongée.", active: true },
]);
await insert("resistances", [
  { device_id: b.id, name: "Résistance 0.6 Ω", ohm: 0.6, description: "Tirage aéré.", active: true },
  { device_id: b.id, name: "Résistance 1.0 Ω", ohm: 1.0, description: "Tirage serré, plus économique.", active: true },
]);

console.log("Accessories...");
await insert("accessories", [
  { name: "Câble de charge USB-C", description: "Câble certifié, 1 m.", price_eur: 6, active: true },
  { name: "Étui de transport", description: "Protège l'appareil et une cartouche de rechange.", price_eur: 9, active: true },
]);

console.log("Liquids + flavor links...");
const liquidSeed = [
  ["Fruits du verger", "Fruité", "Fruité", "Pomme et poire, rondeur douce sans sucre marqué."],
  ["Fruits rouges", "Fruits rouges", "Fruité", "Fraise et framboise, l'entrée la plus consensuelle."],
  ["Agrumes", "Agrumes", "Fruité", "Citron et pamplemousse, vif et net en fin de bouffée."],
  ["Fraîcheur légère", "Frais", "Frais", "Une pointe de fraîcheur, utile après les repas."],
  ["Menthe douce", "Mentholé", "Frais", "Menthe nette, proche des sensations recherchées le matin."],
  ["Vanille crème", "Gourmand", "Gourmand", "Gourmand discret, à alterner avec un fruité."],
  ["Classique blond", "Classique", "Classique", "Le plus proche du goût du tabac, sans en être une copie."],
  ["Café expresso", "Boisson", "Boisson", "Note torréfiée, à réserver aux moments café."],
];
const liquids = await insert(
  "liquids",
  liquidSeed.map(([name, , universe, desc]) => ({ name, brand_id: brand.id, universe, description_short: desc, spec_hint: "10 ml · ≈ 6 €", active: true }))
);
await insert(
  "liquid_flavors",
  liquids.map((l, i) => ({ liquid_id: l.id, flavor_id: flavorIdByName[liquidSeed[i][1]] })).filter((r) => r.flavor_id)
);

console.log("Tutorials + steps...");
const tutorialSeed = [
  ["Première utilisation", "PRISE EN MAIN", 3, "Quelques gestes suffisent pour bien démarrer. Prenez votre temps, rien ne presse.", "Vos dix premières minutes", [
    "Chargez complètement l'appareil avant la première utilisation.", "Clipsez la cartouche jusqu'au léger déclic.",
    "Attendez cinq minutes pour que la résistance s'imbibe.", "Tirez doucement, par bouffées courtes et régulières.",
  ]],
  ["Entretien", "ENTRETIEN", 4, "Un appareil propre dure plus longtemps et restitue mieux les saveurs.", "Le garder propre et fiable", [
    "Essuyez le contact avec un chiffon sec une fois par semaine.", "Retirez la cartouche et nettoyez le logement.",
    "Évitez l'eau sur les parties électroniques.", "Rangez l'appareil à l'abri de la chaleur.",
  ]],
  ["Changer la cartouche", "CARTOUCHE", 2, "La cartouche se remplace lorsque le goût s'affaiblit.", "En deux minutes", [
    "Tirez la cartouche vers le haut sans forcer.", "Jetez-la dans un point de collecte adapté.",
    "Clipsez la nouvelle cartouche.", "Patientez cinq minutes avant la première bouffée.",
  ]],
  ["Changer la résistance", "RÉSISTANCE", 5, "Une résistance usée donne un goût de brûlé : c'est le signal.", "Reconnaître le bon moment", [
    "Videz le réservoir avant l'opération.", "Dévissez l'ancienne résistance.",
    "Amorcez la nouvelle avec quelques gouttes de e-liquide.", "Remplissez, puis attendez dix minutes.",
  ]],
  ["Recharger", "RECHARGE", 2, "Une recharge correcte préserve la batterie.", "Préserver la batterie", [
    "Utilisez le câble fourni ou un chargeur certifié.", "Ne laissez pas l'appareil en charge sans surveillance.",
    "Débranchez une fois la charge terminée.", "Évitez de descendre systématiquement à zéro.",
  ]],
  ["Comprendre le e-liquide", "E-LIQUIDE", 6, "Trois repères suffisent : le taux de nicotine, le ratio PG/VG et la saveur.", "Trois repères à connaître", [
    "Le taux de nicotine s'ajuste selon votre consommation actuelle.", "Un ratio riche en PG donne un tirage plus serré.",
    "Les sels de nicotine adoucissent le passage en gorge.", "Conservez vos flacons hors de portée des enfants.",
  ]],
];
const tutorials = await insert(
  "tutorials",
  tutorialSeed.map(([title, category, duration_min, intro, grid_summary], i) => ({ title, category, duration_min, intro, grid_summary, published: true, sort_order: i }))
);
await insert(
  "tutorial_steps",
  tutorials.flatMap((t, i) => tutorialSeed[i][5].map((text, n) => ({ tutorial_id: t.id, n: n + 1, text })))
);

console.log("FAQ, advice, articles, notifications...");
await insert("faq_items", [
  ["Le vapotage aide-t-il à arrêter de fumer ?", "Les autorités sanitaires françaises considèrent que son efficacité comme outil de sevrage n'est pas suffisamment établie. L'arrêt complet du tabac reste l'objectif prioritaire, et un accompagnement professionnel ou des traitements de substitution nicotinique validés peuvent vous y aider."],
  ["Switch est-elle payante ?", "Non. L'accès est gratuit et sans abonnement. Certains liens vers des boutiques partenaires sont rémunérés, et toujours signalés comme tels."],
  ["Comment sont classées les recommandations ?", "Uniquement à partir de vos réponses : format, niveau de simplicité, budget et préférences de saveurs. La rémunération d'un partenaire ne modifie pas l'ordre affiché."],
  ["Quel taux de nicotine choisir ?", "Il dépend de votre consommation actuelle et de vos sensations. En cas de doute, un professionnel de santé ou un conseiller en boutique peut vous orienter."],
  ["Les puffs jetables sont-elles proposées ?", "Non. Leur vente est interdite en France depuis 2025 ; elles ne figurent pas dans nos recommandations."],
  ["Mes données sont-elles partagées ?", "Vos réponses servent uniquement à personnaliser votre sélection dans l'application. Vous pouvez les modifier ou les effacer à tout moment."],
].map(([question, answer], i) => ({ question, answer, published: true, sort_order: i })));

await insert("advice_items", [
  ["HABITUDES", "Repérer les deux ou trois moments où l'envie revient le plus souvent rend la journée plus facile à anticiper."],
  ["MATÉRIEL", "Un appareil chargé et une cartouche disponible évitent la plupart des rechutes de dépannage."],
  ["ENTOURAGE", "Prévenir une personne de confiance de votre démarche aide à tenir les premiers jours."],
  ["ACCOMPAGNEMENT", "Tabac info service (39 89) propose un accompagnement gratuit par des professionnels."],
].map(([tag, text], i) => ({ tag, text, published: true, sort_order: i })));

await insert("articles", [
  ["Ce que dit la réglementation française", "Réglementation", "Âge minimum, vente en ligne, lieux publics : les règles en vigueur en 2026.", "La vente de produits de vapotage est interdite aux mineurs en France. La vente en ligne est encadrée et nécessite une vérification d'âge.\n\nLes puffs jetables sont interdites à la vente depuis 2025. L'usage dans les lieux publics fermés suit les mêmes restrictions que le tabac dans de nombreux établissements.\n\nCes informations sont données à titre indicatif et peuvent évoluer : renseignez-vous auprès des sources officielles pour toute décision importante."],
  ["Les traitements de substitution nicotinique validés", "Guide", "Patchs, gommes, pastilles : un aperçu des options reconnues par les autorités de santé.", "Les traitements de substitution nicotinique (patchs, gommes, pastilles, inhaleurs) sont des dispositifs médicaux dont l'efficacité pour l'arrêt du tabac est reconnue par les autorités sanitaires.\n\nIls sont disponibles en pharmacie, souvent remboursés partiellement, et peuvent être combinés entre eux sous certaines conditions.\n\nUn professionnel de santé ou un tabacologue peut vous aider à choisir le dosage adapté à votre consommation."],
].map(([title, category, excerpt, body], i) => ({ title, category, excerpt, body, published: true, sort_order: i })));

await insert("notifications", [
  { title: "Bienvenue sur Switch", body: "Votre sélection est prête, elle s'ajuste automatiquement à vos réponses.", unread: true, published: true },
]);

console.log("Done.");
