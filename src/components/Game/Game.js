import React, {Component} from "react"
import {countPriceHour, formatPlaytime, getTotalPrice} from "../../helpers"
import axios from 'axios'
import styles from './Game.module.scss'
import classNames from 'classnames'
import * as _ from 'lodash'
import { Field, Form } from "react-final-form";

class Game extends Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
    this.state = {
      value: "",
      hidden: props.data.hidden,
      isExpanded: false
    }
  }

  handleInputSubmit = (event, appid) => {
    if (event.keyCode === 13) {
      this.props.saveData(appid, this.state.value);
    } else {
      this.setState({value: event.target.value});
    }
  };

  definePriceHourClassName = (el) => {
    let priceHour = countPriceHour(el);
    if (priceHour <= 10) {
      return "darkGreen"
    } else if (priceHour <= 50) {
      return "green"
    } else if (priceHour <= 100) {
      return "yellow"
    } else if (priceHour <= 200) {
      return "orange"
    } else if (priceHour >= 200) {
      return "red"
    }
  };

  hideGame = (appId) => {
    this.setState({gameClassName: "hide", hidden: true}, () => {
      axios.patch(`http://steamify-api.61hub.com/v1/games/${appId}`, {hidden: this.state.hidden});
    });
  };

  toggleOptions = () => {
    this.setState({isExpanded: !this.state.isExpanded})
  };

  patchSubmitedData = (appId, e) => {
    e.preventDefault();
    const stringAppid = appId.toString();
    const packId = this.selectRef.current.options[this.selectRef.current.selectedIndex].value;
    const foundPack = this.props.packages.find((el) => el.packId == packId);

    axios.patch(`http://steamify-api.61hub.com/v1/packs/${packId}`, {items: [...foundPack.items, appId]})
      .then(() => {
        this.props.onAddedToPack();
        this.hideGame(appId);
      })
  };

  renderOptions = () => {
    const { data } = this.props;

    return (
      <div className={styles.options}>
        <div>
          Item price:
          <input className="priceInput" defaultValue={data.price} type="number"
                 onKeyUp={(event) => this.handleInputSubmit(event, data.appId, data.playtimeForever)}/>
        </div>
        <div className="hideButton">
          <button onClick={() => this.hideGame(data.appId)}>Hide</button>
        </div>
        <div className="dropDownPacks">
          {data.type !== 'pack' &&
          <form onSubmit={e => this.patchSubmitedData(data.appId, e)}>
            <select ref={this.selectRef}>
              {this.props.packages && this.props.packages.map(pack => <option value={pack.packId}>{pack.name}</option>)}
            </select>
            <button>Package</button>
          </form>
          }
        </div>
      </div>
    )
  };

  render() {
    const { data } = this.props;
    const { hidden } = this.state;
    const isPack = data.type === 'pack';
    const items = isPack ? data.games : data.dlc;

    return (
      <div>
        <div className={classNames(styles.gameWrapper, { [styles.hidden]: hidden })}>
          <div className={styles.gameIcon}>
            <img src={data.logo} alt="Image logo" />
          </div>

          <div className='gameInformation'>
            <div className="gameName" onClick={this.toggleOptions}>{data.name}</div>
            <div className="gameMinorInfo">
              <div className={`gameHourPrice ${this.definePriceHourClassName(data)}`} />
              <div className='gameIndex'>#{this.props.index + 1}</div>
              <div className='gameTotalPrice'>{data.totalPrice}P</div>
            </div>
          </div>

          <div className="gameDuration">{formatPlaytime(data.playtimeForever)}</div>
        </div>

        <div className={classNames(styles.details, { [styles.expanded]: this.state.isExpanded })}>
          { this.renderOptions() }

          <div className={styles.items}>
            <h3>{isPack ? "Items in pack:" : "DLCs list:"}</h3>
            {!_.isEmpty(items) && items.map(el => (
              <div className={styles.item}>
                {el.name && <div>{el.name}</div>}
                {isPack ?
                  <div>{formatPlaytime(el.playtimeForever)}</div>
                  :
                  <div>{el.price}</div>
                }
              </div>
          ))}

            {!isPack &&
              <div className={styles.addDlcWrapper}>
                <h3>Add DLC</h3>

                <Form
                  onSubmit={(...props) => this.props.onAddDlcFormSubmit(data.appId, ...props)}
                  render={({ handleSubmit, reset }) => (
                    // TODO reset doesn't work
                    <form onSubmit={(...rest) => handleSubmit(...rest).then(reset)}>
                      <Field name="dlcName" component="input" type="text" placeholder="DLC name"/>
                      <Field name="dlcPrice" component="input" type="number" placeholder="DLC price"/>
                      <button type="submit">Сохранить</button>
                    </form>
                  )}
                />
              </div>
            }
          </div>
        </div>
      </div>
    )
  }
}

export default Game
