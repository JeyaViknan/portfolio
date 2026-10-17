// The network map: lines are areas of work, stations are projects and roles.
// Coordinates are hand-placed for two layouts: wide (desktop) and tall (phone).

export type LineId = 'systems' | 'ai' | 'research' | 'product';

export interface Line {
  id: LineId;
  name: string;
  color: string;
  tint: string;
  // Ordered stops along the line (station ids).
  stops: string[];
  path: { wide: [number, number][]; tall: [number, number][] };
  extension?: { wide: [number, number][]; tall: [number, number][] };
}

export const lines: Record<LineId, Line> = {
  systems: {
    id: 'systems',
    name: 'Systems',
    color: '#E4312B',
    tint: '#FDECEA',
    stops: ['penny', 'meridian', 'switchyard', 'sorry-no-proxy'],
    path: {
      wide: [[130, 300], [570, 300], [770, 500]],
      tall: [[169, 40], [169, 330], [301, 462]],
    },
  },
  ai: {
    id: 'ai',
    name: 'AI engineering',
    color: '#1E5BD7',
    tint: '#E9F0FD',
    stops: ['integra', 'autorag', 'switchyard', 'residual-graph-indexing'],
    path: {
      wide: [[130, 110], [380, 110], [570, 300], [900, 300]],
      tall: [[43, 40], [43, 205], [169, 330], [169, 548]],
    },
  },
  research: {
    id: 'research',
    name: 'Research',
    color: '#00A06A',
    tint: '#E3F6EE',
    stops: ['nit', 'residual-graph-indexing', 'hc-wf'],
    path: {
      wide: [[900, 90], [900, 300], [1000, 400], [1090, 400]],
      tall: [[30, 548], [169, 548], [235, 614], [235, 674]],
    },
  },
  product: {
    id: 'product',
    name: 'Product and teams',
    color: '#F5A01A',
    tint: '#FEF3DF',
    stops: ['viteach', 'hudo', 'nankiv', 'sorry-no-proxy'],
    path: {
      wide: [[130, 500], [770, 500]],
      tall: [[301, 40], [301, 462]],
    },
    extension: {
      wide: [[770, 500], [1060, 500]],
      tall: [[301, 462], [301, 640]],
    },
  },
};

export interface Label {
  dx: number;
  dy: number;
  anchor: 'start' | 'middle' | 'end';
  text?: string[];
}

export interface Station {
  id: string;
  name: string;
  kind: string;
  lines: LineId[];
  href: string;
  n?: string;
  wide: [number, number];
  tall: [number, number];
  label: { wide: Label; tall: Label };
  future?: boolean;
}

const above = (lines?: string[]): Label => ({ dx: 0, dy: -24, anchor: 'middle', text: lines });
const below = (lines?: string[]): Label => ({ dx: 0, dy: 36, anchor: 'middle', text: lines });
const right = (lines?: string[], dy = 5): Label => ({ dx: 22, dy, anchor: 'start', text: lines });

