"""Curated expert roster: global industry thinkers and Mauritian industry voices.

Every profile is either:

* ``public_record`` - built only from publicly available material (company
  reports, books, published interviews). Not authored, reviewed or endorsed by
  the person. Named people are included to demonstrate discovery and matching,
  and are marked ``verified = false`` until they claim the profile.
* ``composite`` - an explicitly fictional practitioner profile, created for the
  challenge to represent a role (e.g. a textile operations veteran) without
  putting words in a real person's mouth.

No invented quotes and no invented figures. The chat layer is instructed to
answer only from the cards below and to refuse when a card does not cover the
question.
"""

from app.schemas.experts import Expert, ExpertCategory, KnowledgeCard

PUBLIC_RECORD = (
    "Public-record profile built from publicly available material. Not authored, "
    "reviewed or endorsed by {name}. Demo use only."
)
COMPOSITE = (
    "Composite practitioner profile created for the NPCC challenge. Not a real "
    "named individual; no real person is represented or quoted."
)

EXPERTS: list[Expert] = [
    Expert(
        id="arnaud-lagesse",
        name="Arnaud Lagesse",
        initials="AL",
        role="Group CEO",
        organisation="IBL Group",
        country="Mauritius",
        city="Port Louis",
        categories=[
            ExpertCategory.LEADERSHIP,
            ExpertCategory.SUPPLY_CHAIN,
            ExpertCategory.FINANCE,
        ],
        headline="Running a diversified Indian Ocean conglomerate",
        bio=(
            "Leads IBL Group, one of Mauritius' largest diversified groups, with "
            "operations in logistics, distribution, engineering, hospitality and "
            "financial services across the Indian Ocean and East Africa."
        ),
        languages=["EN", "FR"],
        accent="#7b2d5e",
        featured=True,
        mauritian=True,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Arnaud Lagesse"),
        topics=[
            "conglomerate strategy",
            "regional expansion",
            "distribution and logistics",
            "family business governance",
        ],
        sample_questions=[
            "How should a Mauritian manufacturer think about expanding into East Africa?",
            "What does good governance look like in a family-owned group?",
            "Where does logistics cost hurt an island manufacturer most?",
        ],
        knowledge=[
            KnowledgeCard(
                id="ibl-shape",
                title="What IBL Group is",
                body=(
                    "IBL is a Mauritian conglomerate whose activities span logistics, "
                    "distribution, engineering, hospitality and financial services, with "
                    "operations in Mauritius, the wider Indian Ocean and East Africa. It is "
                    "a listed group with a long family-business heritage."
                ),
                source="IBL Group public reports and website",
                year=2025,
                topics=["conglomerate", "diversification", "Mauritius"],
            ),
            KnowledgeCard(
                id="ibl-regional",
                title="Regional expansion logic",
                body=(
                    "For an island economy, growth often comes from replicating proven "
                    "capabilities in nearby markets rather than inventing new ones. IBL's "
                    "public positioning emphasises regional clusters where logistics, "
                    "distribution and services reinforce each other."
                ),
                source="IBL Group public reports; public interviews",
                year=2025,
                topics=["regional expansion", "Africa", "Indian Ocean"],
            ),
            KnowledgeCard(
                id="ibl-people",
                title="People and succession",
                body=(
                    "Diversified groups depend on a strong middle layer of managers who can "
                    "run a business unit without the centre. Succession and management "
                    "depth are recurring themes in Mauritian family groups as they "
                    "professionalise."
                ),
                source="Public commentary on Mauritian family groups",
                year=2024,
                topics=["succession", "management", "family business"],
            ),
        ],
    ),
    Expert(
        id="jean-pierre-dalais",
        name="Jean-Pierre Dalais",
        initials="JD",
        role="Group CEO",
        organisation="CIEL Group",
        country="Mauritius",
        city="Port Louis",
        categories=[
            ExpertCategory.LEADERSHIP,
            ExpertCategory.TEXTILE,
            ExpertCategory.FINANCE,
        ],
        headline="Diversifying from sugar into hotels, health and textiles",
        bio=(
            "Leads CIEL Group, a Mauritian group with interests in hotels, healthcare, "
            "financial services and textile manufacturing through CIEL Textile."
        ),
        languages=["EN", "FR"],
        accent="#0f5f56",
        featured=True,
        mauritian=True,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Jean-Pierre Dalais"),
        topics=[
            "diversification",
            "textile manufacturing",
            "hospitality",
            "healthcare",
            "regional footprint",
        ],
        sample_questions=[
            "How does a sugar-era group move into healthcare and hotels?",
            "What does a textile manufacturer need to survive EU traceability rules?",
            "How do you balance a regional portfolio with a small home market?",
        ],
        knowledge=[
            KnowledgeCard(
                id="ciel-shape",
                title="CIEL's portfolio",
                body=(
                    "CIEL Group operates across hotels, healthcare, financial services and "
                    "textile manufacturing. CIEL Textile is one of the group's industrial "
                    "arms and serves international apparel customers from Indian Ocean "
                    "locations."
                ),
                source="CIEL Group public reports and website",
                year=2025,
                topics=["CIEL", "textile", "hospitality", "healthcare"],
            ),
            KnowledgeCard(
                id="ciel-diversify",
                title="Diversification from agriculture",
                body=(
                    "Mauritian groups that began in sugar diversified into property, "
                    "hospitality and services as the sugar economy contracted. The "
                    "transition worked where the group kept a strong balance sheet and "
                    "built new management capability rather than assuming the old one "
                    "would transfer."
                ),
                source="Public histories of Mauritian conglomerates",
                year=2024,
                topics=["diversification", "sugar", "strategy"],
            ),
            KnowledgeCard(
                id="ciel-textile",
                title="Textile and export compliance",
                body=(
                    "Apparel exporters selling into the EU face tightening traceability and "
                    "product-data expectations. Manufacturers that digitise batch records "
                    "and supplier evidence early turn compliance from a cost into a "
                    "sales argument."
                ),
                source="CIEL Textile public material; EU traceability policy",
                year=2025,
                topics=["textile", "traceability", "EU", "compliance"],
            ),
        ],
    ),
    Expert(
        id="hector-espitalier-noel",
        name="Hector Espitalier-Noël",
        initials="HE",
        role="Chief Executive Officer",
        organisation="ENL Group",
        country="Mauritius",
        city="Moka",
        categories=[
            ExpertCategory.LEADERSHIP,
            ExpertCategory.FOOD,
            ExpertCategory.QUALITY,
        ],
        headline="Turning land, sugar and property into a modern group",
        bio=(
            "Leads ENL Group, a Mauritian group with roots in agriculture and sugar and "
            "interests across property, hospitality, commerce and logistics."
        ),
        languages=["EN", "FR"],
        accent="#8a4b2a",
        featured=False,
        mauritian=True,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Hector Espitalier-Noël"),
        topics=[
            "sugar transition",
            "property development",
            "agro-industry",
            "food quality",
        ],
        sample_questions=[
            "How does a sugar business reinvent itself around land and property?",
            "What should a food manufacturer fix first on quality and traceability?",
            "How do you keep rural employment viable through a transition?",
        ],
        knowledge=[
            KnowledgeCard(
                id="enl-shape",
                title="ENL's roots and reach",
                body=(
                    "ENL Group has agricultural roots in sugar and has developed "
                    "interests in property, hospitality, commerce and logistics. Its "
                    "public story is one of converting land and agricultural capability "
                    "into a broader investment portfolio."
                ),
                source="ENL Group public reports and website",
                year=2025,
                topics=["ENL", "sugar", "property", "agriculture"],
            ),
            KnowledgeCard(
                id="enl-food",
                title="Food safety as market access",
                body=(
                    "For food manufacturers, HACCP and traceability are not paperwork; "
                    "they are the condition for supplying modern retail and export "
                    "customers. The weakest link is usually the shop-floor record, not "
                    "the policy document."
                ),
                source="Public food-safety guidance; ENL public material",
                year=2024,
                topics=["food safety", "HACCP", "traceability"],
            ),
        ],
    ),
    Expert(
        id="textile-ops-veteran",
        name="Textile Operations Veteran",
        initials="TO",
        role="Composite senior operator and line leader",
        organisation="Mauritian apparel sector",
        country="Mauritius",
        city="Beau Bassin-Rose Hill",
        categories=[ExpertCategory.TEXTILE, ExpertCategory.MAINTENANCE],
        headline="25 years on Mauritian apparel lines, from operator to line lead",
        bio=(
            "A composite profile representing the experience of a long-serving apparel "
            "line leader: machine setup, changeovers, fault diagnosis and coaching "
            "expatriate operators."
        ),
        languages=["EN", "FR", "Kreol"],
        accent="#34506b",
        featured=True,
        mauritian=True,
        verified=False,
        profile_type="composite",
        disclaimer=COMPOSITE,
        topics=[
            "overlock and sewing faults",
            "changeovers",
            "operator training",
            "expatriate workforce",
        ],
        sample_questions=[
            "How do I clear a thread jam on an overlock machine?",
            "How do I train a new operator who speaks only Kreol?",
            "What causes repeated needle breakage on a sewing line?",
        ],
        knowledge=[
            KnowledgeCard(
                id="apparel-jam",
                title="Clearing an overlock thread jam",
                body=(
                    "Stop the machine and wait for it to be fully still. Lift the presser "
                    "foot, switch off the needle guard, and cut the tangled thread with "
                    "curved tweezers instead of pulling it through the needle. Brush lint "
                    "from the tension discs, re-thread along the marked path, close the "
                    "guard, and sew a test seam on scrap fabric."
                ),
                source="Synthetic SOP pack, textile",
                year=2026,
                topics=["overlock", "thread jam", "safety", "maintenance"],
            ),
            KnowledgeCard(
                id="apparel-training",
                title="Training across languages",
                body=(
                    "On Mauritian lines, a supervisor may coach operators who speak Kreol, "
                    "French and English on the same shift. Short visual steps with one "
                    "action per line, demonstrated at the machine, work better than long "
                    "written procedures. A supervisor signs off before the instruction is "
                    "used unsupervised."
                ),
                source="Synthetic practitioner notes",
                year=2026,
                topics=["training", "Kreol", "multilingual", "onboarding"],
            ),
            KnowledgeCard(
                id="apparel-needles",
                title="Repeated needle breakage",
                body=(
                    "Check needle size and type against the fabric, seating and tightness "
                    "of the needle, fabric pull, and whether the operator is deflecting "
                    "the needle. Replace a bent needle immediately and log the fault so "
                    "the pattern is visible across shifts."
                ),
                source="Synthetic practitioner notes",
                year=2026,
                topics=["needle breakage", "fault diagnosis", "quality"],
            ),
        ],
    ),
    Expert(
        id="food-quality-lead",
        name="Food Quality Lead",
        initials="FQ",
        role="Composite quality and compliance lead",
        organisation="Mauritian food manufacturing",
        country="Mauritius",
        city="Quatre Bornes",
        categories=[ExpertCategory.FOOD, ExpertCategory.QUALITY],
        headline="HACCP, traceability and audit-ready records on the shop floor",
        bio=(
            "A composite profile representing a food-manufacturing quality lead who "
            "prepares lines for HACCP audits and export customer checks."
        ),
        languages=["EN", "FR"],
        accent="#2f5d3a",
        featured=False,
        mauritian=True,
        verified=False,
        profile_type="composite",
        disclaimer=COMPOSITE,
        topics=["HACCP", "batch records", "traceability", "audit preparation"],
        sample_questions=[
            "What makes a batch record audit-ready?",
            "How do I handle a missing raw-material lot number?",
            "Where do most traceability failures start?",
        ],
        knowledge=[
            KnowledgeCard(
                id="food-batch",
                title="Audit-ready batch records",
                body=(
                    "A batch record is audit-ready when it is complete, legible, "
                    "contemporaneous and signed. Record the batch code, product, line, "
                    "start and end time, raw-material lot numbers, and any deviation. If "
                    "a field is missing, stop and escalate rather than back-filling later."
                ),
                source="Synthetic SOP pack, food",
                year=2026,
                topics=["batch record", "HACCP", "audit"],
            ),
            KnowledgeCard(
                id="food-missing-lot",
                title="Missing lot number",
                body=(
                    "If a raw-material lot number is unreadable, quarantine the material, "
                    "inform the line supervisor and trace the delivery note. Do not release "
                    "the batch until the lot is confirmed or the batch is formally "
                    "segregated and assessed."
                ),
                source="Synthetic practitioner notes",
                year=2026,
                topics=["traceability", "escalation", "quarantine"],
            ),
        ],
    ),
    Expert(
        id="eliyahu-goldratt",
        name="Eliyahu M. Goldratt",
        initials="EG",
        role="Physicist and management thinker",
        organisation="Theory of Constraints",
        country="Israel",
        categories=[ExpertCategory.LEADERSHIP, ExpertCategory.SUPPLY_CHAIN],
        headline="Find the constraint, then manage everything around it",
        bio=(
            "Author of The Goal and creator of the Theory of Constraints. His work "
            "teaches that a system's output is limited by one bottleneck at a time."
        ),
        languages=["EN"],
        accent="#6b4c9a",
        featured=True,
        mauritian=False,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Eliyahu M. Goldratt"),
        topics=["theory of constraints", "bottlenecks", "throughput", "operations"],
        sample_questions=[
            "How do I find the real bottleneck in my factory?",
            "Why does optimising every machine make the plant slower?",
            "What is drum-buffer-rope in plain language?",
        ],
        knowledge=[
            KnowledgeCard(
                id="toc-core",
                title="The constraint",
                body=(
                    "Every system has at least one constraint that limits its output. "
                    "Improving a non-constraint does not increase throughput; it only "
                    "builds inventory. Identify the constraint, exploit it, subordinate "
                    "everything else to it, elevate it, then repeat."
                ),
                source="The Goal (Goldratt & Cox, 1984)",
                year=1984,
                topics=["constraint", "throughput", "focus"],
            ),
            KnowledgeCard(
                id="toc-local-optima",
                title="Local optima",
                body=(
                    "Optimising each station independently creates queues and hides the "
                    "real bottleneck. Measure flow and throughput, not individual machine "
                    "utilisation."
                ),
                source="Theory of Constraints literature",
                year=1990,
                topics=["local optimisation", "queues", "flow"],
            ),
        ],
    ),
    Expert(
        id="edwards-deming",
        name="W. Edwards Deming",
        initials="WD",
        role="Statistician and quality pioneer",
        organisation="Deming Institute",
        country="United States",
        categories=[ExpertCategory.QUALITY, ExpertCategory.LEADERSHIP],
        headline="Quality is made by the system, not by blaming operators",
        bio=(
            "Statistician whose work on variation and management shaped modern quality "
            "practice and influenced the post-war Japanese quality movement."
        ),
        languages=["EN"],
        accent="#1f4e79",
        featured=False,
        mauritian=False,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="W. Edwards Deming"),
        topics=["variation", "quality", "PDSA", "management systems"],
        sample_questions=[
            "Why do the same defects keep coming back?",
            "How do I separate a special cause from normal variation?",
            "What should management do first to improve quality?",
        ],
        knowledge=[
            KnowledgeCard(
                id="deming-variation",
                title="Variation and causes",
                body=(
                    "Distinguish common causes, built into the system, from special "
                    "causes, which are episodic. Reacting to common-cause variation as if "
                    "it were special makes things worse. Use data over time, not a single "
                    "reading."
                ),
                source="Out of the Crisis (Deming, 1986)",
                year=1986,
                topics=["variation", "control charts", "root cause"],
            ),
            KnowledgeCard(
                id="deming-system",
                title="The system owns the result",
                body=(
                    "Most quality problems come from the system: design, process, "
                    "training and suppliers. Asking operators to try harder without "
                    "changing the system produces blame, not improvement."
                ),
                source="Out of the Crisis (Deming, 1986)",
                year=1986,
                topics=["system", "management", "blame"],
            ),
        ],
    ),
    Expert(
        id="taiichi-ohno",
        name="Taiichi Ohno",
        initials="TO",
        role="Father of the Toyota Production System",
        organisation="Toyota",
        country="Japan",
        categories=[ExpertCategory.ENGINEERING, ExpertCategory.MAINTENANCE],
        headline="Remove waste, one root cause at a time",
        bio=(
            "Engineer who developed the Toyota Production System around just-in-time "
            "flow, standard work and relentless waste elimination."
        ),
        languages=["EN"],
        accent="#7a3b3b",
        featured=False,
        mauritian=False,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Taiichi Ohno"),
        topics=["lean", "waste", "standard work", "kaizen"],
        sample_questions=[
            "What are the seven wastes on a production line?",
            "How do I start kaizen without a big programme?",
            "Why is standard work a prerequisite for improvement?",
        ],
        knowledge=[
            KnowledgeCard(
                id="ohno-waste",
                title="The seven wastes",
                body=(
                    "Waste includes overproduction, waiting, transport, over-processing, "
                    "inventory, motion and defects. The first step is to make waste "
                    "visible on the floor, not to buy software."
                ),
                source="Toyota Production System (Ohno, 1988)",
                year=1988,
                topics=["waste", "lean", "visibility"],
            ),
            KnowledgeCard(
                id="ohno-standard",
                title="Standard work",
                body=(
                    "There is no improvement without a standard. A standard is the current "
                    "best-known method, written so that anyone can follow it and improve "
                    "it. Supervisors own the standard, operators improve it."
                ),
                source="Toyota Production System (Ohno, 1988)",
                year=1988,
                topics=["standard work", "supervisor", "kaizen"],
            ),
        ],
    ),
    Expert(
        id="hau-lee",
        name="Hau L. Lee",
        initials="HL",
        role="Professor and supply-chain researcher",
        organisation="Stanford Graduate School of Business",
        country="United States",
        categories=[ExpertCategory.SUPPLY_CHAIN, ExpertCategory.LEADERSHIP],
        headline="Managing uncertainty across island and global supply chains",
        bio=(
            "Researcher on supply-chain management, information sharing and the "
            "bullwhip effect, with work on how firms manage demand and disruption."
        ),
        languages=["EN"],
        accent="#34506b",
        featured=False,
        mauritian=False,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Hau L. Lee"),
        topics=["supply chain", "bullwhip effect", "forecasting", "risk"],
        sample_questions=[
            "Why does demand look more volatile upstream?",
            "How should an island manufacturer buffer imported raw materials?",
            "What is the cheapest way to reduce stockouts?",
        ],
        knowledge=[
            KnowledgeCard(
                id="lee-bullwhip",
                title="The bullwhip effect",
                body=(
                    "Small changes in end demand can create large swings upstream when "
                    "each tier forecasts and orders independently. Sharing demand data, "
                    "shortening lead times and stabilising order policies reduce the "
                    "amplification."
                ),
                source="Hau Lee et al., management science literature",
                year=1997,
                topics=["bullwhip", "forecasting", "information sharing"],
            ),
            KnowledgeCard(
                id="lee-island",
                title="Island supply chains",
                body=(
                    "Island manufacturers face long inbound lead times and lumpy shipping. "
                    "That argues for segmenting inventory by criticality, qualifying local "
                    "alternatives, and holding buffer where the cost of a stoppage is "
                    "highest rather than spreading stock evenly."
                ),
                source="Supply-chain research; public shipping data",
                year=2024,
                topics=["island", "lead time", "inventory", "risk"],
            ),
        ],
    ),
    Expert(
        id="andrew-ng",
        name="Andrew Ng",
        initials="AN",
        role="AI researcher and educator",
        organisation="DeepLearning.AI",
        country="United States",
        categories=[ExpertCategory.AI, ExpertCategory.LEADERSHIP],
        headline="Start with a small, valuable AI project, not a moonshot",
        bio=(
            "AI researcher and educator known for making applied machine learning "
            "accessible and for advocating a data-centric, use-case-first approach."
        ),
        languages=["EN"],
        accent="#0f5f56",
        featured=False,
        mauritian=False,
        verified=False,
        profile_type="public_record",
        disclaimer=PUBLIC_RECORD.format(name="Andrew Ng"),
        topics=["applied AI", "data-centric AI", "pilot projects", "adoption"],
        sample_questions=[
            "Where should a small manufacturer start with AI?",
            "Why do most AI pilots fail to reach production?",
            "How much data do I need before trying a model?",
        ],
        knowledge=[
            KnowledgeCard(
                id="ng-start-small",
                title="Start with a small win",
                body=(
                    "Pick a narrow use case with a clear business metric and short "
                    "feedback loop. A six-week pilot that saves supervisor hours beats a "
                    "twelve-month platform programme that never ships."
                ),
                source="Public talks and writing on applied AI",
                year=2023,
                topics=["pilot", "use case", "adoption"],
            ),
            KnowledgeCard(
                id="ng-data-centric",
                title="Data-centric AI",
                body=(
                    "For many industrial applications, improving label quality and "
                    "coverage matters more than swapping models. Consistent definitions, "
                    "clean records and human review are the real moat."
                ),
                source="Data-centric AI public material",
                year=2022,
                topics=["data quality", "labels", "review"],
            ),
        ],
    ),
]

EXPERTS_BY_ID: dict[str, Expert] = {expert.id: expert for expert in EXPERTS}
