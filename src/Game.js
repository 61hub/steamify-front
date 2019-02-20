import React, {Component} from "react"
import {countPriceHour} from "./helpers"
import axios from 'axios'


class Game extends Component {
  constructor(props) {
    super(props);
    this.dlcNameRef = React.createRef();
    this.dlcPriceRef = React.createRef();
    this.selectRef = React.createRef();
    this.state = {
      value: "",
      hidden: props.data.hidden,
      dlcClassName: "dlcWrapperHidden"

    }
  }

  handleInputSubmit = (event, appid) => {
    if (event.keyCode == 13) {
      this.props.saveData(appid, this.state.value);
    }
    else {
      this.setState({value: event.target.value});
    }
  };
  handleDlc = (event, appid) => {
    if (event.keyCode == 13) {
      this.props.saveDataDlc(appid, this.dlcNameRef.current.value, this.dlcPriceRef.current.value)
      // console.log(this.dlcNameRef.current.value)
    }
  }

  definePriceHourClassName = (el) => {
    let priceHour = countPriceHour(el);
    // console.log(priceHour);
    if (priceHour <= 10) {
      return "darkGreen"
    } else if (priceHour <= 50) {
      return "green"
    } else if (priceHour <= 100) {
      return "yellow"
    } else if (priceHour <= 200) {
      return "orange"
    } else if (priceHour >= 200) {
      return "red"
    }
  };

  hideGame = (appId) => {
    // console.log(appId);
    this.setState({gameClassName: "hide", hidden: true}, () => {
      axios.patch(`http://steamify-api.61hub.com/v1/games/${appId}`, {hidden: this.state.hidden});
    });

  };
  openDlc = (e) => {
    if (this.state.dlcClassName == "dlcWrapper") {
      this.setState({dlcClassName: "dlcWrapperHidden"})
    } else {
      this.setState({dlcClassName: "dlcWrapper"})

    }
  }
  patchSubmitedData = (appId, e) => {
    e.preventDefault();
    const stringAppid = appId.toString();
    console.log(stringAppid);
    const packId = this.selectRef.current.options[this.selectRef.current.selectedIndex].value;
    const foundPack = this.props.packages.find((el) => el.packId == packId);
    axios.patch(`http://steamify-api.61hub.com/v1/packs/${packId}`, {items:[...foundPack.items, appId]});
    this.hideGame(appId);
  }


  render() {
    return(
    <>
      <div className={`gameWrapper ${this.state.hidden ? "hidden" : ""}`}>
        <div className="gameHourPriceWrapper">
          <div className={`gameHourPrice ${this.definePriceHourClassName(this.props.data)}`}></div>
        </div>
        <div>{this.props.index + 1}</div>
        <div className="gameIcon">
          <img src={this.props.data.icon}></img>
        </div>
        <div className="gameName" onClick={(e) => this.openDlc(e)}>{this.props.data.name}</div>


        <div colSpan="2"
             className="gameDuration">{this.props.data.items ? null : this.props.data.playtimeForeverReadable.replace(" days", "d").replace(" hours", "h").replace(" minutes", "m")}</div>
        <div>
          <input className="priceInput" defaultValue={this.props.data.price} type="number"
                 onKeyUp={(event) => this.handleInputSubmit(event, this.props.data.appId, this.props.data.playtimeForever)}/>
        </div>
        <div className="hideButton">
          <button onClick={() => this.hideGame(this.props.data.appId)}>Hide</button>
        </div>
        <div className="dropDownPacks">
          <form onSubmit={(e) => this.patchSubmitedData(this.props.data.appId, e)}>
            <select ref={this.selectRef}>

                {this.props.data.items ? null : this.props.packages.map((pack) => <option value={pack.packId}>{pack.name}</option>) }


            </select>
          <button>Package</button>
          </form>

        </div>
      </div>
    <div className={this.state.dlcClassName}>
      {
        this.props.data.items == undefined && this.props.data.dlc.length > 0 ?
          <div>
            {this.props.data.dlc.map((el) => <div>
              <div>{el.name}</div>
              <div>{el.price}</div>
            </div>)}
            <div><input className="dlcInput" placeholder="DLC name" type="text"
                        onKeyUp={(event) => this.handleDlc(event, this.props.data.appId)} ref={this.dlcNameRef}/>
            </div>

            <div>
              <input className="dlcInput" placeholder="DLC price" type="text"
                     onKeyUp={(event) => this.handleDlc(event, this.props.data.appId)} ref={this.dlcPriceRef}/>
            </div>
          </div>
          :
          <div>
            <div><input className="dlcInput" placeholder="DLC name" type="text"
                        onKeyUp={(event) => this.handleDlc(event, this.props.data.appId)} ref={this.dlcNameRef}/>
            </div>

            <div>
              <input className="dlcInput" placeholder="DLC price" type="text"
                     onKeyUp={(event) => this.handleDlc(event, this.props.data.appId)} ref={this.dlcPriceRef}/>
            </div>
          </div>
      }
    </div>

    </>
    )
  }
}
export default Game