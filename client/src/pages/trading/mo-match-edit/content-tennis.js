import React from 'react'
import { Col, Row, Space } from 'antd'
import Title from 'antd/lib/typography/Title'
import SectionMatch from './section-match'
import SectionProfile from './section-profile'
import SectionOddsPointDiff from './section-odds-point-diff'
import SectionParlay from './section-parlay'
import SectionLinkOddsDiff from './section-link-odds-diff'
import ButtonLive from './button-live-finalize'
import SectionProfileGameType from './section-profile-game-type'
import SectionAddSubMatch from './section-add-sub-match'
import ButtonAddAutoSubMatch from './button-add-auto-sub-match'

const getMatchLabel = auto_odds => {
  switch (auto_odds) {
    case 0:
      return 'MANUAL'
    case 1:
      return 'link to SBO'
    case 2:
      return 'link to IBC'
    default:
      return ''
  }
}
const ContentTennis = ({ match }) => {
  if (!match) return null

  return (
    <Row className="m-0">
      <Col flex="400px">
        <SectionMatch />
        <SectionProfile />
        <SectionOddsPointDiff OU={false} />
        <SectionParlay page="MOTennis" />
      </Col>
      <Col flex="1" xl={{ order: 2 }} order={3}>
        <Row>
          <Col>
            <SectionLinkOddsDiff gt="AHSW" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="GAH" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OUGOU" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OEGOE" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="ML" />
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionProfileGameType gt="AHSW" />
          </Col>
          <Col>
            <SectionProfileGameType gt="GAH" />
          </Col>
          <Col>
            <SectionProfileGameType gt="OUGOU" />
          </Col>
          <Col>
            <SectionProfileGameType gt="OEGOE" />
          </Col>
          <Col>
            <SectionProfileGameType gt="ML" />
          </Col>
        </Row>
      </Col>
      <Col flex="250px" xl={{ order: 3 }} order={2}>
        <Space direction="vertical" className="p-3">
          <Title level={4} className="text-danger">
            This match is {getMatchLabel(match.auto_odds)}
          </Title>
          <ButtonLive />
          {/* <ButtonFixMarket /> */}
          {/* <SectionAutoProcessBetbazar /> */}
          {/* <SectionETPEN /> */}
          {/* <SectionPenaltyShootout /> */}
          <SectionAddSubMatch page="MOTennis" />
          <ButtonAddAutoSubMatch match={match} />
        </Space>
      </Col>
    </Row>
  )
}

export default ContentTennis
