import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export function hashLeaf(address: string): Buffer {
  return Buffer.from(keccak256(address).slice(2), "hex");
}

export function tree(addresses: string[]): MerkleTree {
  const leaves = addresses.map(hashLeaf);
  return new MerkleTree(leaves, keccak256, {
    sortPairs: true,
  });
}

export function getMerkleRoot(tree: MerkleTree) {
  return tree.getRoot().toString("hex");
}

export function getMerkleProof(address: string, tree: MerkleTree) {
  const hashedAddress = Buffer.from(keccak256(address).slice(2), "hex");
  return tree.getHexProof(hashedAddress);
}
