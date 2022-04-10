import React, { Component } from "react";
import PresaleDBTContract from "./contracts/PresaleDBT.sol/PresaleDBT.json";
import PresaleDIGContract from "./contracts/PresaleDIG.sol/PresaleDIG.json";
import DIGcontract from "./contracts/DigitalGolems.sol/DigitalGolems.json";
import SignsDBT from "./signatures/signsDBT.json"
import SignsDIG from "./signatures/signsDIG.json"
import getWeb3 from "./getWeb3";
import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import DIG from "./routes/DIG";
import DBT from "./routes/DBT";
import Index from "./routes/Index";
import Owner from "./routes/Owner";

class App extends Component {
  state = {
    web3: null,
    account: null,
    contractDBT: null,
    contractDIG: null,
    DIG: null,
    priceDBT: "0.00007",
    priceDIG:"0.03",
    nftAmount: 0,
    dbtPresaleClose: false,
    digPresaleClose: false,
    signDBT: {},
    signDIG: {},
    isOwner: false
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
      const dig = new web3.eth.Contract(
        DIGcontract.abi
      );
      instanceDBT.options.address = "0x07882Ae1ecB7429a84f1D53048d35c4bB2056877"
      instanceDIG.options.address = "0x34B40BA116d5Dec75548a9e9A8f15411461E8c70"
      dig.options.address = "0xc96304e3c037f81dA488ed9dEa1D8F2a48278a75"

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts"
      });
      this.setState({
        account: accounts[0]
      })
      const nft = await dig.methods.balanceOf(accounts[0]).call()
      const dbtPresaleClose = await instanceDBT.methods.hasClosed().call()
      const digPresaleClose = await instanceDIG.methods.hasRound1Closed().call()
      this.setState({
        dbtPresaleClose,
        digPresaleClose
      })
      this.setState({
        nftAmount: nft
      })
      let flag = false;
      let newSign = {}
      SignsDBT.map(
        (value) => {
          if(value.address === accounts[0]) {
            flag = true
            newSign.v = value.v
            newSign.r = value.r
            newSign.s = value.s
          }
        }
      )
      let flag1 = false;
      let newSign2 = {}
      SignsDIG.map(
        (value) => {
          if(value.address === accounts[0]) {
            flag1 = true
            newSign2.v = value.v
            newSign2.r = value.r
            newSign2.s = value.s
          }
        }
      )
      if ((flag1 === false) || (flag === false)) {
        throw "error"
      }
      if (accounts[0] === '0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266') {
        this.setState({
          isOwner: true
        })
      }
      // const accounts = await window.ethereum.request({
      //   method: "eth_requestAccounts"
      // });

      this.setState({
        web3,
        contractDBT: instanceDBT,
        contractDIG: instanceDIG,
        DIG: dig,
        signDBT: newSign,
        signDIG: newSign2
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
    const { account, contractDIG, contractDBT, DIG } = this.state;

    // const price = await contractDIG.methods.getRound1Price().call()
    // console.log(price)
    // await contractDIG.methods.mockRound1StartTime(
    //     (parseInt(startTime) - secondsInADay * 2).toString()
    // ).send({from: account})
    // await contractDBT.methods.mockRound1StartTime(
    //         (parseInt(startTime) - secondsInADay * 2).toString()
    //     ).send({from: account})
  };

  buyDBT = this.buyDBT.bind(this)
  buyDIG = this.buyDIG.bind(this)

  async buyDIG(amount) {
    const {account, contractDIG, priceDIG, web3, signDIG, DIG } = this.state
    const priceSend = web3.utils.toWei(priceDIG)
    const value = parseInt(amount) * parseInt(priceSend)
    const r = signDIG.r
    const s = signDIG.s
    const v = signDIG.v
    await contractDIG.methods.buyDIGRound1(
      v,
      r,
      s
      )
      .send({from: account, value})
      .then(async () => {
        const nft = await DIG.methods.balanceOf(account).call()
        this.setState({
          nftAmount: nft
        })
      })
  }

  async buyDBT(amount) {
    const {account, contractDBT, priceDBT, web3, signDBT} = this.state
    const priceSend = web3.utils.toWei(priceDBT)
    const value = parseInt(amount) * parseInt(priceSend)
    const r = signDBT.r
    const s = signDBT.s
    const v = signDBT.v
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

  //dig 0x84eA74d481Ee0A5332c457a4d796187F6Ba67fEB
  async addTokenToMetamask() {
      const tokenAddress = '0xD0141E899a65C95a556fE2B27e5982A6DE7fDD7A'
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

  async ownerMint(address, url) {
      const { account, DIG } = this.state
      await DIG.methods.ownerMint(
        address, url
        ).send({from: account})
  }

  ownerMint = this.ownerMint.bind(this)

  async endDBTPresale() {
      const { account, contractDBT } = this.state
      await contractDBT.methods.closePresale().send({from: account})
  }

  endDBTPresale = this.endDBTPresale.bind(this)

  async endDIGPresale() {
      const { account, contractDIG } = this.state
      await contractDIG.methods.closeRound1Presale().send({ from: account })
  }

  endDIGPresale = this.endDIGPresale.bind(this)

  async withdrawDBT() {
      const { account, contractDBT } = this.state
      await contractDBT.methods.withdrawDBT().send({ from: account })
  }

  withdrawDBT = this.withdrawDBT.bind(this)

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
            <br/>
              {this.state.isOwner
                ?
                <div>
                  <li>
                    <Link to="/owner"><button type="button" className="btn btn-outline-primary">Owner Functions</button></Link>
                  </li>
                </div>
                :
                ''
              }
          </ul>
        </nav>

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Routes>
          <Route path="/" element={<Index changeAccount={this.changeAccount} account={this.state.account}/>}>
          </Route>
          <Route path="/dig" element={<DIG digPresaleClose={this.state.digPresaleClose} nftAmount={this.state.nftAmount} addDIGToMetamask={this.addDIGToMetamask} price={this.state.priceDIG} buy={this.buyDIG}/>}>
          </Route>
          <Route path="/dbt" element={<DBT dbtPresaleClose={this.state.dbtPresaleClose} addTokenToMetamask={this.addTokenToMetamask} price={this.state.priceDBT} buy={this.buyDBT}/>}>
          </Route>
          <Route path="/owner" element={
            <Owner
              ownerMint = { this.ownerMint }
              endDBTPresale = { this.endDBTPresale }
              endDIGPresale = { this.endDIGPresale }
              withdrawDBT = { this.withdrawDBT }
            />
          }>
          </Route>
        </Routes>
</div>
    </Router>
  </div>

    );
  }
}

export default App;
