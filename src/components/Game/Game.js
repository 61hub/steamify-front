import React, {Component} from "react"
import {countPriceHour, formatPlaytime, getTotalPrice} from "../../helpers"
import axios from 'axios'
import styles from './Game.module.scss'
import classNames from 'classnames'
import * as _ from 'lodash'
import { Field, Form } from "react-final-form";
import { Icon, Switch } from "@blueprintjs/core";
import completed from './completed.svg'
import SVG from 'react-inlinesvg';

class Game extends Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
    this.state = {
      isExpanded: false,
      completed: props.data.completed,
      endless: props.data.endless,
    }
  }

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

  hide = () => {
    const appId = this.props.data.appId
    this.props.onChange(appId, {hidden: true})
  };

  toggleOptions = () => {
    this.setState({isExpanded: !this.state.isExpanded})
  };

  patchSubmitedData = (appId, e) => {
    e.preventDefault();
    const stringAppid = appId.toString();
    const packId = this.selectRef.current.options[this.selectRef.current.selectedIndex].value;
    const foundPack = this.props.packages.find((el) => el.packId === packId);

    axios.patch(`http://steamify-api.61hub.com/v1/packs/${packId}`, {items: [...foundPack.items, appId]})
      .then(() => {
        this.props.onAddedToPack();
        this.hide();
      })
  };

  onSwitchToggle = key => {
    this.setState({ [key]: !this.state[key]}, () => {
      this.props.onChange(this.props.data.appId, { [key]: this.state[key] })
    })
  }

  renderOptions = () => {
    const { data } = this.props;

    return (
      <div className={styles.options}>
        <div>
          Item price:
          <Form
            onSubmit={(...props) => this.props.onPriceChange(data.appId, ...props)}
            render={({ handleSubmit }) => (
              <form onSubmit={handleSubmit}>
                <Field
                  name="price"
                  initialValue={data.price}
                  component="input"
                  type="text"
                  placeholder="DLC name"
                  // TODO format doesn't work
                  format={value => parseInt(value, 10)}
                />
                <button type="submit">Сохранить</button>
              </form>
            )}
          />
        </div>
        <div className="hideButton">
          <button onClick={this.hide}>Hide</button>
        </div>

        <div>
          <Switch checked={this.state.completed} label="Completed" onChange={() => this.onSwitchToggle('completed')} />
          <Switch checked={this.state.endless} label="Endless" onChange={() => this.onSwitchToggle('endless')} />
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
      /*<div className={classNames({ [styles.completed]: data.completed })}>*/
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
              <div>{data.totalPrice}P</div>
            </div>
          </div>

          <div className={styles.icons}>
            {data.completed && <span>✅</span> }
            {data.endless && <span className={styles.infiniteIcon}>∞</span>}
            {!data.completed && !data.endless && <span>⚠️</span>}
          </div>
          <div className={styles.gameDuration}>
            {formatPlaytime(data.playtimeForever)}
          </div>
        </div>

        <div className={classNames(styles.details, { [styles.expanded]: this.state.isExpanded })}>
          { this.renderOptions() }

          <div className={styles.items}>
            {!_.isEmpty(items) &&
              <>
                <h3>{isPack ? "Items in pack:" : "DLCs list:"}</h3>
                {items.map(el => (
                  <div className={styles.item}>
                  {el.name && <div>{el.name}</div>}
                  {isPack ?
                    <div>{formatPlaytime(el.playtimeForever)}</div>
                    :
                    <div>{el.price}</div>
                  }
                  </div>
                  ))
                }
              </>
            }

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
