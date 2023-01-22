import React, { useState } from 'react';
import { ethers } from 'ethers';
import MyGovAbi from './MyGov.json'; // import the smart contract ABI
import './mygov.css';
import logo from './ppp.png';
import description from './ppp_desc.png';

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
  const [timeValue, setTimeValue] = useState(null);
  const [surveyTimeValue, setSurveyTimeValue] = useState(
    null
  );
  const [timeDiff, setTimeDiff] = useState(0);
  const [surveyTimeDiff, setSurveyTimeDiff] = useState(0);
  const [voteChoice, setVoteChoice] = useState();
  const [votePaymentChoice, setVotePaymentChoice] = useState();

  const [numberOfPayments, setNumberOfPayments] = React.useState();
  const dateNow = dayjs();
  const [surveyInfo, setSurveyInfo] = useState({});
  const [surveyResult, setSurveyResult] = useState({});
  const [surveyOwner, setSurveyOwner] = useState('');
  const [projectIsFunded, setProjectIsFunded] = useState('');
  const [projectNextPayment, setProjectNextPayment] = useState('');
  const [projectOwner, setProjectOwner] = useState('');
  const [projectInfo, setProjectInfo] = useState({});
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
  const takeSurveyHandler = async (surveyid, choices) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.takeSurvey(surveyid, choices);
    } catch (error) {
      console.log(error);
      alert('error in take survey');
    }
  };
  const reserveProjectGrantHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.reserveProjectGrant(projectid);
    } catch (error) {
      console.log(error);
      alert('error in reserve project grant');
    }
  };
  const withdrawProjectPaymentHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      await contract.withdrawProjectPayment(projectid);
    } catch (error) {
      console.log(error);
      alert('error in withdraw project payment');
    }
  };
  const getSurveyResultsHandler = async (surveyid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getSurveyResults(surveyid);
      setSurveyResult({
        numtaken: result[0].toNumber(),
        results: result[1],
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get survey result');
    }
  };
  const getSurveyInfoHandler = async (surveyid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getSurveyInfo(surveyid);
      setSurveyInfo({
        ipfshash: result[0],
        surveydeadline: result[1].toNumber(),
        numchoices: result[2].toNumber(),
        atmostchoice: result[3].toNumber(),
      });
      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get survey info');
    }
  };
  const getSurveyOwnerHandler = async (surveyid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getSurveyOwner(surveyid);
      setSurveyOwner(result);
      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get survey owner');
    }
  };
  const getIsProjectFundedHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getIsProjectFunded(projectid);
      setProjectIsFunded(result.toString());

      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get is project funded');
    }
  };

  const getProjectNextPaymentHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getProjectNextPayment(projectid);
      setProjectNextPayment(result.toNumber());

      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get project next payment');
    }
  };

  const getProjectOwnerHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getProjectOwner(projectid);
      setProjectOwner(result);

      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get project owner');
    }
  };

  const getProjectInfoHandler = async (projectid) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    //await provider.send("eth_requestAccounts",[]);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(contract_address, MyGovAbi, signer);
    // console.log(contract);
    try {
      const result = await contract.getProjectInfo(projectid);
      setProjectInfo({
        ipfshash: result[0],
        projectdeadline: result[1].toNumber(),
        paymentamounts: result[2],
        payschedule: result[3],
      });

      console.log(result);
    } catch (error) {
      console.log(error);
      alert('error in get project info');
    }
  };

  return (
    <div className='main-layout'>

      <div className='mygov-row'>

        <div className='mygov-column'>

        
        <img src={logo} className='logo' alt='ppp logo'/>

        <div className='left-part-interactive'>

          <div className='mygov-column'>

            {/* Initials */}
            <div className='init-container'>
              <div>
                <Button className='connect-button' onClick={loginWithEth}>Connect</Button>
              </div>
              <div>
                <Button className='faucet-button' onClick={faucetHandler}>Use Faucet</Button>
              </div>
              <div className='field-title-container'>
                <div className='field-title'>Use custom faucet</div>
              </div>
              <div className='custom-faucet-form-container'>
                <form className='custom-faucet-form'>
                    <TextField className='form-text-field' type='number' id='amount' name='amount' placeholder='MGOV Amount' InputProps={{ style: { color: "white", borderRadius: "10px" }}} />
                    <Button className='custom-faucet-button'
                      onClick={(event) => 
                        event.preventDefault() || customFaucetHandler(document.getElementById('amount').value)
                      }>Get Tokens</Button>
                </form>
              </div>
            </div>

            {/* Donate ether */}
            <div className='small-container'>
              <div className='donation-desc-container'>
                <div className='field-title'>Donate a specified amount of Ether to the Peer 2 Peer Parliament</div>
              </div>
              <div className='donation-form-container'>
                <form className='donation-form-layout'>
                  <TextField
                    className='donation-text-field'
                    type='number'
                    id='donateEther'
                    name='donateEther'
                    placeholder='Ether Amount'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  <Button
                    className='ether-donation-button'
                    onClick={(event) =>
                      event.preventDefault() ||
                      donateEtherHandler(document.getElementById('donateEther').value)
                    }>
                    Donate
                  </Button>
                </form>
              </div>
            </div>

            {/* Donate mygov */}
            <div className='small-container-2'>
              <div className='donation-desc-container-2'>
                <div className='field-title'>Donate a specified amount of MGOV token to the Peer 2 Peer Parliament</div>
              </div>
              <div className='donation-form-container'>
                <form className='donation-form-layout'>
                  <TextField
                    className='donation-text-field'
                    type='number'
                    id='donateMyGov'
                    name='donateMyGov'
                    placeholder='MGOV Amount'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  <Button
                    className='mgov-donation-button'
                    onClick={(event) =>
                      event.preventDefault() ||
                      donateMyGovHandler(document.getElementById('donateMyGov').value)
                    }>
                    Donate
                  </Button>
                </form>
              </div>
            </div>

          </div>

          <div className='mygov-column'>

            {/* Submit project proposal */}
            <div className='proposal-container'>
              <div className='field-title-container-proposal'>
                <div className='field-title'>Submit a project proposal by giving its IPFS hash and providing a voting deadline and a proper payment schedule with necessary payment amounts</div>
              </div>
              <div className='proposal-form-container'>
                <form>
                  <div className='ipfs-text'>
                    <TextField className='ipfs-text-field' type='text' id='ipfshash' name='ipfshash' placeholder='IPFS Hash' InputProps={{ style: { color: "white", borderRadius: "10px" }}} />
                  </div>
                  <div className='prop-field'>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DesktopDatePicker
                        className='prop-date-picker'
                        label='Vote Deadline'
                        inputFormat='DD/MM/YYYY'
                        value={timeValue}
                        id='voteDeadline'
                        onChange={handleTimeChange}
                        renderInput={(params) => <TextField {...params} sx={{
                          svg: { color: "#808083" },
                          input: { color: "white" },
                          label: { color: "#808083" }
                        }}/>}
                        minDate={dateNow}
                        InputProps={{ style: { color: "white", borderRadius: "10px" }}}
                      />
                    </LocalizationProvider>
                    <FormControl className='pay-select-field' sx={{ svg: { color: "#808083" }, input: { color: "white" }, label: { color: "#808083" } }}>
                      <InputLabel id='demo-simple-select-label'>
                        Number of Payments
                      </InputLabel>
                      <Select
                        sx={{ borderRadius: '10px', color: 'white' }}
                        id='demo-simple-select'
                        value={numberOfPayments}
                        label='Number of payments'
                        onChange={handlePaymentChange}>
                        {Array.from(Array(20).keys()).map((i) => (
                          <MenuItem value={i + 1}>{i + 1}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  {Array.from(Array(numberOfPayments).keys()).map((i) => (
                    <div className='prop-field'>
                      <TextField
                        className='prop-dynamic-text-field'
                        type='number'
                        id={'paymentamounts' + (i + 1)}
                        name='paymentamounts'
                        placeholder={'Payment #' + (i + 1)}
                        InputProps={{ style: { color: "white", borderRadius: "10px" }}}
                      />
                      <TextField
                        className='prop-dynamic-text-field'
                        type='number'
                        id={'payschedule' + (i + 1)}
                        name='payschedule'
                        placeholder={'Payment Schedule #' + (i + 1)}
                        InputProps={{ style: { color: "white", borderRadius: "10px" }}}
                      />
                    </div>
                  ))}
                  <Button
                    className='submit-proposal-button'
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
                    }}>
                    Submit
                  </Button>
                </form>
              </div>
            </div>

            {/* Submit survey */}
            <div className='medium-container'>
              <div className='submit-survey-desc-container'>
                <div className='field-title'>Submit a survey. You can submit a survey for a project proposal by providing the project ID and the IPFS hash of the survey, alongside the number of choices and maximum choice amount.</div>
              </div>
              <div className='submit-survey-form-container'>
                <form>
                  <div className='ipfs-text'>
                    <TextField className='ipfs-text-field' type='text' id='ipfshash_submitsurvey' name='ipfshash' placeholder='IPFS Hash' InputProps={{ style: { color: "white", borderRadius: "10px" }}} />
                  </div>
                  <div className='prop-field'>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DesktopDatePicker
                      className='survey-date-picker'
                      label='Survey Deadline'
                      inputFormat='DD/MM/YYYY'
                      value={surveyTimeValue}
                      id='surveyDeadline'
                      onChange={handleSurveyTimeChange}
                      renderInput={(params) => <TextField {...params} sx={{
                        svg: { color: "#808083" },
                        input: { color: "white" },
                        label: { color: "#808083" }
                      }}/>}
                      minDate={dateNow}
                      InputProps={{ style: { color: "white", borderRadius: "10px" }}}
                    />
                  </LocalizationProvider>
                  <TextField
                    className='survey-choice-field'
                    type='number'
                    id='numchoices'
                    name='numchoices'
                    placeholder='Choice Amount'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  <TextField
                    className='survey-choice-field'
                    type='number'
                    id='atmostchoice'
                    name='atmostchoice'
                    placeholder='Maximum Choice'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  </div>
                  <Button
                    className='submit-survey-button'
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
                    Submit
                  </Button>
                </form>
              </div>  
            </div>

            {/* Delegate vote */}
            <div className='medium-container'>
              <div className='delegate-desc-container'>
                <div className='field-title'>Delegate your vote to another address. You can delegate your vote to another address for a specific project proposal.</div>
              </div>
              <div className='delegate-form-container'>
                <form className='one-line-form-layout'>
                  <TextField
                    className='medium-form-text-field'
                    type='text'
                    id='delegateaddress'
                    name='delegateaddress'
                    placeholder='Address to Delegate Vote To'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  <TextField
                    className='medium-form-text-field-2'
                    type='number'
                    id='projectid'
                    name='projectid'
                    placeholder='Project ID'
                    InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                  <Button
                    className='delegate-button'
                    onClick={(event) =>
                      event.preventDefault() ||
                      delegateVoteToHandler(
                        document.getElementById('delegateaddress').value,
                        document.getElementById('projectid').value
                      )
                    }>
                    Delegate Vote
                  </Button>
                </form>
              </div>
            </div>
            
          </div>

        </div>

        </div>
        
        <div className='mygov-column'>

          {/* Vote project proposal */}
          <div className='medium-container'>
            <div className='vote-proposal-desc-container'>
              <div className='field-title'>Vote for a project proposal by providing the proposal ID. You can either vote for a project proposal or against.</div>
            </div>
            <div className='vote-proposal-form-container'>
              <form className='one-line-form-layout'>
                <TextField
                  className='medium-form-text-field'
                  type='number'
                  id='projectid_voteproposal'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <FormControl className='med-select-field' sx={{ svg: { color: "#808083" }, input: { color: "white" }, label: { color: "#808083" } }}>
                  <InputLabel id='demo-simple-select-label'>Choice</InputLabel>
                  <Select
                    sx={{ borderRadius: '10px', color: 'white' }}
                    id='demo-simple-select'
                    value={voteChoice}
                    label='Choice'
                    onChange={handleVoteChange}
                  >
                    <MenuItem value={true}>Vote for proposal</MenuItem>
                    <MenuItem value={false}>Vote against proposal</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  className='vote-prop-button'
                  onClick={(event) =>
                    event.preventDefault() ||
                    voteForProjectProposalHandler(
                      document.getElementById('projectid_voteproposal').value,
                      voteChoice
                    )
                  }>
                  Vote for Proposal
                </Button>
              </form>
            </div>
          </div>

          {/* Vote payment */}
          <div className='medium-container'>
            <div className='vote-payment-desc-container'>
              <div className='field-title'>Vote for a payment by providing the payment ID. You can either vote for a payment or against.</div>
            </div>
            <div className='vote-payment-form-container'>
              <form className='one-line-form-layout'>
                <TextField
                  className='medium-form-text-field'
                  type='number'
                  id='projectid_votepayment'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <FormControl className='med-select-field' sx={{ svg: { color: "#808083" }, input: { color: "white" }, label: { color: "#808083" } }}>
                  <InputLabel id='demo-simple-select-label'>Choice</InputLabel>
                  <Select
                    sx={{ borderRadius: '10px', color: 'white' }}
                    id='demo-simple-select'
                    value={votePaymentChoice}
                    label='Choice'
                    onChange={handleVotePaymentChange}
                  >
                    <MenuItem value={true}>Vote for payment</MenuItem>
                    <MenuItem value={false}>Vote against payment</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  className='vote-payment-button'
                  onClick={(event) =>
                    event.preventDefault() ||
                    voteForProjectPaymentHandler(
                      document.getElementById('projectid_votepayment').value,
                      votePaymentChoice
                    )
                  }>
                  Vote for Payment
                </Button>
              </form>
            </div>
          </div>

          {/* Take survey */}
          <div className='medium-container'>
            <div className='take-survey-desc-container'>
              <div className='field-title'>Take a survey. You can take a survey by providing the survey ID and the choices you want to select in the form of comma separated indexes.</div>
            </div>
            <div className='take-survey-form-container'>
              <form className='one-line-form-layout'>
                <TextField
                  className='medium-form-text-field'
                  type='number'
                  id='take_surveyid'
                  name='surveyid'
                  placeholder='Survey ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <TextField
                  className='medium-form-text-field-2'
                  type='text'
                  id='take_choices'
                  name='choices'
                  placeholder='Choices (comma separated)'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='take-survey-button'
                  onClick={(event) =>
                    event.preventDefault() ||
                    takeSurveyHandler(
                      document.getElementById('take_surveyid').value,
                      Array.from(
                        document.getElementById('take_choices').value.split(','),
                        Number
                      )
                    )
                  }>
                  Take Survey
                </Button>
              </form>
            </div>
          </div>
        
          {/* Reserve payment */}
          <div className='medium-container'>
            <div className='reserve-desc-container'>
              <div className='field-title'>You can reserve a project grant by providing the project ID. You can only reserve a project grant before the payment schedule.</div>
            </div>
            <div className='reserve-form-container'>
              <form className='one-line-form-layout'>
                <TextField
                  className='one-line-form-text-field'
                  type='number'
                  id='reserved_projectid'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='reserve-button'
                  onClick={(event) =>
                    event.preventDefault() ||
                    reserveProjectGrantHandler(
                      document.getElementById('reserved_projectid').value
                    )
                  }>
                  Reserve
                </Button>
              </form>
            </div>
          </div>
          
          {/* Withdraw payment */}
          <div className='medium-container'>
            <div className='withdraw-desc-container'>
              <div className='field-title'>You can withdraw the next project grant by providing the project ID. You can only withdraw a project grant after the payment schedule.</div>
            </div>
            <div className='withdraw-form-container'>
              <form className='one-line-form-layout'>
                <TextField
                  className='one-line-form-text-field'
                  type='number'
                  id='withdraw_projectid'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='withdraw-button'
                  onClick={(event) =>
                    event.preventDefault() ||
                    withdrawProjectPaymentHandler(
                      document.getElementById('withdraw_projectid').value
                    )
                  }>
                  Withdraw
                </Button>
              </form>
            </div>
          </div>
          
        </div>

      </div>
      
      <div className='mygov-row'>

      <div className='getter-column'>

        {/* Get project info */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the information of a project by providing its ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_project_info_id'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-orange'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getProjectInfoHandler(
                      document.getElementById('get_project_info_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>IPFS Hash: <a href={projectInfo?.ipfshash}>{projectInfo?.ipfshash}</a> </li>
                  <li className='getter-element' style={{paddingBottom: "2px", paddingTop: "2px"}}>Project Deadline: {projectInfo?.projectdeadline}</li>
                  <li className='getter-element' style={{paddingBottom: "2px", paddingTop: "2px"}}>
                    Payment Amounts:{' '}
                    {projectInfo?.paymentamounts?.map(
                      (amount) => amount.toNumber() + ' '
                    )}
                  </li>
                  <li className='getter-element' style={{paddingTop: "2px"}}>
                    Payment Schedule:{' '}
                    {projectInfo?.payschedule?.map(
                      (schedule) => schedule.toNumber() + ' '
                    )}
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>

        {/* Get project owner */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the owner's address of a project by providing its ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_project_owner_id'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-purple'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getProjectOwnerHandler(
                      document.getElementById('get_project_owner_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>Owner Address: {projectOwner}</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
        
        {/* Get survey result */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the result of a survey by providing the survey ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_survey_result_id'
                  name='surveyid'
                  placeholder='Survey ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-orange'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getSurveyResultsHandler(
                      document.getElementById('get_survey_result_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>How Many Members Taken the Survey: {surveyResult?.numtaken}</li>
                  <li className='getter-element' style={{paddingTop: "2px"}}>
                    Results:{' '}
                    {surveyResult?.results?.map((result) => (
                      <div>{result.toNumber()}</div>
                    ))}
                  </li>
                </ul>
              </div>
            </form>
          </div>
        </div>
        
        {/* Get survey owner */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the owner's address of a survey by providing its ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_survey_owner_id'
                  name='surveyid'
                  placeholder='Survey ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-blue'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getSurveyOwnerHandler(
                      document.getElementById('get_survey_owner_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>Owner Address: {surveyOwner}</li>
                </ul>
              </div>
            </form>
          </div>
        </div>

        {/* Get project funded */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can check if project is funded or not by providing its ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_project_funded_id'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-pink'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getIsProjectFundedHandler(
                      document.getElementById('get_project_funded_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>Project is Funded or Not: {projectIsFunded}</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
        
        {/* Get next payment */}
        <div className='medium-container'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the next payment of a project by providing its ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_project_next_payment_id'
                  name='projectid'
                  placeholder='Project ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-turqoise'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getProjectNextPaymentHandler(
                      document.getElementById('get_project_next_payment_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>Next Payment: {projectNextPayment}</li>
                </ul>
              </div>
            </form>
          </div>
        </div>
        
        {/* Get survey info */}
        <div className='medium-container-alt'>
          <div className='getter-desc-container'>
            <div className='field-title'>You can get the information of a survey by providing the survey ID.</div>
          </div>
          <div className='getter-form-container'>
            <form className='getter-form-layout'>
              <div className='request-field'>
                <TextField
                  className='getter-form-text-field'
                  type='number'
                  id='get_survey_info_id'
                  name='surveyid'
                  placeholder='Survey ID'
                  InputProps={{ style: { color: "white", borderRadius: "10px" }}}/>
                <Button
                  className='get-button-purple'
                  onClick={(event) =>
                    event.preventDefault() ||
                    getSurveyInfoHandler(
                      document.getElementById('get_survey_info_id').value
                    )
                  }>
                  Get
                </Button>
              </div>
              <div className='response-field'>
                <ul>
                  <li className='getter-element' style={{paddingBottom: "2px"}}>IPFS Hash: <a href={surveyInfo?.ipfshash}>{surveyInfo?.ipfshash}</a></li>
                  <li className='getter-element' style={{paddingBottom: "2px", paddingTop: "2px"}}>Survey Deadline: {surveyInfo?.surveydeadline}</li>
                  <li className='getter-element' style={{paddingBottom: "2px", paddingTop: "2px"}}>Number of Choices: {surveyInfo?.numchoices}</li>
                  <li className='getter-element' style={{paddingTop: "2px"}}>Maximum Choice Amount: {surveyInfo?.atmostchoice}</li>
                </ul>
              </div>
            </form>
          </div>
        </div>

        <img src={description} className='description' alt='ppp description'/>

      </div>

      </div>

    </div>
  );
};

export default MyGovComponent;
