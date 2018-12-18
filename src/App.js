import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: []
    }
}


  render() {
    const key = "2D7A611545098E1FC165D53E16F03065";
    const id = "76561198080321262";
    axios.get(`http://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${key}&steamid=${id}&format=json`)
      .then(response =>  response.data.response.games ? this.setState({games: response.data.response.games}) : null );
    return (
     <div>
        <table>
          <thead>
          <tr>
            <th>Game's name</th>
            <th>Game play duration</th>
          </tr>
          </thead>
          <tbody>
          <tr>
            {this.state.games.map((el) => <tr><td>{el.appid}</td><td>{Math.round(el.playtime_forever /60) }</td></tr> )}
          </tr>
          </tbody>
        </table>
     </div>

    );
  }
}

export default App;
