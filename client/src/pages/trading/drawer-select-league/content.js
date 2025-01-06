import React from 'react'
import { groupBy } from 'lodash'
import { connect } from 'react-redux'
import { Button, Divider, Spin } from 'antd'
import actions from 'redux/league/actions'
// import transmuteDataLeague from '../shared-components/match-assignment/transmuteData'
import CustomTable from '../mo-components/table-unscroll'
import RowSelectionContext from './context'

const mapStateToProps = ({ league }) => ({
  loading: league.loading,
  data: league.select,
  // defaultSelectedLeague: league.defaultSelectedLeague,
})
const mapDispatchToProps = (dispatch, { popup_id, group, early_date, successCallback }) => ({
  UpdateLeagueSelection: payload => {
    dispatch({
      type: actions.UPDATE_SELECT,
      payload: {
        popup_id,
        group,
        from_early_date: early_date?.[0].format('YYYY-MM-DD'),
        to_early_date: early_date?.[1].format('YYYY-MM-DD'),
        ...payload,
      },
      successCallback,
    })
  },
})
const TableLeague = ({ loading, data = [], UpdateLeagueSelection }) => {
  const [selectedLeagueIDs, setSelectedLeagueIDs] = React.useState([])
  React.useEffect(() => {
    const defaultSelectedRows = data.filter(x => x.is_selected === 'Y').map(x => x.league_id)
    setSelectedLeagueIDs(defaultSelectedRows)
  }, [data])

  const grouped = React.useMemo(() => {
    return groupBy(data, 'sport_name')
  }, [data])

  const onRow = React.useCallback(
    record => ({
      className: 'selected_row',
      onClick: () =>
        setSelectedLeagueIDs(prev => {
          const { league_id } = record
          const isSelected = prev.includes(league_id)
          if (isSelected) return prev.filter(x => x !== league_id)
          return [...prev, league_id]
        }),
    }),
    [],
  )

  // const onCheckHeader = React.useCallback(
  //   e => {
  //     if (e.target.checked)
  //       setSelectedRows(prev => {
  //         const selectedAll = dataSource.reduce((acc, curr) => {
  //           const { league_id } = curr
  //           const isExist = prev.includes(league_id)
  //           if (!isExist) acc.push(league_id)
  //           return acc
  //         }, [])
  //         return [...prev, ...selectedAll]
  //       })
  //     else setSelectedRows(prev => prev.filter(x => !dataSource.some(v => v.league_id === x)))
  //   },
  //   [dataSource, setSelectedRows],
  // )

  const updateHandler = React.useCallback(() => {
    UpdateLeagueSelection({
      league_ids: selectedLeagueIDs.toString(),
    })
  }, [UpdateLeagueSelection, selectedLeagueIDs])

  if (data.length === 0) return null

  return (
    <>
      <Divider className="m-0" orientation="right">
        <Button type="primary" onClick={updateHandler}>
          Submit
        </Button>
      </Divider>
      <div style={{ overflow: 'auto', height: 'calc(100% - 160px)' }}>
        <Spin spinning={loading}>
          <RowSelectionContext.Provider value={[selectedLeagueIDs, setSelectedLeagueIDs]}>
            {Object.entries(grouped).map(([sport_name, dataSource]) => (
              <Content
                key={sport_name}
                sport={sport_name}
                dataSource={dataSource}
                setSelectedRows={setSelectedLeagueIDs}
                onRow={onRow}
              />
            ))}
          </RowSelectionContext.Provider>
        </Spin>
      </div>
      <Divider className="m-0" orientation="right">
        <Button type="primary" onClick={updateHandler}>
          Submit
        </Button>
      </Divider>
    </>
  )
}
export default connect(mapStateToProps, mapDispatchToProps)(TableLeague)

const Content = React.memo(({ sport, dataSource, setSelectedRows, onRow }) => {
  const onCheckHeader = React.useCallback(
    e => {
      if (e.target.checked)
        setSelectedRows(prev => {
          const selectedAll = dataSource.reduce((acc, curr) => {
            const { league_id } = curr
            const isExist = prev.includes(league_id)
            if (!isExist) acc.push(league_id)
            return acc
          }, [])
          return [...prev, ...selectedAll]
        })
      else setSelectedRows(prev => prev.filter(x => !dataSource.some(v => v.league_id === x)))
    },
    [dataSource, setSelectedRows],
  )

  // const newDataSource = React.useMemo(() => {
  //   const newData = transmuteDataLeague(dataSource)
  //   return newData
  // }, [dataSource])

  const columns = [
    {
      title: () => <input type="checkbox" onChange={onCheckHeader} />,
      render: ({ league_id }) => <CheckboxLeagueID league_id={league_id} />,
      align: 'center',
      width: 30,
    },
    {
      title: 'Sport',
      dataIndex: 'sport_name',
      width: 100,
    },
    {
      title: 'League Name',
      dataIndex: 'league_name',
    },
  ]

  return (
    <>
      <Divider className="m-0" orientation="left">
        <strong>{sport}</strong>
      </Divider>
      <CustomTable
        className="custom_row_hover"
        rowKey="league_id"
        size="small"
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        onRow={onRow}
      />
    </>
  )
})

const CheckboxLeagueID = ({ league_id }) => {
  const [selectedLeagueIDs, setSelectedLeagueIDs] = React.useContext(RowSelectionContext)
  const checked = selectedLeagueIDs.includes(league_id)
  return (
    <input
      type="checkbox"
      checked={checked}
      onChange={e => {
        if (e.target.checked) setSelectedLeagueIDs(prev => [...prev, league_id])
        else setSelectedLeagueIDs(prev => prev.filter(id => id !== league_id))
      }}
    />
  )
}

// const RenderRow = React.memo(
//   ({ children, ...restProps }) => {
//     return (
//       <tr {...restProps} className="selected_row">
//         {children}
//       </tr>
//     )
//   },
//   (prev, next) => isEqual(prev.row, next.row),
// )
