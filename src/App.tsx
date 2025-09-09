import { useEffect, useState } from "react";
import "./App.css";
import { ethereum_window } from "./iEth";
import { ethers, Network, parseUnits } from "ethers";
import { useUsdtContract } from "./hooks/useUsdtContract";
import { formatUnits } from "ethers";
import { useWallet } from "./hooks/useWallets";

const detectProviderAndSigner = async () => {
  let signer = null;
  let provider;

  if (!ethereum_window) {
    console.log("MetaMask not installed; using read-only defaults");
    provider = ethers.getDefaultProvider("sepolia");
  } else {
    provider = new ethers.BrowserProvider(ethereum_window);
    signer = await provider.getSigner();
  }

  return [provider, signer];
};

const webSocketProvider = new ethers.WebSocketProvider(
  "wss://ethereum-sepolia-rpc.publicnode.com"
);

function App() {
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [provider, setProvider] = useState<
    ethers.BrowserProvider | ethers.AbstractProvider | null
  >(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [network, setNetwork] = useState<Network>();

  const { account } = useWallet(signer, setSigner, provider);

  const {
    symbol,
    decimals,
    totalSupply,
    userUSDTBalance,
    writableUsdtContract,
    listenerUsdtContract,
  } = useUsdtContract(provider, signer, webSocketProvider, account);

  useEffect(() => {
    detectProviderAndSigner().then(([_provider, _signer]) => {
      setProvider(_provider);
      setSigner(_signer);
    });
  }, []);

  useEffect(() => {
    if (listenerUsdtContract && account) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      listenerUsdtContract.on("Transfer", (from, to, amount) => {
        console.log(
          `Transfer Detected from ${from} to ${to}: ${ethers.formatUnits(
            amount,
            decimals
          )} MTK`
        );
      });
    }

    return () => {
      listenerUsdtContract?.removeAllListeners();
    };
  }, [listenerUsdtContract, account, decimals]);

  useEffect(() => {
    async function getNetwork() {
      if (provider) {
        const _network = await provider.getNetwork();
        return _network;
      } else {
        return undefined;
      }
    }

    getNetwork().then((_network) => setNetwork(_network));
  }, [provider]);

  const sendUSDT = async () => {
    if (writableUsdtContract === undefined) return;

    const tx = await writableUsdtContract.transfer(
      "0xAb5A9FCb27e4F97E87a536E768b9cb49dC8B1A4F",
      parseUnits("100", decimals)
    );

    console.log("Transaction Hash:", tx.hash);
    await tx.wait();
  };

  return (
    <>
      <h1>Our Demo</h1>
      <p>Symbol: {symbol}</p>
      <p>decimals: {decimals}</p>
      <p>Total Supply: {formatUnits(totalSupply, decimals)}</p>
      <p>User balance: {formatUnits(userUSDTBalance, decimals)}</p>
      <p>User: {account}</p>

      <button onClick={sendUSDT}>Transfer 100 usdt to anon</button>
    </>
  );
}

export default App;