const {
    EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey, unmarshalTx
  } = require("secretjs");
const { Slip10RawIndex } = require("@iov/crypto");
const { fromUtf8 } = require("@iov/encoding");
  
const fs = require("fs");
require('dotenv').config();

var SECRET_REST_URL='https://bootstrap.secrettestnet.io/'
var SECRET_RPC_URL='http://bootstrap.secrettestnet.io:26657/'
var SECRET_WS_URL='ws://bootstrap.secrettestnet.io:26657/websocket'
var SECRET_CHAIN_ID='holodeck-2'

var MNEMONIC='soccer can ridge flag captain girl supreme used off blind rifle couple elephant tiny wink pony lecture identify exhibit waste similar club fabric impulse'
var ADDRESS='secret1627fae0an8mj6e22rfj0va9vr7z0unv6dznxvz'
var IMEI='353010123456789'
var PHONE='+16466815674'
var CONTRACTADDRESS='secret1gg8ve5zrrg0fj73236qktk7l0hrelw6lr0vmkl'
var VIEW_KEY='kGlSbOaCDnDo8cwEhGe/IXwOl5nokdpb0wDUtcvBRCY='
  
  const customFees = {
    upload: {
        amount: [{ amount: "3000000", denom: "uscrt" }],
        gas: "3000000",
    },
    init: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "500000",
    },
    exec: {
        amount: [{ amount: "500000", denom: "uscrt" }],
        gas: "500000",
    },
    send: {
        amount: [{ amount: "80000", denom: "uscrt" }],
        gas: "80000",
    },
  }
  
  const main = async () => {
    const httpUrl = SECRET_REST_URL;
    const mnemonic = MNEMONIC;
    const signingPen = await Secp256k1Pen.fromMnemonic(mnemonic);
  
    const pubkey = encodeSecp256k1Pubkey(signingPen.pubkey);
    const accAddress = pubkeyToAddress(pubkey, 'secret');  
    const txEncryptionSeed = EnigmaUtils.GenerateNewSeed();

    const client = new SigningCosmWasmClient(
        httpUrl,
        accAddress,
        (signBytes) => signingPen.sign(signBytes),
        txEncryptionSeed, customFees
    );
    console.log(`Wallet address=${accAddress}`)
    
    // 1. Upload the wasm of a simple contract
    const wasm = fs.readFileSync("contract.wasm");
    console.log('Uploading contract')
    const uploadReceipt = await client.upload(wasm, {});
    const codeId = uploadReceipt.codeId;
  
    // 2. Create an instance of the token contract, minting some tokens to our wallet
    const initMsg = {
        "name":"nft",
        "symbol":"NFT",
        "entropy": Buffer.from("Something really random").toString('base64'),
        "admin": accAddress
    }
    const contract = await client.instantiate(codeId, initMsg, "NFT Token" + Math.ceil(Math.random()*10000));
    console.log('contract: ', contract);
    const contractAddress = contract.contractAddress;
    console.log('contract address: ', contractAddress);

    // 3. Create viewing key for queries
    const entropy = "Another really random thing";
    let handleMsg = { create_viewing_key: {entropy: entropy} };
    console.log('Creating viewing key');
    response = await client.execute(contractAddress, handleMsg);
    console.log('response: ', response);

    const apiKey = JSON.parse(fromUtf8(response.data)).viewing_key.key;
    console.log("apiKey: ", apiKey);

  };

main()