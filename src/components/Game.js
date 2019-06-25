import React, {Component} from "react"
import {countPriceHour, formatPlaytime, getTotalPrice} from "../helpers"
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
    if (event.keyCode === 13) {
      this.props.saveData(appid, this.state.value);
    } else {
      this.setState({value: event.target.value});
    }
  };

  handleDlc = (event, appid) => {
    if (event.keyCode === 13) {
      this.props.saveDataDlc(appid, this.dlcNameRef.current.value, this.dlcPriceRef.current.value)
    }
  };

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
  };

  patchSubmitedData = (appId, e) => {
    e.preventDefault();
    const stringAppid = appId.toString();
    const packId = this.selectRef.current.options[this.selectRef.current.selectedIndex].value;
    const foundPack = this.props.packages.find((el) => el.packId == packId);

    axios.patch(`http://steamify-api.61hub.com/v1/packs/${packId}`, {items: [...foundPack.items, appId]})
      .then(() => {
        this.props.onAddedToPack();
        this.hideGame(appId);
      })
  };


  render() {
    const {data} = this.props;

    return (
      <>
        <div className={`gameWrapper ${this.state.hidden ? "hidden" : ""}`}>
          <div className="gameIcon">
            <img src={data.logo}/>
          </div>

          <div className='gameInformation'>
            <div className="gameName" onClick={e => this.openDlc(e)}>{data.name}</div>
            <div className="gameMinorInfo">
              <div className={`gameHourPrice ${this.definePriceHourClassName(data)}`}></div>
              <div className='gameIndex'>#{this.props.index + 1}</div>
              <div className='gameTotalPrice'>{data.totalPrice}P</div>
            </div>
          </div>


          <div className="gameDuration">{formatPlaytime(data.playtimeForever)}</div>
        </div>


        <div className={`${this.state.dlcClassName} options`}>
          <div>
            <input className="priceInput" defaultValue={data.price} type="number"
                   onKeyUp={(event) => this.handleInputSubmit(event, data.appId, data.playtimeForever)}/>
          </div>
          <div className="hideButton">
            <button onClick={() => this.hideGame(data.appId)}>Hide</button>
          </div>
          <div className="dropDownPacks">
            {data.type !== 'pack' &&
              <form onSubmit={e => this.patchSubmitedData(data.appId, e)}>
                <select ref={this.selectRef}>
                  {this.props.packages && this.props.packages.map(pack => <option value={pack.packId}>{pack.name}</option>)}
                </select>
                <button>Package</button>
              </form>
            }
          </div>
        </div>

        <div className={this.state.dlcClassName}>
          {
            data.type === 'pack' ?
              <div className='packWrapper'>
                {data.games.map((game) => <div>
                  <div>{game.name}</div>
                  <div>{formatPlaytime(game.playtimeForever)}</div>
                </div>)}
              </div>
              :
              <>
                {data.dlc && data.dlc.map(el => <div className='dlc'>
                  <div className='dlcName'>{el.name}</div>
                  <div>{el.price}</div>
                </div>)}
                <div>
                  <input className="dlcInput" placeholder="DLC name" type="text"
                         onKeyUp={(event) => this.handleDlc(event, data.appId)} ref={this.dlcNameRef}/>
                </div>

                <div>
                  <input className="dlcInput" placeholder="DLC price" type="text"
                         onKeyUp={(event) => this.handleDlc(event, data.appId)} ref={this.dlcPriceRef}/>
                </div>
              </>
          }
        </div>

      </>
    )
  }
}

export default Game
