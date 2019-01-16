import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: [],
      value: "",
      className: ""
    };
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
    this.handlePriceHour = this.handlePriceHour.bind(this);
}

  componentDidMount() {
    axios.get(`http://157.230.56.14:3000/api/v1/games`)
      .then(response =>  response.data ? this.setState({games: response.data}) : null);
  }
  handleInputSubmit(event, appid) {
    console.log(event.keyCode);
    if(event.keyCode == 13) {
      this.saveData(appid);
    } else {
      this.setState({value: event.target.value});
      console.log(event.target.value)
    }
  }
  handlePriceHour(price, playtime) {
    let playTimeInHours = playtime / 60;
    let priceHour = Number(price /playTimeInHours).toFixed(1);
    if(priceHour == 0.0) {
      const roundedPrice = Math.round(priceHour);
      return roundedPrice
    }
    return priceHour
  }
  saveData(appid) {
    this.setState({className: "loading"});
    axios.patch(`http://157.230.56.14:3000/api/v1/games/${appid}`, {price: this.state.value})
      .then(response => this.setState({className: "success"}))
      .catch(response =>  this.setState({className: "error"}));
  }

  render() {
    return (
     <div className="container">
       <div className="overlay">
         <div className={`loadingState ${this.state.className}`}></div>
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
                <td>{index + 1}</td>
               <td>
                 <img src={el.icon}></img>
               </td>
                <td>{el.name}</td>
                <td colSpan="2" className="gameDuration">{el.playtimeForeverReadable}</td>
                 <td>
                   <input className="priceInput" defaultValue={el.price} type="text" onBlur={() => this.saveData(el.appId)} onKeyUp={(event) => this.handleInputSubmit(event, el.appId)}/>
                 </td>
                <td>{this.handlePriceHour(el.price, el.playtimeForever)}</td>
              </tr> )}
          </tbody>
        </table>
       </div>
     </div>

    );
  }
}

export default App;

