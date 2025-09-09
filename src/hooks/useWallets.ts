import { ethers } from "ethers";
import { useCallback, useEffect, useState } from "react";
import { ethereum_window } from "../iEth";

export const useWallet = (
  signer: ethers.JsonRpcSigner | null,
  setSigner: React.Dispatch<React.SetStateAction<ethers.JsonRpcSigner | null>>,
  provider: ethers.BrowserProvider | ethers.AbstractProvider | null
) => {
  const [account, setAccount] = useState<string>();

  const connectWallet = useCallback(async () => {
    if (
      ethereum_window &&
      provider &&
      typeof provider === typeof ethers.BrowserProvider
    ) {
      const signedProvider = provider as ethers.BrowserProvider;
      await signedProvider.send("eth_requestAccounts", []);
      return await signedProvider.getSigner();
    }
  }, [provider]);

  useEffect(() => {
    if (signer) {
      (() => signer.getAddress())().then(setAccount);
    } else {
      connectWallet().then((_signer) => {
        if (_signer) setSigner(_signer);
      });
    }
  }, [connectWallet, setSigner, signer]);

  return {
    account,
  };
};