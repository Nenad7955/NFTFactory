import { task } from "hardhat/config";
import { Factory } from "../typechain-types";
import fs from "fs"

task("create", "Create nft collection via factory contact")
    .addParam("name")
    .addParam("symbol")
    .setAction(async (args, hre) => {
        const fileContent = JSON.parse(fs.readFileSync("deployments.json", "utf8"))
        const factoryAddress = fileContent.address

        const Factory = await hre.ethers.getContractFactory("Factory")
        const factory: Factory = Factory.attach(factoryAddress)

        return await factory.deployNFT(args.name,args.symbol)
    });