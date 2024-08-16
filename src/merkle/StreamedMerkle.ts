import { ChunkedMerkleTree } from "./ChunkedMerkleTree";
import { streamFile } from "../utils/streamer";

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
          processNewChunk(addresses, tree, false);
          addresses = []; // Clear the array for the next chunk
        }
      },
      // on end
      () => {
        if (addresses.length > 0) {
          processNewChunk(addresses, tree, true);
        } else {
          tree.regenerateTopTreeRoot();
        }
        console.log(
          "Finished processing tree... root:",
          tree.getMerkleTreeRoot()
        );
        resolve(tree);
      },
      // on error
      reject
    );
  });
}

function processNewChunk(
  chunk: string[],
  tree: ChunkedMerkleTree,
  regenerateTopTreeRoot: boolean
) {
  const chunkTree = tree.addTreeChunk(chunk, regenerateTopTreeRoot);
  console.log("Processed chunk, root:", chunkTree.getRoot().toString("hex"));
}
