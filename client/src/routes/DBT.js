import React from 'react'

class DBT extends React.Component {
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
                  <h3>BUY DBT</h3>

                  <div>
                    <button onClick={() => this.props.addTokenToMetamask()} className="btn btn-outline-success" type="button">Add DBT to Metamask</button>
                  </div>
                  <br/>
                  <p>Price Per One: {this.props.price} ETH</p>
                  <p>Input amount</p>
                  <input value={this.state.amount} onChange={this.changeAmount} type="number" min="1" max="100000" required/><br/>
                  <br/>
                  <button onClick={() => this.props.buy(this.state.amount)} className="btn btn-success" type="button">BUY</button>
                </div>
            )
    }
}

export default DBT;
