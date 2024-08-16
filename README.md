# ChunkedMerkleTree

The `ChunkedMerkleTree` class is designed to create a Merkle tree structure from Ethereum addresses, split into chunks. This allows you to generate Merkle roots and proofs efficiently for a large set of addresses.

## Installation

Before using the `ChunkedMerkleTree` class, ensure you have the necessary dependencies installed:

```bash
npm install merkle-builder
```

## Importing the Class

```
import { ChunkedMerkleTree } from "merkle-builder";
```

## Creating a Chunked Merkle Tree

To create a new `ChunkedMerkleTree`, instantiate the class with a specified chunk size:

```
const chunkSize = 1000; // Define the size of each chunk
const merkleTree = new ChunkedMerkleTree(chunkSize);
```

## Adding Address Chunks to the Tree

You can add chunks of Ethereum addresses to the tree using the `addTreeChunk` method. This method will create a Merkle tree for the given chunk of addresses:

```
const addresses = [
  "0x1234...",
  "0x5678...",
  // more addresses
];

const buildFinalTree = false; // Set to true if you want to build the final tree immediately after adding this chunk
merkleTree.addTreeChunk(addresses, buildFinalTree);
```

## Building the Final Merkle Tree

After adding all the chunks, you can build the final Merkle tree:

```
const finalTree = merkleTree.buildTree();
```

## Getting the Merkle Root

To retrieve the Merkle root of the final tree, use the `getMerkleTreeRoot` method:

```
const merkleRoot = merkleTree.getMerkleTreeRoot();
console.log("Merkle Root:", merkleRoot);
```

## Generating Proofs for an Address

To generate a proof for a specific Ethereum address, use the `getMerkleTreeProof` method:

```
const address = "0x1234...";
const proof = merkleTree.getMerkleTreeProof(address);
console.log("Proof for Address:", proof);

```

## Example Workflow

Here’s a complete example of how to use the ChunkedMerkleTree class:

```
import { ChunkedMerkleTree } from "./ChunkedMerkleTree";

const chunkSize = 1000;
const merkleTree = new ChunkedMerkleTree(chunkSize);

// Add chunks of addresses
merkleTree.addTreeChunk(["0x1234...", "0x5678..."], false);
merkleTree.addTreeChunk(["0x9abc...", "0xdef0..."], false);

// Build the final tree
merkleTree.buildTree();

// Get the Merkle root
const merkleRoot = merkleTree.getMerkleTreeRoot();
console.log("Merkle Root:", merkleRoot);

// Get a proof for an address
const proof = merkleTree.getMerkleTreeProof("0x1234...");
console.log("Proof for Address:", proof);

```

# Streamed Merkle

The `buildMerkleTreeFromJson` function is designed to create a Merkle tree from Ethereum addresses contained within a JSON file. It utilizes the `ChunkedMerkleTree` class to handle large datasets by processing the addresses in chunks.

## Importing the Function

```
import { buildMerkleTreeFromJson } from "./buildMerkleTreeFromJson";
```

## Building a Merkle Tree from a JSON File

To build a Merkle tree from a JSON file, call the `buildMerkleTreeFromJson` function with the appropriate parameters:

```
const filename = "path/to/your/file.json";
const addressFieldName = "address"; // The field in the JSON containing Ethereum addresses
const chunkSize = 1000; // Define the size of each chunk

buildMerkleTreeFromJson(filename, addressFieldName, chunkSize)
  .then((tree) => {
    const merkleRoot = tree.getMerkleTreeRoot();
    console.log("Merkle Root:", merkleRoot);
  })
  .catch((error) => {
    console.error("Error building Merkle Tree:", error);
  });
```
