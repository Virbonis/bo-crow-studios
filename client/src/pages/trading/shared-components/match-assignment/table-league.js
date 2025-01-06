import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button } from 'antd'
import actions from 'redux/match-assignment/actions'
import { groupBy } from 'lodash'
import TableLeagueContent from './table-league-content'
import SelectedContext from './context'

const mapStateToProps = ({ matchAssignment }) => ({
  dataLeague: matchAssignment.dataLeague,
  defaultSelectedLeague: matchAssignment.defaultSelectedLeague,
})

const mapDispatchToProps = (dispatch, { traderName, isPick = 'N', isRO, reload }) => ({
  UpdateLeague: payload => {
    dispatch({
      type: actions.UPDATE_LEAGUE,
      payload: {
        ...payload,
        trader_name: traderName,
        is_pick: isPick,
        is_ro: isRO,
      },
      successCallback: reload,
      source: 'Match Assignment',
    })
  },
})

const TableLeague = React.memo(({ dataLeague, defaultSelectedLeague, UpdateLeague }) => {
  const [selectedLeagueIDs, setSelectedLeagueIDs] = useState([])
  React.useEffect(() => {
    setSelectedLeagueIDs(defaultSelectedLeague)
  }, [defaultSelectedLeague])

  const grouped = React.useMemo(() => {
    return groupBy(dataLeague, 'sport_name')
  }, [dataLeague])

  const onRow = React.useCallback(
    record => ({
      className: 'custom_row_hover',
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

  const updateHandler = React.useCallback(
    () =>
      UpdateLeague({
        league_ids: selectedLeagueIDs.toString(),
      }),
    [UpdateLeague, selectedLeagueIDs],
  )

  return (
    <>
      <div className="d-flex flex-row justify-content-between header-style">
        <div>Assign League</div>
      </div>
      <div className="submit-style">
        <Button type="primary" onClick={updateHandler}>
          Submit
        </Button>
      </div>
      <div style={{ overflow: 'auto', maxHeight: '500px' }}>
        <SelectedContext.Provider value={[selectedLeagueIDs, setSelectedLeagueIDs]}>
          {Object.entries(grouped).map(([sport_name, dataSource]) => (
            <TableLeagueContent key={sport_name} dataSource={dataSource} onRow={onRow} />
          ))}
        </SelectedContext.Provider>
      </div>
      <div className="submit-style">
        <Button type="primary" onClick={updateHandler}>
          Submit
        </Button>
      </div>
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(TableLeague)
