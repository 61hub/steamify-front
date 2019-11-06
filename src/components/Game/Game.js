import React, {Component} from "react"
import {formatPlaytime} from "../../helpers"
import axios from 'axios'
import styles from './Game.module.scss'
import classNames from 'classnames'
import * as _ from 'lodash'
import { Field, Form } from "react-final-form";
import { GameLogo } from "../GameLogo/GameLogo";
import { GameDetails } from "../GameDetails/GameDetails";
import { Button, FormGroup, HTMLSelect, NumericInput } from "@blueprintjs/core";

const CustomField = ({ label, placeholder, helperText = '', input, ...rest}) => (
  <FormGroup
    helperText={helperText}
    label={label}
    labelFor={`field-${label}`}
  >
    <NumericInput
      id={`field-${label}`}
      placeholder={placeholder || label}
      onValueChange={input.onChange}
      {...input}
      {...rest}
    />
  </FormGroup>
)

const CustomSelect = ({input, options, ...rest}) => (
  <FormGroup
    label="Game Status"
    labelFor="field-status"
  >
    <HTMLSelect options={options} id="field-status" {...input} />
  </FormGroup>
)

class Game extends Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
    this.state = {
      isExpanded: false,
    }
  }

  toggleOptions = () => {
    this.setState({isExpanded: !this.state.isExpanded})
  };

  addToPack = (appId, e) => {
    e.preventDefault();
    const packId = this.selectRef.current.options[this.selectRef.current.selectedIndex].value;
    const foundPack = this.props.packages.find((el) => el.packId === parseInt(packId, 10));
    axios.patch(`http://steamify-api.61hub.com/v1/packs/${packId}`, {items: [...foundPack.items, appId]})
      .then(() => {
        this.props.onAddedToPack();
        this.onChange({status: 'hidden'});
      })
  };

  onChange = (...props) => {
    const { onChange, data } = this.props
    this.toggleOptions()
    return onChange(data.appId, ...props)
  }

  renderOptions = () => {
    const { data } = this.props;
    const statuses = ['default', 'playing', 'completed', 'endless', 'abandoned', 'hidden', 'story']

    return (
      <div className={styles.options}>
        <Form
          onSubmit={(...props) => this.onChange(...props)}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit}>
              <Field
                name="price"
                initialValue={data.price}
                defaultValue={data.price}
                label="Price"
                component={CustomField}
                type="text"
                placeholder="Game price"
                // TODO format doesn't work
                format={value => parseInt(value, 10)}
              />

              <Field
                name="status"
                component={CustomSelect}
                initialValue={data.status}
                options={statuses}
              />

              <Field
                name="playtimeForever"
                initialValue={data.playtimeForever}
                defaultValue={data.playtimeForever}
                label="Playtime"
                component={CustomField}
                type="text"
                placeholder="Game playtime"
                format={value => parseInt(value, 10)}
              />

              <Button minimal type="submit" icon="tick">Сохранить</Button>
            </form>
          )}
        />

      {data.type !== 'pack' &&
        <form onSubmit={e => this.addToPack(data.appId, e)}>
          <select ref={this.selectRef}>
            <option value="" />
            {this.props.packages && this.props.packages.map(pack => (
              <option key={pack.packId} value={pack.packId}>{pack.name}</option>
            ))}
          </select>
          <button>Add to Pack</button>
        </form>
      }
    </div>
    )
  };

  render() {
    const { data, index } = this.props;
    const isPack = data.type === 'pack';
    const items = isPack ? data.games : data.dlc;

    return (
      <div>
        <div className={styles.gameWrapper}>
          <GameLogo src={data.logo} />
          <GameDetails data={data} index={index} onTitleClick={this.toggleOptions} />
        </div>

        <div className={classNames(styles.details, { [styles.expanded]: this.state.isExpanded })}>
          { this.renderOptions() }

          <div className={styles.items}>
            {!_.isEmpty(items) &&
              <>
                <h3>{isPack ? "Items in pack:" : "DLCs list:"}</h3>
                {
                  items.map(el => (
                  <div className={styles.item} key={el.appId || el.name}>
                    {el.name && <div>{el.name}</div>}
                    {isPack ?
                      <div>{formatPlaytime(el.playtimeForever)}</div>
                      :
                      <div>{el.price}</div>
                    }
                  </div>
                )
                )
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
