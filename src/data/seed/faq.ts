import type { FaqItem } from "@/types";

export const FAQ: FaqItem[] = [
  { id: "efficacite", question: "Le vapotage aide-t-il à arrêter de fumer ?", answer: "Les autorités sanitaires françaises considèrent que son efficacité comme outil de sevrage n'est pas suffisamment établie. L'arrêt complet du tabac reste l'objectif prioritaire, et un accompagnement professionnel ou des traitements de substitution nicotinique validés peuvent vous y aider.", published: true, sortOrder: 0 },
  { id: "payant", question: "Switch est-elle payante ?", answer: "Non. L'accès est gratuit et sans abonnement. Certains liens vers des boutiques partenaires sont rémunérés, et toujours signalés comme tels.", published: true, sortOrder: 1 },
  { id: "classement", question: "Comment sont classées les recommandations ?", answer: "Uniquement à partir de vos réponses : format, niveau de simplicité, budget et préférences de saveurs. La rémunération d'un partenaire ne modifie pas l'ordre affiché.", published: true, sortOrder: 2 },
  { id: "nicotine", question: "Quel taux de nicotine choisir ?", answer: "Il dépend de votre consommation actuelle et de vos sensations. En cas de doute, un professionnel de santé ou un conseiller en boutique peut vous orienter.", published: true, sortOrder: 3 },
  { id: "puffs", question: "Les puffs jetables sont-elles proposées ?", answer: "Non. Leur vente est interdite en France depuis 2025 ; elles ne figurent pas dans nos recommandations.", published: true, sortOrder: 4 },
  { id: "donnees", question: "Mes données sont-elles partagées ?", answer: "Vos réponses servent uniquement à personnaliser votre sélection dans l'application. Vous pouvez les modifier ou les effacer à tout moment.", published: true, sortOrder: 5 },
];
