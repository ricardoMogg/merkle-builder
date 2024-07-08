import MerkleTree from "merkletreejs";

// index.d.ts
declare module "merkle-builder" {
  export class ChunkedMerkleTree {
    constructor();
    getMerkleTreeProof(address: string, tree: ChunkedMerkleTree): string[];
    getMerkleTreeRoot(tree: ChunkedMerkleTree): string;
  }
  export function buildMerkleTreeFromJson(
    filename: string,
    addressFieldName: string,
    chunkSize: number
  ): Promise<ChunkedMerkleTree>;
  export function streamFile(
    filename: string,
    onData: (data: any) => void,
    onEnd: () => void,
    onError: (err: Error) => void
  ): Promise<void>;
}
