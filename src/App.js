import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Game from "./Game"
import {countPriceHour} from "./helpers"
import * as _ from "lodash"
import {connect} from "react-redux"

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      games: [],
      serverStatus: "",
      gamePriceStatus: "",
      sortedBy: "pricePerHour",
      sortOrder: "desc",
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
        }).filter((el) => el.hidden == false )
        this.props.dispatchGamesToStore(mappedData);

      })
  }

  saveData = (appid, value) => {
    this.setState({serverStatus: "loading"});
    axios.patch(`http://steamify-api.61hub.com/v1/games/${appid}`, {price: parseInt(value)})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));
    const clonedGames = [...this.props.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);
    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.price = parseInt(value);
    clonedGames[indexElToUpdatePrice] = updated;
    this.props.dispatchGamesToStore(clonedGames);
  };
  saveDataDlc = (appid, nameValue, priceValue) => {
    const clonedGames = [...this.props.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);

    this.setState({serverStatus: "loading"});
    axios.patch(`http://steamify-api.61hub.com/v1/games/${appid}`, {dlc: [...elementToUpdatePrice.dlc, {name:nameValue, price:priceValue}]})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));


    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.dlc = [...updated.dlc, {name: nameValue, price: priceValue}];
    clonedGames[indexElToUpdatePrice] = updated;
    console.log(clonedGames[indexElToUpdatePrice]);

    this.props.dispatchGamesToStore(clonedGames);
  };
  handleSortClick = (type) => {
    console.log(type);
    this.setState({sortedBy: type})
  };
  handleSortOrder = (type) => {
    this.setState({sortOrder: type})
  };
  render() {

    let price = 0;
    let playtimeForever = 0;
     this.props.games.forEach((el) => {
      price = price + el.price;
      playtimeForever = playtimeForever + el.playtimeForever;

    });
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
          <div>{`Total price: ${price}`}</div>
          <div>{`Total playtime: ${Math.round(playtimeForever / 60 / 24)}`}</div>
          <div className="mainWrapper">

          <div>
              <div>Game's name</div>
              <div>Game play duration</div>
              <div>Price</div>
            </div>


            {_.orderBy(this.props.games, [this.state.sortedBy, "playtimeForever"], [this.state.sortOrder])
              .map((el, index) =>
                <Game key={el.appId} data={el} index={index} saveData={this.saveData} saveDataDlc={this.saveDataDlc}/>
              )}
          </div>
        </div>
      </div>

    );
  }
}

export default connect(
  (state) => ({
    games: state.games
  }),
  (dispatch) => {
    return {
    dispatchGamesToStore (data) {
      dispatch({
        data: data,
        type: "gamesToStore"
      })
    }
    }
  }
)(App);

