import React from 'react'
import { Table } from 'antd'
import {
  ButtonStock,
  InputOddsCS,
  StatusOpenChoice,
  ButtonPauseChoice,
} from 'pages/trading/mo-components'

const TableScore = ({ data, match_id, game_type, reloadPartai }) => {
  const dataGroup = React.useMemo(
    () =>
      data.reduce((acc, curr) => {
        const { away_score } = curr
        const index = acc.findIndex(e => e.some(v => v.away_score === away_score))
        if (index === -1) {
          if (away_score === 9999) acc[0].push(curr)
          else acc.push([curr])
        } else {
          acc[index].push(curr)
        }
        return acc
      }, []),
    [data],
  )
  const columns = React.useMemo(
    () => [
      {
        title: 'Score',
        width: 50,
        render: ({ home_score, away_score }) => (
          <div className="bg-gray">
            {home_score === 9999 ? 'AOS' : `${home_score} - ${away_score}`}
          </div>
        ),
      },
      {
        title: 'Odds',
        width: 50,
        render: ({ odds, choice_code }) => (
          <InputOddsCS
            match_id={match_id}
            game_type={game_type}
            choice_code={choice_code}
            odds={odds}
            successCallback={reloadPartai}
          />
        ),
      },
      {
        title: 'Stock',
        width: 50,
        render: ({ show_stock, choice_code, stock, home_name, away_name }) =>
          show_stock && (
            <ButtonStock
              stock={stock}
              match_id={match_id}
              game_type={game_type}
              choice_code={choice_code}
              gt="CS"
              home_name={home_name}
              away_name={away_name}
            />
          ),
      },
      {
        title: 'C',
        width: 30,
        onCell: ({ sub_match_open_status }) => ({
          className: sub_match_open_status === 'N' ? 'bg-red' : '',
        }),
        render: ({ choice_code, sub_match_open_status }) => (
          <StatusOpenChoice
            match_id={match_id}
            game_type={game_type}
            choice_code={choice_code}
            st_open={sub_match_open_status}
            successCallback={reloadPartai}
          />
        ),
      },
      {
        title: 'P',
        width: 30,
        render: ({ choice_code, sub_match_pause_status }) => (
          <ButtonPauseChoice
            match_id={match_id}
            game_type={game_type}
            choice_code={choice_code}
            st_pause={sub_match_pause_status}
            successCallback={reloadPartai}
          />
        ),
      },
    ],
    [match_id, game_type, reloadPartai],
  )
  return (
    <div className="table_cs_score w-100 d-flex" style={{ overflow: 'auto' }}>
      {dataGroup.map(dataSource => (
        <Table
          key={dataSource[0].away_score}
          rowKey="choice_code"
          bordered
          columns={columns}
          pagination={false}
          dataSource={dataSource}
          scroll={scroll}
        />
      ))}
    </div>
  )
}

const scroll = {
  x: 'max-content',
}

export default TableScore