export const stations: Station[] = [
  {
    id: 'integra', name: 'Integra', kind: 'AI engineering internship', lines: ['ai'], href: '/integra/', n: '06',
    wide: [130, 110], tall: [43, 40], label: { wide: above(), tall: right() },
  },
  {
    id: 'autorag', name: 'AutoRAG', kind: 'Self-healing RAG', lines: ['ai'], href: '/autorag/', n: '07',
    wide: [330, 110], tall: [43, 172], label: { wide: above(), tall: right() },
  },
  {
    id: 'penny', name: 'Penny', kind: 'Banking ledger', lines: ['systems'], href: '/penny/', n: '02',
    wide: [130, 300], tall: [169, 40], label: { wide: below(), tall: right() },
  },
  {
    id: 'meridian', name: 'Meridian', kind: 'Delivery platform', lines: ['systems'], href: '/meridian/', n: '03',
    wide: [350, 300], tall: [169, 185], label: { wide: below(), tall: right() },
  },
  {
    id: 'switchyard', name: 'Switchyard', kind: 'LLM gateway', lines: ['systems', 'ai'], href: '/switchyard/', n: '01',
    wide: [570, 300], tall: [169, 330], label: { wide: { dx: 22, dy: -20, anchor: 'start' }, tall: right() },
  },
  {
    id: 'residual-graph-indexing', name: 'Residual Graph Indexing', kind: 'GraphRAG research', lines: ['ai', 'research'], href: '/residual-graph-indexing/', n: '08',
    wide: [900, 300], tall: [169, 548], label: { wide: right(['Residual Graph', 'Indexing'], -4), tall: right(['Residual Graph', 'Indexing'], -2) },
  },
  {
    id: 'nit', name: 'NIT Tiruchirappalli', kind: 'AI research internship', lines: ['research'], href: '/#role-nit',
    wide: [900, 90], tall: [30, 548], label: { wide: right(), tall: { dx: -6, dy: -20, anchor: 'start', text: ['NIT Trichy'] } },
  },
  {
    id: 'hc-wf', name: 'HC-WF', kind: 'Traffic-analysis research', lines: ['research'], href: '/hc-wf/', n: '09',
    wide: [1090, 400], tall: [235, 674], label: { wide: above(), tall: below() },
  },
  {
    id: 'viteach', name: 'VITeach', kind: 'Technical head', lines: ['product'], href: '/#role-viteach',
    wide: [130, 500], tall: [301, 40], label: { wide: below(), tall: right() },
  },
  {
    id: 'hudo', name: 'HUDO', kind: 'Co-founder', lines: ['product'], href: '/#role-hudo',
    wide: [330, 500], tall: [301, 172], label: { wide: below(), tall: right() },
  },
  {
    id: 'nankiv', name: 'nankiv', kind: 'Shortlist tracker', lines: ['product'], href: '/nankiv/', n: '05',
    wide: [550, 500], tall: [301, 317], label: { wide: below(), tall: right() },
  },
  {
    id: 'sorry-no-proxy', name: 'Sorry No Proxy', kind: 'Attendance system', lines: ['systems', 'product'], href: '/sorry-no-proxy/', n: '04',
    wide: [770, 500], tall: [301, 462], label: { wide: below(), tall: right(['Sorry No', 'Proxy'], -2) },
  },
  {
    id: 'next', name: 'Your team', kind: 'From May 2027', lines: ['product'], href: '/#contact', future: true,
    wide: [1060, 500], tall: [301, 640], label: { wide: below(['Next stop:', 'your team']), tall: right(['Next stop:', 'your team'], -2) },
  },
];

export interface WorkMeta {
  line: LineId;
  featured: boolean;
  metrics: { value: string; label: string }[];
  tech: string[];
  image?: { src: string; alt: string; caption: string; width: number; height: number };
  // A 4:3 crop for cards, when the full image doesn't crop well.
  cover?: string;
}

// Per-project presentation. Metrics come straight from the verified claims.
export const work: Record<string, WorkMeta> = {
  switchyard: {
    line: 'ai',
    featured: true,
    metrics: [
      { value: '73×', label: 'lower p95 queue wait for the interactive tenant' },
      { value: '100%', label: 'of requests served through a total provider outage' },
      { value: '356', label: 'tests, plus an 11-check verify harness' },
    ],
    tech: ['python', 'asyncio', 'prometheus', 'grafana', 'docker'],
  },
  penny: {
    line: 'systems',
    featured: true,
    metrics: [
      { value: '0', label: 'balance drift under 50 parallel transfers' },
      { value: '85%', label: 'coverage gate on every merge' },
      { value: '4', label: 'role tiers with Spring Security and JWT' },
    ],
    tech: ['java', 'springboot', 'postgresql', 'react', 'githubactions', 'docker'],
  },
  meridian: {
    line: 'systems',
    featured: false,
    metrics: [
      { value: '2 of 6', label: 'racing claims win on a capacity of two' },
      { value: '252', label: 'automated tests' },
    ],
    tech: ['nextdotjs', 'typescript', 'postgresql', 'prisma'],
  },
  'sorry-no-proxy': {
    line: 'product',
    featured: true,
    metrics: [
      { value: '500+', label: 'verifications a day' },
      { value: '4 s', label: 'lifetime of each signed code' },
      { value: '104', label: 'automated tests, including attack paths' },
    ],
    tech: ['nodedotjs', 'python', 'react', 'onnx', 'huggingface', 'cloudflarepages'],
  },
  nankiv: {
    line: 'product',
    featured: false,
    metrics: [
      { value: '3', label: 'answers: in, not this time, can’t tell' },
      { value: '0', label: 'servers, accounts or telemetry' },
    ],
    tech: ['tauri', 'react', 'typescript', 'rust', 'swift'],
    image: {
      src: '/work/nankiv-result.webp',
      alt: 'nankiv showing “You’re in” for a Siemens shortlist, with the user’s circle of friends and the rounds below',
      caption: 'nankiv’s result screen. The season shown is invented, as in the project’s own screenshots.',
      width: 1600,
      height: 1176,
    },
  },
  integra: {
    line: 'ai',
    featured: false,
    metrics: [
      { value: '40%', label: 'faster document retrieval' },
      { value: '5,000+', label: 'documents behind role-based access' },
    ],
    tech: ['python', 'fastapi', 'docker', 'githubactions', 'pytest', 'react'],
  },
  autorag: {
    line: 'ai',
    featured: false,
    metrics: [
      { value: '+15%', label: 'retrieval accuracy on a 100-query set' },
      { value: '0.62', label: 'confidence floor before it retries' },
    ],
    tech: ['python', 'huggingface', 'faiss', 'fastapi', 'redis', 'docker'],
  },
  'residual-graph-indexing': {
    line: 'research',
    featured: true,
    metrics: [
      { value: '34.6%', label: 'in-scope coverage, up from 12.4% at the same budget' },
      { value: '116,217', label: 'relationships audited across 20 novels' },
      { value: '0', label: 'extra model calls' },
    ],
    tech: ['python', 'graphrag'],
    image: {
      src: '/work/rgi-xray.webp',
      alt: 'A graph of Middlemarch communities with lost relationships drawn as red dashed lines, from the GraphRAG X-Ray demo',
      caption: 'From GraphRAG X-Ray, the simulator built alongside the research. Red dashes are relationships lost at index time; its figures are simulated.',
      width: 1600,
      height: 803,
    },
    cover: '/work/rgi-xray-cover.webp',
  },
  'hc-wf': {
    line: 'research',
    featured: false,
    metrics: [
      { value: '92.4%', label: 'closed-world accuracy on simulated sessions' },
      { value: '84.6%', label: 'open-world F1' },
    ],
    tech: ['python', 'pytorch'],
  },
};

