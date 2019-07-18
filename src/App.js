import React, { Component } from 'react';
import axios from 'axios'
import Game from "./components/Game/Game"
import * as _ from "lodash"
import { connect } from "react-redux"
import { Drawer, Position, Classes, Button, RadioGroup, Radio } from '@blueprintjs/core';
import "../node_modules/normalize.css/normalize.css";
import "../node_modules/@blueprintjs/icons/lib/css/blueprint-icons.css";
import "../node_modules/@blueprintjs/core/lib/css/blueprint.css";
import './App.css';
import { Stats } from "./components/Stats";
import Settings from "./components/Settings";
import { fetchGames, gameUpdate } from "./redux/actions/games";
import { fetchPacks } from "./redux/actions/packs";
import PropTypes from 'proptypes'
import { countStatuses, getComposedGames, getComposedPacks, getTotalItems } from "./redux/selectors";

class App extends Component {
  state = {
    serverStatus: "",
    sortedBy: "playtimeForever",
    sortOrder: "desc",
    isSettingsOpen: false,
    isStatsOpen: false
  };

  componentDidMount() {
    this.fetchData();
  }

  fetchData = async () => {
    await this.props.fetchGames();
    await this.props.fetchPacks();
  };

  updateItem = (appId, updates) => {
    this.setState({ serverStatus: "loading" });

    axios.patch(`http://steamify-api.61hub.com/v1/games/${appId}`, updates)
      .then(response => {
        this.props.gameUpdate({appId, ...updates});
        this.setState({ serverStatus: "success" })
      })
      .catch(response => this.setState({ serverStatus: "error" }));
  };

  addDlc = (appid, {dlcName, dlcPrice}) => {
    const { games } = this.props;
    const gameToUpdate = games.find(element => element.appId === appid);

    this.setState({ serverStatus: "loading" });
    return axios.patch(`http://steamify-api.61hub.com/v1/games/${appid}`, {
      dlc: [...gameToUpdate.dlc, {
        name: dlcName,
        price: dlcPrice
      }]
    })
      .then(response => {
        this.props.gameUpdate(response.data);
        this.setState({ serverStatus: "success" });
      })
      .catch(response => this.setState({ serverStatus: "error" }));
  };

  addPack = ({ packName, packPrice }) => {
    axios.post(`http://steamify-api.61hub.com/v1/packs`, { name: packName, price: packPrice })
  };

  render() {
    const { games, packs, items, statuses } = this.props;

    return (
      <div className="container">
        <div className="controls">
          <Button minimal onClick={() => this.setState({ isSettingsOpen: true })}
                  icon="settings"/>

          <Button minimal onClick={() => this.setState({ isStatsOpen: true })}
                  icon="grouped-bar-chart"/>
          <Button minimal onClick={this.fetchData} icon="refresh"/>
          <div className="statuses">
            <p><span>📖</span><span>{statuses.story}</span></p>
            <p><span>✅</span><span>{statuses.completed}</span></p>
            <p><span>∞</span><span>{statuses.endless}</span></p>
            <p><span>☠️</span><span>{statuses.abandoned}</span></p>
            <p><span>🕹</span><span>{statuses.playing}</span></p>
          </div>

        </div>

        <Settings
          isOpen={this.state.isSettingsOpen}
          onClose={() => this.setState({ isSettingsOpen: false })}
          serverStatus={this.state.serverStatus}
          onSortChange={e => this.setState({ sortedBy: e.currentTarget.value })}
          sortedBy={this.state.sortedBy}
          sortOrder={this.state.sortOrder}
          onSortOrderChange={e => this.setState({ sortOrder: e.currentTarget.value })}
          addPack={this.addPack}
        />

        <Drawer
          isOpen={this.state.isStatsOpen}
          onClose={() => this.setState({ isStatsOpen: false })}
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
              <Stats games={[...this.props.games]} packs={[...this.props.packs]}/>
            </div>
          </div>
        </Drawer>

        <div className="mainWrapper">
          {_.orderBy(items, [this.state.sortedBy, "playtimeForever"], [this.state.sortOrder])
            .filter(el => el.status !== 'hidden')
            .map((el, index) =>
              <Game
                key={el.appId}
                data={el}
                index={index}
                onChange={this.updateItem}
                onAddDlcFormSubmit={this.addDlc}
                packages={this.props.packs}
                packId={this.state.packId}
                // TODO
                onAddedToPack={this.fetchData}
              />
            )}
        </div>
      </div>

    );
  }
}

App.propTypes = {
  games: PropTypes.arrayOf(PropTypes.object),
  packs: PropTypes.arrayOf(PropTypes.object),
  fetchGames: PropTypes.func.isRequired,
  fetchPacks: PropTypes.func.isRequired,
  gameUpdate: PropTypes.func.isRequired,
};

App.defaultProps = {
  games: [],
  packs: [],
};

export default connect(
  (state) => ({
    games: getComposedGames(state),
    packs: getComposedPacks(state),
    items: getTotalItems(state),
    statuses: countStatuses(state)
  }),
  { fetchGames, fetchPacks, gameUpdate }
)(App);
