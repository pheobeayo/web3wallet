/* eslint-disable @typescript-eslint/no-explicit-any */
export interface EthereumProvider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
  on?: (eventName: string, listener: (...args: any[]) => void) => void;
  removeListener?: (
    eventName: string,
    listener: (...args: any[]) => void
  ) => void;
  isMetaMask?: boolean; //--> optional/in metaMask
  isCoinbaseWallet?: boolean; //--> optional/in coinbase wallet
  providers?: EthereumProvider[]; //--> optional/in Coinbase Wallet
  chainId?: string; //-->suggested by EIP-1193
}

export type WindowEthereum = typeof window & {
  ethereum?: EthereumProvider;
};

export const ethereum_window = (window as WindowEthereum).ethereum;