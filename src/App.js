import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Game from "./Game"
import {countPriceHour} from "./helpers"
import * as _ from "lodash"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      serverStatus: "",
      gamePriceStatus: "",
      sortedBy: "pricePerHour",
      sortOrder: "asc"
    };
  }

  componentDidMount() {
    axios.get(`http://steamify-api.61hub.com/v1/games`)
      .then(response => {
        const mappedData = response.data.map((el) => {
          if (isNaN(parseInt(el.price))) {
            el.price = 0
          } else {
            el.price = parseInt(el.price)
          }
          const pricePerHour = countPriceHour(el);
          el.pricePerHour = pricePerHour
          return el
        })
        this.setState({games: mappedData})})
  }

  saveData = (appid, value) => {
    this.setState({serverStatus: "loading"});
    axios.patch(`http://steamify-api.61hub.com/v1/games/${appid}`, {price: parseInt(value)})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));
    const clonedGames = [...this.state.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);
    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.price = parseInt(value);
    clonedGames[indexElToUpdatePrice] = updated;
    this.setState({games: clonedGames});
  }
  handleSortClick = (type) => {
    console.log(type);
    this.setState({sortedBy: type})
  };
  handleSortOrder = (type) => {
    this.setState({sortOrder: type})
  }
  render() {
    return (
      <div className="container">
        <div className="overlay">
          <div className={`loadingState ${this.state.serverStatus}`}></div>
          <div>
            Sort by:
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("price")}/>Price</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("playtimeForever")}/>Hours</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("pricePerHour")}/>Price per hour</div>
            <div><input type="radio" name="order" onChange={() => this.handleSortOrder("asc")}/>Asc</div>
            <div><input type="radio" name="order" onChange={() => this.handleSortOrder("desc")}/>Desc</div>
          </div>
          <table>
            <thead>
            <tr>
              <th colSpan='3'>Game's name</th>
              <th colSpan="2">Game play duration</th>
              <th colSpan='1'>Price</th>
            </tr>
            </thead>
            <tbody>
            {_.orderBy(this.state.games, [this.state.sortedBy, "playtimeForever"], [this.state.sortOrder])
              .map((el, index) =>
                <Game key={el.appId} data={el} index={index} saveData={this.saveData}/>
              )}
            </tbody>
          </table>
        </div>
      </div>

    );
  }
}

export default App;

