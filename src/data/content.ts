// Profile and case-study text. Every fact was checked against the resume or the
// project's own README, docs or paper source. Inline markup: `code`, *em*, **strong**.
// The map, metrics, toolkit and route live in network.ts.

export type Grade = 'use' | 'measured' | 'modelled';

export const profile = {
  name: 'Jeya Viknan',
  role: 'Software engineer',
  location: 'Chennai, India',
  graduating: 'Graduating May 2027',
  email: 'jeyaviknan11@gmail.com',
  github: 'https://github.com/JeyaViknan',
  linkedin: 'https://www.linkedin.com/in/jeya-viknan/',
  resume: '/Jeya-Viknan-Resume.pdf',
  description:
    'Jeya Viknan, software engineer. Backend systems, AI engineering and research, mapped as a network of projects, each with a case study you can run in the browser.',
};

export const grades: Record<Grade, { short: string; long: string }> = {
  use: { short: 'In use', long: 'In use by real people' },
  measured: { short: 'Measured', long: 'Measured on a test rig or dataset' },
  modelled: { short: 'Modelled', long: 'Shown in simulation or in preparation' },
};

export interface Claim {
  slug: string;
  n: string;
  group: 'Systems' | 'AI and research';
  statement: string;
  heldBy: string;
  kind: string;
  evidence: string;
  grade: Grade;
  gradeNote: string;
  role?: string;
  stack: string[];
  links: { label: string; href: string }[];
  lede: string;
  problem: string[];
  how: string[];
  decisions?: { choice: string; why: string }[];
  results: { label: string; value: string }[];
  resultsNote?: string;
  limits: string[];
  figure: { id: string; title: string; caption: string; interactive: boolean };
}

