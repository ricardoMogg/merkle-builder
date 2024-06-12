import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";

export function tree(addresses: string[]): MerkleTree {
  return new MerkleTree(addresses.map(keccak256), keccak256, {
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
