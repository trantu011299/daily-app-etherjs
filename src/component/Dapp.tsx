import React, {useState} from "react";
import {ethers} from 'ethers'
import testAbi from "../contracts/test-abi.json"
import Button from '@mui/material/Button';

declare var window: any;

const Dapp = () => {
    // deploy simple storage contract and paste deployed contract address here. This value is local ganache chain
    let contractAddress = '0xd9145CCE52D386f254917e481eB44e9943F39138';

    const [errorMessage, setErrorMessage] = useState("");
    const [defaultAccount, setDefaultAccount] = useState(null);
    const [connButtonText, setConnButtonText] = useState('Connect Wallet');

    const [currentContractVal, setCurrentContractVal] = useState(null);

    const [provider, setProvider] = useState<any>(null);
    const [signer, setSigner] = useState<any>(null);
    const [contract, setContract] = useState<any>(null);

    const connectWalletHandler = () => {
        if (window.ethereum && window.ethereum.isMetaMask) {

            window.ethereum.request({ method: 'eth_requestAccounts'})
                .then((result: any) => {
                    accountChangedHandler(result[0]);
                    setConnButtonText('Wallet Connected');
                })
                .catch((error: any) => {
                    setErrorMessage(error.message);

                });

        } else {
            console.log('Need to install MetaMask');
            setErrorMessage('Please install MetaMask browser extension to interact');
        }
    }

    // update account, will cause component re-render
    const accountChangedHandler = (newAccount: any) => {
        setDefaultAccount(newAccount);
        updateEthers();
    }

    const chainChangedHandler = () => {
        // reload the page to avoid any errors with chain change mid use of application
        window.location.reload();
    }


    // listen for account changes
    window.ethereum.on('accountsChanged', accountChangedHandler);

    window.ethereum.on('chainChanged', chainChangedHandler);

    const updateEthers = () => {
        let tempProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(tempProvider);

        let tempSigner = tempProvider.getSigner();
        setSigner(tempSigner);

        let tempContract = new ethers.Contract(contractAddress, testAbi, tempSigner);
        setContract(tempContract);
    }

    const setHandler = (event: any) => {
        event.preventDefault();
        console.log('sending ' + event.target.setText.value + ' to the contract');
        contract.set(event.target.setText.value);
    }

    const getCurrentVal = async () => {
        let val = await contract.get();
        setCurrentContractVal(val);
    }

    return (
        <div>
            <Button variant="contained" color="success" size="large" onClick={connectWalletHandler}>{connButtonText}</Button>
            <div>
                <h3>Address: {defaultAccount}</h3>
            </div>
            {/*<form onSubmit={setHandler}>*/}
            {/*    <input id="setText" type="text"/>*/}
            {/*    <button type={"submit"}> Update Contract </button>*/}
            {/*</form>*/}
            {/*<div>*/}
            {/*    <button onClick={getCurrentVal} style={{marginTop: '5em'}}> Get Current Contract Value </button>*/}
            {/*</div>*/}
            {currentContractVal}
            {errorMessage}
        </div>
    );
}

export default Dapp