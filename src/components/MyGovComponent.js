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
  const [timeValue, setTimeValue] = useState(dayjs('2022-12-18T21:11:54'));
  const [surveyTimeValue, setSurveyTimeValue] = useState(
    dayjs('2022-12-18T21:11:54')
  );
  const [timeDiff, setTimeDiff] = useState(0);
  const [surveyTimeDiff, setSurveyTimeDiff] = useState(0);
  const [voteChoice, setVoteChoice] = useState();
  const [votePaymentChoice, setVotePaymentChoice] = useState();

  const [numberOfPayments, setNumberOfPayments] = React.useState(1);
  const dateNow = dayjs();

  const handlePaymentChange = (event) => {
    setNumberOfPayments(event.target.value);
  };
  const handleTimeChange = (newValue) => {
    setTimeValue(newValue);
    setTimeDiff(newValue.diff(dateNow));
  };
  const handleSurveyTimeChange = (newValue) => {
    setSurveyTimeValue(newValue);
    setSurveyTimeDiff(newValue.diff(dateNow));
  };
  const handleVoteChange = (event) => {
    setVoteChoice(event.target.value);
  };
  const handleVotePaymentChange = (event) => {
    setVotePaymentChoice(event.target.value);
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
  const donateEtherHandler = async (value) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.donateEther({ value: ethers.utils.parseEther(value) });
    } catch (error) {
      console.log(error);
      alert('error in donate ether');
    }
  };
  const donateMyGovHandler = async (amount) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.donateMyGovToken(amount);
    } catch (error) {
      console.log(error);
      alert('error in donate mygov token');
    }
  };
  const voteForProjectProposalHandler = async (projectid, vote) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.voteForProjectProposal(projectid, vote);
    } catch (error) {
      console.log(error);
      alert('error in vote for project proposal');
    }
  };
  const voteForProjectPaymentHandler = async (projectid, vote) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.voteForProjectPayment(projectid, vote);
    } catch (error) {
      console.log(error);
      alert('error in vote for project payment');
    }
  };
  const delegateVoteToHandler = async (delegateaddress, projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.delegateVoteTo(delegateaddress, projectid);
    } catch (error) {
      console.log(error);
      alert('error in delegate vote to');
    }
  };
  const submitSurveyHandler = async (
    ipfshash,
    surveydeadline,
    numchoices,
    atmostchoice
  ) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.submitSurvey(
        ipfshash,
        surveydeadline,
        numchoices,
        atmostchoice,
        { value: ethers.utils.parseEther('0.04') }
      );
    } catch (error) {
      console.log(error);
      alert('error in submit survey');
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
      <form>
        <TextField
          type='number'
          id='donateEther'
          name='donateEther'
          placeholder='donateEther'
        />
        <Button
          onClick={(event) =>
            event.preventDefault() ||
            donateEtherHandler(document.getElementById('donateEther').value)
          }
        >
          Donate Ether
        </Button>
      </form>
      <form>
        <TextField
          type='number'
          id='donateMyGov'
          name='donateMyGov'
          placeholder='donateMyGov'
        />
        <Button
          onClick={(event) =>
            event.preventDefault() ||
            donateMyGovHandler(document.getElementById('donateMyGov').value)
          }
        >
          Donate MyGov
        </Button>
      </form>
      <form>
        <TextField
          type='number'
          id='projectid_voteproposal'
          name='projectid'
          placeholder='projectid'
        />
        <FormControl sx={{ width: 220 }}>
          <InputLabel id='demo-simple-select-label'>Choice</InputLabel>

          <Select
            id='demo-simple-select'
            value={voteChoice}
            label='Choice'
            onChange={handleVoteChange}
          >
            <MenuItem value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </FormControl>

        <Button
          onClick={(event) =>
            event.preventDefault() ||
            voteForProjectProposalHandler(
              document.getElementById('projectid_voteproposal').value,
              voteChoice
            )
          }
        >
          Vote For Project Proposal
        </Button>
      </form>
      <form>
        <TextField
          type='number'
          id='projectid_votepayment'
          name='projectid'
          placeholder='projectid'
        />
        <FormControl sx={{ width: 220 }}>
          <InputLabel id='demo-simple-select-label'>Choice</InputLabel>

          <Select
            id='demo-simple-select'
            value={votePaymentChoice}
            label='Choice'
            onChange={handleVotePaymentChange}
          >
            <MenuItem value={true}>True</MenuItem>
            <MenuItem value={false}>False</MenuItem>
          </Select>
        </FormControl>

        <Button
          onClick={(event) =>
            event.preventDefault() ||
            voteForProjectPaymentHandler(
              document.getElementById('projectid_votepayment').value,
              votePaymentChoice
            )
          }
        >
          Vote For Project Payment
        </Button>
      </form>
      <form>
        <TextField
          type='text'
          id='delegateaddress'
          name='delegateaddress'
          placeholder='delegateaddress'
        />
        <TextField
          type='number'
          id='projectid'
          name='projectid'
          placeholder='projectid'
        />
        <Button
          onClick={(event) =>
            event.preventDefault() ||
            delegateVoteToHandler(
              document.getElementById('delegateaddress').value,
              document.getElementById('projectid').value
            )
          }
        >
          Delegate Vote To
        </Button>
      </form>
      <form>
        <TextField
          type='text'
          id='ipfshash_submitsurvey'
          name='ipfshash'
          placeholder='ipfshash'
        />

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label='Survey Deadline'
            inputFormat='DD/MM/YYYY'
            value={surveyTimeValue}
            id='surveyDeadline'
            onChange={handleSurveyTimeChange}
            renderInput={(params) => <TextField {...params} />}
            minDate={dateNow}
          />
        </LocalizationProvider>
        <TextField
          type='number'
          id='numchoices'
          name='numchoices'
          placeholder='numchoices'
        />
        <TextField
          type='number'
          id='atmostchoice'
          name='atmostchoice'
          placeholder='atmostchoice'
        />
        <Button
          onClick={(event) =>
            event.preventDefault() ||
            submitSurveyHandler(
              document.getElementById('ipfshash_submitsurvey').value,
              surveyTimeDiff,
              document.getElementById('numchoices').value,
              document.getElementById('atmostchoice').value
            )
          }
        >
          Submit Survey
        </Button>
      </form>
    </div>
  );
};

export default MyGovComponent;
