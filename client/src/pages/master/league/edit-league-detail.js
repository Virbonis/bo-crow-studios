import React, { useEffect } from 'react'
import { connect } from 'react-redux'
import { Button, Card, Col, Divider, Form, Row, Spin } from 'antd'
import actions from 'redux/league/actions'
import actionsMo from 'redux/mo-match-edit/actions'
import actionsLG from 'redux/league-group/actions'
import {
  AutoCloseForm,
  BetGeniusForm,
  LAP1X2Form,
  LAPShortForm,
  LDiff1X2Form,
  LeagueGroupForm,
  LeagueParentForm,
  LinkOddsDiff,
  OddsDiffForm,
  OddsStepForm,
  Profile1X2Form,
  ProfileForm,
  RegionForm,
  SpecialCodeForm,
  SpreadParlayForm,
  TimedDiffForm,
} from './forms-edit-detail'

const mapStateToProps = ({ league }) => ({
  leagueDetail: league.detail,
  loadingDetail: league.loadingDetail,
})

const mapDispatchToProps = dispatch => ({
  EditParentLeague: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_PARENT_LEAGUE,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditOddsStep: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_ODDS_STEP,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditSpreadParlay: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_SPREAD_PARLAY,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditOddsDiff: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_ODDS_DIFF,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  Edit1X2Diff: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_1X2_DIFF,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditLAPShort: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_LAP_SHORT,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditAC: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_AUTO_CLOSE,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditBG: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_BET_GENIUS,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditTimedDiff: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_TIMED_DIFF,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditProfileID: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_PROFILE_ID,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditProfile1X2: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_PROFILE_1X2,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  Edit1x2LAP: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_1X2_LAP,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditSpecialCode: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_SPECIAL_CODE,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditLeagueGroup: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_LEAGUE_GROUP,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditRegion: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_REGION,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  EditLinkOddsDiff: (payload, successCallback) => {
    dispatch({
      type: actions.EDIT_LINK_ODDS_DIFF,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  CopyToLottery: (payload, successCallback) => {
    dispatch({
      type: actions.COPY_TO_LOTTERY,
      payload,
      successCallback,
      source: 'Master League',
    })
  },
  LoadSpecialCode: payload => {
    dispatch({
      type: actionsMo.LOAD_SPECIAL_CODE,
      payload,
      source: 'Master League',
    })
  },
  LoadLeagueGroup: payload => {
    dispatch({
      type: actionsLG.LOAD,
      payload,
      source: 'Master League',
    })
  },
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Master League',
    })
  },
})

