

let SLPSDK = require('slp-sdk');
let slpsdk = new SLPSDK();

module.exports = {

  sendpayment: function (fromwallet,  toaddress, userconfig) {

    await sendToken(
    // var gdata = serverwith.dashcoinInit(contractinfo,  network, url, driverplans, plans, dashlogger);
    // return gdata;
  },

  getDashcoinCompositeAddress: function (creatorstub, uidkey,  network ) {


var address = serverwith.getDashcoinCompositeAddress(creatorstub, uidkey,  network );

    return address;
  }



}


// Send a token from wallet1 to wallet2.
async function sendToken(wallet1, slpAddress2, sendamount) {
  try {
    const mnemonic = wallet1.mnemonic

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

    const fundingAddress = wallet1.slpAddress
    const fundingWif = slpsdk.HDNode.toWIF(change) // <-- compressed WIF format
    const tokenReceiverAddress = slpAddress2 ; // wallet2.slpAddress
    const bchChangeReceiverAddress = wallet1.cashAddress

    // Create a config object for minting
    const sendConfig = {
      fundingAddress,
      fundingWif,
      tokenReceiverAddress,
      bchChangeReceiverAddress,
      tokenId: TEST_TOKEN_ID,
      amount: sendamount 
    }


    // Generate, sign, and broadcast a hex-encoded transaction for sending
    // the tokens.
    const sendTxId = await slpsdk.TokenType1.send(sendConfig)

    //console.log(`sendTxId: ${sendTxId}`)
  } catch (err) {
    console.log(`Error in e2e-util.js/sendToken()`)
    throw err
  }
}

// Returns just the test token balance for a wallet.
async function getTestTokenBalance(walletData) {
  try {
    const tokenBalance = await slpsdk.Util.balancesForAddress(
      walletData.slpAddress
    )
    // console.log(`tokenBalance: ${JSON.stringify(tokenBalance, null, 2)}`)

    let testTokens = tokenBalance.filter(x => TEST_TOKEN_ID === x.tokenId)

    // Bootstrap initial state when wallet has no balance yet.
    if (testTokens.length === 0) testTokens = [{ balance: 0 }]

    return testTokens[0].balance
  } catch (err) {
    console.log(`Error in e2e-util.js/getTestTokenBalance()`)
    throw err
  }
}

