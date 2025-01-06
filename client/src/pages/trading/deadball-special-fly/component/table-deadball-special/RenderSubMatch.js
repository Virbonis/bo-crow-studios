import React from 'react'
import { Col, Divider, Row, Space } from 'antd'
import { Amount } from 'components/blaise'
import BetListButton from 'pages/trading/shared-components/trading-bet-list-button'
import OddsMargin from 'pages/trading/shared-components/deadball-runningball/odds-margin'
import OpenCloseSubMatchButton from 'pages/trading/shared-components/deadball-runningball/open-close-sub-match-button'
import SubMatchSettingButton from '../button/submatch-setting-button'
import { getChoiceAway, getChoiceDraw, getChoiceHome } from './helper'

export const getCellSubMatch = ({ league_group, subMatches }, type) => {
  if (league_group) return { colSpan: 0 }

  const subMatch = subMatches.find(e => e.type === type)
  if (!subMatch) return {}

  if ([40, 21, 25, 27, 35].includes(subMatch?.game_type)) {
    return {
      className: `${subMatch?.sub_match_open_status}${subMatch?.sub_match_pause_status}`,
    }
  }
  return {
    className: `${subMatch?.sub_match_open_status}0`,
  }
}

const RenderSubMatch = ({ subMatches, type, refetch, lastFetchGameType }) => {
  const record = subMatches.find(e => e.type === type)
  if (!record) return null

  const {
    auto_pause,
    sub_match_pause_status,
    // sub_match_open_status,
    reason_pause,
    jml1,
    jml2,
    jml3,
    t1,
    t2,
    t3,
    odds1,
    odds2,
    odds3,
    game_type,
    handicap,
  } = record

  const colStatus = <Col>{auto_pause === 1 && <div className="icon-indicator pause" />}</Col>
  const containerClass = sub_match_pause_status > 0 && 'td-sub-match-paused'

  return (
    <Row>
      {colStatus}
      <Col flex="auto" className={`ml-1 ${containerClass}`}>
        <Row>
          <Col>
            <Space direction="vertical" size={0} className="font-weight-bold">
              <span>{getChoiceHome(game_type, handicap)}</span>
              <span>{getChoiceAway(game_type, handicap)}</span>
              {[48, 49, 30, 29].includes(game_type) && <span>{getChoiceDraw(game_type)}</span>}
            </Space>
          </Col>
          <Col align="right" flex="auto">
            <Space direction="vertical" size={0} className="font-weight-bold" align="right">
              <Amount bold value={odds1} noColor />
              {game_type === 39 && <Amount bold value={odds3} />}
              <Amount bold value={odds2} noColor />
              {[48, 49, 30, 29].includes(game_type) && <Amount bold value={odds3} />}
            </Space>
          </Col>
          <Col span={12} align="right">
            <BetListButton
              record={{
                ...record,
                jml_home: jml1,
                jml_away: game_type !== 39 ? jml2 : jml3,
                jml_draw: game_type !== 39 ? jml3 : jml2,
                t_home: t1,
                t_away: game_type !== 39 ? t2 : t3,
                t_draw: game_type !== 39 ? t3 : t2,
              }}
            />
          </Col>
        </Row>
        <Divider className="m-0" />
        <OddsMargin record={record} />
        <Row justify="space-between">
          <Col>
            <OpenCloseSubMatchButton record={record} successcallback={refetch} />
          </Col>
          <Col>
            <SubMatchSettingButton
              record={record}
              successCallback={refetch}
              lastFetchGameType={lastFetchGameType}
            />
          </Col>
        </Row>
        <Row align="center">
          <span className="font-italic">{reason_pause}</span>
        </Row>
      </Col>
    </Row>
  )
}

export default RenderSubMatch
