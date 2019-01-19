import React, { Component } from 'react';
import './App.css';
import axios from 'axios'

class App extends Component {
  constructor (props) {
    super(props);
    this.state = {
      games: [],
      value: "",
      serverStatus: "",
      gamePriceStatus: "",
      sortedBy: ""
    };
    this.handleInputSubmit = this.handleInputSubmit.bind(this);
}

  componentDidMount() {
    axios.get(`http://157.230.56.14:3000/api/v1/games`)
      .then(response =>  response.data ? this.setState({games: response.data}) : null);
  }
  handleInputSubmit(event, appid) {
    if(event.keyCode == 13) {
      this.saveData(appid);
    }
    else {
      this.setState({value: event.target.value});
    }
  }
  definePriceHourClassName = (el) => {
    let priceHour = this.countPriceHour(el);

    if(priceHour <= 10) {
      return "darkGreen"
    } else if(priceHour <=50) {
      return "green"
    } else if(priceHour <= 100) {
      return "yellow"
    } else if(priceHour <= 200) {
      return "orange"
    } else if(priceHour >= 200 ) {
      return "red"
    }
  };
   countPriceHour = (el) => {
     let priceHour;
     if(el.playtimeForever <= 60) {
       priceHour = el.price;
       return priceHour
     } else {
       let playTimeInHours = el.playtimeForever /60;
       priceHour = Number(el.price /playTimeInHours).toFixed(1);
       return priceHour
     }

  };
  saveData(appid) {
    console.log(this.inputRef);
    this.setState({serverStatus: "loading"});
    axios.patch(`http://157.230.56.14:3000/api/v1/games/${appid}`, {price: this.state.value})
      .then(response => this.setState({serverStatus: "success"}))
      .catch(response =>  this.setState({serverStatus: "error"}));
    const clonedGames = [...this.state.games];
    const elementToUpdatePrice = clonedGames.find((element) => element.appId == appid);
    const indexElToUpdatePrice = clonedGames.findIndex((element) => element.appId == appid);
    const updated = {...elementToUpdatePrice};
    updated.price = this.state.value;
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
           <div><input type="radio"  name="sort" onChange={() => this.handleSortClick("price")}/>Price</div>
           <div><input type="radio"  name="sort" onChange={() => this.handleSortClick("playtimeForever")}/>Hours</div>
           <div><input type="radio" name="sort" onChange={() => this.handleSortClick("pricePerHour")}/>Price per hour</div>
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
            {this.state.games.sort((a,b) => {

              if(this.state.sortedBy == "playtimeForever") {

                return b[this.state.sortedBy] - a[this.state.sortedBy]
              } else if(this.state.sortedBy == "price") {
                if(isNaN(parseInt(b.price))) {
                  return -1
                }
                console.log(b[this.state.sortedBy] - a[this.state.sortedBy]);
                return b[this.state.sortedBy] - a[this.state.sortedBy]
              } else {
                if(isNaN(parseInt(b.price))) {
                  return -1
                }
                return this.countPriceHour(a) -  this.countPriceHour(b)
              }
            })
              .map((el, index) =>
              <tr key={el.appId}>
                <td className="gameHourPriceWrapper"><div className={`gameHourPrice ${this.definePriceHourClassName(el)}`}></div></td>
                <td>{index + 1}</td>
               <td>
                 <img src={el.icon}></img>
               </td>
                <td>{el.name}</td>
                <td colSpan="2" className="gameDuration">{el.playtimeForeverReadable}</td>
                 <td>
                   <input className="priceInput" defaultValue={el.price} type="number" ref={this.inputRef} onBlur={() => this.saveData(el.appId)} onKeyUp={(event) => this.handleInputSubmit(event, el.appId, el.playtimeForever)}/>
                 </td>
                <td></td>
              </tr> )}
          </tbody>
        </table>
       </div>
     </div>

    );
  }
}

export default App;

