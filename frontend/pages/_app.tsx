import "../styles/globals.css";
import '@rainbow-me/rainbowkit/styles.css';
import 'react-responsive-modal/styles.css';
import 'react-tooltip/dist/react-tooltip.css'
import { connectorsForWallets, RainbowKitProvider } from '@rainbow-me/rainbowkit';
import type { AppProps } from 'next/app';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import { mainnet, goerli, localhost } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public';
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'; //can import wallets from here
import 'dotenv/config'

const { chains, publicClient, webSocketPublicClient } = configureChains(
  [
    mainnet,
    goerli,
    localhost
  ],
  [publicProvider()]
);

const connectors = connectorsForWallets([
  {
    groupName: 'Recommended',
    wallets: [ //and add here
      injectedWallet({ chains, shimDisconnect: true })
    ]
  }
])

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
  webSocketPublicClient,
});

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains}>
        <Component {...pageProps} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default MyApp;