// The route so far, oldest first. Used for the timeline in About.
export const route: { when: string; title: string; org: string; line: LineId | 'study'; note?: string; href?: string; id?: string }[] = [
  { when: '2023', title: 'B.Tech, Computer Science and Engineering', org: 'VIT Chennai · CGPA 8.5', line: 'study' },
  { when: '2023', title: 'BS, Data Science and Applications', org: 'IIT Madras, online · CGPA 8.0', line: 'study' },
  { when: 'Dec 2024', id: 'role-viteach', title: 'Technical Head', org: 'VITeach', line: 'product', note: 'Leads 10+ developers shipping platforms used by 1,000+ students. Set up branching conventions, mandatory PR review and CI gates.' },
  { when: '2025', id: 'role-hudo', title: 'Co-founder and Product Engineer', org: 'HUDO', line: 'product', note: 'Turns client problems into scoped features with acceptance criteria. Three products shipped, two in build, five engagements run in Jira.' },
  { when: 'May 2025', id: 'role-nit', title: 'AI Research Intern', org: 'NIT Tiruchirappalli', line: 'research', note: 'Sarcasm detection: 86.8% accuracy on 2,000+ samples with an end-to-end scikit-learn pipeline.' },
  { when: 'May 2026', title: 'AI Engineering Intern', org: 'Integra Global Solutions', line: 'ai', note: 'Production RAG assistant for accounting and BPO teams.', href: '/integra/' },
  { when: 'Aug 2026', title: 'AWS Certified Solutions Architect – Associate', org: 'Amazon Web Services', line: 'study', href: 'https://drive.google.com/file/d/1jwVXY9mWMB80aaprJ4Uy-c-lPHWkHnVZ/view?usp=drive_link' },
];

export const recognition = [
  { icon: 'codechef', title: 'CodeChef 6-star', note: 'Rating 2200+, Division 1' },
  { icon: 'leetcode', title: '210+ problems', note: 'Solved on LeetCode' },
  { icon: 'sih', title: 'Smart India Hackathon', note: 'Shortlisted to represent VIT Chennai' },
  { icon: 'patent', title: 'F.O.R.G.E', note: 'Co-inventor, patent filing in progress' },
  { icon: 'mongodb', title: 'Atlas Vector Search and RAG', note: 'MongoDB University, Mar 2026', href: 'https://drive.google.com/file/d/1WW1j96leBEnGvv7WwnCYHS68VPEO7TvV/view?usp=drive_link' },
];

export const toolkit: { group: string; items: string[] }[] = [
  { group: 'Languages', items: ['python', 'typescript', 'javascript', 'java', 'cplusplus', 'sql'] },
  { group: 'Backend and web', items: ['fastapi', 'springboot', 'nodedotjs', 'nextdotjs', 'react', 'prisma'] },
  { group: 'AI and data', items: ['pytorch', 'huggingface', 'scikitlearn', 'pandas', 'numpy', 'faiss'] },
  { group: 'Data stores', items: ['postgresql', 'redis', 'mysql', 'mongodb', 'apachekafka'] },
  { group: 'Infrastructure and quality', items: ['docker', 'kubernetes', 'githubactions', 'prometheus', 'grafana', 'pytest', 'junit5'] },
];
