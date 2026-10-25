// Career details supplied by Manuel. Dates describe completed appointments;
// grant currency is intentionally omitted because it was not specified.
export type Experience = {
  name: string
  organization?: string
  role: string
  start: string
  end: string
  startLabel: string
  endLabel: string
  location?: string
  summary: string
  outcome?: string
  detailsLabel?: string
  details?: string[]
  current?: boolean
}

export const experience: Experience[] = [
  {
    name: 'Peptaris, Inc.',
    role: 'Founder & Lead Engineer',
    start: '2026-10', end: '2026-10',
    startLabel: 'Oct 2026', endLabel: 'Present',
    location: 'Philadelphia, PA · On-site',
    summary: 'Building the next generation of peptide therapeutics alongside William Herbert, Prof. César de la Fuente and Prof. Marcelo Der Torossian Torres, as a spin-off of UPenn.',
    current: true,
  },
  {
    name: 'Tinybird',
    role: 'Software Engineer',
    start: '2025-09', end: '2026-09',
    startLabel: 'Sep 2025', endLabel: 'Sep 2026',
    location: 'Madrid, Spain · On-site',
    summary: 'Developed ClickHouse and core database infrastructure, and worked on platform infrastructure at scale with Kubernetes and Docker. Rebuilt the billing system into a cloud-provider-grade model, working across teams on correctness and reliability.',
  },
  {
    name: 'Mercatus Center',
    organization: 'George Mason University',
    role: 'Emergent Venture Fellow',
    start: '2025-03', end: '2026-07',
    startLabel: 'Mar 2025', endLabel: 'Jul 2026',
    summary: 'Pursued independent research in protein design, supported by two Emergent Ventures grants.',
    outcome: 'Two research grants of 4K each.',
  },
  {
    name: 'University of Pennsylvania',
    role: 'Undergraduate Researcher',
    start: '2026-01', end: '2026-06',
    startLabel: 'Jan 2026', endLabel: 'Jun 2026',
    summary: 'Built an end-to-end generative pipeline for therapeutic peptides targeting GSK3β, a kinase involved in tau hyperphosphorylation in Alzheimer’s disease. Combined molecular generation, target-specific guidance, and a blood–brain barrier permeability classifier.',
    detailsLabel: 'Research details',
    details: [
      'Used BoltzGen, an all-atom diffusion model with a VP-SDE formulation, to jointly denoise backbone geometry and side-chain identity.',
      'Steered sampling with Dhariwal–Nichol classifier guidance toward hotspot residues and away from the ATP-competitive cleft.',
      'Used a separate ESM-2-based classifier for blood–brain barrier permeability. Since its signal was not differentiable with respect to 3D coordinates, distilled that signal through reinforcement learning.',
    ],
  },
  {
    name: 'Stealth startup',
    role: 'Co-founder & Advisor',
    start: '2025-01', end: '2026-02',
    startLabel: 'Jan 2025', endLabel: 'Feb 2026',
    summary: 'Co-founded and advised a company building marketing mix models for large ecommerce businesses using causal machine learning.',
    outcome: 'The company was sold before the product launched.',
  },
  {
    name: 'VRAIN',
    organization: 'Valencian Research Institute for Artificial Intelligence',
    role: 'Undergraduate Researcher',
    start: '2024-11', end: '2026-01',
    startLabel: 'Nov 2024', endLabel: 'Jan 2026',
    location: 'Valencia, Spain · On-site',
    summary: 'Worked on computational genomics and precision medicine. Co-authored “Exploring BioNER Frontiers: An In-Depth Evaluation” (CAiSE 2025), a systematic benchmark of biomedical named entity recognition models.',
    detailsLabel: 'Publication & collaboration',
    details: [
      'Evaluated BioBERT, PubMedBERT, AIONER, and VANER across five entity types, releasing a unified evaluation pipeline for reproducibility.',
      'This work led to a collaboration with César de la Fuente’s lab at UPenn on a computational pipeline for cyclic peptide design targeting GSK3β in Alzheimer’s-related research.',
    ],
  },
  {
    name: 'Massachusetts Institute of Technology',
    role: 'Undergraduate Researcher',
    start: '2025-10', end: '2025-11',
    startLabel: 'Oct 2025', endLabel: 'Nov 2025',
    summary: 'Conducted exploratory research at the intersection of AI, drug design, and biotechnology, including time in Rafael Gómez-Bombarelli’s lab. Worked with diffusion models and flow matching for molecular generation and guidance, alongside GPU-level implementation to run these methods efficiently at scale.',
    outcome: 'Later recognition: MIT Grand Hackathon winner, March 2026.',
  },
  {
    name: 'Keytrends',
    role: 'Co-founder · Head of Data & AI',
    start: '2022-03', end: '2025-07',
    startLabel: 'Mar 2022', endLabel: 'Jul 2025',
    location: 'Remote',
    summary: 'Co-founded a B2B SaaS used by Meliá and PcComponentes, and led its Data & AI division. Built the full data and ML stack from scratch with ClickHouse, Python, Rust, and PyTorch, including scraping infrastructure handling millions of requests per day. Owned hiring and growth end-to-end.',
    outcome: 'Raised €500K and grew the company to $1M ARR.',
  },
  {
    name: 'Freelance',
    role: 'SEO Consultant & Web Developer',
    start: '2018-03', end: '2025-03',
    startLabel: 'Mar 2018', endLabel: 'Mar 2025',
    location: 'Full-time',
    summary: 'Worked with companies including Mercado Libre and ABCDIN on data-driven SEO and product marketing. Built and deployed custom ecommerce applications and production APIs, connecting marketing analysis with hands-on software development.',
    detailsLabel: 'Consulting & engineering',
    details: [
      'Used Google Search Console, Google Analytics, Semrush, and BigQuery for keyword research, competitive analysis, search strategy, and performance measurement.',
      'Optimized product listings and content, built data-driven campaigns, and monitored results to improve visibility and engagement.',
      'Developed scalable ecommerce applications with Django, Vue, and AWS, integrating custom features and maintaining secure, reliable systems.',
      'Built and operated production APIs with Kubernetes, Jenkins, and Docker.',
    ],
  },
]
