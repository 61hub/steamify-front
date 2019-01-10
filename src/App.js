import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: []
    };
}

  componentDidMount() {
    axios.get(`http://157.230.56.14:3000/api/v1/games`)
      .then(response => response.data ? this.setState({games: response.data}) : null);
  }

  render() {
    return (
     <div className="container">
       <div className="overlay">
        <table>
          <thead>
          <tr>
            <th colSpan='3'>Game's name</th>
            <th>Game play duration</th>
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
                <td className="gameDuration">{el.playtimeForeverReadable}</td>
              </tr> )}
          </tbody>
        </table>
       </div>
     </div>

    );
  }
}

export default App;

