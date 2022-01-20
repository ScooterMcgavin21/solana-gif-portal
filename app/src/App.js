import {
  Program, Provider, web3
} from '@project-serum/anchor';
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js';
import React, { useEffect, useState } from 'react';
import './App.css';
import twitterLogo from './assets/twitter-logo.svg';
import idl from './idl.json';
import kp from './keypair.json';

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
// let baseAccount = Keypair.generate();

// replace baseaccount with permanent keypair
const arr = Object.values(kp._keypair.secretKey)
const secret = new Uint8Array(arr)
const baseAccount = web3.Keypair.fromSecretKey(secret)


// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
// can change to finalized to be absolutely sure to wait for the tx to complete
const opts = {
  preflightCommitment: "processed"
}
/** CONSTANTS */
const TWITTER_HANDLE = '_buildspace';
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
// const TEST_GIFS = [
// 	'https://media.giphy.com/media/RBDXLadJCxs6A/giphy.gif',
// 	'https://i.imgur.com/Zd8fFGl.gif',
// 	'https://media.giphy.com/media/l0IykOsxLECVejOzm/giphy.gif',
// 	'https://i.imgur.com/rb5q3yM.gif',
//   'https://media.giphy.com/media/OkHIKBJPKvXs4/giphy.gif',
//   'https://media.giphy.com/media/45OUBXs78epxqenqzC/giphy.gif',
//   'https://media.giphy.com/media/3o7TKH8yWJ4X5iSDMQ/giphy.gif',
//   'https://media.giphy.com/media/TLb0f7jArTDfZBPSYN/giphy.gif',
//   'https://media.giphy.com/media/3oKIP5ZKn0vHL4QqLS/giphy.gif',
//   'https://media.giphy.com/media/LKqotXWsCnTIN84d5C/giphy.gif',
//   'https://media.giphy.com/media/E0VriXFYLSexVidg22/giphy.gif',
//   'https://media.giphy.com/media/Z91wshOLQ8wGQ/giphy.gif',
// ]

/** Yeet */
const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  /** Check window object in DOM to see  if  obj.solana is inejected */
  const checkWalletConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Noice, Phantom wallet found!');

          /** check if logged in */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'onConnect PubKey:',
            response.publicKey.toString()
          );
          // setting user pubKey in state
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('No habla, solana object not found - get phantom wallet 👻');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;
  
    if (solana) {
      const response = await solana.connect();
      console.log('Connected with PubKey:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  /**
   * Call addGif then getGifList so app refreshes latest submitted GIF
   * Allows submit link, approve the txn via phantom, app renders gif
   */
  const sendGif = async () => {
    if (inputValue.length === 0) {
      console.log("No gif link given!")
      return
    }
    setInputValue('');
    console.log('Gif link:', inputValue);
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
  
      await program.rpc.addGif(inputValue, {
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
        },
      });
      console.log("GIF successfully sent to program", inputValue)
  
      await getGifList();
    } catch (error) {
      console.log("Error sending GIF:", error)
    }
  };

  /** onChange function gets fired each time input box value changes */
  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  /** Solana authentication connection provider */
  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }

  /**
   * Initialize BaseAccount via startStuffOff
   */
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log("ping")
      await program.rpc.startStuffOff({
        accounts: {
          baseAccount: baseAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [baseAccount]
      });
      console.log("Created a new BaseAccount wid address:", baseAccount.publicKey.toString())
      await getGifList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  /**
   * Render ui if user hasnt conneccted phantom wallet
   */
  const renderNotConnectedContainer = () => (
    <button
      className="cta-button connect-wallet-button"
      onClick={connectWallet}
    >
      Connect to Wallet
    </button>
  );

  /**
   * Maps through GIF links and renders upon user logged in, contains form with input box
   * Add conditional cases:
   *    1) After sucessful login, Give button to create account if BaseAccount is null 
   *    2) Render GifList allow peeps to submit gif if logged in and BaseAccount does exist
   */
  const renderConnectedContainer = () => {
    // program account hasnt been initialized if this hits
    if (gifList === null) {
      return (
        <div className="connected-container">
          <button className="cta-button submit-gif-button" onClick={createGifAccount}>
            Do One-Time Initialization For GIF Program Account
          </button>
        </div>
      )
    }
    else {
      return (
        <div className="connected-container">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendGif();
            }}
          >
            <input 
              type="text"
              placeholder="Enter gif link!"
              value={inputValue}
              onChange={onInputChange}
            />
            <button type="submit" className="cta-button submit-gif-button">
              Submit
            </button>
          </form>
          <div className="gif-grid">
            {gifList.map((item, index) => (
              <div className="gif-item" key={index}>
                <img src={item.gifLink} alt=''/>
              </div>
            ))}
          </div>
        </div>
      )
    }
  };

  /** Guarentee obj avail upon evt is called, after full load */
  useEffect(() => {
    const onLoad = async () => {
      await checkWalletConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);

  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const account = await program.account.baseAccount.fetch(baseAccount.publicKey);
      
      console.log("Got the account", account)
      setGifList(account.gifList)
  
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }

  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
    }
  }, [walletAddress]);

  return (
    <div className="App">
			<div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">🖼 Always Sunny Portal</p>
          <p className="sub-text">
            View your GIF collection in the metaverse ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {walletAddress && renderConnectedContainer()}
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built on @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;
