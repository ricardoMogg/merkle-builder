import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";
import { getMerkleRoot } from "./MerkleUtils";

export class ChunkedMerkleTree {
  finalTree: MerkleTree;
  chunkRoots: Buffer[];
  chunkTrees: MerkleTree[];
  chunkSize: number;

  constructor(chunkSize: number) {
    this.chunkSize = chunkSize;
    this.finalTree = new MerkleTree([]);
    this.chunkRoots = [];
    this.chunkTrees = [];
  }

  getMerkleTreeProof(address: string, tree: ChunkedMerkleTree): string[] {
    const hashedAddress = Buffer.from(keccak256(address).slice(2), "hex");
    let finalProof: string[] = [];

    for (let i = 0; i < tree.chunkTrees.length; i++) {
      const t = tree.chunkTrees[i];
      const proof = t
        .getProof(hashedAddress)
        .map((p) => "0x" + p.data.toString("hex"));
      if (proof.length > 0) {
        const chunkRootProof = tree.finalTree
          .getProof(tree.chunkRoots[i])
          .map((p) => "0x" + p.data.toString("hex"));
        finalProof = proof.concat(chunkRootProof);
        break;
      }
    }

    return finalProof.length > 0 ? finalProof : [];
  }

  getMerkleTreeRoot(tree: ChunkedMerkleTree) {
    return getMerkleRoot(tree.finalTree);
  }
}

// Generate a Merkle tree for a chunk of addresses
export function treeChunk(addresses: string[]): MerkleTree {
  const leaves = addresses.map((addr) =>
    Buffer.from(keccak256(addr).slice(2), "hex")
  );
  return new MerkleTree(leaves, keccak256, { sortPairs: true });
}

// Generate a Merkle tree from the roots of chunk trees
export function treeFromChunks(chunkRoots: Buffer[]): MerkleTree {
  return new MerkleTree(chunkRoots, keccak256, { sortPairs: true });
}
