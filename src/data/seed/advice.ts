import type { AdviceItem, NotificationItem } from "@/types";

export const ADVICE: AdviceItem[] = [
  { id: "habitudes", tag: "HABITUDES", text: "Repérer les deux ou trois moments où l'envie revient le plus souvent rend la journée plus facile à anticiper.", published: true, sortOrder: 0 },
  { id: "materiel", tag: "MATÉRIEL", text: "Un appareil chargé et une cartouche disponible évitent la plupart des rechutes de dépannage.", published: true, sortOrder: 1 },
  { id: "entourage", tag: "ENTOURAGE", text: "Prévenir une personne de confiance de votre démarche aide à tenir les premiers jours.", published: true, sortOrder: 2 },
  { id: "accompagnement", tag: "ACCOMPAGNEMENT", text: "Tabac info service (39 89) propose un accompagnement gratuit par des professionnels.", published: true, sortOrder: 3 },
];

export const NOTIFICATIONS: NotificationItem[] = [
  { id: "n1", title: "Votre prochaine étape", text: "Le guide « Changer la cartouche » vous attend, il prend deux minutes.", when: "Il y a 2 heures", unread: true, published: true, createdAt: Date.now() - 2 * 3600000 },
  { id: "n2", title: "Conseil du jour", text: "Comprendre vos habitudes peut vous aider à identifier les moments les plus difficiles.", when: "Ce matin, 08:00", unread: true, published: true, createdAt: Date.now() - 6 * 3600000 },
  { id: "n3", title: "Jour 10", text: "Dix jours depuis votre décision. Votre journal compte trois notes cette semaine.", when: "Il y a 2 jours", unread: false, published: true, createdAt: Date.now() - 2 * 86400000 },
  { id: "n4", title: "Votre sélection a été mise à jour", text: "Vous avez modifié votre budget : une option a changé dans vos recommandations.", when: "Il y a 5 jours", unread: false, published: true, createdAt: Date.now() - 5 * 86400000 },
];
