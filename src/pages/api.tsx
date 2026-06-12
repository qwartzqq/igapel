import React from "react";
import { motion } from "motion/react";
import { Logo } from "../components/Logo";

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch (e) {
      alert("Copy failed");
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-white/60 hover:text-white transition-colors"
    >
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function CodeBlock({
  code,
  language = "json",
}: {
  code: string;
  language?: string;
}) {
  return (
    <div className="rounded-2xl overflow-hidden border border-white/10 bg-black/40">
      <div className="flex items-center justify-between px-4 py-3 border-b border-white/10 bg-white/[0.03]">
        <div className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em]">
          {language}
        </div>
        <CopyButton text={code} />
      </div>
      <pre className="p-5 overflow-x-auto text-[13px] leading-7 font-mono text-white/80">
        <code dangerouslySetInnerHTML={{ __html: highlightCode(code) }} />
      </pre>
    </div>
  );
}

function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="glass-card p-8 sm:p-10 scroll-mt-24">
      {subtitle && (
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.24em] mb-3">
          {subtitle}
        </div>
      )}
      <h2 className="text-2xl sm:text-3xl font-bold tracking-tight mb-6">{title}</h2>
      {children}
    </section>
  );
}

const EndpointCard: React.FC<{
  method: string;
  path: string;
  description: string;
  request: string;
  response: string;
}> = ({
  method,
  path,
  description,
  request,
  response,
}) => {

  const [open, setOpen] = React.useState(false);

  const methodClasses =
    method === "GET"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
      : "bg-white/10 text-white border-white/20";

  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] overflow-hidden">

      <div className="px-6 py-5 border-b border-white/10">

        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${methodClasses}`}>
            {method}
          </span>

          <span className="font-mono text-sm text-white/90">
            {path}
          </span>
        </div>

        <p className="text-sm text-white/45 mt-4">
          {description}
        </p>

      </div>


      <div className="grid xl:grid-cols-2 border-white/10">

        <div className="p-6 border-b xl:border-b-0 xl:border-r border-white/10">
          <div className="text-[10px] font-bold text-white/20 uppercase mb-4">
            Example Request
          </div>

          <CodeBlock code={request} language="http" />
        </div>


        <div className="p-6">

          <button
            onClick={() => setOpen(!open)}
            className="mb-4 text-xl text-[#7dd3fc] hover:text-white transition"
          >
            {open ? "Hide Response ▲" : "Show Response ▼"}
          </button>

          {open && (
            <CodeBlock code={response} language="json" />
          )}

        </div>

      </div>
    </div>
  );
};

function Row({
  name,
  type,
  description,
}: {
  name: string;
  type: string;
  description: string;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_140px_1fr] gap-3 md:gap-6 px-5 py-4 border-b border-white/5">
      <div className="font-mono text-[#7dd3fc] text-sm break-all">{name}</div>
      <div className="text-xs uppercase tracking-widest text-white/30 font-bold">{type}</div>
      <div className="text-sm text-white/55 leading-7">{description}</div>
    </div>
  );
}

function highlightCode(input: string) {
  const escapeHtml = (str: string) =>
    str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

  let html = escapeHtml(input);

  html = html.replace(
    /"([^"]+)"(?=\s*:)/g,
    '<span style="color:#7dd3fc">"$1"</span>'
  );

  html = html.replace(
    /:\s*"([^"]*)"/g,
    ': <span style="color:#86efac">"$1"</span>'
  );

  html = html.replace(
    /:\s*(-?\d+(\.\d+)?)/g,
    ': <span style="color:#f9a8d4">$1</span>'
  );

  html = html.replace(
    /:\s*(true|false|null)/g,
    ': <span style="color:#fca5a5">$1</span>'
  );

  html = html.replace(
    /\b(GET|POST|PUT|PATCH|DELETE)\b/g,
    '<span style="color:#86efac">$1</span>'
  );

  html = html.replace(
    /(\/api\/[A-Za-z0-9_/:.-]+)/g,
    '<span style="color:#7dd3fc">$1</span>'
  );

  return html;
}

const detectRequest = `GET /api/detect/EQCXXXXXXXXXXXXXXXXXXXXXXXXXXXX`;
const detectResponse = `{
  "network": "ton"
}`;

type ApiNetwork = 'ton' | 'bitcoin' | 'litecoin' | 'ethereum' | 'tron';

const NETWORK_LABELS: Record<ApiNetwork, string> = {
  ton: 'TON',
  bitcoin: 'BTC',
  litecoin: 'LTC',
  ethereum: 'ETH',
  tron: 'TRON',
};

const SAMPLE_ADDRESS: Record<ApiNetwork, string> = {
  ton: 'EQCXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  bitcoin: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  litecoin: 'LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  ethereum: '0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  tron: 'TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
};

const ANALYSIS_BLOCK = `  "analysis": {
    "riskScore": 10,
    "personality": "Standard",
    "tags": [
      "Active"
    ]
  }`;

const WALLET_RESPONSE: Record<ApiNetwork, string> = {
  ton: `{
  "address": "EQDxxxxxxxxxxxxxxxx",
  "balance": "12.40 TON",
  "usdValue": 79.41,
  "transactions": [
    {
      "hash": "1234567890abcdef",
      "lt": 51234567000003,
      "date": "2026-03-16T12:00:00.000Z",
      "from": "EQAAAA...",
      "to": "EQBBBB...",
      "fromName": "Alice",
      "toName": "Bob",
      "amount": "2.7500 TON",
      "amountValueTon": 2.75,
      "comment": "Payment",
      "status": "Success",
      "fee": "0.000020 TON",
      "type": "TonTransfer",
      "direction": "in",
      "isScam": false,
      "nftInfo": null
    }
  ],
  "nextBeforeLt": 51234567000001,
  "nfts": [
    {
      "address": "EQNFT123...",
      "name": "Example NFT",
      "image": "https://example.com/nft.png",
      "description": "Example item description",
      "collection": "Pale Collection",
      "index": 12,
      "verified": true
    }
  ],
  "stats": {
    "totalReceived": "25.00 TON",
    "totalSent": "12.60 TON",
    "txCount": 42,
    "firstTx": "01 Jan 2025",
    "lastTx": "12/06/2026",
    "status": "active",
    "interfaces": ["wallet_v4"],
    "maxBalance": "18.00 TON",
    "code": "te6ccg..."
  },
  "tokens": [],
${ANALYSIS_BLOCK}
}`,
  bitcoin: `{
  "address": "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
  "balance": "0.05230000 BTC",
  "usdValue": 3142.50,
  "transactions": [
    {
      "hash": "abc123...",
      "date": "2026-03-16T12:00:00.000Z",
      "from": "1AAAA...",
      "to": "1BBBB...",
      "amount": "0.01000000 BTC",
      "status": "Success",
      "fee": "0.00001200 BTC",
      "direction": "in",
      "type": "Transfer"
    }
  ],
  "nfts": [],
  "stats": {
    "totalReceived": "0.12000000 BTC",
    "totalSent": "0.06770000 BTC",
    "txCount": 18,
    "firstTx": "N/A",
    "lastTx": "N/A",
    "maxBalance": "0.12000000 BTC (Est.)"
  },
  "tokens": [],
${ANALYSIS_BLOCK}
}`,
  litecoin: `{
  "address": "LXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "balance": "4.20000000 LTC",
  "usdValue": 315.00,
  "transactions": [
    {
      "hash": "def456...",
      "date": "2026-03-16T12:00:00.000Z",
      "from": "LAAAA...",
      "to": "LBBBB...",
      "amount": "1.00000000 LTC",
      "status": "Success",
      "fee": "0.00010000 LTC",
      "direction": "out",
      "type": "Transfer"
    }
  ],
  "nfts": [],
  "stats": {
    "totalReceived": "10.00000000 LTC",
    "totalSent": "5.80000000 LTC",
    "txCount": 9,
    "firstTx": "N/A",
    "lastTx": "N/A",
    "maxBalance": "10.00000000 LTC (Est.)"
  },
  "tokens": [],
${ANALYSIS_BLOCK}
}`,
  ethereum: `{
  "address": "0xXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "balance": "1.250000 ETH",
  "usdValue": 4375.00,
  "transactions": [
    {
      "hash": "0xabc...",
      "date": "2026-03-16T12:00:00.000Z",
      "from": "External Source",
      "to": "0xXXXX...",
      "amount": "0.500000 ETH",
      "status": "Success",
      "fee": "N/A",
      "direction": "in",
      "type": "Transfer"
    }
  ],
  "nfts": [],
  "stats": {
    "totalReceived": "3.000000 ETH",
    "totalSent": "1.750000 ETH",
    "txCount": 31,
    "firstTx": "N/A",
    "lastTx": "N/A",
    "maxBalance": "3.000000 ETH (Est.)"
  },
  "tokens": [],
${ANALYSIS_BLOCK}
}`,
  tron: `{
  "address": "TXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  "balance": "120.50 TRX",
  "usdValue": 18.20,
  "transactions": [
    {
      "hash": "trx_abc...",
      "date": "2026-03-16T12:00:00.000Z",
      "from": "TAAAA...",
      "to": "TBBBB...",
      "amount": "10.00 TRX",
      "status": "Success",
      "fee": "0.001000 TRX",
      "direction": "out",
      "type": "Transfer"
    }
  ],
  "nfts": [],
  "stats": {
    "totalReceived": "500.00 TRX",
    "totalSent": "379.50 TRX",
    "txCount": 25,
    "firstTx": "N/A",
    "lastTx": "12/06/2026",
    "maxBalance": "500.00 TRX (Est.)"
  },
  "tokens": [
    {
      "name": "Tether USD",
      "symbol": "USDT",
      "balance": "42.50",
      "usdValue": 42.50
    }
  ],
${ANALYSIS_BLOCK}
}`,
};

const TON_ONLY_ENDPOINTS: { method: string; path: string; description: string; request: string; response: string }[] = [
  {
    method: 'GET',
    path: '/api/jettons/ton/:address',
    description: 'Returns jetton (token) balances for a TON address, lazily loaded by the Tokens tab.',
    request: `GET /api/jettons/ton/${SAMPLE_ADDRESS.ton}`,
    response: `[
  {
    "name": "Tether USD",
    "symbol": "USDT",
    "image": "https://example.com/usdt.png",
    "balance": "42.5000",
    "rawBalance": 42.5,
    "usdValue": 42.5,
    "verified": true,
    "address": "EQJetton..."
  }
]`,
  },
  {
    method: 'GET',
    path: '/api/transactions/ton/:address?before_lt=...',
    description: 'Loads older transactions for the "More" button in the History tab, paginated by lt.',
    request: `GET /api/transactions/ton/${SAMPLE_ADDRESS.ton}?before_lt=51234567000001`,
    response: `{
  "transactions": [ /* same shape as wallet.transactions */ ],
  "nextBeforeLt": 51234560000000
}`,
  },
  {
    method: 'GET',
    path: '/api/tx/ton/:hash',
    description: 'Full detail for a single transaction, including NFT ownership history and jetton transfer info.',
    request: `GET /api/tx/ton/1234567890abcdef`,
    response: `{
  "hash": "1234567890abcdef",
  "date": "2026-03-16T12:00:00.000Z",
  "from": "EQAAAA...",
  "to": "EQBBBB...",
  "amount": "2.7500 TON",
  "opCode": "TON Transfer",
  "nftOwnershipHistory": null,
  "jettonFlow": null
}`,
  },
  {
    method: 'GET',
    path: '/api/nfts/ton/:address',
    description: 'Returns the NFT inventory for a TON address, used by the Collectibles tab.',
    request: `GET /api/nfts/ton/${SAMPLE_ADDRESS.ton}`,
    response: `[
  {
    "address": "EQNFT123...",
    "name": "Example NFT",
    "image": "https://example.com/nft.png",
    "collection": "Pale Collection",
    "index": 12,
    "verified": true
  }
]`,
  },
];

const priceRequest = `GET /api/price/ton`;
const priceResponse = `{
  "usd": 6.42,
  "usd_24h_change": 2.15
}`;

const DOC_SECTIONS: { id: string; label: string }[] = [
  { id: 'overview', label: 'Overview' },
  { id: 'search-flow', label: 'Search flow' },
  { id: 'endpoints', label: 'Endpoints' },
  { id: 'ton-endpoints', label: 'TON-only endpoints' },
  { id: 'wallet-fields', label: 'Wallet fields' },
  { id: 'transaction-fields', label: 'Transaction fields' },
  { id: 'nft-fields', label: 'NFT fields' },
  { id: 'stats-analysis', label: 'Stats & analysis' },
  { id: 'examples', label: 'Examples' },
];

function NetworkSelector({ value, onChange }: { value: ApiNetwork; onChange: (n: ApiNetwork) => void }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      {(Object.keys(NETWORK_LABELS) as ApiNetwork[]).map((net) => (
        <button
          key={net}
          onClick={() => onChange(net)}
          className={`px-4 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-widest transition-colors ${
            value === net ? 'bg-white text-black' : 'bg-white/5 text-white/40 hover:text-white border border-white/10'
          }`}
        >
          {NETWORK_LABELS[net]}
        </button>
      ))}
    </div>
  );
}

function DocSidebar({ apiNetwork }: { apiNetwork: ApiNetwork }) {
  const sections = DOC_SECTIONS.filter((s) => s.id !== 'ton-endpoints' || apiNetwork === 'ton');
  return (
    <aside className="hidden xl:block self-start">
      <div
        className="sticky flex flex-col gap-1 rounded-2xl border border-white/10 bg-white/[0.03] p-4 max-h-[calc(100vh-8rem)] overflow-y-auto"
        style={{ position: 'sticky', top: '7rem' }}
      >
        <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-2 px-2">
          On this page
        </div>
        {sections.map((s) => (
          <a
            key={s.id}
            href={`#${s.id}`}
            className="text-sm text-white/50 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors"
          >
            {s.label}
          </a>
        ))}
      </div>
    </aside>
  );
}

