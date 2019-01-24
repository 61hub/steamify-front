import React, {Component} from "react"
import {countPriceHour} from "./helpers"
import axios from 'axios'


class Game extends Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "",
      hidden: props.data.hidden
    }
  }

  handleInputSubmit = (event, appid) => {
    if(event.keyCode == 13) {
      this.props.saveData(appid, this.state.value);
    }
    else {
      this.setState({value: event.target.value});
    }
  };

  definePriceHourClassName = (el) => {
    let priceHour = countPriceHour(el);
    if(priceHour <= 10) {
      return "darkGreen"
    } else if(priceHour <=50) {
      return "green"
    } else if(priceHour <= 100) {
      return "yellow"
    } else if(priceHour <= 200) {
      return "orange"
    } else if(priceHour >= 200 ) {
      return "red"
    }
  };

  hideGame = (appId) => {
    console.log(appId);
    this.setState({gameClassName: "hide", hidden: true}, () => {
      axios.patch(`http://steamify-api.61hub.com/v1/games/${appId}`, {hidden: this.state.hidden});
    });

  };
  render() {
    return (
      <tr className={`gameWrapper ${this.state.hidden ? "hidden" : ""}`}>
        <td className="gameHourPriceWrapper">
          <div className={`gameHourPrice ${this.definePriceHourClassName(this.props.data)}`}></div>
        </td>
        <td>{this.props.index + 1}</td>
        <td>
          <img src={this.props.data.icon}></img>
        </td>
        <td>{this.props.data.name}</td>
        <td colSpan="2" className="gameDuration">{this.props.data.playtimeForeverReadable.replace(" days","d").replace(" hours", "h").replace(" minutes", "m")}</td>
        <td>
          <input className="priceInput" defaultValue={this.props.data.price} type="number" 
                 onKeyUp={(event) => this.handleInputSubmit(event, this.props.data.appId, this.props.data.playtimeForever)}/>
        </td>
        <td>
          <button onClick={() => this.hideGame(this.props.data.appId)}>Hide</button>
        </td>
      </tr>
    )
  }
}
export default Game