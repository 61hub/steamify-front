import React from 'react'
import { formatPlaytime } from "../../helpers";
import { Col, Row } from "antd";

export const Stats = ({ games }) => {
  const red = games.filter(game => game.pricePerHour > 200)
  const orange = games.filter(game => game.pricePerHour > 100 && game.pricePerHour <= 200)
  const yellow = games.filter(game => game.pricePerHour > 50 && game.pricePerHour <= 100)
  const green = games.filter(game => game.pricePerHour > 10 && game.pricePerHour <= 50)
  const greener = games.filter(game => game.pricePerHour < 10)


  return (
    <>
      <div style={{display: 'flex', color: 'black', fontSize: 16, fontWeight: 'bold', textAlign: 'center', marginBottom: 20}}>
        <div style={{width: `${red.length / (games.length / 100)}%`, backgroundColor: 'red', padding: 2}}>{`${Math.round(red.length / (games.length / 100))}%`}</div>
        <div style={{width: `${orange.length / (games.length / 100)}%`, backgroundColor: 'orange', padding: 2}}>{`${Math.round(orange.length / (games.length / 100))}%`}</div>
        <div style={{width: `${yellow.length / (games.length / 100)}%`, backgroundColor: 'yellow', padding: 2}}>{`${Math.round(yellow.length / (games.length / 100))}%`}</div>
        <div style={{width: `${green.length / (games.length / 100)}%`, backgroundColor: 'lightgreen', padding: 2}}>{`${Math.round(green.length / (games.length / 100))}%`}</div>
        <div style={{width: `${greener.length / (games.length / 100)}%`, backgroundColor: 'green', padding: 2}}>{`${Math.round(greener.length / (games.length / 100))}%`}</div>
      </div>
      <div>
        {red
          .sort((g1, g2) => g2.pricePerHour - g1.pricePerHour)
          .map(({ name, logo }, i) => (
            <Row gutter={[5, 12]} type="flex" justify="center" align="center" style={{ color: 'white' }}>
              <Col span={8}>
                <img style={{ width: '100%' }} src={logo} alt="Game logo"/>
              </Col>
              <Col offset={1} span={13} style={{ display: 'flex', alignItems:'center', textOverflow: 'hidden', wordWrap: 'no-wrap' }}>
                <span>{name}</span>
              </Col>
            </Row>
          ))}

        }
      </div>
      <div>
        {games
          .filter(g => g.playtimeTwoWeeks && g.status !== 'hidden')
          .sort((g1, g2) => g2.playtimeTwoWeeks - g1.playtimeTwoWeeks)
          .map(({ name, playtimeTwoWeeks, logo }, i) => (
            <Row gutter={[5, 12]} type="flex" align="center" style={{ color: 'white' }}>
              <Col span={2}>{i + 1}.</Col>
              <Col span={4}>{formatPlaytime(playtimeTwoWeeks)}</Col>
              <Col span={4}>
                <img style={{ width: '100%' }} src={logo} alt="Game logo"/>
              </Col>
              <Col span={14} style={{ textOverflow: 'hidden', wordWrap: 'no-wrap' }}>
                <span>{name}</span>
              </Col>
            </Row>
          ))}
      </div>
    </>
  )
}