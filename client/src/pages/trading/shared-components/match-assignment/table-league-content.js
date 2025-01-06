import React, { useContext } from 'react'
import CustomTable from 'pages/trading/mo-components/table-unscroll'
import { isEqual } from 'lodash'
import SelectedContext from './context'

const TableLeagueContent = React.memo(
  ({ dataSource, onRow }) => {
    const columnsLeague = React.useMemo(
      () => [
        {
          title: () => <CheckboxHeaderLeagueIDs dataSource={dataSource} />,
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
          render: (text, record) => {
            return (
              <div className="justify-content-between d-flex flex-row">
                <span>{text}</span>
                {record.count_unassigned > 0 ? (
                  <span className="icon_counter_unassigned_games">{record.count_unassigned}</span>
                ) : null}
              </div>
            )
          },
        },
      ],
      [dataSource],
    )
    return (
      <CustomTable
        id="table-trading"
        rowKey="league_id"
        columns={columnsLeague}
        dataSource={dataSource}
        onRow={onRow}
        pagination={false}
      />
    )
  },
  (prev, next) => isEqual(prev.dataSource, next.dataSource),
)

const CheckboxHeaderLeagueIDs = ({ dataSource }) => {
  const [, setSelectedLeagueIDs] = useContext(SelectedContext)
  return (
    <input
      type="checkbox"
      onChange={e => {
        if (e.target.checked)
          setSelectedLeagueIDs(prev => {
            const selectedAll = dataSource.reduce((acc, curr) => {
              const { league_id } = curr
              const isExist = prev.includes(league_id)
              if (!isExist) acc.push(league_id)
              return acc
            }, [])
            return [...prev, ...selectedAll]
          })
        else
          setSelectedLeagueIDs(prev => prev.filter(x => !dataSource.some(v => v.league_id === x)))
      }}
    />
  )
}
const CheckboxLeagueID = ({ league_id }) => {
  const [selectedLeagueIDs, setSelectedLeagueIDs] = useContext(SelectedContext)
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

export default TableLeagueContent
