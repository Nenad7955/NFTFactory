import { task } from "hardhat/config";
import { Factory } from "../typechain-types";
import fs from "fs"

task("mint", "Mint tokens via factory contact")
    .addParam("collection")
    .addParam("recipient")
    .addParam("id")
    .setAction(async (args, hre) => {
        const fileContent = JSON.parse(fs.readFileSync("deployments.json", "utf8"))
        const factoryAddress = fileContent.address

        const Factory = await hre.ethers.getContractFactory("Factory")
        const factory: Factory = Factory.attach(factoryAddress)

        return await factory.mintNFT(args.collection, args.recipient, args.id)
    });