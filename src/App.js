import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: [],
      value: "",
      serverStatus: "",
      gamePriceStatus: ""
    };
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
}

  componentDidMount() {
    axios.get(`http://157.230.56.14:3000/api/v1/games`)
      .then(response =>  response.data ? this.setState({games: response.data}) : null);
  }
  handleInputSubmit(event, appid) {
    if(event.keyCode == 13) {
      this.saveData(appid);
    } else {
      const clonedGames = [...this.state.games];
      const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);
      const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
      const updated = {...elementToUpdatePrice};
      updated.price = event.target.value;
      clonedGames[indexElToUpdatePrice] = updated;
      this.setState({games: clonedGames});
      this.setState({value: event.target.value});
    }
  }
  countPriceHour = (el) => {
    let playTimeInHours = el.playtimeForever /60;
    console.log(playTimeInHours);
    let priceHour = Number(el.price /playTimeInHours).toFixed(1);
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
  saveData(appid) {
    this.setState({serverStatus: "loading"});
    axios.patch(`http://157.230.56.14:3000/api/v1/games/${appid}`, {price: this.state.value})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response =>  this.setState({serverStatus: "error"}));
  }

  render() {
    return (
     <div className="container">
       <div className="overlay">
         <div className={`loadingState ${this.state.serverStatus}`}></div>
        <table>
          <thead>
          <tr>
            <th colSpan='3'>Game's name</th>
            <th colSpan="2">Game play duration</th>
            <th colSpan='1'>Price</th>
          </tr>
          </thead>
          <tbody>
            {this.state.games.sort((a,b) => (b.playtimeForever - a.playtimeForever)).map((el, index) =>
              <tr>
                <td className="gameHourPriceWrapper"><div className={`gameHourPrice ${this.countPriceHour(el)}`}></div></td>
                <td>{index + 1}</td>
               <td>
                 <img src={el.icon}></img>
               </td>
                <td>{el.name}</td>
                <td colSpan="2" className="gameDuration">{el.playtimeForeverReadable}</td>
                 <td>
                   <input className="priceInput" defaultValue={el.price} type="text" onBlur={() => this.saveData(el.appId)} onKeyUp={(event) => this.handleInputSubmit(event, el.appId, el.playtimeForever)}/>
                 </td>
                <td></td>
              </tr> )}
          </tbody>
        </table>
       </div>
     </div>

    );
  }
}

export default App;

