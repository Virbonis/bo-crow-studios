import React from 'react'
import { Col, Row } from 'antd'
import Title from 'antd/lib/typography/Title'
import SectionMatch from './section-match'
import SectionSportsTicker from './section-sports-ticker'
import SectionOddsPointDiff from './section-odds-point-diff'
import SectionParlay from './section-parlay'
import SectionRBDelay from './section-rb-delay'
import SectionLinkOddsDiff from './section-link-odds-diff'
import SectionTimedMaxBet from './section-timed-max-bet'

import SectionProfileGameType from './section-profile-game-type'

const Content = React.memo(({ match, page }) => {
  if (!match) return null
  const matchLabel = React.useMemo(() => {
    switch (match.auto_odds) {
      case 0:
        return 'MANUAL'
      case 1:
        return 'link to SBO'
      case 2:
        return 'link to IBC'
      default:
        return ''
    }
  }, [match.auto_odds])

  return (
    <Row className="m-0">
      <Col flex="400px">
        <SectionMatch />
        <SectionSportsTicker />
        <SectionOddsPointDiff />
        <SectionParlay page={page} />
        <SectionRBDelay />
      </Col>
      <Col flex="1" xl={{ order: 2 }} order={3}>
        <Row>
          <Col>
            <SectionLinkOddsDiff gt="AH" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OU" />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OE" />
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionTimedMaxBet gt="AH" time={1} />
          </Col>
          <Col>
            <SectionTimedMaxBet gt="OU" time={1} />
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionProfileGameType gt="AH" />
          </Col>
          <Col>
            <SectionProfileGameType gt="OU" />
          </Col>
          <Col>
            <SectionProfileGameType gt="OE" />
          </Col>
          <Col>
            {page === 'MOOS' ? (
              <SectionProfileGameType gt="ML" />
            ) : (
              <SectionProfileGameType gt="1X2" />
            )}
          </Col>
        </Row>
      </Col>
      <Col flex="250px" xl={{ order: 3 }} order={2}>
        <Title level={4} className="text-danger">
          This match is {matchLabel}
        </Title>
      </Col>
    </Row>
  )
})

export default Content
