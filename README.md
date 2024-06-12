# merkle-builder

merkle tree builder

1. Run `npm install` to install the dependencies.
2. Create a `.env` file in the root directory and add the following:

```
CHUNK_SIZE=1000000 # This will help in splitting the data into chunks in case your merkle tree is big
FILE_NAME=./sample_input_file.json # This is the file that contains the data to be hashed into the merkle tree
ADDRESS_FIELD_NAME=address # This is the field name in the data that contains the content to be hashed
```

3. Run `npm run test_gen` to run the tests. This will use the provided file and field nme to generate the merkle tree.
