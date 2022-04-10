import React from 'react'

class DIG extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            amount: 1
        }
        this.changeAmount = this.changeAmount.bind(this)
    }

    async changeAmount(event) {
        this.setState({
            amount: event.target.value
        })
    }

    render() {
        return (
          <div>
          <br/>
            <h3>BUY DIG</h3>
            <h6>Presale is { this.props.digPresaleClose === false ? "open" : "close"}</h6>
            <div>
              Your DIG amount: {this.props.nftAmount}
            </div>
            <br/>
            <p>Price Per One: {this.props.price} ETH</p>
            <p>Input amount</p>
            <input value={this.state.amount} onChange={this.changeAmount} placeholder="MAX: 3" type="number" min="1" max="3" required/><br/>
            <br/>
            <button onClick={() => this.props.buy(this.state.amount)} className="btn btn-success" type="button">BUY</button>
          </div>
        )
    }
}

export default DIG;
