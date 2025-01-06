import React from 'react'
import { Table } from 'antd'
import { isEqual } from 'lodash'
import useAudioPause from '../useAudioPause'

const TablePaused = React.memo(
  ({
    setCurrSearchIndex,
    currSearchIndex,
    tableRef,
    tableData = [],
    pausedMatches = [],
    total_paused_matches = 0,
  }) => {
    const [total_paused_sub_matches, total_paused_max_bet, total_paused_lap] = React.useMemo(() => {
      let sumMatchPaused = 0
      let sumMaxBet = 0
      let sumTotalLap = 0
      if (tableData.length > 0)
        tableData
          .filter(x => !x.league_group)
          .forEach(({ subMatches }) => {
            if (subMatches) {
              subMatches.forEach(({ sub_match_pause_status, reason_pause }) => {
                if (Number(sub_match_pause_status) > 0) sumMatchPaused += 1
                if (reason_pause?.toLowerCase() === 'max bet') sumMaxBet += 1
                if (['lap short', 'lap long'].includes(reason_pause?.toLowerCase()))
                  sumTotalLap += 1
              })
            }
          })
      return [sumMatchPaused, sumMaxBet, sumTotalLap]
    }, [tableData])

    useAudioPause(total_paused_sub_matches > 0, total_paused_max_bet > 0, total_paused_lap > 0)

    const matchPauseListHandler = () => {
      setCurrSearchIndex(prev => {
        const index = (prev.current_index + 1) % pausedMatches.length
        return {
          active_match_id: pausedMatches[index].match_id,
          current_index: index,
        }
      })
    }

    React.useEffect(() => {
      setCurrSearchIndex({ active_match_id: 0, current_index: -1 })
    }, [tableData, setCurrSearchIndex])

    React.useEffect(() => {
      // eslint-disable-next-line
      if (tableRef.current && currSearchIndex !== -1)
        tableRef.current.scrollTo({
          index: pausedMatches[currSearchIndex.current_index]?.index,
          align: 'top',
        })
    }, [currSearchIndex, pausedMatches, tableRef])

    const pausedMatchesColumn = [
      {
        title: 'PAUSED',
        children: [
          {
            title: 'Matches',
            align: 'center',
            render: record => (
              <button
                type="button"
                className="btn_plain_pause h4 text-primary font-weight-bold"
                onClick={matchPauseListHandler}
                disabled={pausedMatches.length === 0}
              >
                {record.total_paused_matches}
              </button>
            ),
          },
          {
            title: 'By Max Bet',
            align: 'center',
            render: record => (
              <span className="h4 text-primary font-weight-bold">{record.total_max_bet}</span>
            ),
          },
          {
            title: 'By LAP',
            align: 'center',
            render: record => (
              <span className="h4 text-primary font-weight-bold">{record.total_lap}</span>
            ),
          },
        ],
      },
    ]

    return (
      <Table
        columns={pausedMatchesColumn}
        dataSource={[
          {
            key: 1,
            total_paused_matches, // currently need to check again because the number is not showing as same as sum manually
            total_max_bet: total_paused_max_bet,
            total_lap: total_paused_lap,
          },
        ]}
        pagination={false}
        scroll={{
          x: 'max-content',
        }}
        bordered
        className="mr-1"
      />
    )
  },
  (prev, next) =>
    isEqual(prev.tableData, next.tableData) && isEqual(prev.currSearchIndex, next.currSearchIndex),
)
export default TablePaused
