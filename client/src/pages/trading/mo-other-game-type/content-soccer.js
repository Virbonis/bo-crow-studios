import React from 'react'
import { connect } from 'react-redux'
import { Col, Row, Spin } from 'antd'
import actions from 'redux/mo-other-game-type/actions'
import actionsMOMatchEdit from 'redux/mo-match-edit/actions'
import useDefaultColumns from './hooks'
import TableOEWNW from './table-oewnw'
import TableGT from './table-gt'
import TableCSLive from './table-cslive'
import TableSpecial from './table-special'

const mapStateToProps = ({ moOtherGameType }) => ({
  listOEWNW: [...moOtherGameType.list_oe, ...moOtherGameType.list_wnw],
  listGT: [
    ...moOtherGameType.list_special_gt,
    ...moOtherGameType.list_special_other,
    ...moOtherGameType.list_cs.CS,
  ],
  listCSLive: moOtherGameType.list_cs.CSLive,
  listSpecial: moOtherGameType.list_special_other,
})
const mapDispatchToProps = (dispatch, { refetch: successCallback }) => ({
  EditMatch: payload => {
    dispatch({
      type: actionsMOMatchEdit.OPEN_EDIT,
      payload,
    })
  },
  UpdateBG: payload => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_BG,
      payload,
      successCallback,
    })
  },
  UpdateParlay: payload => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_PARLAY,
      payload,
      successCallback,
    })
  },
  UpdateOpen: payload => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_OPEN,
      payload,
      successCallback,
    })
  },
  UpdatePause: payload => {
    dispatch({
      type: actions.UPDATE_MORE_STATUS_PAUSE,
      payload,
      successCallback,
    })
  },
  UpdateMoreGameType: payload => {
    dispatch({
      type: actions.UPDATE_MORE_GAME_TYPE,
      payload,
      successCallback,
    })
  },
})
const TableAddMatchMore = ({
  match_id,
  sport_id,
  st_live,
  listOEWNW,
  listGT,
  listCSLive,
  listSpecial,
  EditMatch,
  UpdateBG,
  UpdateParlay,
  UpdateOpen,
  UpdatePause,
  UpdateMoreGameType,
  refetch,
  loading,
}) => {
  const isLive = st_live === 'Y'

  const editMatch = React.useCallback(
    (display_admin, game_type) => () => {
      EditMatch({
        match_id,
        display_admin,
        game_type,
        page: 'MO5More',
      })
    },
    [EditMatch, match_id],
  )

  const defaultColumns = useDefaultColumns(
    isLive,
    match_id,
    sport_id,
    UpdateBG,
    UpdateParlay,
    UpdateOpen,
    UpdatePause,
    refetch,
  )

  const onSubmit = React.useCallback(
    payload => {
      UpdateMoreGameType({
        ...payload,
        match_id,
      })
    },
    [match_id, UpdateMoreGameType],
  )

  return (
    <Spin spinning={loading}>
      <div
        style={{
          width: '100%',
          overflow: 'auto scroll',
          maxHeight: '500px',
        }}
      >
        <TableOEWNW
          list={listOEWNW}
          defaultColumns={defaultColumns}
          match_id={match_id}
          refetch={refetch}
          editMatch={editMatch}
        />
        <TableGT list={listGT} defaultColumns={defaultColumns} onSubmit={onSubmit} />
        <Row>
          <Col span={12}>
            <TableCSLive
              isLive={isLive}
              list={listCSLive}
              match_id={match_id}
              refetch={refetch}
              UpdateBG={UpdateBG}
              UpdateParlay={UpdateParlay}
              UpdateOpen={UpdateOpen}
              UpdatePause={UpdatePause}
            />
          </Col>
          <Col span={12}>
            <TableSpecial
              list={listSpecial}
              defaultColumns={defaultColumns}
              match_id={match_id}
              refetch={refetch}
              onSubmit={onSubmit}
            />
          </Col>
        </Row>
      </div>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableAddMatchMore)
