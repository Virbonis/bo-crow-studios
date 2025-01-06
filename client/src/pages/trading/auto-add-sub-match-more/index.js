import React from 'react'
import { connect } from 'react-redux'
import { Button, Descriptions, Divider, Space, Spin, Typography } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import actions from 'redux/auto-add-sub-match-more/actions'
import ContentSoccer from './content-soccer'
import ContentTennisBadminton from './content-tennis-badminton'

const { Text } = Typography
const mapStateToProps = ({ autoAddSubMatchMore, moEdit, sport }, { match }) => ({
  sportName: sport.select.find(item => item.sport_id === match.sport_id)?.name,
  leagueName: moEdit.data.match?.league_name,
  loading: autoAddSubMatchMore.loading,
  status: autoAddSubMatchMore.status,
  data: autoAddSubMatchMore.data,
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
      type: actions.REQUEST_SUB_MATCH_MORE,
      payload,
    })
  },
  ResetSubMatchMore: payload => {
    dispatch({
      type: actions.RESET_SUB_MATCH_MORE,
      payload,
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const AutoAddSubMatchMore = ({
  match,

  sportName,
  leagueName,
  loading,
  status,
  data,
  LoadData,
  RequestSubMatchMore,
  ResetSubMatchMore,
  CleanUp,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const { match_id, match_date, home_name, away_name, sport_id } = match
  React.useEffect(() => {
    LoadData()
  }, [LoadData])

  const onClickRequestSubMatchMore = () => RequestSubMatchMore({ match_id })
  const onClickResetSubMatchMore = () => ResetSubMatchMore({ match_id })

  return (
    <Spin tip="Loading..." spinning={loading} className="w-100 h-100">
      <Descriptions size="small">
        <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
        <Descriptions.Item label="Sport">{sportName}</Descriptions.Item>
        <Descriptions.Item label="League">{leagueName}</Descriptions.Item>
        <Descriptions.Item label="Match Date" span={2}>
          {match_date.formatDateTime()}
        </Descriptions.Item>
        <Descriptions.Item label="Home - Away">
          {home_name} - {away_name}
        </Descriptions.Item>
      </Descriptions>
      <Divider className="mt-0" orientation="left">
        <Space>
          {status === 1 ? <Text type="danger">Request on Queue ...</Text> : null}
          <Button type="primary" className="" onClick={onClickRequestSubMatchMore}>
            Request Game Type More
          </Button>
          <Button type="primary" className="" onClick={onClickResetSubMatchMore}>
            Reset Game Type More
          </Button>
          <Button
            size="small"
            loading={loading}
            icon={<ReloadOutlined />}
            onClick={() => LoadData()}
          >
            Refresh
          </Button>
        </Space>
      </Divider>
      <Content match_id={match_id} sport_id={sport_id} list={data} successCallback={LoadData} />
    </Spin>
  )
}

const Content = ({ match_id, sport_id, list, successCallback }) => {
  if (isEmpty(list)) return null
  // soccer
  if (sport_id === 10) {
    return <ContentSoccer match_id={match_id} list={list} successCallback={successCallback} />
  }
  // tennis or badminton
  if (sport_id === 11 || sport_id === 32) {
    return <ContentTennisBadminton list={list} />
  }
  return 'Sport not supported yet'
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoAddSubMatchMore)
