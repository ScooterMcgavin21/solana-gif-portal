/**
 * Script to write a key pair directly to our file system, therefor when peeps visit app, same key pair is loaded
 */

const fs = require('fs')
const anchor = require("@project-serum/anchor")

const account = anchor.web3.Keypair.generate()

fs.writeFileSync('./keypair.json', JSON.stringify(account))