export default function ApiPage() {
  const [apiNetwork, setApiNetwork] = React.useState<ApiNetwork>('ton');

  return (
    <div className="min-h-screen text-white">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4 sm:gap-8">
            <a
              href="/"
              className="hover:opacity-80 transition-opacity"
            >
              <Logo />
            </a>

            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
              <a href="/" className="hover:text-white transition-colors">
                Home
              </a>
              <a href="/features" className="hover:text-white transition-colors">
                Features
              </a>
              <a href="/api" className="text-white transition-colors">
                API
              </a>
            </div>
          </div>

          <div className="text-xs font-bold text-white/25 uppercase tracking-[0.22em]">
            Documentation
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="grid grid-cols-1 xl:grid-cols-[1fr_240px] gap-8 items-start"
        >
        <div className="flex flex-col gap-8">
          <section id="overview" className="glass-card p-8 sm:p-12 overflow-hidden relative scroll-mt-24">
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_top_right,rgba(51,147,224,0.14),transparent_25%)]" />
            <div className="relative">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-white/60 mb-6">
                Internal API • Current project structure
              </div>

              <h1 className="text-4xl sm:text-6xl font-bold tracking-tight mb-6">
                PaleChain API
              </h1>

              <p className="text-white/45 max-w-3xl text-sm sm:text-base leading-8 mb-8">
                This documentation is based on the endpoints your current frontend
                already uses right now. Nothing here changes your logic. It only
                documents the existing request flow and expected response structure.
              </p>

              <div className="mb-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.18em]">
                Choose a network to see its example payloads
              </div>
              <NetworkSelector value={apiNetwork} onChange={setApiNetwork} />

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-2">
                    Base URL
                  </div>
                  <div className="font-mono text-sm text-[#7dd3fc]">
                    http://palechain.sbs
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-2">
                    Auth
                  </div>
                  <div className="font-mono text-sm text-white/75">No auth used in current frontend</div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.18em] mb-2">
                    Format
                  </div>
                  <div className="font-mono text-sm text-white/75">JSON responses</div>
                </div>
              </div>
            </div>
          </section>

          <Section id="search-flow" title="Search flow" subtitle="How current frontend works">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  n: "01",
                  title: "Detect network",
                  text: "The frontend first sends the entered address or value to /api/detect/:value.",
                },
                {
                  n: "02",
                  title: "Fetch wallet data",
                  text: "After detection, it requests /api/wallet/:network/:address and renders the dashboard.",
                },
                {
                  n: "03",
                  title: "Fetch TON price",
                  text: "TON price is requested separately from /api/price/ton for price widgets and USD values.",
                },
              ].map((item) => (
                <div
                  key={item.n}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
                >
                  <div className="text-[10px] font-bold text-[#7dd3fc] uppercase tracking-[0.2em] mb-3">
                    Step {item.n}
                  </div>
                  <div className="text-lg font-bold mb-3">{item.title}</div>
                  <div className="text-sm text-white/50 leading-7">{item.text}</div>
                </div>
              ))}
            </div>
          </Section>

          <Section id="endpoints" title="Endpoints" subtitle="Current API routes">
            <div className="flex flex-col gap-6">
              <EndpointCard
                method="GET"
                path="/api/detect/:value"
                description="Detects the blockchain network for the entered value. Current frontend expects a JSON object with a single network field."
                request={`GET /api/detect/${SAMPLE_ADDRESS[apiNetwork]}`}
                response={`{
  "network": "${apiNetwork}"
}`}
              />

              <EndpointCard
                method="GET"
                path="/api/wallet/:network/:address"
                description={`Returns wallet data used by the main dashboard for ${NETWORK_LABELS[apiNetwork]}, including balance, transactions, NFTs, stats and analysis.`}
                request={`GET /api/wallet/${apiNetwork}/${SAMPLE_ADDRESS[apiNetwork]}`}
                response={WALLET_RESPONSE[apiNetwork]}
              />

              <EndpointCard
                method="GET"
                path="/api/price/ton"
                description="Returns the current TON price and 24h change. Used by the frontend price fetch logic."
                request={priceRequest}
                response={priceResponse}
              />
            </div>
          </Section>

          {apiNetwork === 'ton' && (
            <Section id="ton-endpoints" title="TON-only endpoints" subtitle="Tabs that only apply to TON wallets">
              <div className="flex flex-col gap-6">
                {TON_ONLY_ENDPOINTS.map((ep) => (
                  <EndpointCard
                    key={ep.path}
                    method={ep.method}
                    path={ep.path}
                    description={ep.description}
                    request={ep.request}
                    response={ep.response}
                  />
                ))}
              </div>
            </Section>
          )}

          <Section id="wallet-fields" title="Wallet response fields" subtitle="Main object structure">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <Row
                name="address"
                type="string"
                description="Wallet address shown in the main account card."
              />
              <Row
                name="balance"
                type="string"
                description="Formatted native balance, for example 12.40 TON."
              />
              <Row
                name="usdValue"
                type="number"
                description="USD value of the native balance."
              />
              <Row
                name="tokens"
                type="array"
                description="Token list used in the asset distribution chart."
              />
              <Row
                name="nfts"
                type="array"
                description="Collectibles shown in the Collectibles tab and NFT modal."
              />
              <Row
                name="transactions"
                type="array"
                description="Transaction history shown in History and Raw Transactions tabs."
              />
              <Row
                name="stats"
                type="object"
                description="Wallet stats, contract code and detected interfaces."
              />
              <Row
                name="analysis"
                type="object"
                description="Risk score, personality label and tags used by the UI."
              />
            </div>
          </Section>

          <Section id="transaction-fields" title="Transaction object fields" subtitle="transactions[]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <Row name="date" type="string" description="ISO date string of the transaction." />
              <Row name="direction" type="string" description='Expected values: "in" or "out".' />
              <Row name="type" type="string" description='Transaction type, for example "TonTransfer" or "NftItemTransfer".' />
              <Row name="amount" type="string" description="Formatted amount shown in transaction rows." />
              <Row name="from" type="string" description="Sender address." />
              <Row name="to" type="string" description="Receiver address." />
              <Row name="fromName" type="string" description="Optional display label for sender." />
              <Row name="toName" type="string" description="Optional display label for receiver." />
              <Row name="hash" type="string" description="Transaction hash used for reference and explorer redirection." />
              <Row name="comment" type="string" description="Optional message/comment displayed in the row." />
              <Row name="isScam" type="boolean" description="If true, transaction can be marked as spam/scam in UI." />
              <Row name="nftInfo" type="object|null" description="NFT metadata object for NFT transfer rows." />
            </div>
          </Section>

          <Section id="nft-fields" title="NFT object fields" subtitle="nfts[] / transactions[].nftInfo">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden">
              <Row name="name" type="string" description="NFT name shown on cards and modal." />
              <Row name="collection" type="string" description="Collection name." />
              <Row name="description" type="string" description="Description shown in NFT modal." />
              <Row name="image" type="string" description="Image URL used for NFT preview." />
              <Row name="verified" type="boolean" description="Shows the verified badge if true." />
              <Row name="address" type="string" description="NFT address shown in modal and copyable by user." />
            </div>
          </Section>

          <Section id="stats-analysis" title="Stats and analysis" subtitle="stats / analysis">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">
                  stats
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                  <Row name="totalReceived" type="string" description="All-time received amount." />
                  <Row name="totalSent" type="string" description="All-time sent amount." />
                  <Row name="maxBalance" type="string" description="Maximum wallet balance." />
                  <Row name="code" type="string" description="Contract code / BOC shown in the Code tab." />
                  <Row name="interfaces" type="array" description="Detected methods/interfaces shown in Methods tab." />
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                <div className="text-[10px] font-bold text-white/20 uppercase tracking-[0.2em] mb-4">
                  analysis
                </div>
                <div className="rounded-2xl border border-white/10 bg-black/20 overflow-hidden">
                  <Row name="riskScore" type="number" description="Risk score used by warning banner and PaleScore bar." />
                  <Row name="personality" type="string" description="Wallet personality/label badge." />
                  <Row name="tags" type="array" description="Additional tag badges rendered under the account card." />
                </div>
              </div>
            </div>
          </Section>

          <Section id="examples" title="Minimal valid examples" subtitle="Quick reference">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              <CodeBlock
                language="json"
                code={`{
  "network": "${apiNetwork}"
}`}
              />
              <CodeBlock
                language="json"
                code={`{
  "usd": 6.42,
  "usd_24h_change": 2.15
}`}
              />
              <CodeBlock
                language="json"
                code={WALLET_RESPONSE[apiNetwork]}
              />
            </div>
          </Section>
        </div>

        <DocSidebar apiNetwork={apiNetwork} />
        </motion.div>
      </main>
    </div>
  );
}