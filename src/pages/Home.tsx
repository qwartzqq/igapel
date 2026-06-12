import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Wallet, TrendingUp, Activity, Shield, ArrowRight, Copy, ExternalLink, RefreshCw, Globe, ArrowUpRight, ArrowDownLeft, Zap, Layers, Cpu, X, Info, Pizza, ChevronDown, ChevronUp } from 'lucide-react';
import { cn, WalletData, Network, NFT } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { QRCodeCanvas } from 'qrcode.react';
import { useTonConnectUI, useTonWallet, TonConnectButton } from '@tonconnect/ui-react';
import { beginCell } from '@ton/core';
import { Star, Share2 } from 'lucide-react';
import { Logo } from '../components/Logo';
import { useNotify } from '../components/Notifications';

// --- Components ---

const Navbar = ({ onLogoClick }: { onLogoClick: () => void }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-xl border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4 sm:gap-8">
          <div 
            className="cursor-pointer hover:opacity-80 transition-opacity"
            onClick={onLogoClick}
          >
            <Logo />
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-white/40">
		  <a href="/" className="text-white transition-colors">Home</a>
            <a href="/features" className="hover:text-white transition-colors">Features</a>
            <a href="/api" className="hover:text-white transition-colors">API</a>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <TonConnectButton />
        </div>
      </div>
    </nav>
  );
};

const PriceCard = ({ symbol, price, change, color }: { symbol: string; price: number; change: number; color: string }) => (
  <div className="glass-card p-4 flex items-center gap-4">
    <div className={cn("w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs", color)}>
      {symbol[0]}
    </div>
    <div>
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{symbol}</div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-mono font-bold">${(price || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
        <span className={cn("text-[10px] font-bold", (change || 0) >= 0 ? "text-emerald-400" : "text-rose-400")}>
          {(change || 0) >= 0 ? '▲' : '▼'} {Math.abs(change || 0).toFixed(2)}%
        </span>
      </div>
    </div>
  </div>
);

const StatBox = ({ label, value, subValue, icon: Icon }: { label: string; value: string; subValue?: string; icon: any }) => (
  <div className="glass-card p-6">
    <div className="flex items-center justify-between mb-4">
      <div className="text-[10px] font-bold text-white/40 uppercase tracking-widest">{label}</div>
      <Icon className="w-4 h-4 text-white/20" />
    </div>
    <div className="text-2xl font-bold tracking-tight mb-1">{value}</div>
    {subValue && <div className="text-xs font-mono text-white/20">{subValue}</div>}
  </div>
);

interface TransactionRowProps {
  tx: any;
  onNFTClick?: (nft: NFT) => void;
  onAddressClick?: (address: string) => void;
  onHashClick?: (hash: string) => void;
}

