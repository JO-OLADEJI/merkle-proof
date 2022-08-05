import { ethers } from "hardhat";
import WHITELIST_INFO from "./config.json";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const encodeLeaf = (address: string, whitelistSlots: number): string => {
  return ethers.utils.defaultAbiCoder.encode(
    ["address", "uint64"],
    [address, whitelistSlots]
  );
};

const main = async () => {
  const whitelist: string[] = WHITELIST_INFO.map((info) =>
    encodeLeaf(info.address, info.whitelistSlots)
  );
  const merkleTree = new MerkleTree(whitelist, keccak256, {
    hashLeaves: true,
    sortPairs: true,
  });
  const merkleRoot = merkleTree.getHexRoot();

  try {
    const MerkelWhitelistCF = await ethers.getContractFactory(
      "MerkleWhitelist"
    );
    const MerkleWhitelist = await MerkelWhitelistCF.deploy(merkleRoot);

    console.log(`MerkleWhitelist deployed to ${MerkleWhitelist.address}`);
    process.exitCode = 0;
  } catch (error) {
    console.error(error);
    process.exitCode = 1;
  }
};
