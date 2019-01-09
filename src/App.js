import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: []
    };
    this.handleScroll = this.handleScroll.bind(this);
}

  handleScroll = () => {
    window.scrollTo({
      top: 1000,
      behavior: "smooth"
    })
  };

  render() {

    axios.get(`http://157.230.56.14:3000/GetOwnedGames`)
      .then(response => response.data.games ? this.setState({games: response.data.games}) : null);

    const mappedId = this.state.games.map((el) => el.appid);
    const joinedId = mappedId.join();

    // axios.get(`https://store.steampowered.com/api/appdetails/?appids=${joinedId}&cc=us&filters=price_overview`)
    //   .then(response => console.log(response) );

    return (
     <div className="container" onClick={this.handleScroll}>
       <div className="overlay">
        <table>
          <thead>
          <tr>
            <th colSpan='3'>Game's name</th>
            <th>Game play duration</th>
          </tr>
          </thead>
          <tbody>
            {this.state.games.sort((a,b) => (b.playtime_forever - a.playtime_forever)).map((el, index) =>
              <tr>
                <td>{index + 1}</td>
               <td>
                 <img src={"http://media.steampowered.com/steamcommunity/public/images/apps/"
               + el.appid + "/" + el.img_icon_url + ".jpg"}></img></td>
                <td>{el.name}</td>
                <td className="gameDuration">{Math.round(el.playtime_forever / 60)}</td>
              </tr> )}
          </tbody>
        </table>
       </div>
     </div>

    );
  }
}

export default App;

