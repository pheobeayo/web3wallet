import { Contract, ethers } from "ethers";
import { useEffect, useState } from "react";
import erc20Abi from "../abi";

export const useUsdtContract = (
  provider: ethers.BrowserProvider | ethers.AbstractProvider | null,
  signer: ethers.JsonRpcSigner | null,
  webSocketProvider: ethers.WebSocketProvider,
  account?: string
) => {
  const [usdtContract, setUsdtContract] = useState<Contract>();
  const [listenerUsdtContract, setListenerUsdtContract] = useState<Contract>();
  const [writableUsdtContract, setWritableUsdtContract] = useState<Contract>();
  // symbols, decimals, totalsupply
  const [symbol, setSymbol] = useState<string>();
  const [decimals, setDecimals] = useState<number>(0);
  const [totalSupply, setTotalSupply] = useState<bigint>(0n);
  const [userUSDTBalance, setUserUSDTBalance] = useState<bigint>(0n);

  useEffect(() => {
    setUsdtContract(
      new Contract(
        "0x0AB8b787ffEF496212237B4f8d33B9276E3c4931",
        erc20Abi,
        provider
      )
    );
  }, [provider]);
  useEffect(() => {
    setWritableUsdtContract(
      new Contract(
        "0x0AB8b787ffEF496212237B4f8d33B9276E3c4931",
        erc20Abi,
        signer
      )
    );
  }, [signer]);

  useEffect(() => {
    setListenerUsdtContract(
      new Contract(
        "0x0AB8b787ffEF496212237B4f8d33B9276E3c4931",
        erc20Abi,
        webSocketProvider
      )
    );
  }, [webSocketProvider]);

  useEffect(() => {
    async function run() {
      if (usdtContract === undefined) return;
      const decimals = Number(await usdtContract.decimals());
      setSymbol(await usdtContract.symbol());
      setDecimals(decimals);
      setTotalSupply(await usdtContract.totalSupply());
      if (account) setUserUSDTBalance(await usdtContract.balanceOf(account));
    }
    run();
  }, [account, usdtContract]);

  return {
    usdtContract,
    symbol,
    decimals,
    totalSupply,
    userUSDTBalance,
    writableUsdtContract,
    listenerUsdtContract,
  };
};