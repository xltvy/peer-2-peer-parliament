import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyGovAbi from './MyGov.json'; // import the smart contract ABI

const MyGovComponent = () => {
  const [myGovInstance, setMyGovInstance] = useState();
  window.userAddress = null;
  const contract_address = '0x64597Aee40c77f566b8A953dAA58f733D6F71f52';

  const showAddress = () => {
    if (!window.userAddress) {
      document.getElementById('userAddress').innerText = '';
      document.getElementById('hideButton').classList.add('hidden');
      return false;
    }

    document.getElementById(
      'userAddress'
    ).innerText = `Active User Address: ${window.userAddress}`;
    //document.getElementById("hideButton").classList.remove("hidden");
  };

  const loginWithEth = async () => {
    if (window.web3) {
      try {
        // We use this since ethereum.enable() is deprecated. This method is not
        // available in Web3JS - so we call it directly from metamasks' library
        const selectedAccount = await window.ethereum
          .request({
            method: 'eth_requestAccounts',
          })
          .then((accounts) => accounts[0])
          .catch(() => {
            throw Error('No account selected!');
          });
        window.userAddress = selectedAccount;
        //setUserAddress(selectedAccount);
        window.localStorage.setItem('userAddress', selectedAccount);
        showAddress();
      } catch (error) {
        console.error(error);
      }
    } else {
      alert('No ETH brower extension detected.');
    }
  };
  const faucetHandler = async (event) => {
    event.preventDefault();

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.faucet();
    } catch (error) {
      alert('you have already used the faucet');
    }
  };
  const customFaucetHandler = async (amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.customFaucet(amount);
    } catch (error) {
      alert('you have already used the faucet');
    }
  };
  const submitProjectPropsalHandler = async (
    ipfshash,
    votedeadline,
    paymentamounts,
    payschedule
  ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.submitProjectPropsal(
        ipfshash,
        votedeadline,
        paymentamounts,
        payschedule
      );
    } catch (error) {
      alert('you have already used the faucet');
    }
  };
  return (
    <div>
      <button onClick={loginWithEth}>Login</button>
      <button onClick={faucetHandler}>Use faucet</button>
      <form>
        <input type='number' id='amount' name='amount' placeholder='amount' />
        <button
          onClick={(event) =>
            event.preventDefault() ||
            customFaucetHandler(document.getElementById('amount').value)
          }
        >
          Use custom faucet
        </button>
      </form>
      <form>
        <input
          type='text'
          id='ipfshash'
          name='ipfshash'
          placeholder='ipfshash'
        />
        <input
          type='number'
          id='votedeadline'
          name='votedeadline'
          placeholder='votedeadline'
        />
        <input
          type='number'
          id='paymentamounts'
          name='paymentamounts'
          placeholder='paymentamounts'
        />
        <input
          type='number'
          id='payschedule'
          name='payschedule'
          placeholder='payschedule'
        />
        <button
          onClick={(event) =>
            event.preventDefault() ||
            submitProjectPropsalHandler(
              document.getElementById('ipfshash').value,
              document.getElementById('votedeadline').value,
              document.getElementById('paymentamounts').value,
              document.getElementById('payschedule').value
            )
          }
        >
          Submit Project Proposal
        </button>
      </form>
    </div>
  );
};

export default MyGovComponent;
