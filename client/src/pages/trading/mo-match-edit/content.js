import React from "react";
import { Col, Row, Space } from "antd";
import Title from "antd/lib/typography/Title";
import SectionMatch from "./section-match";
import SectionProfile from "./section-profile";
import SectionSportsTicker from "./section-sports-ticker";
import SectionSportsTickerCs from "./section-sports-ticker-cs";
import SectionMatchParlay from "./section-match-parlay";
import SectionOddsPointDiff from "./section-odds-point-diff";
import SectionParlay from "./section-parlay";
import SectionRBDelay from "./section-rb-delay";
import SectionLinkOddsDiff from "./section-link-odds-diff";
import SectionTimedMaxBet from "./section-timed-max-bet";
import SectionAutoProcessBetbazar from "./section-auto-process-betbazar";
import ButtonLive from "./button-live-finalize";
import ButtonFixMarket from "./button-fix-market";
import SectionProfileGameType from "./section-profile-game-type";
import SectionETPEN from "./section-et-pen";
import SectionPenaltyShootout from "./section-penalty-shootout";
import SectionAddSubMatch from "./section-add-sub-match";
import ButtonAddAutoSubMatch from "./button-add-auto-sub-match";
import ButtonAddAutoSubMatchMore from "../shared-components/add-auto-sub-match-more-button";
import SectionAutoProcessIM from "./section-auto-process-im";

const getMatchLabel = (auto_odds) => {
  switch (auto_odds) {
    case 0:
      return "MANUAL";
    case 1:
      return "link to SBO";
    case 2:
      return "link to IBC";
    default:
      return "";
  }
};
const Content = ({ match, display_admin, page }) => {
  if (!match) return null;

  const readOnly = page === "MOView";
  return (
    <Row className="m-0">
      <Col flex="400px">
        <SectionMatch readOnly={readOnly} />
        <SectionProfile readOnly={readOnly} />
        <SectionSportsTicker readOnly={readOnly} />
        {display_admin < 31 && <SectionSportsTickerCs readOnly={readOnly} />}
        <SectionMatchParlay readOnly={readOnly} />
        <SectionOddsPointDiff readOnly={readOnly} />
        <SectionParlay page={page} readOnly={readOnly} />
        <SectionRBDelay readOnly={readOnly} />
      </Col>
      <Col flex="1" lg={{ order: 2 }} order={3}>
        <Row>
          <Col>
            <SectionLinkOddsDiff gt="AHSW" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="GAH" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OUGOU" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="OEGOE" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionLinkOddsDiff gt="ML" readOnly={readOnly} />
          </Col>
        </Row>
        <Row>
          <Col>
            <SectionTimedMaxBet gt="AHSW" time={1} readOnly={readOnly} />
          </Col>
          <Col>
            <SectionTimedMaxBet gt="OUGOU" time={1} readOnly={readOnly} />
          </Col>
        </Row>
        {display_admin < 31 && (
          <Row>
            <>
              <Col>
                <SectionTimedMaxBet gt="AHSW" time={2} readOnly={readOnly} />
              </Col>
              <Col>
                <SectionTimedMaxBet gt="OUGOU" time={2} readOnly={readOnly} />
              </Col>
            </>
          </Row>
        )}
        <Row>
          <Col>
            <SectionProfileGameType gt="AHSW" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionProfileGameType gt="GAH" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionProfileGameType gt="OUGOU" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionProfileGameType gt="OEGOE" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionProfileGameType gt="ML" readOnly={readOnly} />
          </Col>
          <Col>
            <SectionProfileGameType gt="1X2" readOnly={readOnly} />
          </Col>
        </Row>
      </Col>
      <Col flex="250px" lg={{ order: 3 }} order={2}>
        <Space direction="vertical" className="p-3">
          <Title level={4} className="text-danger">
            This match is {getMatchLabel(match.auto_odds)}
          </Title>
          {!readOnly && (
            <>
              <ButtonLive />
              <ButtonFixMarket />
              <SectionAutoProcessBetbazar />
              <SectionAutoProcessIM />
              <SectionETPEN />
              <SectionPenaltyShootout />
              <SectionAddSubMatch />
              <ButtonAddAutoSubMatch match={match} />
              <ButtonAddAutoSubMatchMore match={match} />
            </>
          )}
        </Space>
      </Col>
    </Row>
  );
};

export default Content;