const TransactionRow: React.FC<TransactionRowProps> = ({ tx, onNFTClick, onAddressClick, onHashClick }) => {
  const notify = useNotify();
  return (
  <div className="flex flex-col sm:grid sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-4 sm:py-3 items-start sm:items-center text-[13px] border-b border-[#222b35] hover:bg-white/[0.02] transition-colors group">
    {/* Mobile Header: Action + Amount */}
    <div className="flex sm:hidden w-full justify-between items-center mb-1">
      <div className="flex items-center gap-2">
        <div className={cn(
          "w-5 h-5 rounded-full flex items-center justify-center", 
          tx.direction === 'in' ? "text-[#00b127]" : "text-white/60"
        )}>
          {tx.direction === 'in' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
        </div>
        <span className={cn("font-bold", tx.direction === 'in' ? "text-[#00b127]" : "text-white/80")}>
          {tx.type === 'NftItemTransfer' ? (tx.direction === 'in' ? 'Receive NFT' : 'Send NFT') : 
           tx.direction === 'in' ? 'Receive TON' : 'Send TON'}
        </span>
      </div>
      {!tx.nftInfo && (
        <span className={cn("font-bold text-[14px]", tx.direction === 'in' ? "text-[#00b127]" : "text-white/80")}>
          {tx.direction === 'in' ? '+' : '-'}{tx.amount}
        </span>
      )}
    </div>

    {/* Date (Desktop) */}
    <div className="hidden sm:block col-span-2 text-white/40 whitespace-nowrap">
      {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} {new Date(tx.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
    </div>

    {/* Action (Desktop) */}
    <div className="hidden sm:flex col-span-2 items-center gap-2">
      <div className={cn(
        "w-5 h-5 rounded-full flex items-center justify-center", 
        tx.direction === 'in' ? "text-[#00b127]" : "text-white/60"
      )}>
        {tx.direction === 'in' ? <ArrowDownLeft className="w-3.5 h-3.5" /> : <ArrowUpRight className="w-3.5 h-3.5" />}
      </div>
      <span className={cn("font-medium whitespace-nowrap", tx.direction === 'in' ? "text-[#00b127]" : "text-white/80")}>
        {tx.isScam && <span className="mr-2 px-1 py-0.5 bg-rose-500/20 text-rose-500 text-[9px] font-bold rounded uppercase">Spam</span>}
        {tx.type === 'NftItemTransfer' ? (tx.direction === 'in' ? 'Receive NFT' : 'Send NFT') : 
         tx.direction === 'in' ? `Receive ${(tx.amount || '').split(' ').pop() || 'TON'}` : `Send ${(tx.amount || '').split(' ').pop() || 'TON'}`}
      </span>
    </div>

    {/* Address */}
    <div className="col-span-12 sm:col-span-3 flex flex-col gap-0.5 min-w-0 w-full">
      <div className="text-[10px] font-bold text-white/20 uppercase tracking-tight">
        {tx.direction === 'in' ? 'From' : 'To'}
      </div>
      <div className="flex items-center gap-1.5 group/addr">
        <div 
          className="truncate font-mono text-[#3393e0] hover:underline cursor-pointer text-[11px] sm:text-[13px] flex items-center gap-1.5 min-w-0"
          onClick={() => {
            const addr = tx.direction === 'in' ? tx.from : tx.to;
            if (addr && addr !== 'N/A' && addr !== 'Multiple Inputs' && addr !== 'Multiple Outputs') {
              onAddressClick?.(addr);
            }
          }}
        >
          <span className="truncate">
            {tx.direction === 'in' ? (tx.fromName || tx.from) : (tx.toName || tx.to)}
          </span>
          {(tx.direction === 'in' ? tx.fromName : tx.toName) && (
            <span className="text-[10px] text-white/20 font-mono flex-shrink-0 hidden sm:inline">
              ({(tx.direction === 'in' ? tx.from : tx.to).slice(0, 4)}...{(tx.direction === 'in' ? tx.from : tx.to).slice(-4)})
            </span>
          )}
        </div>
        <button 
          onClick={(e) => {
            e.stopPropagation();
            const addr = tx.direction === 'in' ? tx.from : tx.to;
            if (addr && addr !== 'N/A') {
              navigator.clipboard.writeText(addr);
              notify({ variant: 'info', label: 'Address copied!' });
            }
          }}
          className="opacity-0 group-hover/addr:opacity-100 text-white/20 hover:text-white transition-all flex-shrink-0"
        >
          <Copy className="w-3 h-3" />
        </button>
      </div>
    </div>

    {/* NFT / Comment Info */}
    <div className="col-span-12 sm:col-span-3 flex items-center sm:justify-end gap-2 truncate w-full sm:pr-4">
      {tx.comment && (
        <div className="flex items-center gap-2 truncate">
          <span className="px-1.5 py-0.5 bg-rose-500/10 text-[10px] font-bold text-rose-500 rounded uppercase">MESSAGE</span>
          <span className="text-white/40 truncate italic">{tx.comment}</span>
        </div>
      )}
      {tx.nftInfo && (
        <div 
          className="flex items-center gap-3 bg-white/[0.03] px-3 py-2 rounded-xl border border-white/5 max-w-full group-hover:border-[#3393e0]/40 transition-all shadow-sm cursor-pointer"
          onClick={() => onNFTClick?.(tx.nftInfo)}
        >
          <div className="flex flex-col items-end truncate min-w-0">
            <div className="flex items-center gap-1">
              <span className={cn(
                "truncate font-bold text-[12px] leading-tight",
                tx.nftInfo.name === "Unnamed NFT" ? "text-white/30 italic" : "text-white/90"
              )}>
                {tx.nftInfo.name}
              </span>
              {tx.nftInfo.verified && (
                <div className="w-3 h-3 bg-[#3393e0] rounded-full flex items-center justify-center flex-shrink-0">
                  <Shield className="w-2 h-2 text-white fill-current" />
                </div>
              )}
            </div>
            {tx.nftInfo.collection && (
              <span className="text-white/30 text-[9px] truncate uppercase tracking-tight font-medium">{tx.nftInfo.collection}</span>
            )}
          </div>
          <div className="relative flex-shrink-0">
            {tx.nftInfo.image ? (
              <img 
                src={tx.nftInfo.image} 
                className="w-9 h-9 rounded-lg object-cover border border-white/10 shadow-md transition-transform" 
                referrerPolicy="no-referrer"
                alt=""
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                <Layers className="w-4.5 h-4.5 text-white/10" />
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#161c24] rounded-full border border-[#222b35] flex items-center justify-center shadow-sm">
              <Layers className="w-2 h-2 text-[#3393e0]" />
            </div>
          </div>
        </div>
      )}
      {tx.type !== 'NftItemTransfer' && (
        <span className={cn("font-medium text-[14px]", tx.direction === 'in' ? "text-[#00b127]" : "text-white/80")}>
          {tx.direction === 'in' ? '+' : '-'}{tx.amount}
        </span>
      )}
    </div>

    {/* Reference / Hash + Date (Mobile) */}
    <div className="col-span-12 sm:col-span-2 flex sm:block justify-between items-center w-full sm:text-right">
      <div className="sm:hidden text-white/40 text-[11px]">
        {new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} {new Date(tx.date).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false })}
      </div>
      <div 
        className="font-mono text-white/20 text-[11px] truncate hover:text-[#3393e0] cursor-pointer"
        onClick={() => onHashClick?.(tx.hash)}
      >
        Ref#{tx.hash.slice(0, 8)}
      </div>
    </div>
  </div>
  );
};


const NFTModal = ({ nft, onClose }: { nft: NFT; onClose: () => void }) => {
  const notify = useNotify();
  return (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }}
      animate={{ scale: 1, y: 0 }}
      exit={{ scale: 0.9, y: 20 }}
      className="bg-[#161c24] border border-[#222b35] rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="relative aspect-square md:aspect-video bg-white/5">
        {nft.image ? (
          <img 
            src={nft.image} 
            alt={nft.name} 
            className="w-full h-full object-contain"
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-white/10">
            <Layers className="w-24 h-24" />
          </div>
        )}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/80 rounded-full text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="p-8">
        <div className="flex items-center gap-2 mb-2">
          <div className="text-xs font-bold text-[#3393e0] uppercase tracking-widest">
            {nft.collection || 'No Collection'}
          </div>
          {nft.verified && (
            <div className="w-4 h-4 bg-[#3393e0] rounded-full flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white fill-current" />
            </div>
          )}
        </div>
        <h2 className="text-2xl font-bold mb-4">{nft.name}</h2>
        <div className="space-y-4">
          <div>
            <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Description</div>
            <p className="text-sm text-white/60 leading-relaxed whitespace-pre-wrap">
              {nft.description || 'No description available for this item.'}
            </p>
          </div>
          {nft.address && (
            <div>
              <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1">Address</div>
              <div className="flex items-center gap-2 font-mono text-xs text-[#3393e0] break-all">
                {nft.address}
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(nft.address!);
                    notify({ variant: 'info', label: 'NFT address copied!' });
                  }}
                  className="text-white/20 hover:text-white transition-colors"
                >
                  <Copy className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  </motion.div>
  );
};


const truncAddr = (addr?: string) => addr && addr.length > 12 ? `${addr.slice(0, 6)}...${addr.slice(-6)}` : (addr || 'N/A');

interface TransactionModalProps {
  hash: string;
  onClose: () => void;
  onAddressClick?: (address: string) => void;
}

const TransactionModal: React.FC<TransactionModalProps> = ({ hash, onClose, onAddressClick }) => {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    fetch(`/api/tx/ton/${hash}`)
      .then(res => {
        if (!res.ok) throw new Error('Failed to load transaction');
        return res.json();
      })
      .then(d => { if (!cancelled) setData(d); })
      .catch(e => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [hash]);

  const AddressLink = ({ addr, name }: { addr?: string; name?: string }) => (
    <button
      className="font-mono text-[#3393e0] hover:underline text-xs sm:text-sm break-all text-left"
      onClick={() => addr && addr !== 'N/A' && onAddressClick?.(addr)}
    >
      {name ? `${name} (${truncAddr(addr)})` : truncAddr(addr)}
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-[#161c24] border border-[#222b35] rounded-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-[#161c24] border-b border-[#222b35] p-6 flex items-center justify-between z-10">
          <div>
            <div className="text-xs font-bold text-white/40 uppercase tracking-widest mb-1">Transaction</div>
            <div className="font-mono text-sm text-white/80 break-all">{hash}</div>
          </div>
          <button onClick={onClose} className="p-2 bg-white/5 hover:bg-white/10 rounded-full text-white transition-colors flex-shrink-0 ml-4">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {loading && (
            <div className="py-20 text-center text-white/20 text-sm italic">Loading transaction...</div>
          )}
          {error && (
            <div className="py-20 text-center text-rose-400 text-sm italic">{error}</div>
          )}

          {data && !loading && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-3 items-baseline text-sm">
                <div className="text-white/40 text-[13px]">Type</div>
                <div className="font-mono text-white/80 break-all">{data.opCode || data.type}</div>

                <div className="text-white/40 text-[13px]">Date</div>
                <div className="text-white/80">{new Date(data.date).toLocaleString('en-GB')}</div>

                <div className="text-white/40 text-[13px]">Status</div>
                <div>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest",
                    data.status === 'Success' ? "bg-emerald-500/10 text-emerald-500" : "bg-yellow-500/10 text-yellow-500"
                  )}>
                    {data.status}
                  </span>
                </div>

                <div className="text-white/40 text-[13px]">From</div>
                <AddressLink addr={data.from} name={data.fromName} />

                <div className="text-white/40 text-[13px]">To</div>
                <AddressLink addr={data.to} name={data.toName} />

                <div className="text-white/40 text-[13px]">Amount</div>
                <div className="font-bold text-white/90">{data.amount}</div>

                <div className="text-white/40 text-[13px]">Fee</div>
                <div className="font-mono text-white/60 text-xs">{data.fee}</div>

                {data.comment && (
                  <>
                    <div className="text-white/40 text-[13px]">Comment</div>
                    <div className="text-white/80 italic break-all">{data.comment}</div>
                  </>
                )}
              </div>

              {/* NFT Ownership history "tree" — like tonviewer's NFT transfer chain */}
              {data.nftInfo && (
                <div className="border-t border-white/5 pt-6">
                  <div className="flex items-center gap-3 mb-4">
                    {data.nftInfo.image && (
                      <img src={data.nftInfo.image} className="w-12 h-12 rounded-lg object-cover border border-white/10" referrerPolicy="no-referrer" alt="" />
                    )}
                    <div>
                      <div className="font-bold text-sm">{data.nftInfo.name}</div>
                      <div className="text-[11px] text-white/40 uppercase tracking-widest">{data.nftInfo.collection}</div>
                    </div>
                  </div>

                  {data.nftOwnershipHistory && data.nftOwnershipHistory.length > 0 && (
                    <div>
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <Layers className="w-3.5 h-3.5" /> Ownership History
                      </div>
                      <div className="flex flex-col gap-2">
                        {data.nftOwnershipHistory.map((h: any, i: number) => (
                          <div key={i} className="flex items-center gap-2 text-xs bg-white/[0.03] rounded-lg px-3 py-2 border border-white/5">
                            <AddressLink addr={h.from} name={h.fromName} />
                            <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                            <AddressLink addr={h.to} name={h.toName} />
                            {h.comment && <span className="text-white/30 italic ml-2 truncate">"{h.comment}"</span>}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Jetton flow — simplified from -> to with token info, like tonviewer's token transfer view */}
              {data.jettonFlow && (
                <div className="border-t border-white/5 pt-6">
                  <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5" /> Token Transfer
                  </div>
                  <div className="flex items-center gap-3 bg-white/[0.03] rounded-xl p-4 border border-white/5">
                    {data.jettonFlow.jetton?.image && (
                      <img src={data.jettonFlow.jetton.image} className="w-8 h-8 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" alt="" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-sm mb-2">{data.jettonFlow.jetton?.symbol}</div>
                      <div className="flex items-center gap-2 text-xs flex-wrap">
                        <AddressLink addr={data.jettonFlow.from} name={data.jettonFlow.fromName} />
                        <ArrowRight className="w-3.5 h-3.5 text-white/20 flex-shrink-0" />
                        <AddressLink addr={data.jettonFlow.to} name={data.jettonFlow.toName} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="border-t border-white/5 pt-4">
                <a
                  href={`https://tonviewer.com/transaction/${hash}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] text-white/30 hover:text-white/60 transition-colors flex items-center gap-1.5"
                >
                  View on Tonviewer <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
};


const NotFoundView = () => (
  <motion.div
    key="notfound"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="min-h-[60vh] flex items-center justify-center px-4"
  >
    <div className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
      <div className="flex-shrink-0 flex items-center justify-center">
        <img
          src="/notfound.png"
          alt="404 not found"
          className="h-[240px] md:h-[300px] w-auto object-contain select-none pointer-events-none"
        />
      </div>
      <div className="h-[240px] md:h-[300px] flex flex-col justify-center text-center md:text-left max-w-xl">
        <div className="text-7xl md:text-8xl font-bold tracking-tight leading-none text-white">404</div>
        <p className="mt-5 text-base md:text-lg text-white/45 leading-relaxed">
          This page does not exist. The address may be invalid, incomplete, or simply not found on the selected network.
        </p>
      </div>
    </div>
  </motion.div>
);

const SendMessageTab = ({ address }: { address: string }) => {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [amount, setAmount] = React.useState('0.01');
  const [comment, setComment] = React.useState('');
  const [sending, setSending] = React.useState(false);
  const [status, setStatus] = React.useState<'success' | 'error' | null>(null);
  const notify = useNotify();

  const isValidTarget = /^[a-zA-Z0-9_-]{48}$/.test(address);

  const handleSend = async () => {
    if (!wallet) {
      tonConnectUI.openModal();
      return;
    }
    setStatus(null);
    const amountNum = parseFloat(amount.replace(',', '.'));
    if (!amountNum || amountNum <= 0) {
      setStatus('error');
      notify({ variant: 'error', label: 'Enter a valid amount' });
      return;
    }

    setSending(true);
    try {
      const amountNano = BigInt(Math.round(amountNum * 1e9));

      let payload: string | undefined;
      if (comment.trim()) {
        const cell = beginCell().storeUint(0, 32).storeStringTail(comment.trim()).endCell();
        payload = cell.toBoc().toString('base64');
      }

      await tonConnectUI.sendTransaction({
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address,
            amount: amountNano.toString(),
            ...(payload ? { payload } : {}),
          },
        ],
      });
      setStatus('success');
      setComment('');
      notify({ variant: 'info', label: 'Message sent!' });
    } catch (e: any) {
      setStatus('error');
      notify({ variant: 'error', label: 'Failed to send transaction' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center">
      <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-6">
        <Zap className="w-8 h-8 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 break-all">Send Message to {address.slice(0, 8)}...{address.slice(-8)}</h3>
      <p className="text-sm text-white/40 max-w-md mb-8">
        Send a small TON transfer with an on-chain text comment — this is how messages
        are delivered directly to a wallet on TON.
      </p>

      {!isValidTarget ? (
        <div className="text-sm text-rose-400 max-w-md">
          This address isn't a valid TON wallet, so a message can't be sent to it.
        </div>
      ) : (
        <div className="w-full max-w-md flex flex-col gap-4">
          <div className="text-left">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5 block">Amount (TON)</label>
            <input
              type="text"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.01"
              className="w-full bg-black/40 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-sm font-mono outline-none transition-colors"
            />
          </div>
          <div className="text-left">
            <label className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-1.5 block">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Your message..."
              rows={3}
              maxLength={120}
              className="w-full bg-black/40 border border-white/5 focus:border-white/20 rounded-xl px-4 py-3 text-sm outline-none transition-colors resize-none"
            />
          </div>

          {status === 'success' && (
            <div className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-3">
              Transaction sent! Confirm it in your wallet app.
            </div>
          )}
          {status === 'error' && (
            <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              Couldn't send the transaction. Check the amount and try again.
            </div>
          )}

          <button
            onClick={handleSend}
            disabled={sending}
            className="btn-pill btn-primary px-8 py-3 w-full disabled:opacity-50"
          >
            {!wallet ? 'Connect Wallet to Send' : sending ? 'Sending...' : 'Send Message'}
          </button>
        </div>
      )}
    </div>
  );
};

// --- Main App ---

export default function Home() {
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [walletData, setWalletData] = React.useState<WalletData | null>(null);
  const [prices, setPrices] = React.useState<any>({});
  const [network, setNetwork] = React.useState<Network>('unknown');
  const [activeTab, setActiveTab] = React.useState('History');
  const [selectedNFT, setSelectedNFT] = React.useState<NFT | null>(null);
  const [searchHistory, setSearchHistory] = React.useState<string[]>([]);
  const [showHistory, setShowHistory] = React.useState(false);
  const [favorites, setFavorites] = React.useState<string[]>([]);
  const [notFound, setNotFound] = React.useState(false);
  const [tokens, setTokens] = React.useState<any[] | null>(null);
  const [tokensLoading, setTokensLoading] = React.useState(false);
  const [loadingMore, setLoadingMore] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'date' | 'amount'>('date');
  const [sortDir, setSortDir] = React.useState<'asc' | 'desc'>('desc');
  const [selectedTxHash, setSelectedTxHash] = React.useState<string | null>(null);
  const [chartCollapsed, setChartCollapsed] = React.useState(false);
  const [clientIp, setClientIp] = React.useState<string | null>(null);
  const notify = useNotify();

  // Per-IP storage keys, so favorites/history don't mix between visitors on shared devices
  const historyKey = `necro_search_history_${clientIp || 'anon'}`;
  const favoritesKey = `necro_favorites_${clientIp || 'anon'}`;

  React.useEffect(() => {
    fetch('/api/myip')
      .then(res => res.json())
      .then(data => setClientIp(data.ip || 'anon'))
      .catch(() => setClientIp('anon'));
  }, []);

  const USD_TO_RUB = 81.8763;
  const goodies = [
    { name: 'Pocket Pizza', priceRub: 239 },
    { name: 'Coca-Cola 0.5L', priceRub: 52 },
    { name: 'Baltika 9 0.5L', priceRub: 80 },
    { name: 'McDonalds Cheeseburger', priceRub: 151 },
  ];

  const totalWalletUsd = React.useMemo(() => {
    if (!walletData) return 0;
    const nativeUsd = Number(walletData.usdValue || 0);
    const tokensUsd = Array.isArray(walletData.tokens)
      ? walletData.tokens.reduce((sum: number, token: any) => sum + Number(token?.usdValue || 0), 0)
      : 0;
    return nativeUsd + tokensUsd;
  }, [walletData]);

  const totalWalletRub = React.useMemo(() => totalWalletUsd * USD_TO_RUB, [totalWalletUsd]);

  const goodiesCounts = React.useMemo(() =>
    goodies.map((item) => ({
      ...item,
      count: Math.floor(totalWalletRub / item.priceRub),
    })),
  [totalWalletRub]);

  const performSearch = async (addr: string) => {
    if (!addr) return;
    setLoading(true);
    setNotFound(false);
    setTokens(null);
    setActiveTab('History');
    // Scroll to top when searching
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    try {
      const detectRes = await fetch(`/api/detect/${addr}`);
      if (!detectRes.ok) throw new Error('Detection failed');
      const { network: detected } = await detectRes.json();
      setNetwork(detected);

      const walletRes = await fetch(`/api/wallet/${detected}/${addr}`);
      if (!walletRes.ok) {
        const errData = await walletRes.json().catch(() => ({}));
        const message = errData.error || 'Wallet search failed';
        const lowered = String(message).toLowerCase();

        if (walletRes.status === 404 || lowered.includes('not found') || lowered.includes('invalid') || lowered.includes('not exist')) {
          setWalletData(null);
          setNotFound(true);
          notify({ variant: 'error', label: 'Address not found (404)' });
          return;
        }

        throw new Error(message);
      }
      const data = await walletRes.json();

      if (
        !data ||
        !data.address ||
        (
          Number(data.usdValue || 0) === 0 &&
          Number((data.tokens || []).length || 0) === 0 &&
          Number((data.transactions || []).length || 0) === 0 &&
          Number((data.nfts || []).length || 0) === 0
        )
      ) {
        setWalletData(null);
        setNotFound(true);
        notify({ variant: 'error', label: 'Address not found (404)' });
        return;
      }

      setNotFound(false);
      setWalletData(data);

      // Update history
      setSearchHistory(prev => {
        const newHistory = [addr, ...prev.filter(h => h !== addr)].slice(0, 5);
        localStorage.setItem(historyKey, JSON.stringify(newHistory));
        return newHistory;
      });
    } catch (e: any) {
      console.error(e);
      setWalletData(null);
      setNotFound(true);
      notify({ variant: 'error', label: 'Something went wrong while searching' });
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (clientIp === null) return;
    const saved = localStorage.getItem(historyKey);
    if (saved) {
      try {
        setSearchHistory(JSON.parse(saved));
      } catch (e) {}
    } else {
      setSearchHistory([]);
    }
    const savedFavs = localStorage.getItem(favoritesKey);
    if (savedFavs) {
      try {
        setFavorites(JSON.parse(savedFavs));
      } catch (e) {}
    } else {
      setFavorites([]);
    }
  }, [clientIp]);

  const toggleFavorite = (addr: string) => {
    const isAdding = !favorites.includes(addr);
    const newFavs = isAdding ? [...favorites, addr] : favorites.filter(f => f !== addr);
    localStorage.setItem(favoritesKey, JSON.stringify(newFavs));
    setFavorites(newFavs);
    notify(
      isAdding
        ? { variant: 'success', label: 'Added to favorites' }
        : { variant: 'info', label: 'Removed from favorites' }
    );
  };

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const addr = params.get('address');
    if (addr) {
      setSearch(addr);
      performSearch(addr);
    }
  }, []);

  React.useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch('/api/price/ton');
        const data = await res.json();
        setPrices({ 'the-open-network': data });
      } catch (e) {}
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!search) return;
    
    // Update URL without refreshing
    const newUrl = `${window.location.origin}${window.location.pathname}?address=${encodeURIComponent(search)}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    performSearch(search);
  };

  // Load older transactions ("More" button)
  const loadMoreTransactions = async () => {
    if (!walletData?.nextBeforeLt || loadingMore) return;
    setLoadingMore(true);
    try {
      const res = await fetch(`/api/transactions/ton/${walletData.address}?before_lt=${walletData.nextBeforeLt}`);
      if (!res.ok) throw new Error('Failed to load more');
      const data = await res.json();
      setWalletData(prev => prev ? {
        ...prev,
        transactions: [...(prev.transactions || []), ...(data.transactions || [])],
        nextBeforeLt: data.nextBeforeLt
      } : prev);
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  // Lazy-load jetton/token balances when the Tokens tab is opened
  const loadTokens = async () => {
    if (!walletData || tokens !== null || tokensLoading) return;
    if (network === 'tron') {
      setTokens(walletData.tokens || []);
      return;
    }
    if (network !== 'ton') {
      setTokens([]);
      return;
    }
    setTokensLoading(true);
    try {
      const res = await fetch(`/api/jettons/ton/${walletData.address}`);
      const data = await res.json();
      setTokens(Array.isArray(data) ? data : []);
    } catch (e) {
      setTokens([]);
    } finally {
      setTokensLoading(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'Tokens') loadTokens();
  }, [activeTab, walletData?.address]);

  // Sorted transactions for the History tab
  const sortedTransactions = React.useMemo(() => {
    const txs = [...(walletData?.transactions || [])];
    txs.sort((a: any, b: any) => {
      let cmp = 0;
      if (sortBy === 'date') {
        cmp = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        const valA = Math.abs(a.amountValueTon ?? 0);
        const valB = Math.abs(b.amountValueTon ?? 0);
        cmp = valA - valB;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return txs;
  }, [walletData?.transactions, sortBy, sortDir]);

  const toggleSort = (field: 'date' | 'amount') => {
    if (sortBy === field) {
      setSortDir(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortDir('desc');
    }
  };

  // Daily received/sent stats — for the in/out activity chart
  const dailyStatsData = React.useMemo(() => {
    if (!walletData?.transactions?.length) return [];
    const byDay = new Map<string, { received: number; sent: number }>();

    for (const tx of walletData.transactions as any[]) {
      if (tx.amountValueTon === null || tx.amountValueTon === undefined) continue;
      const day = new Date(tx.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
      const entry = byDay.get(day) || { received: 0, sent: 0 };
      if (tx.direction === 'in') entry.received += tx.amountValueTon;
      else entry.sent += tx.amountValueTon;
      byDay.set(day, entry);
    }

    return Array.from(byDay.entries())
      .map(([day, v]) => ({ day, received: Number(v.received.toFixed(2)), sent: Number(v.sent.toFixed(2)) }))
      .reverse();
  }, [walletData?.transactions]);

  const resetView = () => {
    setWalletData(null);
    setSearch('');
    setNetwork('unknown');
    setNotFound(false);
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen">
      <Navbar onLogoClick={resetView} />
      
      <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
        <AnimatePresence mode="wait">
          {notFound ? (
            <NotFoundView />
          ) : !walletData ? (
            <motion.div 
              key="hero"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="flex flex-col items-center text-center"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full text-[11px] font-medium text-white/60 mb-8">
                <Globe className="w-3.5 h-3.5" />
                Blockchain Explorer • Multi-chain • Auto-detect
              </div>
              
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl px-4">
                Explore transactions <br />
                <span className="bg-gradient-to-r from-purple-400 via-emerald-400 to-blue-400 bg-clip-text text-transparent">instantly</span>
              </h1>
              
              <p className="text-base sm:text-lg text-white/40 max-w-2xl mb-12 px-4">
                Paste a wallet address or transaction hash. We'll figure out the network (BTC, ETH, LTC, TON, TRON) and show what matters.
              </p>

              <div className="w-full max-w-3xl glass-card p-4 sm:p-6 mb-16 mx-4">
                <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
                  {['Auto', 'BTC', 'ETH', 'LTC', 'TON', 'TRON'].map(net => (
                    <button 
                      key={net}
                      className={cn(
                        "btn-pill text-[10px] sm:text-[11px] font-bold uppercase tracking-widest whitespace-nowrap",
                        net === 'Auto' ? "bg-white text-black" : "bg-white/5 text-white/40 hover:text-white"
                      )}
                    >
                      {net}
                    </button>
                  ))}
                </div>

                <form onSubmit={handleSearch} className="relative flex flex-col sm:flex-row items-stretch sm:items-center bg-black/40 border border-white/5 rounded-2xl p-1 focus-within:border-white/20 transition-all gap-2">
                  <div className="flex items-center flex-1 relative">
                    <Search className="w-5 h-5 text-white/20 ml-4 flex-shrink-0" />
                    <input 
                      type="text" 
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onFocus={() => setShowHistory(true)}
                      onBlur={() => setTimeout(() => setShowHistory(false), 200)}
                      placeholder="Address or TX hash..."
                      className="input-pale"
                    />
                    
                    {showHistory && searchHistory.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-[#161c24] border border-[#222b35] rounded-xl overflow-hidden z-50 shadow-2xl">
                        <div className="px-4 py-2 flex items-center justify-between border-b border-white/5">
                          <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Favorites & Recent</div>
                          <button 
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSearchHistory([]);
                              localStorage.removeItem(historyKey);
                            }}
                            className="text-[10px] font-bold text-white/20 hover:text-white transition-colors uppercase tracking-widest"
                          >
                            Clear
                          </button>
                        </div>
                        
                        {favorites.length > 0 && (
                          <div className="border-b border-white/5">
                            {favorites.map((f, i) => (
                              <div 
                                key={`fav-${i}`}
                                className="px-4 py-3 text-xs font-mono text-yellow-400/80 hover:text-yellow-400 hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3"
                                onClick={() => {
                                  setSearch(f);
                                  performSearch(f);
                                  setShowHistory(false);
                                }}
                              >
                                <Star className="w-3 h-3 fill-current" />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {searchHistory.map((h, i) => (
                          <div 
                            key={i}
                            className="px-4 py-3 text-xs font-mono text-white/60 hover:text-white hover:bg-white/5 cursor-pointer transition-colors flex items-center gap-3"
                            onClick={() => {
                              setSearch(h);
                              performSearch(h);
                              setShowHistory(false);
                            }}
                          >
                            <Activity className="w-3 h-3 text-white/20" />
                            <span className="truncate">{h}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                  <button 
                    disabled={loading}
                    className="btn-pill btn-primary flex items-center justify-center gap-2 py-3 sm:py-2 px-6"
                  >
                    <Zap className="w-4 h-4" />
                    <span className="whitespace-nowrap">{loading ? 'Searching...' : 'Search'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
                
                <div className="flex items-center justify-between mt-4 px-2">
                  <div className="flex items-center gap-4">
                    {['BTC', 'ETH', 'LTC', 'TON', 'TRON'].map(n => (
                      <span key={n} className="text-[10px] font-bold text-white/20 uppercase tracking-widest">{n}</span>
                    ))}
                  </div>
                  <div className="text-[10px] text-white/20 flex items-center gap-1">
                    <RefreshCw className="w-3 h-3" />
                    auto-detect enabled
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-6xl">
                <div className="glass-card p-8 text-left">
                  <h3 className="font-bold mb-4">Auto-detect</h3>
                  <p className="text-sm text-white/40 leading-relaxed">We classify addresses and tx hashes and route the lookup to the right chain.</p>
                </div>
                <div className="glass-card p-8 text-left">
                  <h3 className="font-bold mb-4">Lightning speed</h3>
                  <p className="text-sm text-white/40 leading-relaxed">The best and the fastest free service for exploring blockchains.</p>
                </div>
                <div className="glass-card p-8 text-left">
                  <h3 className="font-bold mb-4">Multi-chain</h3>
                  <p className="text-sm text-white/40 leading-relaxed">BTC, ETH, LTC are live via BlockCypher. TON/TRON ready via env keys.</p>
                </div>
              </div>

              <div className="mt-20 text-[10px] text-white/20 font-mono">
                Tip: try <span className="text-white/40">0x...</span> for ETH, <span className="text-white/40">bc1...</span> for BTC, <span className="text-white/40">EQ...</span> for TON.
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex flex-col gap-6 transition-opacity duration-300", loading && "opacity-50 pointer-events-none")}
            >
              {/* Breadcrumbs */}
              <div className="flex items-center gap-2 text-[13px] text-white/40">
                <span>Main</span>
                <span className="text-white/20">›</span>
                <span className="text-white/80 font-medium">{search}</span>
              </div>

              {/* Account Card */}
              <div className="flex flex-col gap-6">
                {walletData.analysis && walletData.analysis.riskScore > 50 && (
                  <div className="bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-center gap-4 text-rose-500">
                    <Shield className="w-6 h-6 flex-shrink-0" />
                    <div>
                      <div className="text-sm font-bold uppercase tracking-widest">High Risk Warning</div>
                      <div className="text-xs opacity-80">This wallet has been flagged for suspicious activity or interaction with known scam contracts.</div>
                    </div>
                  </div>
                )}

                <div className="bg-white/5 border border-white/5 rounded-3xl p-6 sm:p-8 flex flex-col lg:flex-row justify-between relative overflow-hidden backdrop-blur-md gap-8">
                  <div className="flex flex-col gap-6 flex-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-2xl border border-white/10">
                          <Wallet className="w-8 h-8 text-[#3393e0]" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h2 className="text-2xl font-bold tracking-tight">{walletData.address.slice(0, 6)}...{walletData.address.slice(-6)}</h2>
                            <button 
                              onClick={() => toggleFavorite(walletData.address)}
                              className={`p-1.5 rounded-lg transition-colors ${favorites.includes(walletData.address) ? 'text-yellow-400 bg-yellow-400/10' : 'text-white/20 hover:text-white hover:bg-white/5'}`}
                            >
                              <Star className={`w-5 h-5 ${favorites.includes(walletData.address) ? 'fill-current' : ''}`} />
                            </button>
                            <button 
                              onClick={() => {
                                navigator.clipboard.writeText(window.location.href);
                                notify({ variant: 'info', label: 'Link copied to clipboard!' });
                              }}
                              className="p-1.5 rounded-lg text-white/20 hover:text-white hover:bg-white/5 transition-colors"
                            >
                              <Share2 className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] font-bold text-white/40 uppercase tracking-widest border border-white/5">{network}</span>
                            {walletData.analysis && (
                              <span className="px-2 py-0.5 bg-[#3393e0]/10 rounded text-[10px] font-bold text-[#3393e0] uppercase tracking-widest border border-[#3393e0]/20">
                                {walletData.analysis.personality}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="hidden sm:flex flex-col items-end gap-1">
                        <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">PaleScore</div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden border border-white/5">
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${100 - (walletData.analysis?.riskScore || 0)}%` }}
                              className={`h-full ${ (walletData.analysis?.riskScore || 0) > 50 ? 'bg-red-500' : (walletData.analysis?.riskScore || 0) > 20 ? 'bg-yellow-500' : 'bg-emerald-500' }`}
                            />
                          </div>
                          <span className={`text-xl font-bold ${ (walletData.analysis?.riskScore || 0) > 50 ? 'text-red-500' : (walletData.analysis?.riskScore || 0) > 20 ? 'text-yellow-500' : 'text-emerald-500' }`}>
                            {100 - (walletData.analysis?.riskScore || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-[140px_1fr] gap-y-4 items-baseline border-t border-white/5 pt-6">
                      <div className="text-white/40 text-[13px]">Address</div>
                      <div className="flex items-center gap-2 font-mono text-[12px] sm:text-[13px] text-white/80 break-all">
                        {walletData.address}
                        <button 
                          onClick={() => {
                            navigator.clipboard.writeText(walletData.address);
                            notify({ variant: 'info', label: 'Address copied!' });
                          }}
                          className="text-white/20 hover:text-white transition-colors flex-shrink-0"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-white/40 text-[13px]">Balance</div>
					  <div className="flex flex-wrap items-baseline gap-2">
                        <span className="text-base sm:text-lg font-bold">{walletData.balance}</span>
                        <div className="group relative inline-flex items-center gap-2 text-[12px] sm:text-[13px] text-white/40">
                          <span>≈ ${(walletData.usdValue || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                          <button
                            type="button"
                            className="inline-flex h-5 w-5 items-center justify-center rounded-full border border-white/10 bg-white/5 text-[11px] text-white/70 transition hover:bg-white/10 hover:text-white"
                          >
                            <Pizza className="w-3 h-3" />
                          </button>

                          <div className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 w-72 -translate-y-1/2 rounded-2xl border border-white/10 bg-[#0b0b10]/95 p-4 text-left opacity-0 shadow-2xl backdrop-blur-xl transition duration-200 group-hover:opacity-100">
                            <div className="mb-2 text-sm font-semibold text-white">What you can buy for this balance</div>
                            <div className="mb-3 text-[11px] text-white/45">≈ {Math.floor(totalWalletRub).toLocaleString('ru-RU')} ₽</div>

                            <div className="space-y-2 text-sm text-white/70">
                              {goodiesCounts.map((item) => (
                                <div key={item.name} className="flex items-center justify-between gap-3">
                                  <span className="text-white/60">{item.name}</span>
                                  <span className="text-white">{item.count.toLocaleString('ru-RU')}x</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                      

                      <div className="text-white/40 text-[13px]">Contract type</div>
                      <div className="flex items-center gap-2 text-[13px] text-white/80">
                        {walletData.stats.interfaces?.join(', ') || 'Standard Account'}
                      </div>

                      <div className="text-white/40 text-[13px]">Max Balance</div>
                      <div className="text-[13px] text-white/80">
                        {walletData.stats.maxBalance || 'N/A'}
                      </div>
                    </div>
                  </div>

                  {/* QR Code */}
                  <div className="bg-white rounded-lg p-2 flex-shrink-0 self-center lg:self-start shadow-xl">
                    <QRCodeCanvas 
                      value={`${window.location.origin}/?address=${walletData.address}`}
                      size={120}
                      level="H"
                      includeMargin={false}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-12 gap-6">
                  <div className="col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 group-hover:text-white/40 transition-colors">Total Received</div>
                      <div className="text-xl font-bold tracking-tight mb-1">{walletData.stats.totalReceived}</div>
                      <div className="text-xs text-white/40 font-medium">All time</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 group-hover:text-white/40 transition-colors">Total Sent</div>
                      <div className="text-xl font-bold tracking-tight mb-1">{walletData.stats.totalSent}</div>
                      <div className="text-xs text-white/40 font-medium">All time</div>
                    </div>
                    <div className="bg-white/5 rounded-2xl p-6 border border-white/5 hover:border-white/10 transition-colors group">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest mb-2 group-hover:text-white/40 transition-colors">Collectibles</div>
                      <div className="text-xl font-bold tracking-tight mb-1">{(walletData.nfts || []).length}</div>
                      <div className="text-xs text-white/40 font-medium">Unique items</div>
                    </div>
                  </div>

                  <div className="col-span-12 lg:col-span-4 bg-white/5 rounded-2xl p-6 border border-white/5 flex flex-col items-center justify-center min-h-[160px]">
                    <div className="w-full text-[10px] font-bold text-white/20 uppercase tracking-widest mb-4 text-left">Asset Distribution</div>
                    <div className="w-full h-24">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={[
                              { name: 'Native', value: walletData.usdValue },
                              ...walletData.tokens.map(t => ({ name: t.symbol, value: t.usdValue }))
                            ].filter(d => d.value > 0)}
                            cx="50%"
                            cy="50%"
                            innerRadius={25}
                            outerRadius={35}
                            paddingAngle={5}
                            dataKey="value"
                            stroke="none"
                          >
                            <Cell fill="#3393e0" />
                            <Cell fill="#ffffff20" />
                            <Cell fill="#ffffff10" />
                            <Cell fill="#ffffff05" />
                          </Pie>
                          <Tooltip 
                            contentStyle={{ backgroundColor: '#161c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                            itemStyle={{ color: '#fff', fontSize: '10px' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                </div>

                {dailyStatsData.length > 0 && (
                  <div className="bg-white/5 rounded-2xl p-6 border border-white/5">
                    <div className="flex items-center justify-between mb-4">
                      <div className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Daily Activity (TON)</div>
                      <button
                        onClick={() => setChartCollapsed(prev => !prev)}
                        className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
                      >
                        {chartCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
                      </button>
                    </div>
                    {!chartCollapsed && (
                      <>
                        <div className="w-full h-48">
                          <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStatsData}>
                              <defs>
                                <linearGradient id="receivedGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#00b127" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#00b127" stopOpacity={0} />
                                </linearGradient>
                                <linearGradient id="sentGrad" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="5%" stopColor="#f87171" stopOpacity={0.4} />
                                  <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff0a" vertical={false} />
                              <XAxis dataKey="day" stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} />
                              <YAxis stroke="#ffffff20" fontSize={10} tickLine={false} axisLine={false} width={40} />
                              <Tooltip
                                contentStyle={{ backgroundColor: '#161c24', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }}
                                labelStyle={{ color: '#fff' }}
                                formatter={(value: any, name: any) => [`${value} TON`, name === 'received' ? 'Received' : 'Sent']}
                              />
                              <Area type="monotone" dataKey="received" stroke="#00b127" fill="url(#receivedGrad)" strokeWidth={2} />
                              <Area type="monotone" dataKey="sent" stroke="#f87171" fill="url(#sentGrad)" strokeWidth={2} />
                            </AreaChart>
                          </ResponsiveContainer>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-[10px] font-bold uppercase tracking-widest text-white/40">
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#00b127]" /> Received</span>
                          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#f87171]" /> Sent</span>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {walletData.analysis?.tags && walletData.analysis.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {walletData.analysis.tags.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-white/60 uppercase tracking-widest border border-white/10">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Tabs */}
              <div className="flex items-center justify-between border-b border-[#222b35] px-2 overflow-x-auto scrollbar-hide">
                <div className="flex items-center gap-6 min-w-max">
                  {['History', 'Tokens', 'Raw Transactions', 'Collectibles', ...(network === 'ton' ? ['Code', 'Methods', 'Send Message'] : [])].map(tab => (
                    <button 
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={cn(
                        "pb-3 text-sm font-medium transition-all relative",
                        activeTab === tab ? "text-white" : "text-white/40 hover:text-white/60"
                      )}
                    >
                      {tab}
                      {tab === 'Collectibles' && walletData.nfts && walletData.nfts.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-white/40">
                          {walletData.nfts.length}
                        </span>
                      )}
                      {tab === 'Tokens' && tokens && tokens.length > 0 && (
                        <span className="ml-1.5 px-1.5 py-0.5 bg-white/5 rounded text-[10px] text-white/40">
                          {tokens.length}
                        </span>
                      )}
                      {activeTab === tab && (
                        <motion.div 
                          layoutId="activeTab"
                          className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#3393e0]"
                        />
                      )}
                    </button>
                  ))}
                </div>
                {activeTab === 'History' && (
                  <div className="hidden sm:flex items-center gap-2 mb-3 ml-4">
                    <button
                      onClick={() => toggleSort('date')}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors",
                        sortBy === 'date' ? "bg-[#3393e0]/10 text-[#3393e0]" : "bg-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      <Activity className="w-3.5 h-3.5" />
                      Date {sortBy === 'date' && (sortDir === 'asc' ? '↑' : '↓')}
                    </button>
                    <button
                      onClick={() => toggleSort('amount')}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded text-xs font-medium transition-colors",
                        sortBy === 'amount' ? "bg-[#3393e0]/10 text-[#3393e0]" : "bg-white/5 text-white/60 hover:bg-white/10"
                      )}
                    >
                      <Layers className="w-3.5 h-3.5" />
                      Amount {sortBy === 'amount' && (sortDir === 'asc' ? '↑' : '↓')}
                    </button>
                  </div>
                )}
              </div>


              {/* Tab Content */}
              <div className="bg-white/5 border border-white/5 rounded-3xl overflow-hidden min-h-[400px] backdrop-blur-md">
                {activeTab === 'History' && (
                  <div className="flex flex-col">
                    {sortedTransactions.map((tx, i) => (
                      <TransactionRow 
                        key={i} 
                        tx={tx} 
                        onNFTClick={setSelectedNFT}
                        onAddressClick={(addr) => {
                          setSearch(addr);
                          performSearch(addr);
                          const newUrl = `${window.location.origin}${window.location.pathname}?address=${encodeURIComponent(addr)}`;
                          window.history.pushState({ path: newUrl }, '', newUrl);
                        }}
                        onHashClick={(hash) => setSelectedTxHash(hash)}
                      />
                    ))}
                    {sortedTransactions.length === 0 && (
                      <div className="p-20 text-center text-white/20 text-sm italic">No transactions found</div>
                    )}
                    {network === 'ton' && walletData.nextBeforeLt && (
                      <div className="p-4 flex justify-center border-t border-[#222b35]">
                        <button
                          onClick={loadMoreTransactions}
                          disabled={loadingMore}
                          className="btn-pill bg-white/5 hover:bg-white/10 text-white/60 text-xs font-bold uppercase tracking-widest px-6 py-2 transition-colors disabled:opacity-50"
                        >
                          {loadingMore ? 'Loading...' : 'More'}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'Tokens' && (
                  <div className="flex flex-col">
                    {tokensLoading && (
                      <div className="p-20 text-center text-white/20 text-sm italic">Loading tokens...</div>
                    )}
                    {!tokensLoading && (tokens || []).map((token: any, i: number) => (
                      <div key={i} className="flex items-center justify-between px-6 py-4 border-b border-[#222b35] hover:bg-white/[0.02] transition-colors">
                        <div className="flex items-center gap-3 min-w-0">
                          {token.image ? (
                            <img src={token.image} alt={token.symbol} className="w-9 h-9 rounded-full object-cover border border-white/10" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xs font-bold text-white/40">
                              {(token.symbol || '?')[0]}
                            </div>
                          )}
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-sm truncate">{token.name}</span>
                              {token.verified && (
                                <div className="w-3 h-3 bg-[#3393e0] rounded-full flex items-center justify-center flex-shrink-0">
                                  <Shield className="w-2 h-2 text-white fill-current" />
                                </div>
                              )}
                            </div>
                            <div className="text-[11px] text-white/40 uppercase tracking-widest">{token.symbol}</div>
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <div className="font-mono font-bold text-sm">{token.balance}</div>
                          {token.usdValue > 0 && (
                            <div className="text-[11px] text-white/40">${token.usdValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          )}
                        </div>
                      </div>
                    ))}
                    {!tokensLoading && (tokens || []).length === 0 && (
                      <div className="p-20 text-center text-white/20 text-sm italic">No tokens found</div>
                    )}
                  </div>
                )}


                {activeTab === 'Raw Transactions' && (
                  <div className="p-6">
                    <pre className="text-[11px] font-mono text-white/60 overflow-auto max-h-[600px] bg-black/20 p-4 rounded-lg">
                      {JSON.stringify(walletData.transactions, null, 2)}
                    </pre>
                  </div>
                )}

                {activeTab === 'Collectibles' && (
                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {(walletData.nfts || []).map((nft: any, i: number) => (
                      <div 
                        key={i} 
                        className="glass-card overflow-hidden group cursor-pointer hover:border-[#3393e0]/50 transition-all"
                        onClick={() => setSelectedNFT(nft)}
                      >
                        <div className="aspect-square relative overflow-hidden bg-white/5">
                          {nft.image ? (
                            <img 
                              src={nft.image} 
                              alt={nft.name} 
                              className="w-full h-full object-cover transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10">
                              <Layers className="w-12 h-12" />
                            </div>
                          )}
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] font-bold text-white flex items-center gap-1.5">
                              <Info className="w-3 h-3" />
                              Details
                            </div>
                          </div>
                        </div>
                        <div className="p-4">
                          <div className="flex items-center gap-1.5 mb-1 truncate">
                            <div className="text-[10px] font-bold text-[#3393e0] uppercase tracking-widest truncate">
                              {nft.collection || 'No Collection'}
                            </div>
                            {nft.verified && (
                              <div className="w-3 h-3 bg-[#3393e0] rounded-full flex items-center justify-center flex-shrink-0">
                                <Shield className="w-2 h-2 text-white fill-current" />
                              </div>
                            )}
                          </div>
                          <h4 className="font-bold text-sm mb-2 truncate">{nft.name}</h4>
                          <p className="text-[11px] text-white/40 line-clamp-2 h-8">
                            {nft.description || 'No description available'}
                          </p>
                        </div>
                      </div>
                    ))}
                    {(walletData.nfts || []).length === 0 && (
                      <div className="col-span-full py-20 text-center text-white/20 text-sm italic">No collectibles found</div>
                    )}
                  </div>
                )}

                {activeTab === 'Code' && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                      <Cpu className="w-4 h-4" />
                      Smart Contract BOC / Code
                    </div>
                    <pre className="text-[11px] font-mono text-white/60 overflow-auto max-h-[600px] bg-black/20 p-4 rounded-lg break-all whitespace-pre-wrap">
                      {walletData.stats.code || 'Not available for this network'}
                    </pre>
                  </div>
                )}

                {activeTab === 'Methods' && (
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-4 text-xs font-bold text-white/40 uppercase tracking-widest">
                      <Activity className="w-4 h-4" />
                      Available Interfaces & Methods
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {(walletData.stats.interfaces || []).map((iface: string, i: number) => (
                        <div key={i} className="p-4 bg-white/5 border border-white/10 rounded-lg flex items-center justify-between">
                          <span className="text-sm font-mono text-white/80">{iface}</span>
                          <div className="px-2 py-0.5 bg-emerald-500/10 text-[10px] font-bold text-emerald-500 rounded uppercase">Detected</div>
                        </div>
                      ))}
                      {(walletData.stats.interfaces || []).length === 0 && (
                        <div className="col-span-full py-10 text-center text-white/20 text-sm italic">No interfaces detected</div>
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'Send Message' && (
                  <SendMessageTab address={walletData.address} />
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedNFT && (
            <NFTModal nft={selectedNFT} onClose={() => setSelectedNFT(null)} />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {selectedTxHash && (
            <TransactionModal
              hash={selectedTxHash}
              onClose={() => setSelectedTxHash(null)}
              onAddressClick={(addr) => {
                setSelectedTxHash(null);
                setSearch(addr);
                performSearch(addr);
                const newUrl = `${window.location.origin}${window.location.pathname}?address=${encodeURIComponent(addr)}`;
                window.history.pushState({ path: newUrl }, '', newUrl);
              }}
            />
          )}
        </AnimatePresence>
      </main>

      <footer className="max-w-7xl mx-auto px-6 py-20 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 text-white/20">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold tracking-tight text-white/40">PaleChain © 2026</span>
        </div>
        <div className="flex gap-8 text-xs font-medium">
          <a href="/api" className="hover:text-white transition-colors">API</a>
          <a href="https://t.me/paledealsbot" className="hover:text-white transition-colors">Deals</a>
          <a href="https://t.me/palechain" className="hover:text-white transition-colors">Telegram</a>
          <a href="https://t.me/palesupportbot" className="hover:text-white transition-colors">Support</a>
        </div>
      </footer>
    </div>
  );
}
