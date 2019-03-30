import React, {Component} from 'react';
import './App.css';
import axios from 'axios'
import Game from "./Game"
import {countPriceHour, getTotalPrice} from "./helpers"
import * as _ from "lodash"
import {connect} from "react-redux"

class App extends Component {
  constructor(props) {
    super(props);
    this.formInputNameRef = React.createRef();
    this.formInputPriceRef = React.createRef();

    this.state = {
      games: [],
      serverStatus: "",
      gamePriceStatus: "",
      sortedBy: "playtimeForever",
      sortOrder: "desc",
      packs: [],
    };
  }

  fetchGamesData = () => {
    axios.get(`http://steamify-api.61hub.com/v1/games`)
      .then(response => {
        const mappedData = response.data.map((el) => {
          if (isNaN(parseInt(el.price))) {
            el.price = 0
          } else {
            el.price = parseInt(el.price)
          }
          const pricePerHour = countPriceHour(el);
          el.pricePerHour = pricePerHour;
          return el
        })
        this.fetchPacksData(mappedData)
      })
  };

  fetchPacksData = (gamesData) => {
    axios.get(`http://steamify-api.61hub.com/v1/packs`)
      .then(response => {
        response.data.forEach((pack) => {
          pack.games = [];
          pack.type = 'pack';
          pack.items.forEach((id) => {
            const foundGame = gamesData.find((el) => {
              return el.appId === parseInt(id)
            });
            pack.games.push(foundGame);
          });

          pack.playtimeForever = 0;
          if (pack.games && pack.games.length) {
            pack.games.forEach(g => pack.playtimeForever += g.playtimeForever);
          }
        });

        this.props.dataFetched([...response.data, ...gamesData]);
      })
  };

  componentDidMount() {
    this.fetchGamesData();
  }

  saveData = (appId, price) => {
    this.setState({serverStatus: "loading"});
    price = parseInt(price);
    axios.patch(`http://steamify-api.61hub.com/v1/games/${appId}`, {price})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));

    this.props.gameUpdate({appId, price});
  };

  saveDataDlc = (appid, nameValue, priceValue) => {
    const clonedGames = [...this.props.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);

    this.setState({serverStatus: "loading"});
    axios.patch(`http://steamify-api.61hub.com/v1/games/${appid}`, {
      dlc: [...elementToUpdatePrice.dlc, {
        name: nameValue,
        price: priceValue
      }]
    })
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response => this.setState({serverStatus: "error"}));


    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.dlc = [...updated.dlc, {name: nameValue, price: priceValue}];
    clonedGames[indexElToUpdatePrice] = updated;
    // console.log(clonedGames[indexElToUpdatePrice]);

    this.props.dispatchGamesToStore(clonedGames);
  };

  handleSortClick = (type) => {
    // console.log(type);
    this.setState({sortedBy: type})
  };

  handleSortOrder = (type) => {
    this.setState({sortOrder: type})
  };

  handleRefreshButton = () => {
    this.fetchGamesData();
  };

  addPack = (e) => {
    e.preventDefault();
    const inputName = this.formInputNameRef.current.value;
    const inputPrice = this.formInputPriceRef.current.value;
    axios.post(`http://steamify-api.61hub.com/v1/packs`, {name: inputName, price: inputPrice})
  };

  render() {
    let price = 0;
    let playtimeForever = 0;
    this.props.games.forEach((el) => {
      if (!el.hidden) {
        price = price + getTotalPrice(el);
        playtimeForever = playtimeForever + el.playtimeForever;
      }
    });
    return (
      <div className="container">
        <div className="overlay">
          <div className={`loadingState ${this.state.serverStatus}`}></div>
          <div className="menu">
            Sort by:
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("price")}/>Price</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("playtimeForever")}/>Hours</div>
            <div><input type="radio" name="sort" onChange={() => this.handleSortClick("pricePerHour")}/>Price per hour
            </div>
            <div><input type="radio" name="order" onChange={() => this.handleSortOrder("asc")}/>Asc</div>
            <div><input type="radio" name="order" onChange={() => this.handleSortOrder("desc")}/>Desc</div>
            <div>{`Total price: ${price}P`}</div>
            <div>{`Total playtime: ${Math.round(playtimeForever / 60)}hrs`}</div>
            <div onClick={this.handleRefreshButton}>
              <button>Refresh</button>
            </div>
          </div>
          <div className="packageWrapper">
            <form onSubmit={this.addPack}>
              <input type="text" placeholder="Package name" ref={this.formInputNameRef}/>
              <input type="number" placeholder="Package price" ref={this.formInputPriceRef}/>
              <button>Сохранить</button>
            </form>
          </div>

          <div className="mainWrapper">

            {_.orderBy(this.props.games, [this.state.sortedBy, "playtimeForever"], [this.state.sortOrder])
              .filter((el) => el.hidden != true)
              .map((el, index) =>
                <Game
                  key={el.appId}
                  data={el}
                  index={index}
                  saveData={this.saveData}
                  saveDataDlc={this.saveDataDlc}
                  packages={this.props.games.filter((el) => el.items)}
                  packId={this.state.packId}
                  onAddedToPack={this.fetchGamesData}
                />
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
      dataFetched (data) {
        dispatch({
          type: 'dataFetched',
          data
        })
      },

      gameUpdate (game) {
        dispatch({
          type: 'gameUpdate',
          game
        })
      },

      dispatchGamesToStore (data) {
        dispatch({
          data: data,
          type: "gamesToStore"
        })
      },
      dispatchPacksToStore (packs) {
        dispatch({
          packs: packs,
          type: "packsToStore"
        })
      },
      dispatchNewItems (items, packId) {
        dispatch({
          packId: packId,
          item: items,
          type: "newItem"
        })
      }
    }
  }
)(App);

