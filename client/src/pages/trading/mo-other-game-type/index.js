import React from 'react'
import { connect } from 'react-redux'
import { Button, Descriptions, Divider, Popconfirm, Space, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/mo-other-game-type/actions'
import actionsAutoAddSubMatch from 'redux/auto-add-sub-match-more/actions'
import ContentSoccer from './content-soccer'
import ContentBasketball from './content-basketball'

const mapStateToProps = ({ sport, moEdit, autoAddSubMatchMore, moOtherGameType }, { match }) => ({
  sportName: sport.select.find(item => item.sport_id === match.sport_id)?.name,
  leagueName: moEdit.data.match?.league_name,

  loading: moOtherGameType.loading,
  status: autoAddSubMatchMore.status,
})
const mapDispatchToProps = (dispatch, { match }) => ({
  LoadData: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload: {
        ...payload,
        match_id: match.match_id,
        sport_id: match.sport_id,
      },
    })
  },
  RequestSubMatchMore: payload => {
    dispatch({
      type: actionsAutoAddSubMatch.REQUEST_SUB_MATCH_MORE,
      payload,
    })
  },
  ResetSubMatchMore: payload => {
    dispatch({
      type: actionsAutoAddSubMatch.RESET_SUB_MATCH_MORE,
      payload,
    })
  },
  UpdateOpenAll: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_OPEN_ALL,
      payload,
      successCallback,
    })
  },
  UpdatePauseAll: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_PAUSE_ALL,
      payload,
      successCallback,
    })
  },
  UpdateBGAll: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_BG_ALL,
      payload,
      successCallback,
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const MOOtherGameType = ({
  match,
  sportName,
  leagueName,
  status,
  loading,
  LoadData,
  RequestSubMatchMore,
  ResetSubMatchMore,

  UpdateOpenAll,
  UpdatePauseAll,
  UpdateBGAll,

  CleanUp,
}) => {
  const [activeTab, setActiveTab] = React.useState('HT')
  React.useEffect(() => CleanUp, [CleanUp])

  React.useEffect(() => {
    LoadData({ game_type: activeTab })
  }, [LoadData, activeTab])

  const { match_id, match_date, home_name, away_name, sport_id, st_live } = match
  const onClickRequestSubMatchMore = () => RequestSubMatchMore({ match_id })
  const onClickResetSubMatchMore = () => ResetSubMatchMore({ match_id })
  const onConfirmOpenAll = st => () => UpdateOpenAll({ match_id, status: st }, refetch)
  const onConfirmPauseAll = st => () => UpdatePauseAll({ match_id, status: st }, refetch)
  const onConfirmBGAll = st => () => UpdateBGAll({ match_id, status: st }, refetch)

  const refetch = React.useCallback(() => {
    LoadData({ game_type: activeTab })
  }, [LoadData, activeTab])
  return (
    <>
      <Descriptions size="small">
        <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
        <Descriptions.Item label="Sport">{sportName}</Descriptions.Item>
        <Descriptions.Item label="League">{leagueName}</Descriptions.Item>
        <Descriptions.Item label="Match Date" span={2}>
          {match_date}
        </Descriptions.Item>
        <Descriptions.Item label="Home - Away">
          {home_name} - {away_name}
        </Descriptions.Item>
      </Descriptions>
      <Divider className="mt-0" orientation="left">
        <Space>
          {status === 1 && <Typography.Text type="danger">Request on Queue ...</Typography.Text>}
          <Button size="small" type="primary" className="" onClick={onClickRequestSubMatchMore}>
            Request Game Type More
          </Button>
          <Button size="small" type="primary" className="" onClick={onClickResetSubMatchMore}>
            Reset Game Type More
          </Button>
          <Button size="small" loading={loading} icon={<ReloadOutlined />} onClick={refetch}>
            Refresh
          </Button>
        </Space>
      </Divider>
      <Divider className="mt-0" orientation="left">
        <Space>
          <Popconfirm title="Are you sure to open all?" onConfirm={onConfirmOpenAll('Y')}>
            <Button type="primary">Open All</Button>
          </Popconfirm>
          <Popconfirm title="Are you sure to close all?" onConfirm={onConfirmOpenAll('N')}>
            <Button type="primary">Close All</Button>
          </Popconfirm>
          <Popconfirm title="Are you sure to resume all?" onConfirm={onConfirmPauseAll(0)}>
            <Button type="primary">Resume All</Button>
          </Popconfirm>
          <Popconfirm title="Are you sure to pause all?" onConfirm={onConfirmPauseAll(3)}>
            <Button type="primary">Pause All</Button>
          </Popconfirm>
          {sport_id !== 12 && sport_id !== 58 && (
            <>
              <Popconfirm title="Are you sure to bg open all?" onConfirm={onConfirmBGAll('Y')}>
                <Button type="primary">BG Open All</Button>
              </Popconfirm>
              <Popconfirm title="Are you sure to bg close all?" onConfirm={onConfirmBGAll('N')}>
                <Button type="primary">BG Close All</Button>
              </Popconfirm>
            </>
          )}
        </Space>
      </Divider>
      <Content
        match_id={match_id}
        sport_id={sport_id}
        st_live={st_live}
        refetch={refetch}
        setActiveTab={setActiveTab}
        loading={loading}
      />
    </>
  )
}
const Content = ({ match_id, sport_id, st_live, refetch, setActiveTab, loading }) => {
  // soccer
  if (sport_id === 10) {
    return (
      <ContentSoccer
        match_id={match_id}
        sport_id={sport_id}
        st_live={st_live}
        refetch={refetch}
        loading={loading}
      />
    )
  }
  // basketball
  if (sport_id === 12 || sport_id === 58) {
    return (
      <ContentBasketball
        match_id={match_id}
        sport_id={sport_id}
        st_live={st_live}
        refetch={refetch}
        setActiveTab={setActiveTab}
        loading={loading}
      />
    )
  }

  return 'Sport not supported yet'
}

export default connect(mapStateToProps, mapDispatchToProps)(MOOtherGameType)
