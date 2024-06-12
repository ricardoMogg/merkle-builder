import { buildMerkleTreeFromJson } from "../src/merkle/StreamedMerkle";
import dotenv from "dotenv";

dotenv.config();
const chunkSize: string = process.env.CHUNK_SIZE || "1000";
const fileName = process.env.FILE_NAME;
const addressFieldName = process.env.ADDRESS_FIELD_NAME || "address";

function run() {
  if (isNaN(parseInt(chunkSize))) {
    console.error("Chunk size must be a number");
    return;
  }
  if (!fileName) {
    console.error("File name must be provided");
    return;
  }
  console.log(
    `Building Merkle tree: \n file: ${fileName} \n chunk size: ${chunkSize} \n address field: ${addressFieldName} \n`
  );
  buildMerkleTreeFromJson(fileName, addressFieldName, parseInt(chunkSize))
    .then((tree) => {
      const bob: string = "0x8c7b15cEa1e7FD6840b1aeC4d7e4c3cA83C3bf1b";
      const codie: string = "0x1456760D7d26B37c32f986D3b5cEEb4dCF615adf";

      console.log("Finished building tree...");
      console.log("Final Merkle root:", tree.getMerkleTreeRoot(tree));

      // generate proofs for specific addresses here
      // for (const address of someAddresses) {
      //   console.log(`Merkle proof for ${address}`);
      //   console.log(getMerkleProof(address, finalTree));
      // }

      console.log(`Merkle proof for ${bob}`);
      console.log(tree.getMerkleTreeProof(bob, tree));
      console.log(`Merkle proof for ${codie}`);
      console.log(tree.getMerkleTreeProof(codie, tree));
    })
    .catch((err) => {
      console.error("An error occurred:", err);
    });
}
run();
