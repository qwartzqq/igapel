import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Transaction {
  hash: string;
  lt?: number;
  date: string;
  from: string;
  fromName?: string;
  to: string;
  toName?: string;
  amount: string;
  amountValueTon?: number | null;
  status: string;
  fee: string;
  token?: string;
  type?: string;
  direction?: 'in' | 'out';
  comment?: string;
  isScam?: boolean;
  nftInfo?: {
    name: string;
    image?: string;
    description?: string;
    collection?: string;
    address?: string;
    verified?: boolean;
  };
}

export interface NFT {
  name: string;
  image?: string;
  description?: string;
  collection?: string;
  address?: string;
  verified?: boolean;
}

export interface Token {
  name: string;
  symbol: string;
  image?: string;
  balance: string;
  usdValue: number;
  verified?: boolean;
  address?: string;
}

export interface WalletData {
  address: string;
  balance: string;
  usdValue: number;
  transactions: Transaction[];
  nextBeforeLt?: number | null;
  nfts: NFT[];
  stats: {
    totalReceived: string;
    totalSent: string;
    txCount: number;
    firstTx: string;
    lastTx: string;
    maxBalance?: string;
    code?: string;
    interfaces?: string[];
  };
  tokens: Token[];
  analysis?: {
    personality: string;
    riskScore: number;
    tags: string[];
  };
}

export type Network = 'ethereum' | 'bitcoin' | 'litecoin' | 'tron' | 'ton' | 'unknown';
