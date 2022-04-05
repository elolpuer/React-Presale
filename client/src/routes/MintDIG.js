import React from 'react'

class MintDIG extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            url: "",
            address: ""
        }
        this.changeURL = this.changeURL.bind(this)
        this.changeAddress = this.changeAddress.bind(this)
    }

    async changeURL(event) {
        this.setState({
            url: event.target.value
        })
    }

    async changeAddress(event) {
        this.setState({
            address: event.target.value
        })
    }
    render() {
            return (
              <div>
              <br/>
                <h3>Owner Mint DIG</h3>
                <div className="input-group input-group-sm mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">Address</span>
                  </div>
                  <input value={this.state.address} onChange={this.changeAddress} type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" required/>
                </div>
                <div className="input-group input-group-sm mb-3">
                  <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-sm">URL</span>
                  </div>
                  <input value={this.state.url} onChange={this.changeURL} type="text" className="form-control" aria-label="Small" aria-describedby="inputGroup-sizing-sm" required/>
                </div>
                <button onClick={() => this.props.ownerMint(this.state.address, this.state.url)} className="btn btn-success" type="button">MINT</button>
              </div>
            )
    }
}

export default MintDIG;
