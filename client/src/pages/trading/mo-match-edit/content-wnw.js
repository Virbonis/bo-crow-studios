import React from 'react'
import { Col, Row, Space } from 'antd'
import SectionMatch from './section-match'
import SectionParlayOEWNW from './section-parlay-oewnw'
import SectionLinkOddsDiff from './section-link-odds-diff'
import SectionProfileGameType from './section-profile-game-type'
import ButtonAddAutoSubMatchMore from '../shared-components/add-auto-sub-match-more-button'

const ContentWNW = ({ match, game_type }) => {
  if (!match) return null

  const gt = game_type === 63 ? 'HWNW' : 'AWNW'
  return (
    <Row className="m-0">
      <Col flex="400px">
        <SectionMatch readOnly />
        <SectionParlayOEWNW gt={gt} />
      </Col>
      <Col flex="1" xl={{ order: 2 }} order={3}>
        <Row>
          <Col span={8}>
            <SectionLinkOddsDiff gt={gt} />
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionProfileGameType gt={gt} />
          </Col>
        </Row>
      </Col>
      <Col flex="250px" xl={{ order: 3 }} order={2}>
        <Space direction="vertical" className="p-3">
          <ButtonAddAutoSubMatchMore match={match} />
        </Space>
      </Col>
    </Row>
  )
}

export default ContentWNW