const EditLeagueDetail = ({
  initialValue,
  cancelEdit,
  LoadSpecialCode,
  LoadLeagueGroup,
  LoadDetail,
  leagueDetail,
  loadingDetail,
  EditParentLeague,
  EditOddsStep,
  EditSpreadParlay,
  EditOddsDiff,
  Edit1X2Diff,
  EditLAPShort,
  EditAC,
  EditBG,
  EditTimedDiff,
  EditProfileID,
  EditProfile1X2,
  Edit1x2LAP,
  EditSpecialCode,
  EditLeagueGroup,
  EditRegion,
  EditLinkOddsDiff,
  CopyToLottery,
}) => {
  useEffect(() => {
    LoadSpecialCode({ sport_id: initialValue.sport_id })
    LoadLeagueGroup({ sport_id: initialValue.sport_id })
    LoadDetail(initialValue)
  }, [initialValue, LoadSpecialCode, LoadLeagueGroup, LoadDetail])

  const SaveCancelComp = () => {
    return (
      <Form.Item wrapperCol={{ offset: 12, span: 12 }}>
        <Button type="primary" htmlType="submit">
          Update
        </Button>
      </Form.Item>
    )
  }

  return (
    <Spin spinning={loadingDetail}>
      <Row gutter={5}>
        <Col span={4}>
          <LeagueParentForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e => EditParentLeague({ ...e, league_id: initialValue.league_id })}
          />
          <Card title="Copy to Lottery">
            <Button
              type="primary"
              onClick={() => CopyToLottery({ league_id: initialValue.league_id })}
            >
              Copy
            </Button>
          </Card>
        </Col>
        <Col span={4}>
          <OddsStepForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditOddsStep({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
        <Col span={4}>
          <SpreadParlayForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditSpreadParlay({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
        <Col span={4}>
          <OddsDiffForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditOddsDiff({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
        <Col span={4}>
          <LDiff1X2Form
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              Edit1X2Diff({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
        <Col span={4}>
          <LAPShortForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditLAPShort({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={5}>
        <Col span={4}>
          <AutoCloseForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={values =>
              EditAC({
                ...leagueDetail,
                ...values,
                league_id: initialValue.league_id,
                auto_close_interval: values.auto_close_interval.format('HH:mm:ss'),
              })
            }
          />
          <BetGeniusForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditBG({
                ...leagueDetail,
                st_booking_bg: e.st_booking_bg ? 'Y' : 'N',
                league_id: initialValue.league_id,
              })
            }
          />
        </Col>
        <Col span={8}>
          <TimedDiffForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditTimedDiff({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
        </Col>
        <Col span={4}>
          <ProfileForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditProfileID({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
          <Profile1X2Form
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditProfile1X2({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
          <LAP1X2Form
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e => Edit1x2LAP({ ...leagueDetail, ...e, league_id: initialValue.league_id })}
          />
        </Col>
        <Col span={6} offset={2}>
          <SpecialCodeForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditSpecialCode({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
          <LeagueGroupForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e =>
              EditLeagueGroup({ ...leagueDetail, ...e, league_id: initialValue.league_id })
            }
          />
          <RegionForm
            initialValue={leagueDetail}
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
            OnFinish={e => EditRegion({ ...leagueDetail, ...e, league_id: initialValue.league_id })}
          />
        </Col>
      </Row>
      <Divider />
      <Row gutter={5}>
        <Col span={4}>
          <LinkOddsDiff
            game_type={0}
            initialValue={{
              link_odds_diff: leagueDetail.link_odds_diff_ah,
              link_odds_spread: leagueDetail.link_odds_spread_ah,
              link_odds_diff_lock: leagueDetail.link_odds_diff_lock_ah,
            }}
            onFinish={e =>
              EditLinkOddsDiff({ league_id: initialValue.league_id, game_type: 0, ...e })
            }
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
          />
          <LinkOddsDiff
            game_type={2}
            initialValue={{
              link_odds_diff: leagueDetail.link_odds_diff_ah_ht,
              link_odds_spread: leagueDetail.link_odds_spread_ah_ht,
              link_odds_diff_lock: leagueDetail.link_odds_diff_lock_ah_ht,
            }}
            onFinish={e =>
              EditLinkOddsDiff({ league_id: initialValue.league_id, game_type: 2, ...e })
            }
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
          />
        </Col>
        <Col span={4}>
          <LinkOddsDiff
            game_type={5}
            initialValue={{
              link_odds_diff: leagueDetail.link_odds_diff_ou,
              link_odds_spread: leagueDetail.link_odds_spread_ou,
              link_odds_diff_lock: leagueDetail.link_odds_diff_lock_ou,
            }}
            onFinish={e =>
              EditLinkOddsDiff({ league_id: initialValue.league_id, game_type: 5, ...e })
            }
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
          />
          <LinkOddsDiff
            game_type={6}
            initialValue={{
              link_odds_diff: leagueDetail.link_odds_diff_ou_ht,
              link_odds_spread: leagueDetail.link_odds_spread_ou_ht,
              link_odds_diff_lock: leagueDetail.link_odds_diff_lock_ou_ht,
            }}
            onFinish={e =>
              EditLinkOddsDiff({ league_id: initialValue.league_id, game_type: 6, ...e })
            }
            ButtonActions={() => <SaveCancelComp onCancel={cancelEdit} />}
          />
        </Col>
      </Row>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(EditLeagueDetail)
