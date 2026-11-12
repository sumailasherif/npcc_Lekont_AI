"use client";

import { useLanguage } from "@/components/language-provider";
import type { Locale } from "@/lib/i18n";

/**
 * Copy for the WhatsApp experience (tour, live bot, side cards, autoplay script) in every locale.
 * Quick replies are commands the bot engine understands in that language
 * (facture/faktir, vendu/vann, rapport, stock, TVA).
 */
const COPY = {
  en: {
    quick: ["invoice Ramesh 2500", "sales report today", "what is low in stock?", "sold 3 bags at 250", "VAT this month"],
    welcome: `Hi 👋 I'm Lekont, your back office on WhatsApp. Invoices, payslips and your numbers, all from this chat.

🧾 Invoices: "invoice Ramesh 2500" and I draft it, ready to send as a PDF
📊 Know your numbers: sales, spend, VAT and profit, with a live dashboard
💸 Sales and stock: "sold 3 bags at 250", "what is low in stock?"
👥 Payslips: prepare your team's monthly pay in minutes
📥 Imports: send an Excel, CSV or CRM export and I'll bring it in
📤 Exports: PDF, CSV or Excel, whenever you need them
📒 Your notebook: snap a page and I'll read it for you

Just type what you need. Nothing is saved until you confirm.`,
    features: [
      ["Invoices", "“invoice Ramesh 2500” → a draft, ready as PDF"],
      ["Business intelligence", "sales, spend, VAT and profit with a live dashboard"],
      ["Sales and stock", "record a sale, see what is running low"],
      ["Payslips", "prepare the team's monthly pay"],
      ["Imports and exports", "Excel, CSV and CRM exports in; PDF, CSV and Excel out"],
      ["Notebook photo", "send a page, Lekont reads it and asks before saving"],
    ],
    handles: "What the bot handles",
    errApi: "API not reachable. Start it on port 8010.",
    errReply: "The bot did not answer. Check the API and try again.",
    errReset: "Could not reset the conversation.",
    live: {
      eyebrow: "Try it live · WhatsApp chatbot",
      title: "Talk to Lekont",
      highlight: "yourself.",
      description: "This is the real bot engine. Type your own request, tap a suggestion, or send a notebook photo and see what comes back.",
      reset: "Reset conversation",
    },
    demo: {
      eyebrow: "Business automation and intelligence · on WhatsApp",
      title: "Run the business",
      highlight: "from a chat.",
      description: "Watch one morning in the shop: an invoice, a notebook photo, an approval, the month's numbers and the daily report, all in one thread.",
      cta: "Try it live yourself",
    },
    message: "Message",
    sendPhoto: "Send a notebook photo",
    verified: "Verified business",
    typing: "typing…",
    online: "online",
    today: "Today",
    synthetic: "🔒 Synthetic demo. Messages stay on this machine; no real customer data.",
    cards: {
      invoice: ["Invoice INV-0418", "Ramesh Traders · MUR 2,500", "ready"],
      numbers: ["Know your numbers", "This month · MUR 91,900", "▲ 12% vs last month"],
      payslips: ["Payslips · November", "6 employees · MUR 141,600", "ready to review"],
      importing: ["Importing sales.xlsx", "Excel · 248 rows"],
      crm: ["CRM contacts synced", "1,204 customers · just now", "Live sync with your CRM and spreadsheets"],
      notebook: ["Notebook page read", "5 lines · MUR 3,450"],
    },
    data: {
      sale: "Sale recorded",
      notebook: "Notebook preview",
      needsReview: "needs review",
      total: "Total",
      replyPost: "Reply “post” to add these sales.",
    },
    stages: ["Capture", "Read", "Approve", "Analyse", "Report"],
    script: {
      welcome: "Hi 👋 I'm Lekont, your business automation and intelligence assistant. Tell me what happened today, or ask for your numbers.",
      turns: [
        ["invoice Ramesh 2500", "🧾 Invoice INV-0419 drafted for Ramesh · MUR 2,500.\nSent to the Head of Finance for approval."],
        ["[photo]", "📒 I read 3 lines from your notebook:\n• Sugar 5 kg · MUR 425\n• Milk 12 packs · MUR 960\n• Transport · MUR 300\nReply YES to save them."],
        ["YES", "✅ Saved to your ledger after your approval. Today's spend: MUR 1,685."],
        ["how much did I sell this month?", "📊 November so far: MUR 122,600 in sales, up 9% on October. Best day: Saturday.\n⚠ Sugar runs out in about 4 days at this pace."],
        ["send me the daily report", "📄 Daily report · 12 Nov.pdf is ready: sales, spend, VAT and stock in one page."],
      ],
    },
  },
  fr: {
    quick: ["facture Ramesh 2500", "rapport des ventes du jour", "stock faible ?", "vendu 3 sacs a 250", "TVA du mois"],
    welcome: `Bonjour 👋 Je suis Lekont, votre back-office sur WhatsApp. Factures, bulletins de paie et vos chiffres, tout depuis ce chat.

🧾 Factures : « facture Ramesh 2500 » et je prépare le brouillon, prêt à envoyer en PDF
📊 Vos chiffres : ventes, dépenses, TVA et bénéfice, avec un tableau de bord en direct
💸 Ventes et stock : « vendu 3 sacs a 250 », « stock faible ? »
👥 Paie : préparez la paie de l’équipe en quelques minutes
📥 Imports : envoyez un export Excel, CSV ou CRM et je l’intègre
📤 Exports : PDF, CSV ou Excel, quand vous voulez
📒 Votre cahier : prenez une page en photo et je la lis pour vous

Écrivez simplement ce dont vous avez besoin. Rien n’est enregistré sans votre accord.`,
    features: [
      ["Factures", "« facture Ramesh 2500 » → un brouillon, prêt en PDF"],
      ["Intelligence d’affaires", "ventes, dépenses, TVA et bénéfice en direct"],
      ["Ventes et stock", "enregistrer une vente, voir ce qui manque"],
      ["Bulletins de paie", "préparer la paie mensuelle de l’équipe"],
      ["Imports et exports", "Excel, CSV et CRM en entrée ; PDF, CSV et Excel en sortie"],
      ["Photo du cahier", "envoyez une page, Lekont la lit et demande avant d’enregistrer"],
    ],
    handles: "Ce que le bot sait faire",
    errApi: "API injoignable. Lancez-la sur le port 8010.",
    errReply: "Le bot n’a pas répondu. Vérifiez l’API et réessayez.",
    errReset: "Impossible de réinitialiser la conversation.",
    live: {
      eyebrow: "Essai en direct · chatbot WhatsApp",
      title: "Parlez à Lekont",
      highlight: "vous-même.",
      description: "C’est le vrai moteur du bot. Écrivez votre demande, touchez une suggestion ou envoyez une photo de cahier pour voir la réponse.",
      reset: "Réinitialiser la conversation",
    },
    demo: {
      eyebrow: "Automatisation et intelligence d’affaires · sur WhatsApp",
      title: "Gérez l’entreprise",
      highlight: "depuis un chat.",
      description: "Une matinée à la boutique : une facture, une photo de cahier, une validation, les chiffres du mois et le rapport du jour, dans une seule conversation.",
      cta: "Essayer en direct",
    },
    message: "Message",
    sendPhoto: "Envoyer une photo du cahier",
    verified: "Entreprise vérifiée",
    typing: "écrit…",
    online: "en ligne",
    today: "Aujourd’hui",
    synthetic: "🔒 Démo synthétique. Les messages restent sur cette machine ; aucune donnée client réelle.",
    cards: {
      invoice: ["Facture INV-0418", "Ramesh Traders · MUR 2 500", "prête"],
      numbers: ["Vos chiffres", "Ce mois · MUR 91 900", "▲ 12 % vs mois dernier"],
      payslips: ["Paie · novembre", "6 employés · MUR 141 600", "à vérifier"],
      importing: ["Import de ventes.xlsx", "Excel · 248 lignes"],
      crm: ["Contacts CRM synchronisés", "1 204 clients · à l’instant", "Synchronisation en direct avec votre CRM et vos tableurs"],
      notebook: ["Page de cahier lue", "5 lignes · MUR 3 450"],
    },
    data: {
      sale: "Vente enregistrée",
      notebook: "Aperçu du cahier",
      needsReview: "à vérifier",
      total: "Total",
      replyPost: "Répondez « post » pour ajouter ces ventes.",
    },
    stages: ["Capturer", "Lire", "Valider", "Analyser", "Rapport"],
    script: {
      welcome: "Bonjour 👋 Je suis Lekont, votre assistant d’automatisation et d’intelligence d’affaires. Dites-moi ce qui s’est passé aujourd’hui, ou demandez vos chiffres.",
      turns: [
        ["facture Ramesh 2500", "🧾 Facture INV-0419 préparée pour Ramesh · MUR 2 500.\nEnvoyée au responsable financier pour validation."],
        ["[photo]", "📒 J’ai lu 3 lignes de votre cahier :\n• Sucre 5 kg · MUR 425\n• Lait 12 paquets · MUR 960\n• Transport · MUR 300\nRépondez OUI pour les enregistrer."],
        ["OUI", "✅ Enregistré au grand livre après votre validation. Dépenses du jour : MUR 1 685."],
        ["combien j’ai vendu ce mois-ci ?", "📊 Novembre à ce jour : MUR 122 600 de ventes, +9 % sur octobre. Meilleur jour : samedi.\n⚠ Au rythme actuel, le sucre sera épuisé dans 4 jours."],
        ["envoie-moi le rapport du jour", "📄 Rapport du jour · 12 nov.pdf est prêt : ventes, dépenses, TVA et stock sur une page."],
      ],
    },
  },
  cr: {
    quick: ["faktir Ramesh 2500", "rapport lavant zordi", "stock ki pe fini?", "vann 3 sak a 250", "TVA sa mwa la"],
    welcome: `Bonzour 👋 Mo Lekont, ou biro lor WhatsApp. Faktir, fis lapey ek ou bann sif, tou depi sa chat la.

🧾 Faktir: "faktir Ramesh 2500" ek mo prepar brouyon la, pare pou avoy an PDF
📊 Ou bann sif: lavant, depans, TVA ek profi, avek enn tablo an direk
💸 Lavant ek stok: "vann 3 sak a 250", "stock ki pe fini?"
👥 Fis lapey: prepar lapey ou lekip an enn de minit
📥 Import: avoy enn export Excel, CSV ouswa CRM ek mo rant li
📤 Export: PDF, CSV ouswa Excel, kan ou anvi
📒 Ou kaye: pran enn paz an foto ek mo lir li pou ou

Ekrir zis seki ou bizin. Nanyin pa sove san ou dakor.`,
    features: [
      ["Faktir", "“faktir Ramesh 2500” → enn brouyon, pare an PDF"],
      ["Lintelizans biznes", "lavant, depans, TVA ek profi an direk"],
      ["Lavant ek stok", "anrezistre enn lavant, trouv seki pe fini"],
      ["Fis lapey", "prepar lapey mansiel lekip la"],
      ["Import ek export", "Excel, CSV ek CRM rantre; PDF, CSV ek Excel sorti"],
      ["Foto kaye", "avoy enn paz, Lekont lir li ek demann avan sove"],
    ],
    handles: "Seki bot la kapav fer",
    errApi: "API pa pe reponn. Lans li lor port 8010.",
    errReply: "Bot la pa finn reponn. Verifie API la ek reesey.",
    errReset: "Pa finn kapav rekoumans konversasion la.",
    live: {
      eyebrow: "Esey an direk · chatbot WhatsApp",
      title: "Koz ar Lekont",
      highlight: "ou mem.",
      description: "Samem vre moter bot la. Ekrir ou prop demann, tap enn sizesion, ouswa avoy enn foto kaye pou trouv repons la.",
      reset: "Rekoumans konversasion",
    },
    demo: {
      eyebrow: "Lotomatisasion ek lintelizans biznes · lor WhatsApp",
      title: "Get ou biznes",
      highlight: "depi enn chat.",
      description: "Gete enn bomatin dan laboutik: enn faktir, enn foto kaye, enn aprobasion, sif sa mwa la ek rapor zordi, tou dan enn sel konversasion.",
      cta: "Esey li ou mem",
    },
    message: "Mesaz",
    sendPhoto: "Avoy enn foto kaye",
    verified: "Biznes verifie",
    typing: "pe ekrir…",
    online: "an lign",
    today: "Zordi",
    synthetic: "🔒 Demo sintetik. Mesaz reste lor sa masinn la; pena okenn vre done klian.",
    cards: {
      invoice: ["Faktir INV-0418", "Ramesh Traders · MUR 2,500", "pare"],
      numbers: ["Ou bann sif", "Sa mwa la · MUR 91,900", "▲ 12% lor mwa dernie"],
      payslips: ["Fis lapey · Novam", "6 anplwaye · MUR 141,600", "pou verifie"],
      importing: ["Pe import lavant.xlsx", "Excel · 248 linn"],
      crm: ["Kontak CRM sinkronize", "1,204 klian · aster la", "Sinkronizasion an direk avek ou CRM ek tablo"],
      notebook: ["Paz kaye lir", "5 linn · MUR 3,450"],
    },
    data: {
      sale: "Lavant anrezistre",
      notebook: "Aperi kaye",
      needsReview: "pou verifie",
      total: "Total",
      replyPost: "Reponn “post” pou azout sa bann lavant la.",
    },
    stages: ["Kaptir", "Lir", "Aprouve", "Analiz", "Rapor"],
    script: {
      welcome: "Bonzour 👋 Mo Lekont, ou asistan lotomatisasion ek lintelizans biznes. Dir mwa seki finn pase zordi, ouswa demann ou bann sif.",
      turns: [
        ["faktir Ramesh 2500", "🧾 Faktir INV-0419 prepare pou Ramesh · MUR 2,500.\nAvoye Sef Finans pou aprobasion."],
        ["[photo]", "📒 Mo finn lir 3 linn dan ou kaye:\n• Disik 5 kg · MUR 425\n• Dile 12 pake · MUR 960\n• Transpor · MUR 300\nReponn WI pou sove zot."],
        ["WI", "✅ Sove dan ou ledzer apre ou aprobasion. Depans zordi: MUR 1,685."],
        ["konbien mo finn vann sa mwa la?", "📊 Novam ziska aster: MUR 122,600 lavant, +9% lor Oktob. Pli bon zour: Samdi.\n⚠ Disik pou fini dan 4 zour koumsa."],
        ["avoy mwa rapor zordi", "📄 Rapor zordi · 12 Nov.pdf pare: lavant, depans, TVA ek stok lor enn paz."],
      ],
    },
  },
} satisfies Record<Locale, unknown>;

export type WaCopy = (typeof COPY)["en"];

export function waCopy(locale: Locale): WaCopy {
  return COPY[locale] as WaCopy;
}

export function useWaCopy(): WaCopy {
  const { locale } = useLanguage();
  return waCopy(locale);
}
