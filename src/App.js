import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Game from "./Game"
import {countPriceHour} from "./helpers"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      serverStatus: "",
      gamePriceStatus: "",
      sortedBy: ""
    };
  }

  componentDidMount() {
    axios.get(`http://157.230.56.14:3000/api/v1/games`)
      .then(response => response.data ? this.setState({games: response.data}) : null);
  }


  saveData = (appid, value) => {
    console.log(this.inputRef);
    this.setState({serverStatus: "loading"});
    axios.patch(`http://157.230.56.14:3000/api/v1/games/${appid}`, {price: value})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));
    const clonedGames = [...this.state.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);
    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.price = value;
    clonedGames[indexElToUpdatePrice] = updated;
    this.setState({games: clonedGames});
  }
  handleSortClick = (type) => {
    console.log(type);
    this.setState({sortedBy: type})
  };

  render() {
    return (
      <div className="container">
        <div className="overlay">
          <div className={`loadingState ${this.state.serverStatus}`}></div>
          <div>
            Sort by:
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("price")}/>Price</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("playtimeForever")}/>Hours</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("pricePerHour")}/>Price per hour
            </div>
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
            {this.state.games.sort((a, b) => {

              if (this.state.sortedBy == "playtimeForever") {

                return b[this.state.sortedBy] - a[this.state.sortedBy]
              } else if (this.state.sortedBy == "price") {
                if (isNaN(parseInt(b.price))) {
                  return -1
                }
                console.log(b[this.state.sortedBy] - a[this.state.sortedBy]);
                return b[this.state.sortedBy] - a[this.state.sortedBy]
              } else {
                if (isNaN(parseInt(b.price))) {
                  return -1
                }
                return countPriceHour(a) - countPriceHour(b)
              }
            })
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

