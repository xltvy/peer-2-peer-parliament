import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyGovAbi from './MyGov.json'; // import the smart contract ABI
import {
  Select,
  Button,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const MyGovComponent = () => {
  const [timeValue, setTimeValue] = useState(dayjs('2014-08-18T21:11:54'));
  const [timeDiff, setTimeDiff] = useState(0);
  const [numberOfPayments, setNumberOfPayments] = React.useState(1);
  const dateNow = dayjs();

  const handlePaymentChange = (event) => {
    setNumberOfPayments(event.target.value);
  };
  const handleTimeChange = (newValue) => {
    // console.log(newValue, 'newValue');
    // let timeVal = newValue.split('T')[0];
    // console.log(timeVal, 'timeVal');
    // setTimeValue(timeVal);
    setTimeDiff(newValue.diff(dateNow));
  };
  window.userAddress = null;
  const contract_address = '0x54c0B35dB02f2E7132c138B0EcC5aFE4b693fEa9';

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
      await contract.submitProjectProposal(
        ipfshash,
        votedeadline,
        paymentamounts,
        payschedule,
        { value: ethers.utils.parseEther('0.1') }
      );
    } catch (error) {
      console.log(error);
      alert('error in submit project proposal');
    }
  };
  return (
    <div>
      <Button onClick={loginWithEth}>Login</Button>
      <Button onClick={faucetHandler}>Use faucet</Button>
      <form>
        <TextField
          type='number'
          id='amount'
          name='amount'
          placeholder='amount'
        />
        <Button
          onClick={(event) =>
            event.preventDefault() ||
            customFaucetHandler(document.getElementById('amount').value)
          }
        >
          Use custom faucet
        </Button>
      </form>
      <form>
        <TextField
          type='text'
          id='ipfshash'
          name='ipfshash'
          placeholder='ipfshash'
        />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label='Vote Deadline'
            inputFormat='DD/MM/YYYY'
            value={timeValue}
            id='voteDeadline'
            onChange={handleTimeChange}
            renderInput={(params) => <TextField {...params} />}
            minDate={dateNow}
          />
        </LocalizationProvider>
        <FormControl sx={{ width: 220 }}>
          <InputLabel id='demo-simple-select-label'>
            Number Of Payments
          </InputLabel>

          <Select
            id='demo-simple-select'
            value={numberOfPayments}
            label='Number of payments'
            onChange={handlePaymentChange}
          >
            {Array.from(Array(20).keys()).map((i) => (
              <MenuItem value={i + 1}>{i + 1}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {Array.from(Array(numberOfPayments).keys()).map((i) => (
          <div>
            <TextField
              type='number'
              id={'paymentamounts' + (i + 1)}
              name='paymentamounts'
              placeholder={'paymentamounts' + (i + 1)}
            />
            <TextField
              type='number'
              id={'payschedule' + (i + 1)}
              name='payschedule'
              placeholder={'payschedule' + (i + 1)}
            />
          </div>
        ))}

        <Button
          onClick={(event) => {
            event.preventDefault();
            let paymentamounts = [];
            let payschedule = [];
            for (let i = 0; i < numberOfPayments; i++) {
              paymentamounts.push(
                document.getElementById('paymentamounts' + (i + 1)).value
              );
              payschedule.push(
                document.getElementById('payschedule' + (i + 1)).value
              );
            }
            submitProjectPropsalHandler(
              document.getElementById('ipfshash').value,
              timeDiff,
              paymentamounts,
              payschedule
            );
          }}
        >
          Submit Project Proposal
        </Button>
      </form>
    </div>
  );
};

export default MyGovComponent;
