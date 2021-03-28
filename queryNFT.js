const {
    EnigmaUtils, Secp256k1Pen, SigningCosmWasmClient, pubkeyToAddress, encodeSecp256k1Pubkey, unmarshalTx
  } = require("secretjs");
const { Slip10RawIndex } = require("@iov/crypto");
const { fromUtf8 } = require("@iov/encoding");
const fs = require("fs");

var SECRET_REST_URL='https://bootstrap.secrettestnet.io/'
var SECRET_RPC_URL='http://bootstrap.secrettestnet.io:26657/'
var SECRET_WS_URL='ws://bootstrap.secrettestnet.io:26657/websocket'
var SECRET_CHAIN_ID='holodeck-2'

var MNEMONIC='soccer can ridge flag captain girl supreme used off blind rifle couple elephant tiny wink pony lecture identify exhibit waste similar club fabric impulse'
var ADDRESS='secret1627fae0an8mj6e22rfj0va9vr7z0unv6dznxvz'
var IMEI='353010123456789'
var PHONE='+16466815674'
var CONTRACTADDRESS='secret1f0kpgwxzx7eqjph43nlylh4zt3mlhgsh664k3t'
var VIEW_KEY='/bSnAxK3WOJIZMawob3hC7g9zp+t09K/6GAVuoHkfy8='
  
  
  // Load environment variables
  require('dotenv').config();
  
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
    const mnemonic =MNEMONIC;
    const contractAddress = CONTRACTADDRESS;
    const viewKey = VIEW_KEY;

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
  
    // 1. Query contract info
    const contractQuery = { 
        contract_info: {}
    };
    let contractInfo = await client.queryContractSmart(contractAddress, contractQuery);
    console.log('My NFT contract info: ', contractInfo);

    // 2. Query all my tokens
    const tokensQuery = { 
        all_tokens: {
            viewer: {
                address: accAddress,
                viewing_key: viewKey
            }
        }
    };
    let allTokens = await client.queryContractSmart(contractAddress, tokensQuery);
    console.log('All My NFT tokens: ', allTokens);

    // 3. Query specific token info
    const nftInfoQuery = { 
        nft_info: {
            token_id: IMEI
        }
    };
    let nftInfo = await client.queryContractSmart(contractAddress, nftInfoQuery);
    console.log('My NFT token info: ', nftInfo);
    
  };

  main();
  