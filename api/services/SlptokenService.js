

let SLPSDK = require('slp-sdk');
let slpsdk = new SLPSDK();

let walletInfo
try {
  walletInfo = require(`../../.secret/wallet.live.json`)
} catch (err) {
  console.log(
    `Could not open wallet.json. Generate a wallet with create-wallet first.`
  )
  process.exit(0)
}

const TOKEN_ID =
  "f9a2699bee594e45c163ee1f78303c5ded829813a21ca0aadba2291b6cdb6f88"
const NETWORK = 'mainnet';

module.exports = {


// Send a token from wallet1 to wallet2.
 sendToken: async function (fromwallet, slpAddress2, sendamount) {


  try {
    const mnemonic = fromwallet.mnemonic

    // root seed buffer
    const rootSeed = slpsdk.Mnemonic.toSeed(mnemonic)

    // master HDNode
    const masterHDNode = slpsdk.HDNode.fromSeed(rootSeed)

    // HDNode of BIP44 account
    const account = slpsdk.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")

    const change = slpsdk.HDNode.derivePath(account, "0/0")

    // get the cash address
    //const cashAddress = slpsdk.HDNode.toCashAddress(change)
    //const slpAddress = slpsdk.HDNode.toSLPAddress(change)

    const fundingAddress = slpAddress1;
    const fundingWif = slpsdk.HDNode.toWIF(change) // <-- compressed WIF format
    const tokenReceiverAddress = slpAddress2 ; // wallet2.slpAddress
    const bchChangeReceiverAddress = fromwallet.cashAddress

    // Create a config object for minting
    const sendConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      bchChangeReceiverAddress,
      tokenId: TOKEN_ID,
      amount: sendamount 
    }


    // Generate, sign, and broadcast a hex-encoded transaction for sending
    // the tokens.
    const sendTxId = await slpsdk.TokenType1.send(sendConfig)

    //console.log(`sendTxId: ${sendTxId}`)
  } catch (err) {
    console.log(`Error in e2e-util.js/sendToken()`)
//    reject(sendTxId);
  }
},

// Returns just the test token balance for a wallet.
getTestTokenBalance : async function () {
    const walletData = walletInfo;
  try {
    const tokenBalance = await slpsdk.Util.balancesForAddress(
      walletData.slpAddress
    )
    // console.log(`tokenBalance: ${JSON.stringify(tokenBalance, null, 2)}`)

    let testTokens = tokenBalance.filter(x => TOKEN_ID === x.tokenId)

    // Bootstrap initial state when wallet has no balance yet.
    if (testTokens.length === 0) testTokens = [{ balance: 0 }]

    return testTokens[0].balance
  } catch (err) {
    console.log(`Error in e2e-util.js/getTestTokenBalance()`)
    throw err
  }
},

createuserwallet : function (user) {

console.log("user=" + JSON.stringify(user));

const outObj = {}

// create 128 bit BIP39 mnemonic
const mnemonic = walletInfo.mnemonic;
console.log("BIP44 $BCH Wallet")

// root seed buffer
const rootSeed = slpsdk.Mnemonic.toSeed(mnemonic)

// master HDNode
let masterHDNode
if (NETWORK === `mainnet`) masterHDNode = slpsdk.HDNode.fromSeed(rootSeed)
else masterHDNode = slpsdk.HDNode.fromSeed(rootSeed, "testnet") // Testnet

// HDNode of BIP44 account
const account = slpsdk.HDNode.derivePath(masterHDNode, "m/44'/145'/0'")
console.log(`BIP44 Account: "m/44'/145'/0'"`)

 var count = user.account;
 var derivePath = `m/44'/145'/0'/0/${count}`;
 const childNode = masterHDNode.derivePath(derivePath);

 console.log ("derivePath="+derivePath);
 outObj.derivePath = derivePath;
 outObj.cashAddress = slpsdk.HDNode.toCashAddress(childNode)
    outObj.slpAddress = slpsdk.Address.toSLPAddress(outObj.cashAddress)
    outObj.legacyAddress = slpsdk.Address.toLegacyAddress(outObj.cashAddress)

	 return outObj;
}

}
