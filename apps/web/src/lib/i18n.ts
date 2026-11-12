export type Locale = "en" | "fr" | "cr";

export const LOCALES: { id: Locale; label: string }[] = [
  { id: "en", label: "EN" },
  { id: "fr", label: "FR" },
  { id: "cr", label: "Kreol" },
];

type NavKey = "overview" | "documents" | "ask" | "readiness" | "whatsapp";

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
  hero: {
    tryLive: string;
    overviewEyebrow: string;
    overviewLead: string;
    overviewHighlight: string;
    reviewDocuments: string;
    marquee: string;
    howEyebrow: string;
    howTitle: string;
    howSub: string;
    steps: { title: string; body: string }[];
    liveEyebrow: string;
    liveTitle: string;
    liveSub: string;
    tabs: { label: string; blurb: string }[];
    askNext: string;
    ctaLead: string;
    ctaHighlight: string;
    ctaSub: string;
    ctaStart: string;
    askEyebrow: string;
    askLead: string;
    askHighlight: string;
    docsEyebrow: string;
    docsLead: string;
    docsHighlight: string;
    docsSub: string;
    readyEyebrow: string;
    readyLead: string;
    readyHighlight: string;
    readySub: string;
    demo: {
      sheet: string;
      document: string;
      party: string;
      vat: string;
      total: string;
      reading: string;
      extracted: string;
      review: string;
    };
    stackOpen: string[];
    wa: {
      eyebrow: string;
      title: string;
      highlight: string;
      sub: string;
      cta: string;
      points: string[];
      script: { from: "me" | "bot"; text: string; kind?: "photo" | "ledger" | "logged" | "report" }[];
    };
    built: { eyebrow: string; title: string; sub: string; chips: string[] };
    acct: { eyebrow: string; title: string; highlight: string; sub: string; points: string[]; cta: string };
  };
};

