import { keccak256 } from "ethers";
import { MerkleTree } from "merkletreejs";
import { getMerkleRoot, hashLeaf } from "./MerkleUtils";

export class ChunkedMerkleTree {
  finalTree: MerkleTree;
  chunkRoots: Buffer[];
  chunkTrees: MerkleTree[];
  addressChunkLocation: Map<string, number>;
  chunkSize: number;
  cachedProofs: Map<number, string[]>;

  constructor(chunkSize: number) {
    this.chunkSize = chunkSize;
    this.finalTree = new MerkleTree([]);
    this.chunkRoots = [];
    this.chunkTrees = [];
    this.addressChunkLocation = new Map<string, number>();
    this.cachedProofs = new Map<number, string[]>();
  }

  getMerkleTreeProof(address: string): string[] {
    const hashedAddress = Buffer.from(keccak256(address).slice(2), "hex");
    let finalProof: string[] = [];

    const chunkLocation = this.addressChunkLocation.get(address);
    const subTree = this.chunkTrees[chunkLocation!];
    const subProof = subTree
      .getProof(hashedAddress)
      .map((p) => "0x" + p.data.toString("hex"));
    if (subProof.length === 0) {
      console.log("No proof found for address", address);
      return [];
    }

    const cachedProof = this.cachedProofs.get(chunkLocation!);
    if (cachedProof) {
      finalProof = subProof.concat(cachedProof);
    } else {
      const chunkRootProof = this.finalTree
        .getProof(this.chunkRoots[chunkLocation!])
        .map((p) => "0x" + p.data.toString("hex"));
      this.cachedProofs.set(chunkLocation!, chunkRootProof);
      finalProof = subProof.concat(chunkRootProof);
    }

    return finalProof.length > 0 ? finalProof : [];
  }

  getMerkleTreeRoot() {
    return getMerkleRoot(this.finalTree);
  }
  addTreeChunk(addresses: string[], buildTree: boolean): MerkleTree {
    const currentChunks = this.chunkTrees.length;
    const leaves = addresses.map(hashLeaf);
    const newChunk = new MerkleTree(leaves, keccak256, { sortPairs: true });
    this.chunkRoots.push(newChunk.getRoot());
    this.chunkTrees.push(newChunk);
    for (let i = 0; i < addresses.length; i++) {
      this.addressChunkLocation.set(addresses[i], currentChunks);
    }
    if (buildTree) {
      this.finalTree = new MerkleTree(this.chunkRoots, keccak256, {
        sortPairs: true,
      });
    }
    return newChunk;
  }

  buildTree(): MerkleTree {
    this.finalTree = new MerkleTree(this.chunkRoots, keccak256, {
      sortPairs: true,
    });
    return this.finalTree;
  }
}
