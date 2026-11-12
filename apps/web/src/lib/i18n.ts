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
  story: {
    problem: {
      eyebrow: string;
      title: string;
      sub: string;
      items: { title: string; body: string; cost: string }[];
    };
    wins: {
      eyebrow: string;
      title: string;
      highlight: string;
      sub: string;
      reasons: { title: string; body: string }[];
      columns: string[];
      /** Each value is "yes", "no", "partial" or a short text. */
      rows: { label: string; values: string[] }[];
      partialLabel: string;
    };
    stats: {
      eyebrow: string;
      title: string;
      items: { value: number; decimals?: number; prefix?: string; suffix?: string; label: string }[];
    };
    pinned: {
      eyebrow: string;
      title: string;
      sub: string;
      hint: string;
      joined: string;
      steps: { tag: string; title: string; body: string }[];
      visual: {
        online: string;
        received: string;
        reading: string;
        confidence: string;
        fields: { supplier: string; date: string; net: string; vat: string; total: string };
        review: string;
        vatCheck: string;
        edit: string;
        approve: string;
        approved: string;
        ledger: string;
        report: string;
        reportSub: string;
      };
    };
    orbit: {
      eyebrow: string;
      title: string;
      sub: string;
      hint: string;
      items: { title: string; body: string; href: string }[];
    };
    deck: {
      eyebrow: string;
      title: string;
      sub: string;
      hint: string;
      roles: { owner: string; accountant: string; staff: string };
      cards: { role: "owner" | "accountant" | "staff"; title: string; body: string }[];
    };
    gallery: {
      eyebrow: string;
      title: string;
      sub: string;
      hint: string;
      captions: string[];
      endTitle: string;
      endCta: string;
    };
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
    story: {
      problem: {
        eyebrow: "The problem",
        title: "Small businesses run on paper, memory and WhatsApp.",
        sub: "The shop is busy all day. The books get done at midnight, if at all. And when the bank or the accountant asks for numbers, nobody has them.",
        items: [
          { title: "Books in a notebook", body: "Sales are scribbled in a notebook and receipts go in a shoebox. Nobody knows today's profit until the month is over.", cost: "Profit is a guess" },
          { title: "Paper in two languages", body: "Invoices arrive in French, payslips in English, VAT at 15%. Typing it all into Excel eats evenings and weekends.", cost: "Evenings lost to typing" },
          { title: "No clean numbers, no loan", body: "Banks and accountants want tidy records. Without them, owners pay more for credit, or get turned away.", cost: "Growth on hold" },
        ],
      },
      wins: {
        eyebrow: "Why Lekont wins",
        title: "Built for the counter,",
        highlight: "not for accountants only.",
        sub: "Other tools expect you to sit at a desk and type. Lekont works where you already are and reads what you already have.",
        reasons: [
          { title: "No new app", body: "It lives in WhatsApp, on the phone already in your pocket." },
          { title: "Reads your paper", body: "French and English invoices and payslips, answers in Kreol too." },
          { title: "You stay in control", body: "Nothing reaches the ledger until a person approves it." },
        ],
        columns: ["Notebook", "Excel", "Accounting software", "Lekont"],
        rows: [
          { label: "Works from WhatsApp", values: ["no", "no", "no", "yes"] },
          { label: "Reads invoices and payslips for you", values: ["no", "no", "partial", "yes"] },
          { label: "Answers in English, French or Kreol", values: ["no", "no", "no", "yes"] },
          { label: "Human approval before it counts", values: ["no", "no", "partial", "yes"] },
          { label: "Monthly PDF for your accountant", values: ["no", "partial", "yes", "yes"] },
          { label: "Time to get started", values: ["—", "Hours", "Weeks", "Minutes"] },
        ],
        partialLabel: "Partly, or with add-ons and training",
      },
      stats: {
        eyebrow: "By the numbers",
        title: "Small numbers that change a working day.",
        items: [
          { value: 4, suffix: " s", label: "to read a supplier invoice" },
          { value: 3, label: "languages understood: English, French, Kreol" },
          { value: 15, suffix: "%", label: "VAT checked on every line" },
          { value: 1, suffix: " tap", label: "to your monthly PDF report" },
        ],
      },
      pinned: {
        eyebrow: "Follow one invoice",
        title: "From the counter to your accountant, in four steps.",
        sub: "One supplier invoice, photographed at the till. Scroll to follow it.",
        hint: "Scroll to follow the invoice",
        joined: "One invoice · four steps · zero typing",
        steps: [
          { tag: "WhatsApp", title: "Snap and send", body: "Take a photo of the invoice and send it to Lekont on WhatsApp. No app to install." },
          { tag: "AI reading", title: "Lekont reads it", body: "Supplier, date, amounts and 15% VAT come out of French or English paper in seconds." },
          { tag: "You decide", title: "You approve", body: "Nothing counts until you say so. Check the numbers, fix anything, approve with one tap." },
          { tag: "Ledger + PDF", title: "Logged and reported", body: "The line lands in your ledger and in this month's PDF for your accountant." },
        ],
        visual: {
          online: "online",
          received: "Got it 👍 Reading Facture_0418…",
          reading: "Reading invoice",
          confidence: "Confidence",
          fields: { supplier: "Supplier", date: "Date", net: "Net", vat: "VAT 15%", total: "Total" },
          review: "Review before it counts",
          vatCheck: "VAT = 15% of 4,200",
          edit: "Edit",
          approve: "Approve",
          approved: "Approved by you",
          ledger: "Ledger · November",
          report: "November report.pdf",
          reportSub: "Ready for your accountant",
        },
      },
      orbit: {
        eyebrow: "One ledger",
        title: "Six tools, one orbit.",
        sub: "Everything Lekont does feeds the same ledger, so every answer comes from the same numbers.",
        hint: "Hover to pause · click a tool to open it",
        items: [
          { title: "Documents", body: "Invoices and payslips, read for you", href: "/documents" },
          { title: "Ask", body: "Questions in plain words", href: "/ask" },
          { title: "Readiness", body: "Your finance-readiness score", href: "/readiness" },
          { title: "WhatsApp", body: "Run the shop from a chat", href: "/whatsapp" },
          { title: "VAT", body: "15% checked on every line", href: "/ask" },
          { title: "Payroll", body: "Payslips and payroll ratio", href: "/ask" },
        ],
      },
      deck: {
        eyebrow: "For the whole team",
        title: "Eight jobs, dealt from one deck.",
        sub: "Owners, staff and accountants each get the tools they need, on the same numbers.",
        hint: "Scroll to deal the deck",
        roles: { owner: "Owner", accountant: "Accountant", staff: "Staff" },
        cards: [
          { role: "owner", title: "Snap a receipt", body: "Photo on WhatsApp, logged in seconds." },
          { role: "owner", title: "Today's sales", body: "Ask “how much today?” and get the total." },
          { role: "staff", title: "Record a sale", body: "Between customers, in one message." },
          { role: "staff", title: "Stock check", body: "See what is running low before the supplier calls." },
          { role: "accountant", title: "VAT at 15%", body: "Every line checked against the invoice." },
          { role: "accountant", title: "Approve first", body: "Nothing reaches the ledger without a human OK." },
          { role: "owner", title: "Payslips", body: "Payslips ready, payroll ratio tracked." },
          { role: "accountant", title: "Monthly PDF", body: "One report, PDF or Excel, ready to send." },
        ],
      },
      gallery: {
        eyebrow: "In pictures",
        title: "Where Lekont works.",
        sub: "Counters, cafés and back rooms. Real businesses, real paperwork.",
        hint: "Keep scrolling",
        captions: [
          "Checking today's sales between customers",
          "One photo of the notebook, and the page is logged",
          "Open for business, books up to date",
          "Month closed. Report sent.",
        ],
        endTitle: "Try it on WhatsApp.",
        endCta: "Open the simulator",
      },
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
    story: {
      problem: {
        eyebrow: "Le problème",
        title: "Les petites entreprises tournent au papier, à la mémoire et à WhatsApp.",
        sub: "La boutique tourne toute la journée. La comptabilité se fait à minuit, quand elle se fait. Et quand la banque ou le comptable demande des chiffres, personne ne les a.",
        items: [
          { title: "Des comptes dans un cahier", body: "Les ventes sont notées dans un cahier, les reçus finissent dans une boîte à chaussures. Personne ne connaît le bénéfice du jour avant la fin du mois.", cost: "Un bénéfice deviné" },
          { title: "Des papiers en deux langues", body: "Factures en français, bulletins en anglais, TVA à 15 %. Tout ressaisir dans Excel dévore les soirées et les week-ends.", cost: "Des soirées à ressaisir" },
          { title: "Pas de chiffres propres, pas de prêt", body: "Banques et comptables veulent des comptes clairs. Sans eux, le crédit coûte plus cher, ou il est refusé.", cost: "Croissance en pause" },
        ],
      },
      wins: {
        eyebrow: "Pourquoi Lekont gagne",
        title: "Pensé pour le comptoir,",
        highlight: "pas seulement pour les comptables.",
        sub: "Les autres outils vous veulent assis à un bureau, à taper. Lekont travaille là où vous êtes déjà et lit ce que vous avez déjà.",
        reasons: [
          { title: "Aucune nouvelle appli", body: "Tout se passe sur WhatsApp, sur le téléphone déjà dans votre poche." },
          { title: "Il lit vos papiers", body: "Factures et bulletins en français et en anglais, réponses en kreol aussi." },
          { title: "Vous gardez la main", body: "Rien n’entre au grand livre sans validation humaine." },
        ],
        columns: ["Cahier", "Excel", "Logiciel comptable", "Lekont"],
        rows: [
          { label: "Fonctionne depuis WhatsApp", values: ["no", "no", "no", "yes"] },
          { label: "Lit factures et bulletins pour vous", values: ["no", "no", "partial", "yes"] },
          { label: "Répond en anglais, français ou kreol", values: ["no", "no", "no", "yes"] },
          { label: "Validation humaine avant de compter", values: ["no", "no", "partial", "yes"] },
          { label: "PDF mensuel pour le comptable", values: ["no", "partial", "yes", "yes"] },
          { label: "Temps de mise en route", values: ["—", "Des heures", "Des semaines", "Quelques minutes"] },
        ],
        partialLabel: "En partie, ou avec modules et formation",
      },
      stats: {
        eyebrow: "En chiffres",
        title: "De petits chiffres qui changent une journée de travail.",
        items: [
          { value: 4, suffix: " s", label: "pour lire une facture fournisseur" },
          { value: 3, label: "langues comprises : anglais, français, kreol" },
          { value: 15, suffix: " %", label: "de TVA vérifiée sur chaque ligne" },
          { value: 1, suffix: " geste", label: "pour votre rapport PDF mensuel" },
        ],
      },
      pinned: {
        eyebrow: "Suivez une facture",
        title: "Du comptoir à votre comptable, en quatre étapes.",
        sub: "Une facture fournisseur, photographiée à la caisse. Faites défiler pour la suivre.",
        hint: "Faites défiler pour suivre la facture",
        joined: "Une facture · quatre étapes · zéro saisie",
        steps: [
          { tag: "WhatsApp", title: "Photographiez et envoyez", body: "Prenez la facture en photo et envoyez-la à Lekont sur WhatsApp. Aucune appli à installer." },
          { tag: "Lecture IA", title: "Lekont la lit", body: "Fournisseur, date, montants et TVA à 15 % sont extraits du papier, en français ou en anglais, en quelques secondes." },
          { tag: "Vous décidez", title: "Vous validez", body: "Rien ne compte sans votre accord. Vérifiez, corrigez si besoin, validez d’un geste." },
          { tag: "Grand livre + PDF", title: "Enregistrée et rapportée", body: "La ligne arrive dans votre grand livre et dans le PDF du mois pour votre comptable." },
        ],
        visual: {
          online: "en ligne",
          received: "Bien reçu 👍 Lecture de Facture_0418…",
          reading: "Lecture de la facture",
          confidence: "Confiance",
          fields: { supplier: "Fournisseur", date: "Date", net: "HT", vat: "TVA 15 %", total: "TTC" },
          review: "À vérifier avant de compter",
          vatCheck: "TVA = 15 % de 4 200",
          edit: "Modifier",
          approve: "Valider",
          approved: "Validée par vous",
          ledger: "Grand livre · novembre",
          report: "Rapport novembre.pdf",
          reportSub: "Prêt pour votre comptable",
        },
      },
      orbit: {
        eyebrow: "Un seul grand livre",
        title: "Six outils, une seule orbite.",
        sub: "Tout ce que fait Lekont alimente le même grand livre : chaque réponse vient des mêmes chiffres.",
        hint: "Survolez pour mettre en pause · cliquez pour ouvrir",
        items: [
          { title: "Documents", body: "Factures et bulletins, lus pour vous", href: "/documents" },
          { title: "Question", body: "Des questions en langage simple", href: "/ask" },
          { title: "Préparation", body: "Votre score de préparation financière", href: "/readiness" },
          { title: "WhatsApp", body: "Gérez la boutique depuis un chat", href: "/whatsapp" },
          { title: "TVA", body: "15 % vérifiés sur chaque ligne", href: "/ask" },
          { title: "Paie", body: "Bulletins et ratio de masse salariale", href: "/ask" },
        ],
      },
      deck: {
        eyebrow: "Pour toute l’équipe",
        title: "Huit tâches, tirées d’un seul jeu.",
        sub: "Gérants, employés et comptables ont chacun leurs outils, sur les mêmes chiffres.",
        hint: "Faites défiler pour distribuer les cartes",
        roles: { owner: "Gérant", accountant: "Comptable", staff: "Employé" },
        cards: [
          { role: "owner", title: "Photographier un reçu", body: "Une photo sur WhatsApp, enregistrée en quelques secondes." },
          { role: "owner", title: "Ventes du jour", body: "Demandez « combien aujourd’hui ? » et obtenez le total." },
          { role: "staff", title: "Enregistrer une vente", body: "Entre deux clients, en un message." },
          { role: "staff", title: "Vérifier le stock", body: "Voyez ce qui manque avant l’appel du fournisseur." },
          { role: "accountant", title: "TVA à 15 %", body: "Chaque ligne comparée à la facture." },
          { role: "accountant", title: "Valider d’abord", body: "Rien n’entre au grand livre sans un accord humain." },
          { role: "owner", title: "Bulletins de paie", body: "Bulletins prêts, ratio de paie suivi." },
          { role: "accountant", title: "PDF mensuel", body: "Un rapport, PDF ou Excel, prêt à envoyer." },
        ],
      },
      gallery: {
        eyebrow: "En images",
        title: "Là où Lekont travaille.",
        sub: "Comptoirs, cafés et arrière-boutiques. De vraies entreprises, de vrais papiers.",
        hint: "Continuez à défiler",
        captions: [
          "Les ventes du jour, vérifiées entre deux clients",
          "Une photo du cahier, et la page est enregistrée",
          "Ouvert, avec une comptabilité à jour",
          "Mois clôturé. Rapport envoyé.",
        ],
        endTitle: "Essayez-le sur WhatsApp.",
        endCta: "Ouvrir le simulateur",
      },
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
    story: {
      problem: {
        eyebrow: "Problem la",
        title: "Ti biznes marse lor papie, memwar ek WhatsApp.",
        sub: "Laboutik okipe tou lazourne. Bann kont fer a minwi, si zot fer ditou. Ek kan labank ouswa kontab demann sif, personn pena zot.",
        items: [
          { title: "Kont dan enn kaye", body: "Lavant ekrir dan enn kaye, resi al dan enn bwat soulie. Personn pa kone profi zordi avan lafin mwa.", cost: "Profi enn devinet" },
          { title: "Papie an de lang", body: "Faktir an Franse, fis lapey an Angle, TVA 15%. Tap tou dan Excel manz ou bann aswar ek wikenn.", cost: "Aswar perdi pou tape" },
          { title: "Pena sif prop, pena prete", body: "Labank ek kontab anvi kont prop. San sa, kredi kout pli ser, ouswa zot refiz.", cost: "Kroisans bloke" },
        ],
      },
      wins: {
        eyebrow: "Kifer Lekont gagne",
        title: "Fer pou kontwar,",
        highlight: "pa zis pou kontab.",
        sub: "Lezot zouti anvi ou asiz dan enn biro ek tape. Lekont travay kot ou deza ete ek lir seki ou deza ena.",
        reasons: [
          { title: "Pena nouvo aplikasion", body: "Tou pas lor WhatsApp, lor telefonn ki deza dan ou pos." },
          { title: "Li lir ou papie", body: "Faktir ek fis lapey an Franse ek Angle, repons an Kreol osi." },
          { title: "Ou gard kontrol", body: "Nanyin pa rant dan ledzer san enn dimoun aprouve." },
        ],
        columns: ["Kaye", "Excel", "Logisiel kontab", "Lekont"],
        rows: [
          { label: "Marse depi WhatsApp", values: ["no", "no", "no", "yes"] },
          { label: "Lir faktir ek fis lapey pou ou", values: ["no", "no", "partial", "yes"] },
          { label: "Reponn an Angle, Franse ouswa Kreol", values: ["no", "no", "no", "yes"] },
          { label: "Enn dimoun aprouve avan li konte", values: ["no", "no", "partial", "yes"] },
          { label: "PDF mansiel pou ou kontab", values: ["no", "partial", "yes", "yes"] },
          { label: "Letan pou koumanse", values: ["—", "Plizir erdtan", "Plizir semenn", "Enn de minit"] },
        ],
        partialLabel: "Enn parti, ouswa avek modil ek formasion",
      },
      stats: {
        eyebrow: "An sif",
        title: "Ti sif ki sanz enn zournee travay.",
        items: [
          { value: 4, suffix: " s", label: "pou lir enn faktir fourniser" },
          { value: 3, label: "lang konpran: Angle, Franse, Kreol" },
          { value: 15, suffix: "%", label: "TVA verifie lor sak linn" },
          { value: 1, suffix: " klik", label: "pou ou rapor PDF mansiel" },
        ],
      },
      pinned: {
        eyebrow: "Swiv enn faktir",
        title: "Depi kontwar ziska ou kontab, an kat etap.",
        sub: "Enn faktir fourniser, pran an foto kot lakes. Defil pou swiv li.",
        hint: "Defil pou swiv faktir la",
        joined: "Enn faktir · kat etap · zero tapaz",
        steps: [
          { tag: "WhatsApp", title: "Pran foto ek avoy", body: "Pran enn foto faktir la ek avoy li Lekont lor WhatsApp. Pena aplikasion pou instale." },
          { tag: "Lektir IA", title: "Lekont lir li", body: "Fourniser, dat, montan ek TVA 15% sorti depi papie an Franse ouswa Angle an enn de segonn." },
          { tag: "Ou ki deside", title: "Ou aprouve", body: "Nanyin pa konte san ou dakor. Gete bann sif, koriz si bizin, aprouve an enn klik." },
          { tag: "Ledzer + PDF", title: "Anrezistre ek rapor", body: "Linn la rant dan ou ledzer ek dan PDF sa mwa la pou ou kontab." },
        ],
        visual: {
          online: "an lign",
          received: "Gagne 👍 Pe lir Facture_0418…",
          reading: "Pe lir faktir la",
          confidence: "Konfians",
          fields: { supplier: "Fourniser", date: "Dat", net: "San TVA", vat: "TVA 15%", total: "Total" },
          review: "Verifie avan li konte",
          vatCheck: "TVA = 15% lor 4,200",
          edit: "Modifie",
          approve: "Aprouve",
          approved: "Ou finn aprouve",
          ledger: "Ledzer · Novam",
          report: "Rapor Novam.pdf",
          reportSub: "Pare pou ou kontab",
        },
      },
      orbit: {
        eyebrow: "Enn sel ledzer",
        title: "Sis zouti, enn sel lorbit.",
        sub: "Tou seki Lekont fer al dan mem ledzer, alor sak repons sorti depi mem bann sif.",
        hint: "Pas lasouri pou pose · klik lor enn zouti pou ouver li",
        items: [
          { title: "Dokiman", body: "Faktir ek fis lapey, lir pou ou", href: "/documents" },
          { title: "Demande", body: "Kestion an langaz sinp", href: "/ask" },
          { title: "Preparasion", body: "Ou skor preparasion finansie", href: "/readiness" },
          { title: "WhatsApp", body: "Get laboutik depi enn chat", href: "/whatsapp" },
          { title: "TVA", body: "15% verifie lor sak linn", href: "/ask" },
          { title: "Lapey", body: "Fis lapey ek ratio lapey", href: "/ask" },
        ],
      },
      deck: {
        eyebrow: "Pou tou lekip",
        title: "Wit travay, tir depi enn sel pake kart.",
        sub: "Patron, staf ek kontab sakenn gagn so zouti, lor mem bann sif.",
        hint: "Defil pou distribie bann kart",
        roles: { owner: "Patron", accountant: "Kontab", staff: "Staf" },
        cards: [
          { role: "owner", title: "Foto enn resi", body: "Enn foto lor WhatsApp, anrezistre an enn de segonn." },
          { role: "owner", title: "Lavant zordi", body: "Demann “konbien zordi?” ek gagn total la." },
          { role: "staff", title: "Anrezistre enn lavant", body: "Ant de klian, an enn mesaz." },
          { role: "staff", title: "Gete stok", body: "Trouv seki pe fini avan fourniser la telefone." },
          { role: "accountant", title: "TVA 15%", body: "Sak linn konpare ar faktir la." },
          { role: "accountant", title: "Aprouve avan", body: "Nanyin pa rant dan ledzer san enn dimoun dakor." },
          { role: "owner", title: "Fis lapey", body: "Fis lapey pare, ratio lapey swivi." },
          { role: "accountant", title: "PDF mansiel", body: "Enn rapor, PDF ouswa Excel, pare pou avoy." },
        ],
      },
      gallery: {
        eyebrow: "An zimaz",
        title: "Kot Lekont travay.",
        sub: "Kontwar, kafe ek lakour deryer. Vre biznes, vre paperas.",
        hint: "Kontinie defile",
        captions: [
          "Gete lavant zordi ant de klian",
          "Enn foto kaye la, ek paz la anrezistre",
          "Louver, ek bann kont azour",
          "Mwa fini. Rapor avoye.",
        ],
        endTitle: "Esey li lor WhatsApp.",
        endCta: "Ouver similater la",
      },
    },
  },
};
