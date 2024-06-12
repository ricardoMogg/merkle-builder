import {
  ChunkedMerkleTree,
  treeChunk,
  treeFromChunks,
} from "./ChunkedMerkleTree";
import { streamFile } from "../utils/streamer";
import { getMerkleRoot } from "./MerkleUtils";

export async function buildMerkleTreeFromJson(
  filename: string,
  addressFieldName: string,
  chunkSize: number
): Promise<ChunkedMerkleTree> {
  let addresses: string[] = [];
  let tree: ChunkedMerkleTree = new ChunkedMerkleTree(chunkSize);

  return new Promise((resolve, reject) => {
    streamFile(
      filename,
      // on data
      (data: { value: any }) => {
        addresses.push(data.value[addressFieldName]);
        if (addresses.length >= chunkSize) {
          console.log("Processing chunk...");
          processChunk(addresses, tree);
          addresses = []; // Clear the array for the next chunk
        }
      },
      // on end
      () => {
        if (addresses.length > 0) {
          processChunk(addresses, tree);
        }
        processFinalTree(tree.chunkRoots, tree);
        console.log("Finished processing tree...");
        resolve(tree);
      },
      // on error
      reject
    );
  });
}

function processChunk(chunk: string[], tree: ChunkedMerkleTree) {
  const chunkTree = treeChunk(chunk);
  const chunkRoot = chunkTree.getRoot();
  tree.chunkRoots.push(chunkRoot);
  tree.chunkTrees.push(chunkTree);
  console.log("Processed chunk, root:", chunkRoot.toString("hex"));
}

function processFinalTree(roots: Buffer[], tree: ChunkedMerkleTree) {
  const finalTree = treeFromChunks(roots);
  tree.finalTree = finalTree;
  console.log("Final Merkle root:", getMerkleRoot(finalTree));
}
