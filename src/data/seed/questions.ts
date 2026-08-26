import type { QuizQuestion } from "@/types";

// Ported 1:1 from the QUESTIONS array in the Claude Design prototype (Switch.dc.html).
export const QUESTIONS: QuizQuestion[] = [
  {
    id: "goal",
    type: "list",
    title: "Qu'est-ce que vous recherchez aujourd'hui ?",
    help: "Il n'y a pas de mauvaise réponse.",
    options: [
      { label: "Je veux arrêter de fumer" },
      { label: "Je veux réduire progressivement" },
      { label: "Je souhaite découvrir la vape" },
      { label: "Je ne sais pas encore" },
    ],
  },
  {
    id: "cigs",
    type: "slider",
    title: "Combien de cigarettes fumez-vous habituellement par jour ?",
  },
  {
    id: "moments",
    type: "list",
    multi: true,
    title: "Quand fumez-vous le plus ?",
    help: "Plusieurs réponses possibles.",
    options: [
      { label: "Au réveil" },
      { label: "Après les repas" },
      { label: "Au travail" },
      { label: "En soirée" },
      { label: "En conduisant" },
      { label: "Lors de moments stressants" },
      { label: "Régulièrement toute la journée" },
    ],
  },
  {
    id: "exp",
    type: "list",
    title: "Avez-vous déjà utilisé une cigarette électronique ?",
    options: [
      { label: "Jamais" },
      { label: "Occasionnellement" },
      { label: "Régulièrement" },
      { label: "J'en utilise actuellement une" },
    ],
  },
  {
    id: "format",
    type: "cards",
    title: "Quel type de format vous attire le plus ?",
    help: "Pas besoin de vocabulaire technique.",
    options: [
      { label: "Compact", desc: "Petit et discret.", gaugeWidth: "18px", gaugeHeight: "30px" },
      { label: "Classique", desc: "Équilibre simplicité / autonomie.", gaugeWidth: "24px", gaugeHeight: "40px" },
      { label: "Plus autonome", desc: "Plus grand format, batterie plus large.", gaugeWidth: "30px", gaugeHeight: "50px" },
    ],
  },
  {
    id: "simplicity",
    type: "cards",
    title: "Vous cherchez plutôt…",
    options: [
      { label: "Simple", desc: "Je veux quelque chose de facile à utiliser.", gaugeWidth: "20px", gaugeHeight: "20px" },
      { label: "Personnalisable", desc: "Je veux pouvoir régler davantage de paramètres.", gaugeWidth: "20px", gaugeHeight: "34px" },
      { label: "Je ne sais pas", desc: "Aidez-moi à choisir.", gaugeWidth: "20px", gaugeHeight: "46px" },
    ],
  },
  {
    id: "budget",
    type: "list",
    title: "Quel budget souhaitez-vous consacrer à votre matériel ?",
    help: "Indicatif, sans engagement.",
    options: [
      { label: "Moins de 30 €" },
      { label: "30–50 €" },
      { label: "50–80 €" },
      { label: "80 € et plus" },
    ],
  },
  {
    id: "flavors",
    type: "chips",
    multi: true,
    title: "Quels univers de saveurs vous attirent ?",
    help: "Choisissez-en un ou plusieurs.",
    options: [
      { label: "Fruité" },
      { label: "Frais" },
      { label: "Gourmand" },
      { label: "Classique" },
      { label: "Boisson" },
      { label: "Mentholé" },
      { label: "Agrumes" },
      { label: "Fruits rouges" },
    ],
  },
];
