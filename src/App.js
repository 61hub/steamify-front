import React, {Component} from 'react';
import axios from 'axios'
import Game from "./Game"
import {countPriceHour, getTotalPrice} from "./helpers"
import * as _ from "lodash"
import {connect} from "react-redux"
import {fetchGames, fetchGamesAction, fetchPacks} from "./store";
import {Drawer, Position, Classes, Button, RadioGroup, Radio} from '@blueprintjs/core';
import "../node_modules/normalize.css/normalize.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import './App.css';
import {Stats} from "./Stats";

class App extends Component {
  constructor(props) {
    super(props);
    this.formInputNameRef = React.createRef();
    this.formInputPriceRef = React.createRef();

    this.state = {
      serverStatus: "",
      sortedBy: "playtimeForever",
      sortOrder: "desc",
      isSettingsOpen: false,
      isStatsOpen: false
    };
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.props.fetchGames();
    await this.props.fetchPacks();
  };

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

    this.props.dispatchGamesToStore(clonedGames);
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
    const {games, packs} = this.props;

    return (
      <div className="container">
        <div className="controls">
          <Button className="bp3-minimal" onClick={() => this.setState({isSettingsOpen: true})}
                  icon="settings"/>
          <Button className="bp3-minimal" onClick={() => this.setState({isStatsOpen: true})}
                  icon="grouped-bar-chart"/>
          <Button className='bp3-minimal' onClick={this.fetchData} icon="refresh"/>
        </div>

        <Drawer
          isOpen={this.state.isSettingsOpen}
          onClose={() => this.setState({isSettingsOpen: false})}
          autoFocus={true}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          enforceFocus={true}
          hasBackdrop={true}
          position={Position.RIGHT}
          usePortal={true}
          size={Drawer.SIZE_SMALL}
        >
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <div className={`loadingState ${this.state.serverStatus}`}/>

              <RadioGroup
                label="Sort by:"
                onChange={e => this.setState({sortedBy: e.currentTarget.value})}
                selectedValue={this.state.sortedBy}
              >
                <Radio label="Price" value="totalPrice"/>
                <Radio label="Hours" value="playtimeForever"/>
                <Radio label="Price per hour" value="pricePerHour"/>
              </RadioGroup>

              <RadioGroup
                label="Order:"
                onChange={e => this.setState({sortOrder: e.currentTarget.value})}
                selectedValue={this.state.sortOrder}
              >
                <Radio label="Asc" value="asc"/>
                <Radio label="Desc" value="desc"/>
              </RadioGroup>
              <form onSubmit={this.addPack}>
                <input type="text" placeholder="Package name" ref={this.formInputNameRef}/>
                <input type="number" placeholder="Package price" ref={this.formInputPriceRef}/>
                <button>Сохранить</button>
              </form>

            </div>
          </div>
        </Drawer>

        <Drawer
          isOpen={this.state.isStatsOpen}
          onClose={() => this.setState({isStatsOpen: false})}
          autoFocus={true}
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          enforceFocus={true}
          hasBackdrop={true}
          position={Position.RIGHT}
          usePortal={true}
          size={Drawer.SIZE_LARGE}
        >
          <div className={Classes.DRAWER_BODY}>
            <div className={Classes.DIALOG_BODY}>
              <Stats games={[...this.props.games]} packs={[...this.props.packs]} />
            </div>
          </div>
        </Drawer>

        <div className="mainWrapper">

          {_.orderBy([...packs, ...games], [this.state.sortedBy, "playtimeForever"], [this.state.sortOrder])
            .filter(el => !el.hidden)
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

    );
  }
}

export default connect(
  (state) => ({
    games: state.games,
    packs: state.packs
  }),
  (dispatch) => {
    return {
      fetchGames() {
        return dispatch(fetchGames())
      },

      fetchPacks() {
        return dispatch(fetchPacks())
      },

      gameUpdate(game) {
        dispatch({
          type: 'gameUpdate',
          game
        })
      },

      dispatchGamesToStore(data) {
        dispatch({
          data: data,
          type: "gamesToStore"
        })
      }
    }
  }
)(App);

