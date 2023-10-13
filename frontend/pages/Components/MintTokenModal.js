import { useState, useEffect } from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Modal } from 'react-responsive-modal';


export function MintTokenModal({ contractAddress, isConnected }) {
  const [formData, setFormData] = useState({ collection: "", recipient: "", tokenId: "" });
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const URL = process.env.NEXT_PUBLIC_BLOCK_EXPLORER

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  useEffect(()=>{}, [isConnected])

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "mintNFT",
    args: [
      formData.collection, formData.recipient, formData.tokenId
    ]
  });

  const { data, write: write, reset: reset } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (() => {
      setTimeout(()=>{
        setFormData({collection: "", recipient: "", tokenId: ""})
        reset()
        onCloseModal()
      }, 3000)  
    }),
    
  });

  return (
    <div>
      <Modal open={open} onClose={onCloseModal} center>
        <h1 className="p-6 m-0 text-center">Token Minting Modal</h1>

        <form>
          <label htmlFor="name">collection:</label>
          <input className="border-2" type="text" value={formData.collection} name="collection" onChange={handleChange} /> <br />

          <label htmlFor="email">recipient:</label>
          <input className="border-2" type="text" value={formData.recipient} name="recipient" onChange={handleChange} /> <br />

          <label htmlFor="message">tokenId:</label>
          <input className="border-2" type="text" value={formData.tokenId} name="tokenId" onChange={handleChange} /> <br />
        </form>

        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
          disabled={isLoading}
          onClick={() => {
            write();
          }}
        >
          {isLoading ? "Minting..." : "Mint"}
        </button>
        {isSuccess && (
          <div>
            Successfully minted your NFT!
            <div>
              <a href={`${URL}/tx/${data?.hash}`}>Open transaction receipt</a>
            </div>
          </div>
        )}
      </Modal>
      <button onClick={onOpenModal} className="m-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
        hidden={!isConnected} >
        Mint Token
      </button>
    </div>
  );
}

const ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_nftAddress",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "_recipient",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "_tokenId",
        "type": "uint256"
      }
    ],
    "name": "mintNFT",
    "stateMutability": "nonpayable",
    "type": "function",
    "outputs": [],

  }
]
