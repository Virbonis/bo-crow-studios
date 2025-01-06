import React from 'react'
import { Tabs } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/mo-other-game-type/actions'
import useDefaultColumns from '../hooks'
import TableHT from './table-ht'
import TableFT from './table-ft'
import TableQT from './table-qt'
import TableSubQT from './table-sub-qt'

const mapStateToProps = ({ moOtherGameType }) => ({
  tableDataHT: moOtherGameType.data_HT,
  tableDataFT: moOtherGameType.data_FT,
  tableDataQT: moOtherGameType.data_QT,
  tableDataSubQT1: moOtherGameType.data_QT1,
  tableDataSubQT2: moOtherGameType.data_QT2,
  tableDataSubQT3: moOtherGameType.data_QT3,
  tableDataSubQT4: moOtherGameType.data_QT4,
})

const mapDispatchToProps = (dispatch, { refetch: successCallback }) => ({
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
  UpdateMoreGameTypeBasketball: payload => {
    dispatch({
      type: actions.UPDATE_MORE_GAME_TYPE_BASKETBALL,
      payload,
      successCallback,
    })
  },
})

const ContentBasketball = ({
  match_id,
  sport_id,
  st_live,
  refetch,
  UpdateBG,
  UpdateParlay,
  UpdateOpen,
  UpdatePause,
  UpdateMoreGameTypeBasketball,
  setActiveTab,
  tableDataHT,
  tableDataFT,
  tableDataQT,
  tableDataSubQT1,
  tableDataSubQT2,
  tableDataSubQT3,
  tableDataSubQT4,
}) => {
  const isLive = st_live === 'Y'
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
      UpdateMoreGameTypeBasketball({
        ...payload,
        match_id,
      })
    },
    [match_id, UpdateMoreGameTypeBasketball],
  )

  const tabsItems = React.useMemo(
    () =>
      [
        { key: 'HT', label: 'HT', data: tableDataHT, table: TableHT },
        { key: 'FT', label: 'FT', data: tableDataFT, table: TableFT },
        { key: 'QT', label: 'Quarter', data: tableDataQT, table: TableQT },
        { key: 'QT1', label: 'Quarter 1', data: tableDataSubQT1, table: TableSubQT },
        { key: 'QT2', label: 'Quarter 2', data: tableDataSubQT2, table: TableSubQT },
        { key: 'QT3', label: 'Quarter 3', data: tableDataSubQT3, table: TableSubQT },
        { key: 'QT4', label: 'Quarter 4', data: tableDataSubQT4, table: TableSubQT },
      ].map(x => ({
        ...x,
        children: (
          <div
            style={{
              width: '100%',
              overflow: 'auto scroll',
              minHeight: '50vh',
              maxHeight: '50vh',
            }}
          >
            {x.data?.length > 0 && (
              <x.table
                tableData={x.data}
                sport_id={sport_id}
                defaultColumns={defaultColumns}
                refetch={refetch}
                match_id={match_id}
                onSubmit={onSubmit}
              />
            )}
          </div>
        ),
      })),
    [
      tableDataHT,
      tableDataFT,
      tableDataQT,
      tableDataSubQT1,
      tableDataSubQT2,
      tableDataSubQT3,
      tableDataSubQT4,
      defaultColumns,
      refetch,
      match_id,
      sport_id,
      onSubmit,
    ],
  )

  return (
    <Tabs
      type="card"
      defaultActiveKey="HT"
      items={tabsItems}
      onChange={value => setActiveTab(value)}
      destroyInactiveTabPane
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ContentBasketball)
