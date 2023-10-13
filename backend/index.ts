import { ABI } from './abi';
import { ethers } from "ethers";
import express from 'express';
import cors from 'cors'
import dotenv from "dotenv"
dotenv.config()


const URL = process.env.URL
const ADDRESS = process.env.ADDRESS
const PORT = process.env.PORT
const BLOCK_AMOUNT = process.env.BLOCK_AMOUNT


let blockNumberGlobal: number

// const provider = new ethers.WebSocketProvider(URL)
const provider = new ethers.JsonRpcProvider(URL)
const contract = new ethers.Contract(ADDRESS!, ABI, provider);

//status: 0 = mined, 1 = confirmed
let creation_events: { collection: string; name: string; symbol: string; txHash: string; blockNumber: number, confirmed: boolean }[] = []
let mint_events: { collection: string; recipient: string; tokenId: number; tokenUri: string; txHash: string; blockNumber: number; confirmed: boolean; }[] = []

async function updateTransactionStatus(event: any) {
    const trx = await provider.getTransaction(event.txHash)
    if (trx !== null)
        event.status = 1 //can also check for for dropped, also can check for confirmations
}

function updateFinalizedEvents(arrays: any) {
    arrays.forEach((array: any) => { 
        array.forEach(async (event: any) => { 
            if (event.blockNumber + BLOCK_AMOUNT < blockNumberGlobal)
                await updateTransactionStatus(event)
        })
    })
}

function setBlockListener() {
    provider.on("block", async (it: any) => {
        blockNumberGlobal = it
        updateFinalizedEvents([creation_events, mint_events])
    })
}

function setEventListeners() {
    contract.on("CollectionCreated", async (collection, name, symbol, event) => {        
        creation_events.push({
            collection: collection,
            name: name,
            symbol: symbol,
            txHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber,
            confirmed: false
        })
    })

    contract.on("TokenMinted", (collection, recipient, tokenId, tokenUri, event) => {
        mint_events.push({
            collection: collection,
            recipient: recipient,
            tokenId: parseInt(tokenId),
            tokenUri: tokenUri,
            txHash: event.log.transactionHash,
            blockNumber: event.log.blockNumber,
            confirmed: false
        })
    })
}

function filterByBlockNumber(array: any, blockNumber: number) {
    return array.filter((it: any) => it.blockNumber >= (blockNumber | 0))
}

const app = express();
app.use(cors())
app.use(express.json())

// app.use((req, res, next) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//     next();
// });

app.get('/creationEvents', (req: any, res: any) => {
    
    res.send(filterByBlockNumber(creation_events, req.query.blockNumber))
})
app.get('/mintEvents', (req: any, res: any) => {
    res.send(filterByBlockNumber(mint_events, req.query.blockNumber))
})

setBlockListener();
setEventListeners();

console.log("Almost there");
app.listen(parseInt(PORT), "0.0.0.0", () =>{
    console.log(`Started listening on port: ${PORT}`)
});