export const claims: Claim[] = [
  {
    slug: 'switchyard',
    n: '01',
    group: 'Systems',
    statement: 'A quiet tenant never waits behind a loud one.',
    heldBy: 'Switchyard',
    kind: 'Multi-tenant LLM gateway',
    evidence: 'p95 queue wait 19,980 → 273 ms',
    grade: 'measured',
    gradeNote: 'Measured against a synthetic provider fleet with an open-loop load generator',
    stack: ['Python 3.12', 'asyncio', 'Prometheus', 'Grafana', 'Docker'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/Switchyard' }],
    lede: 'Switchyard is an OpenAI-compatible gateway that shares a fixed pool of LLM capacity between tenants. It schedules in tokens, treats budgets as a hard bound, and ships with the load rig and fault scenarios that test both.',
    problem: [
      'Put several teams behind one pool of inference capacity and requests stop being interchangeable. A request holds a slot for as long as it takes to generate, and that depends on output length, which nobody declares up front. A tenant sending 4,000-token completions uses roughly ten times the capacity of one sending 400-token completions at the same rate.',
      'Rate limits count requests, so they meter the wrong unit. And with a single first-come queue, one tenant’s flood becomes everyone’s wait.',
    ],
    how: [
      'Each tenant gets its own bounded queue. A deficit round robin scheduler hands out free slots by tokens consumed, weighted per tenant, with reserved floors and ceilings on top. When a tenant’s queue is full its new work is rejected, so the cost of a flood lands on the tenant causing it.',
      'Budgets are reserved before a request runs and settled on actual usage. `max_tokens` is clamped to what the budget can still pay for, so a budget can’t be overrun even though output length is unknown at admission.',
      'Failure is split by kind. There are four timeouts (connect, first token, inter-token, total), a circuit breaker per provider, and failover that depends on what the client has already received. Before the first token, another provider takes over and the client never knows. After it, the stream ends with a typed error that says how many tokens arrived.',
    ],
    decisions: [
      {
        choice: 'Build the measurement rig before any gateway feature.',
        why: 'A harness written after the system tends to be shaped by what it finds. Building it first also produced the baseline every later change is compared against.',
      },
      {
        choice: 'Generate load open-loop, from a separate process.',
        why: 'A closed-loop generator can’t offer more load than the system absorbs, so queueing never shows up. On the gateway’s own event loop the generator added 20 ms of lag at 20 rps; in its own process, lag stayed between 0 and 2.5% of median latency up to 40 rps.',
      },
      {
        choice: 'Derive request ids from the seed and index.',
        why: 'With random ids, two runs of the same spec drew different output lengths, so comparing two policies meant comparing two workloads. A test now pins the property.',
      },
      {
        choice: 'Never splice a second provider onto a partial answer.',
        why: 'That would return corrupted text under a success status. An explicit failure carrying a token count is something the caller can act on.',
      },
    ],
    results: [
      { label: 'Interactive tenant, queue wait p95', value: '19,980 ms FIFO → 273 ms token-fair (73× lower)' },
      { label: 'Interactive tenant, latency p95', value: '24,449 ms → 5,522 ms (4.4× lower)' },
      { label: 'Interactive tenant, share of tokens', value: '9.2% → 13.5%, closer to its weight' },
      { label: 'Requests served during an 18 s total outage', value: '13% with one provider → 100% with failover' },
      { label: 'Peak client-visible error rate in that outage', value: '100% → 0%' },
      { label: 'Tests', value: '356, plus `switchyard verify`, which runs 11 checks against your own config' },
    ],
    resultsNote: 'Every figure is regenerated from scratch by `make bench` against the synthetic fleet.',
    limits: [
      'It is a single process by design. A crash is an outage, and there is no multi-replica mode.',
      'All the numbers come from a synthetic provider fleet. No live paid traffic has run through it yet.',
      'Floors have to be sized: a tenant needs its offered rate times seconds per request in slots. Beyond that, a neighbour’s flood shows up in its latency.',
    ],
    figure: {
      id: 'flood',
      title: 'Flood the gateway',
      interactive: true,
      caption:
        'A toy model of the scheduler running in your browser: eight slots, a quiet tenant sending one request a second, and a neighbour that floods at twenty-five times that rate. Switch policy mid-flood. The measured numbers are under Evidence.',
    },
  },
  {
    slug: 'penny',
    n: '02',
    group: 'Systems',
    statement: 'Every balance in the ledger sums to exactly zero.',
    heldBy: 'Penny',
    kind: 'Double-entry banking ledger',
    evidence: '50 parallel transfers, 0 drift',
    grade: 'measured',
    gradeNote: 'Proven by integration tests against real PostgreSQL',
    stack: ['Java 17', 'Spring Boot 3', 'PostgreSQL', 'React'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/penny' }],
    lede: 'Penny is a double-entry transaction ledger for digital banking. It is built around a question a bank must always be able to answer: prove that no money was created or destroyed.',
    problem: [
      'Most banking demos keep a `balance` column and update it in place. Two transfers that read the same balance before either writes will both pass the funds check, and the account pays out twice. The column then disagrees with history, and nothing can prove which is right.',
    ],
    how: [
      'Accounts have no balance column. A balance is `SUM(credits) − SUM(debits)` over an append-only journal, computed by a view. One service is the only writer of journal entries, and it always writes a debit and a credit of equal amount in one transaction.',
      'Money entering the system is double-entry too. A deposit debits a bank-owned cash vault and credits the customer, so every balance in the system sums to exactly zero. `GET /ledger/integrity` re-derives the totals from the raw entries, not the view, and asserts it.',
      'A transfer locks both accounts with `SELECT … FOR UPDATE` before re-reading the balance. Database triggers reject `UPDATE` and `DELETE` on the journal and the audit log.',
    ],
    decisions: [
      {
        choice: 'Lock accounts in ascending id order.',
        why: 'Two transfers in opposite directions would otherwise each hold one lock and wait on the other.',
      },
      {
        choice: 'Claim the idempotency key on a savepoint inside the transfer.',
        why: 'The key and the postings commit or roll back together, so a retried request can’t move money twice.',
      },
      {
        choice: 'Spring Data JDBC with immutable records, not an ORM.',
        why: 'The SQL that moves money is explicit and readable, with no lazy loading or dirty checking in the one place that must never be wrong.',
      },
      {
        choice: 'Test against real PostgreSQL.',
        why: 'Row locks and triggers are database features. An in-memory stand-in would pass tests the real database fails.',
      },
    ],
    results: [
      { label: '50 parallel transfers, account affords 10', value: 'Exactly 10 succeed; balance ends at exactly 0' },
      { label: 'Retried requests', value: 'The same `Idempotency-Key` never posts twice' },
      { label: 'Merge gate', value: '85% coverage (JUnit 5, Testcontainers, JaCoCo) in a 3-job CI pipeline' },
      { label: 'Access', value: 'Spring Security and JWT across 4 role tiers' },
      { label: 'Audit', value: 'Every write records actor, action, entity, request id and IP in the same transaction' },
    ],
    limits: [
      'Refresh tokens live in `localStorage` for demo simplicity. A production deployment should move them to an httpOnly cookie.',
      'A transfer assumes both accounts share a currency. Mismatched pairs aren’t rejected yet.',
      'The integrity check runs on demand, not on a schedule, and there is no rate limiting on login or transfers.',
    ],
    figure: {
      id: 'transfers',
      title: 'Fifty transfers at once',
      interactive: true,
      caption:
        'Fifty transfers of ₹100 from an account holding ₹1,000, run in your browser with a random interleaving each time. The same race as Penny’s `ConcurrentTransferIT`, against a mutable balance column and against Penny’s locks.',
    },
  },
  {
    slug: 'meridian',
    n: '03',
    group: 'Systems',
    statement: 'No agent is handed more parcels than they can carry.',
    heldBy: 'Meridian',
    kind: 'Last-mile delivery platform',
    evidence: '6 concurrent claims → 2 winners',
    grade: 'measured',
    gradeNote: 'Proven by an integration test against real PostgreSQL',
    stack: ['Next.js', 'TypeScript', 'PostgreSQL', 'Prisma'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/lastmile' }],
    lede: 'Meridian is a delivery platform with three roles: customers book and track parcels, operations dispatch them, and agents work their queues. Every price comes with its working, and the delivery history can’t be rewritten.',
    problem: [
      'Two dispatchers working the same queue can both see an agent with one free slot. If each reads the agent’s load and then writes it back, both assignments go through and the agent is over capacity. Neither piece of code is wrong on its own. The bug lives in the gap between the read and the write.',
    ],
    how: [
      'Capacity is claimed with one guarded `UPDATE` that increments an agent’s load only `WHERE activeOrderCount < maxConcurrentOrders`. Postgres serialises updates to a row, so exactly one caller sees a row affected. A loser moves on to the next candidate instead of failing, and an order nobody can take waits in the dispatch queue.',
      'Candidates are ranked by a pure function: a zone penalty that outweighs any distance, haversine kilometres to the pickup, and a cost for each order already in hand. Ties break on agent id, so the same inputs give the same ranking in tests and in incident replay.',
    ],
    decisions: [
      {
        choice: 'Money in integer paise, dimensions in millimetres.',
        why: 'Volumetric weight, L×B×H÷5000, becomes exact integer arithmetic. No float ever touches a charge.',
      },
      {
        choice: 'Make pricing a pure function that explains itself.',
        why: 'Each step appends a line to the breakdown the customer sees. The server recomputes the price when the order is created and stores a snapshot, so a later rate change can’t rewrite what someone paid.',
      },
      {
        choice: 'Reject an unknown pincode.',
        why: 'Falling back to the nearest area would misroute the parcel and lose the pincode the customer typed. A clear refusal naming the covered cities shows the gap instead.',
      },
      {
        choice: 'Open a new attempt after a failed delivery.',
        why: 'The failed attempt is never edited. A dispute is only answerable if it still says what happened and when.',
      },
    ],
    results: [
      { label: '6 simultaneous claims on an agent with capacity 2', value: 'Exactly 2 succeed' },
      { label: 'Automated tests', value: '252, including 104 integration tests on real PostgreSQL' },
      { label: 'Delivery history', value: 'Database triggers raise on `UPDATE` and `DELETE`' },
    ],
    limits: [
      'With two route types, Bengaluru to Chennai (about 290 km) costs the same as T Nagar to Siruseri (about 25 km). I found it, scoped the fix as a third route type, and left it out because the brief didn’t ask for it.',
      'Distances are straight lines to area centroids, not road routes.',
      'There is no payment gateway. Charges are calculated, recorded and collected on delivery.',
    ],
    figure: {
      id: 'race',
      title: 'Six dispatchers, one agent',
      interactive: true,
      caption:
        'Six dispatchers claim the same agent at once, and the agent can carry two parcels. Run it as a read followed by a write, then as Meridian’s single guarded update. The interleaving is random each run.',
    },
  },
  {
    slug: 'sorry-no-proxy',
    n: '04',
    group: 'Systems',
    statement: 'A QR code is worthless four seconds after it appears.',
    heldBy: 'Sorry No Proxy',
    kind: 'Proxy-resistant attendance',
    evidence: '500+ verifications a day',
    grade: 'use',
    gradeNote: 'In daily use by VIT faculty: 500+ verifications a day across 67 enrolled students',
    stack: ['Node.js', 'Python', 'React', 'ONNX'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/sorry-no-proxy-pro' }],
    lede: 'Sorry No Proxy is classroom attendance that resists proxies: a rotating, server-signed code on the projector, then face verification on the student’s own phone. Many VIT faculty now use it as their attendance system.',
    problem: [
      'My first version, from 2025, had the projector and the scanner each compute the code from a shared string and the current minute. The secret shipped to every student in View Source, validity was judged by the student’s own phone clock, and the scanner accepted six minutes of codes at once. Attendance could be marked with one `curl`, from anywhere.',
      'The rewrite starts from the opposite assumption. Both clients are untrusted, and only the server decides.',
    ],
    how: [
      'Each code is 34 characters: a session id, a time slot and an 80-bit HMAC-SHA256 signature. A code is valid for one 4-second slot, judged by the server’s clock. The projector holds no secret. It fetches pre-signed batches about a minute ahead and fills the gaps with decoys of exactly the same shape.',
      'A valid scan buys a single-use, device-bound token that lasts 120 seconds. That token is the only way to submit attendance, and the submission has to pass a multi-frame face match against the enrollment gallery. Borderline matches go to the faculty member for review instead of being approved.',
    ],
    decisions: [
      {
        choice: 'Encode the payload in base32.',
        why: 'Its alphabet fits QR alphanumeric mode, so the code fits a 25×25 symbol. Fewer modules means bigger squares on a projector, which decides whether the back row can scan it.',
      },
      {
        choice: 'Make decoys the same length as real codes.',
        why: 'The old decoys were longer JSON blobs, so the valid code stood out by having fewer modules. A script now checks that the two can’t be told apart.',
      },
      {
        choice: 'Refill batches with 20 seconds of runway left.',
        why: 'Lecture-hall wifi drops. A ten-second outage is invisible to the room, and if refills fail entirely the display shows only decoys. That is a delay, never a false accept.',
      },
      {
        choice: 'Keep face images out of the app.',
        why: 'They are sensitive personal data under India’s DPDP Act 2023. Only derived embeddings ship, stored in a private repository and never served over HTTP.',
      },
    ],
    results: [
      { label: 'Daily verifications', value: '500+, across 67 enrolled students' },
      { label: 'Proxy paths closed', value: 'Screenshots, leaked page secrets, clock tampering' },
      { label: 'Automated tests', value: '104, including protocol and attack-surface integration tests' },
      { label: 'Adoption', value: 'The go-to attendance system for many VIT faculty; a proposal to make it VIT’s default is submitted' },
    ],
    limits: [
      'There is no liveness detection, so a photo of another student held up to the camera still passes. This is the largest remaining gap.',
      'Each student has one enrollment photo, which causes most false rejections. Thresholds aren’t calibrated for the cohort yet.',
      'Session state is held in memory, which is correct for one instance only. The free hosting tier sleeps after about 48 hours idle.',
    ],
    figure: {
      id: 'codes',
      title: 'Try to reuse a code',
      interactive: true,
      caption:
        'A stand-in server in your browser signs codes with a random key created when you opened this page, in the same format and 4-second slots. Capture a frame, wait, then submit it. Most frames are decoys, and there is no way to tell by looking.',
    },
  },
  {
    slug: 'nankiv',
    n: '05',
    group: 'Systems',
    statement: '“Can’t tell” is never reported as “no”.',
    heldBy: 'nankiv',
    kind: 'Placement shortlist tracker',
    evidence: 'Used through placement season',
    grade: 'use',
    gradeNote: 'Used by VIT final-year students through placement season',
    stack: ['Tauri', 'React', 'TypeScript'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/nankiv' }],
    lede: 'nankiv answers one question during placement season: am I on this shortlist? Drop the spreadsheet on it and it answers in a second, for you and for the friends you’ve added.',
    problem: [
      'Shortlists arrive as spreadsheets of eight-character IDs nobody remembers, and companies don’t all identify students the same way. Some list Neo IDs and some list registration numbers. A tool that reports “not found” as “not shortlisted” will eventually tell someone they missed an interview they actually got.',
    ],
    how: [
      'There are three answers: You’re in, Not this time, and Can’t tell. Can’t tell is for a file that identifies people in a way nankiv can’t match you on, and it never becomes a no. When two rows could be you, it refuses to guess.',
      'Ask why, and it shows you the file at your row: the column as it was headed, the rows either side, and yours lit.',
    ],
    decisions: [
      {
        choice: 'Keep everything on the computer.',
        why: 'No account, no server, no telemetry. It goes online only when asked to check for updates.',
      },
      {
        choice: 'Read only what it needs.',
        why: 'Phone numbers, emails and dates of birth in a sheet are never read, and there is nowhere in the app to keep them.',
      },
      {
        choice: 'Label estimates as estimates.',
        why: 'The CGPA cutoff it infers from a list is always marked as an estimate and never presented as official.',
      },
    ],
    results: [
      { label: 'Answers', value: 'Three states, with the matching row shown as proof' },
      { label: 'Platforms', value: 'macOS and Windows, plus a macOS desktop widget' },
      { label: 'Use', value: 'Widely used by VIT final-year students through placement season' },
    ],
    limits: [
      'Cutoffs are estimates drawn from the list and batch data.',
      'The app isn’t code-signed yet, so the first launch shows an operating-system warning.',
    ],
    figure: {
      id: 'shortlist',
      title: 'Am I on the list?',
      interactive: true,
      caption:
        'Three invented shortlists, or paste your own. Your Neo ID here is 7QK2M9XA and your registration number 23ABC0042. Nothing you type leaves this page.',
    },
  },
  {
    slug: 'integra',
    n: '06',
    group: 'AI and research',
    statement: 'Each team retrieves only the documents it is cleared to see.',
    heldBy: 'Integra Global Solutions',
    kind: 'AI engineering internship',
    evidence: '40% faster retrieval, 5,000+ documents',
    grade: 'use',
    gradeNote: 'In production for Integra’s accounting and BPO teams',
    role: 'AI Engineering Intern, May to July 2026. One of three engineers.',
    stack: ['Python', 'FastAPI', 'Docker', 'GitHub Actions', 'PyTest', 'React'],
    links: [],
    lede: 'At Integra Global Solutions in Coimbatore I was one of three engineers building a production knowledge assistant for the accounting and BPO operations teams. It searches more than 5,000 documents and has to respect who may read what.',
    problem: [
      'A retrieval system is an access path. If every team’s documents sit in one index and the assistant answers from whatever is most similar, a question from one team can surface another team’s files.',
    ],
    how: [
      'I built the ETL pipeline behind it: ingestion, cleaning, chunking and embedding. Retrieval runs behind FastAPI microservices with token auth and role-based access, so a request only reaches the documents its team is cleared to see. A React interface sits in front.',
      'A GitHub Actions pipeline runs PyTest unit and integration suites on every commit, and the services ship as Docker containers.',
    ],
    results: [
      { label: 'Document retrieval time', value: '40% faster' },
      { label: 'Corpus', value: '5,000+ documents' },
      { label: 'Release cycle time', value: '30% shorter' },
    ],
    limits: ['This was employer work, so there is no code or data to link.'],
    figure: {
      id: 'access',
      title: 'Where access is enforced',
      interactive: false,
      caption:
        'The shape of the system. Access control sits in the retrieval path, so the assistant only ever sees documents the asking team is cleared for.',
    },
  },
  {
    slug: 'autorag',
    n: '07',
    group: 'AI and research',
    statement: 'No answer is returned without its sources and a confidence score.',
    heldBy: 'AutoRAG',
    kind: 'Self-healing knowledge assistant',
    evidence: '+15% retrieval accuracy, 100 queries',
    grade: 'measured',
    gradeNote: 'Measured on a 100-query evaluation set',
    stack: ['Python', 'HuggingFace', 'FAISS', 'FastAPI', 'Redis'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/AutoRAG-Self-Healing-Knowledge-Assistant' }],
    lede: 'AutoRAG is a question-answering system that checks its own answers. When an answer isn’t supported by what it retrieved, it rewrites the query and tries again, and every answer comes back with its sources and a confidence score.',
    problem: [
      'A retrieval system that answers confidently from weak context looks exactly like one that answers well. Without some measure of support, the reader can’t tell which one they got.',
    ],
    how: [
      'A question is rewritten, then retrieved two ways: dense search over FAISS and keyword search with BM25, 30 candidates each. A cross-encoder reranks them, and the best 8 that fit in 2,500 tokens become the context.',
      'After generation, a checker scores the answer against that context: half from embedding similarity, half from an NLI model’s entailment probability. Below 0.62, the controller reformulates the query and retrieves again, up to twice, and keeps the best-scoring attempt.',
    ],
    decisions: [
      {
        choice: 'Hybrid retrieval.',
        why: 'Dense search catches paraphrases. BM25 catches exact terms such as codes and names, which embeddings tend to blur.',
      },
      {
        choice: 'Rerank with a cross-encoder.',
        why: 'It reads the query and passage together, which ranks better than comparing two separate embeddings, and it only runs on the candidates retrieval already found.',
      },
      {
        choice: 'Return the score and the sources, not just the answer.',
        why: 'They let the reader check an answer instead of trusting it.',
      },
    ],
    results: [
      { label: 'Retrieval accuracy', value: '+15% over baseline on a 100-query evaluation set' },
      { label: 'Self-healing', value: 'Up to 2 retries when confidence falls below 0.62' },
      { label: 'Interface', value: '`/ingest` and `/ask` over FastAPI, with a Redis cache, in Docker Compose' },
    ],
    limits: [
      'Confidence takes the best score over all retrieved chunks, so one strongly supporting chunk can lift an answer that makes several claims.',
      'A retry retrieves with the first rewritten query only.',
      'A 100-query set is enough to compare configurations, not to generalise from.',
    ],
    figure: {
      id: 'loop',
      title: 'The self-healing loop',
      interactive: false,
      caption: 'The pipeline, with the parameters it runs at. The loop back to the rewriter is taken only when the answer’s support score is below 0.62.',
    },
  },
  {
    slug: 'residual-graph-indexing',
    n: '08',
    group: 'AI and research',
    statement: 'Whatever the summaries leave out is kept on record.',
    heldBy: 'Residual Graph Indexing',
    kind: 'GraphRAG research',
    evidence: 'In-scope coverage 12.4% → 34.6%',
    grade: 'measured',
    gradeNote: 'Coverage measured on GraphRAG-Bench Novel; effects on answers shown only in simulation so far',
    role: 'Final-year research with Adithya DS and Aatreyee Dev, guided by Dr. Karthika Veeramani.',
    stack: ['Python', 'GraphRAG 3.1.1', 'Leiden communities'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/graphrag-loss-study' }],
    lede: 'Residual Graph Indexing measures what GraphRAG throws away while it builds its index, and adds an exact record of it, without changing the summaries or spending another model call.',
    problem: [
      'GraphRAG answers broad questions by reading summaries of graph communities instead of the graph itself. Information is lost while those summaries are built, before any question is asked. A relationship between entities in two different communities appears in no summary. And the summary input builder admits only 4.6% to 16.3% of a community’s own relationships, because it keeps one relationship per entity whatever the budget.',
      'Because this happens at index time, no retriever that reads the summaries can get it back.',
    ],
    how: [
      'RGI keeps GraphRAG’s summaries and search as they are and adds a residual, in the video-coding sense. The summaries are keyframes, and the residual is exactly what they couldn’t carry. GraphRAG’s own output records which relationships each community holds, so the residual is a set difference over the index files and needs no model calls.',
      'Retrieval can then draw on the residual within the same 8,000-token budget.',
    ],
    decisions: [
      {
        choice: 'Measure the loss before proposing a fix.',
        why: 'We ran GraphRAG 3.1.1’s own indexing code, without calling a model, on all 20 novels of GraphRAG-Bench Novel, so the loss is counted from the real pipeline.',
      },
      {
        choice: 'Separate two strengths of loss.',
        why: 'A relationship can be out of scope, with no input about its community carrying it, or have its evidence absent, with no selected input carrying it in any form. The two move differently across levels of the hierarchy.',
      },
      {
        choice: 'Leave the summaries alone.',
        why: 'Keeping them fixed means any gain comes from the residual and nothing GraphRAG kept is lost.',
      },
      {
        choice: 'Pre-register the test on answers.',
        why: 'Effects on answer quality are only simulated so far, so the protocol that will test them is written down first.',
      },
    ],
    results: [
      { label: 'Relationships audited', value: '116,217 across 20 novels' },
      { label: 'In-scope coverage, default level, same 8,000-token budget', value: '12.4% → 34.6%' },
      { label: 'Mean gain over novels', value: '+24.6 points, 95% CI [20.5, 28.3]' },
      { label: 'Relationships with no evidence in any input, root level', value: '87.6%' },
      { label: 'Extra model calls', value: 'None. Nothing GraphRAG kept is dropped.' },
    ],
    limits: [
      'Effects on answers are shown only in simulation. A pre-registered protocol will test them.',
      'The measurements come from one benchmark corpus.',
    ],
    figure: {
      id: 'residual',
      title: 'What the summaries keep',
      interactive: true,
      caption:
        'A toy graph from Pride and Prejudice, split into three communities the way GraphRAG might split it. Each community summary has room for only a few relationships. Watch what happens to Elizabeth and Darcy.',
    },
  },
  {
    slug: 'hc-wf',
    n: '09',
    group: 'AI and research',
    statement: 'A browsing session gives away more than its pages do one at a time.',
    heldBy: 'HC-WF',
    kind: 'Encrypted-traffic analysis research',
    evidence: '92.4% closed-world accuracy, simulated sessions',
    grade: 'modelled',
    gradeNote: 'Evaluated on simulated sessions under a controlled protocol; manuscript in preparation',
    stack: ['Python', 'PyTorch', 'Transformers'],
    links: [{ label: 'Repository', href: 'https://github.com/JeyaViknan/Hierarchical-Context-Aware-Website-Fingerprinting' }],
    lede: 'HC-WF is research on website fingerprinting: working out which sites someone visits over Tor from the shape of their encrypted traffic. Most models classify each page load alone. HC-WF reads the session.',
    problem: [
      'Earlier deep-learning attacks treat each page load as independent, which throws away the order of a browsing session. A shopping cart page is usually followed by a payment page, and evidence gathered across several visits can settle a trace that is ambiguous on its own.',
    ],
    how: [
      'Stage one is a packet-level Transformer that turns each trace, a sequence of cell directions and timings, into an embedding. Stage two is a session-level Transformer whose attention adds a learned transition bias to the usual content score, QKᵀ/√d + Tᵢⱼ, so it learns how often one kind of site follows another. Two heads predict the site and the session’s category.',
      'Stage one is trained first and then frozen while stage two trains.',
    ],
    decisions: [
      {
        choice: 'Re-run the baselines on the same splits.',
        why: 'DF, Var-CNN and WF-Transformer were re-evaluated on exactly the session splits HC-WF used, so the comparison is like for like.',
      },
      {
        choice: 'Report F1 next to accuracy.',
        why: 'The open world is about telling monitored from unmonitored traffic, where class imbalance makes accuracy alone misleading.',
      },
      {
        choice: 'Ablate each stage.',
        why: 'Stage two on random embeddings scores 12.4%, close to chance for 95 sites. Stage one alone reaches 86.5%, and the two together 92.4%.',
      },
    ],
    results: [
      { label: 'Closed-world accuracy', value: '92.4% (91.6% F1), 5.9 points above the best baseline' },
      { label: 'Open-world F1', value: '84.6%, 6.2 points above the best baseline' },
      { label: 'Accuracy lost at 10–20% injected noise', value: '5.8–8.5 points, against 11.4–16.2 for baselines' },
      { label: 'Significance', value: 'Paired t-tests over 10 runs, p < 0.01' },
    ],
    limits: [
      'The sessions are synthetic: single traces from the DF dataset grouped by a 30-second gap and interleaved. Real browsing may not look like this.',
      'Injected noise stands in for real defences.',
      'The manuscript is in preparation and hasn’t been peer reviewed.',
    ],
    figure: {
      id: 'sessions',
      title: 'Two stages',
      interactive: false,
      caption:
        'Each bar is one Tor cell, drawn up for outgoing and down for incoming. The traces are illustrative. Stage one reads each trace alone, and stage two reads the session.',
    },
  },
];
