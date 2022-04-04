import React, { Component } from "react";
import PresaleDBTContract from "./contracts/PresaleDBT.sol/PresaleDBT.json";
import PresaleDIGContract from "./contracts/PresaleDIG.sol/PresaleDIG.json";
import Signs from "./signatures/sing.json"
import getWeb3 from "./getWeb3";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import Tabletop from 'tabletop'
// import fetch from "node-fetch";
import DIG from "./lists/DIG";
import DBT from "./lists/DBT";
import Index from "./lists/Index"

class App extends Component {
  state = {
    web3: null,
    account: null,
    contractDBT: null,
    contractDIG: null,
    amount: 0,
    priceDBT: "0.00007",
    priceDIG:"0.07"
  };

  // createMarketItem = this.createMarketItem.bind(this)

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Get the contract instance.
      // const networkId = await web3.eth.net.getId();
      // const deployedNetwork = PresaleDBTContract.networks[networkId];
      const instanceDBT = new web3.eth.Contract(
        PresaleDBTContract.abi
      );
      const instanceDIG = new web3.eth.Contract(
        PresaleDIGContract.abi
      );
      instanceDBT.options.address = "0x1613beB3B2C4f22Ee086B2b38C1476A3cE7f78E8"
      instanceDIG.options.address = "0x9E545E3C0baAB3E08CdfD552C960A1050f373042"
      // function init() {
        // Tabletop.init({
        //   key: "1ApFO_MzKw4tvXOyhbiuOYHGUCxyhmnmgXGIuV_a2E9s",
        //   simpleSheet: true
        // }).then((error, data, tabletop) => {
        //   console.log("Error", error)
        //   console.log(data, tabletop)
        // })
        // fetch("http://docs.google.com/spreadsheets/d/1ApFO_MzKw4tvXOyhbiuOYHGUCxyhmnmgXGIuV_a2E9s",{
        //   method: "GET"
        // }).then(async (res) => {
        //   console.log(await res.json())
        // })

      // }
      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      this.setState({
        account: accounts[0]
      })
      let flag = false;
      Signs.map(
        (value) => {
          if(value.address === accounts[0]) {
            flag = true
          }
        }
      )
      if (flag === false) {
        throw "error"
      }

      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts"
      // });

      this.setState({
        web3,
        contractDBT: instanceDBT,
        contractDIG: instanceDIG
      }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load site Or You not in Whitelist`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    // const web3 = await getWeb3();
    // const price = await contract.methods.getRound1Price().call()
    // console.log(price)
    // this.setState({
    //   price
    // })
    const secondsInADay = 86400;
    const startTime = (Math.trunc(Date.now()/ 1000) + secondsInADay).toString();
    // console.log(this.state.account)
    // const accounts = await window.ethereum.request({
    //   method: "eth_requestAccounts"
    // });
    // this.setState({
    //   account: accounts[0]
    // })
    // const { account, contractDIG } = this.state;
    // await contractDIG.methods.mockRound1StartTime(
    //     (parseInt(startTime) - secondsInADay * 2).toString()
    // ).send({from: account})
    // await contract.methods.mockRound1StartTime(
    //         (parseInt(startTime) - secondsInADay * 2).toString()
    //     ).send({from: account})
  };

  buyDBT = this.buyDBT.bind(this)
  buyDIG = this.buyDIG.bind(this)

  async buyDIG(amount) {
    const {account, contractDIG, priceDIG, web3} = this.state
    const priceSend = web3.utils.toWei(priceDIG)
    const value = parseInt(amount) * parseInt(priceSend)
    const r = '0x7b9344a8f89f2cdd33ff0b4fb1a0a179ac7d26c5df456d4234f61f4eff80672e'
    const s = '0x00e4cc53ce5d6e2f2d4487b115092d424ba40e0877d2a29be5625e49da4a96dc'
    const v = 27
    await contractDIG.methods.buyDIGRound1(
      v,
      r,
      s
      ).send({from: account, value})
  }

  async buyDBT(amount) {
    const {account, contractDBT, priceDBT, web3} = this.state
    const priceSend = web3.utils.toWei(priceDBT)
    const value = parseInt(amount) * parseInt(priceSend)
    const r = '0xdaba3f744ada07faadb185875b74cc9077ed383d7dc962214930f2aa70ae331e'
    const s = '0x31fc53e4da5afcbf01a0431cdbdfea46b334ec4037dffcf7f3cf2ef9c39da79d'
    const v = 28
    await contractDBT.methods.buyDBTRound1(
      v,
      r,
      s
      ).send({from: account, value})
  }

  handleAmount = this.handleAmount.bind(this)

  handleAmount(event) {
      this.setState({
          amount: event.target.value
      })
      console.log(parseInt(this.state.amount) * parseInt(this.state.priceSend))
  }

  async addDIGToMetamask() {
      const digAddress = '0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB'
      const digSymbol = 'DIG'
      const tokenDecimals = 0;
      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: digAddress, // The address that the token is at.
              symbol: digSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals // The number of decimals in the token
            },
          },
        });

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
  }

  //dig 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
  async addTokenToMetamask() {
      const tokenAddress = '0xa82fF9aFd8f496c3d6ac40E2a0F282E47488CFc9';
      const tokenSymbol = 'DBT';
      const tokenDecimals = 18;

      try {
        // wasAdded is a boolean. Like any RPC method, an error may be thrown.
        const wasAdded = await window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', // Initially only supports ERC20, but eventually more!
            options: {
              address: tokenAddress, // The address that the token is at.
              symbol: tokenSymbol, // A ticker symbol or shorthand, up to 5 chars.
              decimals: tokenDecimals // The number of decimals in the token
            },
          },
        });

        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error);
      }
  }

  addTokenToMetamask = this.addTokenToMetamask.bind(this)

  async changeAccount() {
    const { web3 } = this.state
    // Use web3 to get the user's accounts.
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts"
    });
    this.setState({
      account: accounts[0]
    })
  }

  changeAccount = this.changeAccount.bind(this)

  render() {
    if (!this.state.web3) {
      return <div>Loading...</div>;
    }
    return (
      <div className="App">
      <button onClick={() => this.changeAccount()} type="button" className="btn btn-dark">
        {this.state.account == null ? "Connect wallet" : this.state.account}
      </button>
      <br/>
      <Router>
      <div>
        <nav>
          <ul className="hr">
            <li>
              <Link to="/"><button type="button" className="btn btn-outline-primary">Index</button></Link>
            </li>
            <li>
              <Link to="/dig"><button type="button" className="btn btn-outline-primary">Digital Golems</button></Link>
            </li>
            <li>
              <Link to="/dbt"><button type="button" className="btn btn-outline-primary">Digibytes</button></Link>
            </li>
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Index changeAccount={this.changeAccount} account={this.state.account}/>}>
          </Route>
          <Route path="/dig" element={<DIG addDIGToMetamask={this.addDIGToMetamask} price={this.state.priceDIG} buy={this.buyDIG}/>}>
          </Route>
          <Route path="/dbt" element={<DBT addTokenToMetamask={this.addTokenToMetamask} price={this.state.priceDBT} buy={this.buyDBT}/>}>
          </Route>
        </Routes>
</div>
    </Router>
  </div>

    );
  }
}

export default App;
