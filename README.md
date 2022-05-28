# Secp256k1-zkp WASM Wrapper

### Description
WASM wrapper around parts of [libsecp256k1-zkp](https://github.com/NicolasFlamel1/secp256k1-zkp).

### Building
Run the following commands to build this wrapper as WASM. The resulting files will be in the `dist` folder.
```
make dependencies
make wasm
```

Run the following commands to build this wrapper as asm.js. The resulting file will be in the `dist` folder.
```
make dependencies
make asmjs
```
