import React from 'react'
import { connect } from 'react-redux'
import { Button, Descriptions, Divider } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import DrawerEarlySettlementBetList from 'pages/trading/early-settlement-bet-list'
import actions from 'redux/early-settlement/actions'
import actionsEarlySettlementBetlist from 'redux/early-settlement-bet-list/actions'
import TableEarlySettlement from './table'

const mapStateToProps = ({ earlySettlement }) => ({
  editValue: earlySettlement.editValue,
  visible: !isEmpty(earlySettlement.editValue),
  loading: earlySettlement.loading,
  match: earlySettlement.data.match,
  list: earlySettlement.list,
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  LoadData: payload => {
    dispatch({
      type: actions.LOAD_DATA,
      payload,
    })
  },
  UpdateEarlySettlement: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_EARLY_SETTLEMENT,
      payload,
      successCallback,
    })
  },
  EditEarlySettlementBetList: payload => {
    dispatch({
      type: actionsEarlySettlementBetlist.EDIT,
      payload,
    })
  },
})

const DrawerEarlySettlement = React.memo(
  ({
    editValue,
    visible,
    loading,
    match,
    list,
    LoadData,
    CancelEdit,
    UpdateEarlySettlement,
    EditEarlySettlementBetList,
  }) => {
    if (!visible) return null

    const { match_id } = editValue
    const refetch = React.useCallback(() => {
      if (!match_id) return
      LoadData({ match_id })
    }, [match_id, LoadData])
    React.useEffect(() => {
      refetch()
    }, [refetch, LoadData])

    return (
      <>
        <DragableModal
          title={`Early Settlement - ${match_id}`}
          open={visible}
          onCancel={CancelEdit}
          footer={null}
          width={800}
        >
          <Content match={match} />
          <Divider orientation="left">
            <Button size="small" loading={loading} icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
          </Divider>
          <TableEarlySettlement
            match_id={match_id}
            list={list}
            UpdateEarlySettlement={UpdateEarlySettlement}
            successCallback={refetch}
            EditEarlySettlementBetList={EditEarlySettlementBetList}
          />
        </DragableModal>
      </>
    )
  },
)

const Content = React.memo(({ match }) => {
  if (isEmpty(match)) return null
  const { match_id, sport_name, league_name, match_date, home_name, away_name } = match

  return (
    <>
      <Descriptions bordered size="small">
        <Descriptions.Item label="Match ID">{match_id}</Descriptions.Item>
        <Descriptions.Item label="Sport">{sport_name}</Descriptions.Item>
        <Descriptions.Item label="League">{league_name}</Descriptions.Item>
        <Descriptions.Item label="Match Date" span={2}>
          {match_date}
        </Descriptions.Item>
        <Descriptions.Item label="Home - Away">
          {home_name} - {away_name}
        </Descriptions.Item>
      </Descriptions>
      <DrawerEarlySettlementBetList />
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerEarlySettlement)
