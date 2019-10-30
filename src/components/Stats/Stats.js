import React from 'react'
import { formatPlaytime } from "../../helpers";
import { Col, Row } from "antd";

export const Stats = ({ games }) =>
  games
    .filter(g => g.playtimeTwoWeeks)
    .sort((g1, g2) => g2.playtimeTwoWeeks - g1.playtimeTwoWeeks)
    .map(({ name, playtimeTwoWeeks, logo }, i) => (
      <Row gutter={[5, 12]} type="flex" align="center" style={{color: 'white'}}>
        <Col span={2}>{i + 1}.</Col>
        <Col span={4}>{formatPlaytime(playtimeTwoWeeks)}</Col>
        <Col span={4}>
          <img style={{ width: '100%' }} src={logo} alt="Game logo"/>
        </Col>
        <Col span={14} style={{textOverflow: 'hidden', wordWrap: 'no-wrap'}}>
          <span>{name}</span>
        </Col>
      </Row>
    ));
