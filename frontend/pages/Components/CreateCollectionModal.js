import { useState, useEffect } from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'
import { Modal } from 'react-responsive-modal';


export function CreateCollectionModal({ contractAddress, isConnected }) {
  const [formData, setFormData] = useState({ name: "", symbol: "" });
  const [open, setOpen] = useState(false);

  const onOpenModal = () => setOpen(true);
  const onCloseModal = () => setOpen(false);

  const URL = process.env.BLOCK_EXPLORER

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  useEffect(()=>{}, [isConnected])

  const { config } = usePrepareContractWrite({
    address: contractAddress,
    abi: ABI,
    functionName: "deployNFT",
    args: [
      formData.name, formData.symbol
    ]
  });

  const { data, write: write, reset: reset } = useContractWrite(config);

  const { isLoading, isSuccess } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: (() => {
      setTimeout(()=>{
        setFormData({name: "", symbol: ""})
        reset()
        onCloseModal()
      }, 3000)  
    }),
    
  });

  return (
    <div>
      <Modal open={open} onClose={onCloseModal} center>
        <h1 className="p-6 m-0 text-center">Collection Creation Modal</h1>

        <form>
          <label htmlFor="name">Token Name:</label>
          <input className="border-2" type="text" value={formData.name} name="name" onChange={handleChange} /> <br />

          <label htmlFor="email">Token Symbol:</label>
          <input className="border-2" type="text" value={formData.symbol} name="symbol" onChange={handleChange} /> <br />
        </form>

        <button className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" hidden={!isConnected}
          disabled={isLoading}
          onClick={() => {
            write();
          }}
        >
          {isLoading ? "Creating..." : "Create"}
        </button>
        {isSuccess && (
          <div>
            Successfully created your NFT collection!
            <div>
              <a href={`${URL}/tx/${data?.hash}`}>Open transaction receipt</a>
            </div>
          </div>
        )}
      </Modal>
      <button onClick={onOpenModal} className="m-3 bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" 
        hidden={!isConnected} >
        Create collection
      </button>
    </div>
  );
}

const ABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      }
    ],
    "name": "deployNFT",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]
