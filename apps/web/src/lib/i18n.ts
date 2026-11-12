export type Locale = "en" | "fr" | "cr";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "cr", label: "Kreol" },
];

type NavKey = "overview" | "documents" | "ask" | "readiness";

export type Messages = {
  nav: Record<NavKey, string>;
  shell: {
    tagline: string;
    demoWorkspace: string;
    searchPlaceholder: string;
    askAi: string;
    workspace: string;
    dataSources: string;
    seedRows: string;
    documents: string;
    syntheticDemo: string;
    syntheticNote: string;
    language: string;
  };
  overview: {
    kicker: string;
    title: string;
    subtitle: string;
    addDocument: string;
    documentsProcessed: string;
    approvedHint: string;
    needsReview: string;
    reviewHint: string;
    spendThisMonth: string;
    vatHint: string;
    readiness: string;
    readinessHint: string;
    cashOutflow: string;
    monthlyTotals: string;
    thisMonth: string;
    legendSpend: string;
    legendPayroll: string;
    askTitle: string;
    askSub: string;
    quickQuestions: string[];
    recentDocuments: string;
    recentSub: string;
    viewAll: string;
    file: string;
    party: string;
    total: string;
    confidence: string;
    status: string;
    loadingDocuments: string;
    topSupplier: string;
    topSupplierSub: string;
    nextBestAction: string;
    automateFirst: string;
    automateSub: string;
    runReadiness: string;
    errorApi: string;
    errorAsk: string;
    typeQuestion: string;
    ask: string;
    seeTable: string;
    statusLabels: { needs_review: string; approved: string; exported: string };
  };
  ask: {
    title: string;
    subtitle: string;
    placeholder: string;
    ask: string;
    thinking: string;
    confidence: string;
    calculation: string;
    caveats: string;
    error: string;
    suggestions: string[];
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    nav: { overview: "Overview", documents: "Documents", ask: "Ask", readiness: "Readiness" },
    shell: {
      tagline: "SME back office",
      demoWorkspace: "Demo workspace",
      searchPlaceholder: "Search documents, suppliers, questions…",
      askAi: "Ask AI",
      workspace: "Workspace",
      dataSources: "Data sources",
      seedRows: "Seed rows",
      documents: "Documents",
      syntheticDemo: "Synthetic demo",
      syntheticNote: "No real company, employee or invoice data. Review before export.",
      language: "Language",
    },
    overview: {
      kicker: "Workspace · Overview",
      title: "Back office overview",
      subtitle:
        "Documents in, human-checked data out, then plain-language answers and a recommended first automation.",
      addDocument: "+ Add document",
      documentsProcessed: "Documents processed",
      approvedHint: "{n} approved",
      needsReview: "Needs review",
      reviewHint: "human check required",
      spendThisMonth: "Spend this month",
      vatHint: "VAT {amount}",
      readiness: "Automation readiness",
      readinessHint: "out of 100",
      cashOutflow: "Cash outflow",
      monthlyTotals: "Monthly ledger totals",
      thisMonth: "this month",
      legendSpend: "Spend",
      legendPayroll: "Includes payroll",
      askTitle: "Ask your spreadsheet",
      askSub:
        "Every answer shows the calculation, the rows behind it, and what it does not cover.",
      typeQuestion: "Type a question…",
      ask: "Ask",
      seeTable: "See the table and chart →",
      quickQuestions: [
        "Who are my top 5 suppliers by spend?",
        "How has my monthly spend changed?",
        "How much VAT did I pay in October?",
      ],
      recentDocuments: "Recent documents",
      recentSub: "Extraction confidence and review state",
      viewAll: "View all →",
      file: "File",
      party: "Party",
      total: "Total",
      confidence: "Confidence",
      status: "Status",
      loadingDocuments: "Loading documents…",
      topSupplier: "Top supplier",
      topSupplierSub: "{amount} across the demo period",
      nextBestAction: "Next best action",
      automateFirst: "What should I automate first?",
      automateSub:
        "Six processes scored on effort and impact, with a recommended first step.",
      runReadiness: "Run the readiness check",
      errorApi: "API not reachable. Start it on port 8010, then refresh.",
      errorAsk: "Could not answer. Check the API and try again.",
      statusLabels: {
        needs_review: "needs review",
        approved: "approved",
        exported: "exported",
      },
    },
    ask: {
      title: "Ask your spreadsheet",
      subtitle:
        "Plain-language questions over the ledger. The answer always shows the calculation, the rows behind it, and what it does not cover.",
      placeholder: "e.g. How much did I spend with Island Packaging this year?",
      ask: "Ask",
      thinking: "Thinking…",
      confidence: "confidence",
      calculation: "Calculation",
      caveats: "Caveats",
      error: "Could not answer. Check the API and try again.",
      suggestions: [
        "Who are my top 5 suppliers by spend?",
        "How has my monthly spend changed?",
        "How much VAT did I pay in October?",
        "Where is my money going by category?",
        "What did I spend on payroll?",
        "What was my largest invoice?",
      ],
    },
  },
  fr: {
    nav: { overview: "Aperçu", documents: "Documents", ask: "Demander", readiness: "Préparation" },
    shell: {
      tagline: "Back-office PME",
      demoWorkspace: "Espace de démonstration",
      searchPlaceholder: "Rechercher documents, fournisseurs, questions…",
      askAi: "Demander à l'IA",
      workspace: "Espace",
      dataSources: "Sources de données",
      seedRows: "Lignes de démo",
      documents: "Documents",
      syntheticDemo: "Démo synthétique",
      syntheticNote:
        "Aucune donnée réelle d'entreprise, d'employé ou de facture. Vérifiez avant export.",
      language: "Langue",
    },
    overview: {
      kicker: "Espace · Aperçu",
      title: "Aperçu du back-office",
      subtitle:
        "Documents en entrée, données vérifiées par un humain en sortie, puis réponses en langage clair et première automatisation recommandée.",
      addDocument: "+ Ajouter un document",
      documentsProcessed: "Documents traités",
      approvedHint: "{n} approuvés",
      needsReview: "À vérifier",
      reviewHint: "contrôle humain requis",
      spendThisMonth: "Dépenses ce mois",
      vatHint: "TVA {amount}",
      readiness: "Préparation à l'automatisation",
      readinessHint: "sur 100",
      cashOutflow: "Sorties de trésorerie",
      monthlyTotals: "Totaux mensuels du grand livre",
      thisMonth: "ce mois",
      legendSpend: "Dépenses",
      legendPayroll: "Inclut les salaires",
      askTitle: "Interrogez votre tableur",
      askSub:
        "Chaque réponse montre le calcul, les lignes sous-jacentes et ce qu'elle ne couvre pas.",
      typeQuestion: "Posez une question…",
      ask: "Demander",
      seeTable: "Voir le tableau et le graphique →",
      quickQuestions: [
        "Quels sont mes 5 principaux fournisseurs par dépense ?",
        "Comment mes dépenses mensuelles ont-elles évolué ?",
        "Combien de TVA ai-je payé en octobre ?",
      ],
      recentDocuments: "Documents récents",
      recentSub: "Confiance d'extraction et état de vérification",
      viewAll: "Tout voir →",
      file: "Fichier",
      party: "Tiers",
      total: "Total",
      confidence: "Confiance",
      status: "Statut",
      loadingDocuments: "Chargement des documents…",
      topSupplier: "Meilleur fournisseur",
      topSupplierSub: "{amount} sur la période de démonstration",
      nextBestAction: "Prochaine action",
      automateFirst: "Que dois-je automatiser en premier ?",
      automateSub:
        "Six processus notés selon l'effort et l'impact, avec une première étape recommandée.",
      runReadiness: "Lancer le diagnostic",
      errorApi: "API inaccessible. Démarrez-la sur le port 8010, puis actualisez.",
      errorAsk: "Impossible de répondre. Vérifiez l'API et réessayez.",
      statusLabels: {
        needs_review: "à vérifier",
        approved: "approuvé",
        exported: "exporté",
      },
    },
    ask: {
      title: "Interrogez votre tableur",
      subtitle:
        "Questions en langage clair sur le grand livre. La réponse montre toujours le calcul, les lignes sous-jacentes et ce qu'elle ne couvre pas.",
      placeholder: "ex. Combien ai-je dépensé avec Island Packaging cette année ?",
      ask: "Demander",
      thinking: "Réflexion…",
      confidence: "de confiance",
      calculation: "Calcul",
      caveats: "Limites",
      error: "Impossible de répondre. Vérifiez l'API et réessayez.",
      suggestions: [
        "Quels sont mes 5 principaux fournisseurs par dépense ?",
        "Comment mes dépenses mensuelles ont-elles évolué ?",
        "Combien de TVA ai-je payé en octobre ?",
        "Où va mon argent par catégorie ?",
        "Combien ai-je dépensé en salaires ?",
        "Quelle était ma plus grosse facture ?",
      ],
    },
  },
  cr: {
    nav: { overview: "Virmont", documents: "Dokiman", ask: "Demann", readiness: "Preparasion" },
    shell: {
      tagline: "Back-office PME",
      demoWorkspace: "Lespas demontrasion",
      searchPlaceholder: "Rod dokiman, fourniser, kestion…",
      askAi: "Demann AI",
      workspace: "Lespas",
      dataSources: "Sours done",
      seedRows: "Linn demo",
      documents: "Dokiman",
      syntheticDemo: "Demo sintetik",
      syntheticNote:
        "Pena done reél konpagni, anplwaye ouswa faktir. Verifie avan eksport.",
      language: "Lang",
    },
    overview: {
      kicker: "Lespas · Virmont",
      title: "Virmont back-office",
      subtitle:
        "Dokiman antre, done verifie par imen sorti, apre repons an langaz kler ek premie otomatizasion rekomande.",
      addDocument: "+ Azout dokiman",
      documentsProcessed: "Dokiman trete",
      approvedHint: "{n} aprouve",
      needsReview: "Pou verifie",
      reviewHint: "kontrol imen neseser",
      spendThisMonth: "Depans sa mwa la",
      vatHint: "TVA {amount}",
      readiness: "Preparasion otomatizasion",
      readinessHint: "lor 100",
      cashOutflow: "Sorti kas",
      monthlyTotals: "Total mansiel ledzer",
      thisMonth: "sa mwa la",
      legendSpend: "Depans",
      legendPayroll: "Inkli saler",
      askTitle: "Demann ou tabler",
      askSub: "Sak repons montre kalkil la, bann linn deryer li, ek seki li pa kouver.",
      typeQuestion: "Poz enn kestion…",
      ask: "Demann",
      seeTable: "Get tablo ek grafik →",
      quickQuestions: [
        "Ki mo 5 meier fourniser par depans?",
        "Kouma mo depans mansiel finn sanze?",
        "Konbyen TVA mo finn peie an oktob?",
      ],
      recentDocuments: "Dokiman resan",
      recentSub: "Konfians ekstraksion ek leta verifikasion",
      viewAll: "Get tou →",
      file: "Fisier",
      party: "Parti",
      total: "Total",
      confidence: "Konfians",
      status: "Statis",
      loadingDocuments: "Pe sarz dokiman…",
      topSupplier: "Meier fourniser",
      topSupplierSub: "{amount} lor period demontrasion",
      nextBestAction: "Prosen aksion",
      automateFirst: "Ki pou otomatiz an premie?",
      automateSub: "Sis proses evalie lor efor ek lenpak, ek enn premie pa rekomanse.",
      runReadiness: "Lans diagnostik",
      errorApi: "API pa disponib. Lans li lor port 8010, apre aktializ.",
      errorAsk: "Pa kapav reponn. Verifie API la ek esey ankor.",
      statusLabels: {
        needs_review: "pou verifie",
        approved: "aprouve",
        exported: "eksporte",
      },
    },
    ask: {
      title: "Demann ou tabler",
      subtitle:
        "Bann kestion an langaz kler lor ledzer. Repons la montre toultan kalkil la, bann linn deryer li, ek seki li pa kouver.",
      placeholder: "ex. Konbyen mo finn depans ar Island Packaging sa lane la?",
      ask: "Demann",
      thinking: "Pe reflesi…",
      confidence: "konfians",
      calculation: "Kalkil",
      caveats: "Limit",
      error: "Pa kapav reponn. Verifie API la ek esey ankor.",
      suggestions: [
        "Ki mo 5 meier fourniser par depans?",
        "Kouma mo depans mansiel finn sanze?",
        "Konbyen TVA mo finn peie an oktob?",
        "Kot mo kas pe ale par kategori?",
        "Konbyen mo finn depans lor saler?",
        "Ki ti mo pli gran faktir?",
      ],
    },
  },
};
