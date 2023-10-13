import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useEffect, useState } from "react";
import axios from 'axios';
import Head from 'next/head';
import type { NextPage } from 'next';

import { default as DrawTable } from "./Components/DrawTablePagination";
import { MintTokenModal } from "./Components/MintTokenModal"
import { CreateCollectionModal } from "./Components/CreateCollectionModal";
import { useAccount } from 'wagmi';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL
const ADDRESS = process.env.NEXT_PUBLIC_FACTORY_ADDRESS

const columns1 = ["Collection", "Token name", "Token symbol", "Block number",]
const columnPrint1 = ['name', 'symbol', 'blockNumber']
const columns2 = ["Collection", "Recipient", "Token Id", "Block number"]
const columnPrint2 = ['recipient', 'tokenId', 'blockNumber']
var interval: any;

const Home: NextPage = () => {
  const [creationEvents, setCreationEvents] = useState([])
  const [mintEvents, setMintEvents] = useState([])

  const { connector, isConnected } = useAccount()

  useEffect(() => {
    function getEvents() {
      axios.get(`${BACKEND_URL}/creationEvents`)
        .then(function (response) {
          setCreationEvents(response.data)
          console.log("creation", response.data);
          
        })
        .catch(function (error) {
          console.log(error);
        })
  
      axios.get(`${BACKEND_URL}/mintEvents`)
        .then(function (response) {
          setMintEvents(response.data)
        })
        .catch(function (error) {
          console.log(error);
        })
    }

    if (interval === undefined)
      interval = setInterval(getEvents, 1000)
  }, [])

  return (
    <div>
      <Head>
        <title>Interview app</title>
      </Head>


      <header className="flex flex-col items-end 
      bg-gradient-to-b from-indigo-400 from-2% via-sky-300 via-60% to-emerald-000 to-95%">
        <div className='m-5'>
          <ConnectButton />
        </div>
      </header>

      <main>
        <div className="flex flex-col justify-center items-center">
          <div className="w-2/3">
            <div className="text-2xl mb-5">Mint events:</div>
            <DrawTable rows={creationEvents} columns={columns1} columnPrint={columnPrint1} sliceAmount={10} />
          </div>
          <CreateCollectionModal contractAddress={ADDRESS} isConnected={isConnected} />
          <div className="w-2/3">
            <div className="text-2xl mb-5">Creation events:</div>
            <DrawTable rows={mintEvents} columns={columns2} columnPrint={columnPrint2} sliceAmount={10} />
          </div>
          <MintTokenModal contractAddress={ADDRESS} isConnected={isConnected} />
        </div>
      </main>
    </div>
  );
};

export default Home;
