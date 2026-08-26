import type { Article } from "@/types";

export const ARTICLES: Article[] = [
  {
    id: "art-reglementation",
    title: "Ce que dit la réglementation française",
    category: "Réglementation",
    excerpt: "Âge minimum, vente en ligne, lieux publics : les règles en vigueur en 2026.",
    body: "La vente de produits de vapotage est interdite aux mineurs en France. La vente en ligne est encadrée et nécessite une vérification d'âge.\n\nLes puffs jetables sont interdites à la vente depuis 2025. L'usage dans les lieux publics fermés suit les mêmes restrictions que le tabac dans de nombreux établissements.\n\nCes informations sont données à titre indicatif et peuvent évoluer : renseignez-vous auprès des sources officielles pour toute décision importante.",
    published: true,
    sortOrder: 0,
  },
  {
    id: "art-substitution",
    title: "Les traitements de substitution nicotinique validés",
    category: "Guide",
    excerpt: "Patchs, gommes, pastilles : un aperçu des options reconnues par les autorités de santé.",
    body: "Les traitements de substitution nicotinique (patchs, gommes, pastilles, inhaleurs) sont des dispositifs médicaux dont l'efficacité pour l'arrêt du tabac est reconnue par les autorités sanitaires.\n\nIls sont disponibles en pharmacie, souvent remboursés partiellement, et peuvent être combinés entre eux sous certaines conditions.\n\nUn professionnel de santé ou un tabacologue peut vous aider à choisir le dosage adapté à votre consommation.",
    published: true,
    sortOrder: 1,
  },
];
