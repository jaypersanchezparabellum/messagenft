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
var IMEI='353010123456987'
var PHONE='+15555555555'
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
    const contractAddress = CONTRACTADDRESS;

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


    const device_IMEI = IMEI
    // 1. Mint my device NFT
    handleMsg = {
        mint_nft: 
        {
            token_id: device_IMEI,
            owner: accAddress
        }
    };
    console.log('Minting NFT for the device');
    response = await client.execute(contractAddress, handleMsg);
    console.log('Mint response: ', response)

    const phoneNumber = PHONE;
    // 2. Set public metadata for my device
    handleMsg = {
        set_public_metadata: 
        {
            token_id: device_IMEI,
            metadata: {
                phone: phoneNumber
            }
        }
    };
    console.log('Setting metadata for the device');
    response = await client.execute(contractAddress, handleMsg);
    console.log('SetPublicMetadata response: ', response)
    
  };
  
  main();
  