export const messages: Record<Locale, Messages> = {
  en: {
    nav: { overview: "Overview", documents: "Documents", ask: "Ask", readiness: "Readiness", whatsapp: "WhatsApp" },
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
    hero: {
      tryLive: "Try it live",
      overviewEyebrow: "Live on synthetic Mauritian SME data",
      overviewLead: "Your back office,",
      overviewHighlight: "in plain language.",
      reviewDocuments: "Review documents",
      marquee: "Reads the paperwork Mauritian SMEs actually have, in both languages",
      howEyebrow: "How it works",
      howTitle: "From a pile of paper to an answer you can check",
      howSub: "Every number Lekont shows traces back to a reviewed document and a calculation you can read.",
      steps: [
        { title: "Upload", body: "Invoice, payslip or contract, EN or FR" },
        { title: "Extract", body: "Fields pulled with a confidence score" },
        { title: "Review", body: "A named person approves every value" },
        { title: "Ask", body: "Plain-language questions, shown working" },
      ],
      liveEyebrow: "Live from the API",
      liveTitle: "One place for the documents, the numbers and the next step",
      liveSub: "Everything below is the demo data, refreshed on every visit.",
      tabs: [
        { label: "Documents", blurb: "Extracted, scored and waiting for a reviewer." },
        { label: "Cash outflow", blurb: "Monthly totals from the ledger." },
        { label: "Top supplier", blurb: "Where most of the money goes." },
      ],
      askNext: "Ask who comes next →",
      ctaLead: "Not sure what to automate first?",
      ctaHighlight: "Ask Lekont.",
      ctaSub: "Six inputs, under two minutes. You get a score, a first process to automate and the reasons behind it.",
      ctaStart: "Start the diagnostic →",
      askEyebrow: "Every answer shows its working",
      askLead: "Ask your",
      askHighlight: "spreadsheet.",
      docsEyebrow: "French and English · human in the loop",
      docsLead: "Documents in,",
      docsHighlight: "checked data out.",
      docsSub: "Extract invoices, payslips and contracts in French and English. Nothing is exported until a named reviewer approves it.",
      readyEyebrow: "Rule-based and explainable",
      readyLead: "What should you",
      readyHighlight: "automate first?",
      readySub: "A short diagnostic that scores six back-office processes on effort and impact, then tells you where to start.",
      demo: { sheet: "Ledger sheet", document: "Document", party: "Party", vat: "VAT", total: "Total", reading: "Reading…", extracted: "extracted", review: "needs review" },
      stackOpen: ["Open documents →", "Ask about spend →", "Ask who comes next →"],
      wa: {
        eyebrow: "Lekont on WhatsApp",
        title: "If you can send a WhatsApp,",
        highlight: "you can run your books.",
        sub: "Text “invoice Ramesh 2500” and the PDF is ready. Snap a notebook page and it’s in your books. Ask how October went and get the numbers.",
        cta: "See Lekont on WhatsApp →",
        points: ["No app to install", "English, French or Kreol", "Nothing saved until you confirm"],
        script: [
          { from: "me", text: "invoice Ramesh 2500" },
          { from: "bot", text: "Done ✅ Invoice INV-0418 for MUR 2,500. PDF ready to send." },
          { from: "me", text: "Today's page 📒", kind: "photo" },
          { from: "bot", text: "I read 5 lines from your page, MUR 3,450 in total. One sale is on credit, please check it:", kind: "ledger" },
          { from: "me", text: "post" },
          { from: "bot", text: "✅ Saved to your ledger.", kind: "logged" },
          { from: "bot", text: "Daily report · 12 Nov.pdf", kind: "report" },
        ],
      },
      built: { eyebrow: "Built for the people who run the shop", title: "Built for the counter, not the back office.", sub: "Record a sale between customers. Check stock before the supplier calls. All from the phone already in your pocket.", chips: ["✓ Sale recorded · MUR 750", "📊 Today · MUR 2,030", "🧾 Invoice INV-0418 · PDF ready", "👥 Payslips · 6 ready"] },
      acct: { eyebrow: "Reports in one tap", title: "A month of paperwork,", highlight: "one PDF.", sub: "Lekont pulls every reviewed invoice, payslip and VAT line into one clean report. Download it as PDF or Excel and send it to your accountant. What took a weekend now takes seconds.", points: ["Monthly report in seconds", "PDF and Excel, ready to send", "Only reviewed numbers go in"], cta: "See the documents →" },
    },
  },
  fr: {
    nav: { overview: "Aperçu", documents: "Documents", ask: "Demander", readiness: "Préparation", whatsapp: "WhatsApp" },
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
    hero: {
      tryLive: "Essayer en direct",
      overviewEyebrow: "En direct sur des données synthétiques de PME mauriciennes",
      overviewLead: "Votre back-office,",
      overviewHighlight: "en langage clair.",
      reviewDocuments: "Vérifier les documents",
      marquee: "Lit les documents qu'ont vraiment les PME mauriciennes, dans les deux langues",
      howEyebrow: "Comment ça marche",
      howTitle: "D'une pile de papiers à une réponse vérifiable",
      howSub: "Chaque chiffre affiché par Lekont renvoie à un document vérifié et à un calcul lisible.",
      steps: [
        { title: "Déposer", body: "Facture, bulletin de paie ou contrat, EN ou FR" },
        { title: "Extraire", body: "Champs extraits avec un score de confiance" },
        { title: "Vérifier", body: "Une personne nommée approuve chaque valeur" },
        { title: "Demander", body: "Questions en langage clair, calcul affiché" },
      ],
      liveEyebrow: "En direct depuis l'API",
      liveTitle: "Un seul endroit pour les documents, les chiffres et la prochaine étape",
      liveSub: "Tout ce qui suit provient des données de démonstration, actualisées à chaque visite.",
      tabs: [
        { label: "Documents", blurb: "Extraits, notés et en attente de vérification." },
        { label: "Sorties de trésorerie", blurb: "Totaux mensuels du grand livre." },
        { label: "Meilleur fournisseur", blurb: "Là où va la plus grande part de l'argent." },
      ],
      askNext: "Demander qui vient ensuite →",
      ctaLead: "Vous ne savez pas quoi automatiser en premier ?",
      ctaHighlight: "Demandez à Lekont.",
      ctaSub: "Six réponses, moins de deux minutes. Vous obtenez un score, un premier processus à automatiser et les raisons.",
      ctaStart: "Lancer le diagnostic →",
      askEyebrow: "Chaque réponse montre son calcul",
      askLead: "Interrogez votre",
      askHighlight: "tableur.",
      docsEyebrow: "Français et anglais · contrôle humain",
      docsLead: "Documents en entrée,",
      docsHighlight: "données vérifiées en sortie.",
      docsSub: "Extrayez factures, bulletins de paie et contrats en français et en anglais. Rien n'est exporté sans l'approbation d'un vérificateur nommé.",
      readyEyebrow: "Basé sur des règles et explicable",
      readyLead: "Que devez-vous",
      readyHighlight: "automatiser en premier ?",
      readySub: "Un court diagnostic qui note six processus de back-office selon l'effort et l'impact, puis vous dit par où commencer.",
      demo: { sheet: "Grand livre", document: "Document", party: "Tiers", vat: "TVA", total: "Total", reading: "Lecture…", extracted: "extrait", review: "à vérifier" },
      stackOpen: ["Ouvrir les documents →", "Interroger les dépenses →", "Demander qui vient ensuite →"],
      wa: {
        eyebrow: "Lekont sur WhatsApp",
        title: "Si vous savez envoyer un WhatsApp,",
        highlight: "vous savez tenir vos comptes.",
        sub: "Écrivez « facture Ramesh 2500 » et le PDF est prêt. Photographiez une page de cahier et c’est dans vos comptes. Demandez comment s’est passé octobre et obtenez les chiffres.",
        cta: "Voir Lekont sur WhatsApp →",
        points: ["Aucune application à installer", "Anglais, français ou kreol", "Rien n’est enregistré sans votre accord"],
        script: [
          { from: "me", text: "facture Ramesh 2500" },
          { from: "bot", text: "C’est fait ✅ Facture INV-0418 de MUR 2 500. PDF prêt à envoyer." },
          { from: "me", text: "La page du jour 📒", kind: "photo" },
          { from: "bot", text: "J’ai lu 5 lignes sur votre page, MUR 3 450 au total. Une vente est à crédit, vérifiez-la :", kind: "ledger" },
          { from: "me", text: "post" },
          { from: "bot", text: "✅ Enregistré dans votre grand livre.", kind: "logged" },
          { from: "bot", text: "Rapport du jour · 12 nov.pdf", kind: "report" },
        ],
      },
      built: { eyebrow: "Pensé pour ceux qui tiennent la boutique", title: "Fait pour le comptoir, pas pour le bureau.", sub: "Enregistrez une vente entre deux clients. Vérifiez le stock avant l’appel du fournisseur. Tout depuis le téléphone déjà dans votre poche.", chips: ["✓ Vente enregistrée · MUR 750", "📊 Aujourd’hui · MUR 2 030", "🧾 Facture INV-0418 · PDF prêt", "👥 Bulletins de paie · 6 prêts"] },
      acct: { eyebrow: "Rapports en un geste", title: "Un mois de paperasse,", highlight: "un seul PDF.", sub: "Lekont rassemble chaque facture, bulletin de paie et ligne de TVA vérifiés dans un rapport clair. Téléchargez-le en PDF ou Excel et envoyez-le à votre comptable. Ce qui prenait un week-end prend quelques secondes.", points: ["Rapport mensuel en quelques secondes", "PDF et Excel, prêts à envoyer", "Seuls les chiffres vérifiés y figurent"], cta: "Voir les documents →" },
    },
  },
  cr: {
    nav: { overview: "Virmont", documents: "Dokiman", ask: "Demann", readiness: "Preparasion", whatsapp: "WhatsApp" },
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
    hero: {
      tryLive: "Esey li an direk",
      overviewEyebrow: "An direk lor done sintetik PME morisien",
      overviewLead: "Ou back-office,",
      overviewHighlight: "an langaz kler.",
      reviewDocuments: "Verifie dokiman",
      marquee: "Li bann dokiman ki PME morisien vremem ena, dan le de lang",
      howEyebrow: "Kouma li marse",
      howTitle: "Depi enn pil papie ziska enn repons ou kapav verifie",
      howSub: "Sak sif ki Lekont montre sorti dan enn dokiman verifie ek enn kalkil ou kapav lir.",
      steps: [
        { title: "Avoy", body: "Faktir, fis lapey ouswa kontra, EN ouswa FR" },
        { title: "Ekstrer", body: "Bann sant tire ek enn skor konfians" },
        { title: "Verifie", body: "Enn dimoun ar so nom aprouv sak valer" },
        { title: "Demann", body: "Kestion an langaz kler, kalkil montre" },
      ],
      liveEyebrow: "An direk depi API",
      liveTitle: "Enn sel plas pou dokiman, sif ek prosen etap",
      liveSub: "Tou seki anba sorti dan done demo, aktyalize sak fwa ou vini.",
      tabs: [
        { label: "Dokiman", blurb: "Ekstre, evalie ek pe atann verifikasion." },
        { label: "Sorti kas", blurb: "Total mansiel depi ledzer." },
        { label: "Meier fourniser", blurb: "Kot plis kas pe ale." },
      ],
      askNext: "Demann kisannla vinn apre →",
      ctaLead: "Pa kone ki pou otomatiz an premie?",
      ctaHighlight: "Demann Lekont.",
      ctaSub: "Sis repons, mwins ki de minit. Ou gagn enn skor, enn premie proses pou otomatiz ek bann rezon.",
      ctaStart: "Lans diagnostik →",
      askEyebrow: "Sak repons montre so kalkil",
      askLead: "Demann ou",
      askHighlight: "tabler.",
      docsEyebrow: "Franse ek angle · kontrol imen",
      docsLead: "Dokiman antre,",
      docsHighlight: "done verifie sorti.",
      docsSub: "Ekstrer faktir, fis lapey ek kontra an franse ek angle. Nanye pa eksporte avan enn verifikater ar so nom aprouv li.",
      readyEyebrow: "Baze lor regleman ek fasil pou explike",
      readyLead: "Ki ou bizin",
      readyHighlight: "otomatiz an premie?",
      readySub: "Enn ti diagnostik ki evalie sis proses back-office lor efor ek lenpak, apre dir ou kot pou koumanse.",
      demo: { sheet: "Ledzer", document: "Dokiman", party: "Parti", vat: "TVA", total: "Total", reading: "Pe lir…", extracted: "ekstre", review: "pou verifie" },
      stackOpen: ["Ouver dokiman →", "Demann lor depans →", "Demann kisannla vinn apre →"],
      wa: {
        eyebrow: "Lekont lor WhatsApp",
        title: "Si ou kone avoy enn WhatsApp,",
        highlight: "ou kapav tini ou kont.",
        sub: "Ekrir « faktir Ramesh 2500 » ek PDF la pare. Pran foto enn paz kaye ek li dan ou kont. Demann kouma oktob inn ale ek gagn bann sif.",
        cta: "Get Lekont lor WhatsApp →",
        points: ["Pa bizin instal okenn aplikasion", "Angle, franse ouswa kreol", "Nanye pa sove avan ou konfirme"],
        script: [
          { from: "me", text: "faktir Ramesh 2500" },
          { from: "bot", text: "Fini ✅ Faktir INV-0418 pou MUR 2,500. PDF pare pou avoy." },
          { from: "me", text: "Paz zordi 📒", kind: "photo" },
          { from: "bot", text: "Mo finn lir 5 linn lor ou paz, MUR 3,450 an tou. Enn lavant lor krédi, verifie li:", kind: "ledger" },
          { from: "me", text: "post" },
          { from: "bot", text: "✅ Sove dan ou ledzer.", kind: "logged" },
          { from: "bot", text: "Rapor zordi · 12 Nov.pdf", kind: "report" },
        ],
      },
      built: { eyebrow: "Fer pou bann dimoun ki tini laboutik", title: "Fer pou kontwar, pa pou biro.", sub: "Anrezistre enn lavant ant de klian. Gete stok avan fourniser la telefone. Tou depi telefonn ki deza dan ou pos.", chips: ["✓ Lavant anrezistre · MUR 750", "📊 Zordi · MUR 2,030", "🧾 Faktir INV-0418 · PDF pare", "👥 Fis lapey · 6 pare"] },
      acct: { eyebrow: "Rapor an enn sel klik", title: "Enn mwa paperas,", highlight: "enn sel PDF.", sub: "Lekont ramas sak faktir, fis lapey ek linn TVA verifie dan enn rapor prop. Telesarz li an PDF ouswa Excel ek avoy li ou kontab. Seki ti pran enn wikenn, aster pran enn de segonn.", points: ["Rapor mansiel an enn de segonn", "PDF ek Excel, pare pou avoy", "Zis sif verifie ki rantre"], cta: "Get bann dokiman →" },
    },
  },
};
