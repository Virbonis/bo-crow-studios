import { Button, Space, Table } from 'antd'
import { Amount } from 'components/blaise'
import { gameTypeDescription, listGT } from 'helper'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/auto-add-sub-match-more/actions'

const mapDispatchToProps = (dispatch, { successCallback }) => ({
  UpdateSubMatchMore: payload => {
    dispatch({
      type: actions.UPDATE_SUB_MATCH_MORE,
      payload,
      successCallback,
    })
  },
})
const ContentSoccer = ({ match_id, list, UpdateSubMatchMore }) => {
  const [selections, setSelections] = React.useState([])
  const setOnRow = React.useCallback(
    row => {
      return {
        className: selections.includes(row.game_type) ? 'bg-light-pink' : '',
        onClick: () => {
          if (selections.includes(row.game_type)) {
            setSelections(selections.filter(x => x !== row.game_type))
          } else {
            setSelections([...selections, row.game_type])
          }
        },
      }
    },
    [selections],
  )
  const isDisabledUpdateOdds = selections.length === 0
  const onUpdateOdds = () => {
    const selectedList = selections.reduce((arr, cur) => {
      const item = list.find(x => x.game_type === cur)
      item.odds_string = getOddsString(item)
      return arr.concat(item)
    }, [])
    UpdateSubMatchMore({
      match_id,
      arr: selectedList,
    })
  }

  return (
    <>
      <div
        style={{
          width: '100%',
          overflow: 'auto scroll',
          maxHeight: '500px',
        }}
      >
        {Object.entries(setGT).map(([gt, columns]) => {
          const dataSource = list.filter(y => listGT[gt].includes(y.game_type))
          return (
            <TableGameType key={gt} dataSource={dataSource} columns={columns} setOnRow={setOnRow} />
          )
        })}
      </div>
      <Button
        type="ghost"
        className="w-100 bg-light-pink"
        onClick={onUpdateOdds}
        disabled={isDisabledUpdateOdds}
      >
        Update Odds
      </Button>
    </>
  )
}

const setGT = {
  OE: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Odd',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Even',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  '1X2': [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Home',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  DC: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '1X',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: '12',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'X2',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
  ],
  TG: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '0-1',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: '2-3',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: '4-6',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: '7 & OVER',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
  ],
  FHTG: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '0-1',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: '2-3',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: '4 & OVER',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
  ],
  FGLG: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'HF',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'HL',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AF',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AL',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
    {
      title: 'NG',
      dataIndex: 'odds_5',
      render: text => <Amount value={text} />,
    },
  ],
  HTFT: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'HH',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'HD',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'HA',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'DH',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
    {
      title: 'DD',
      dataIndex: 'odds_5',
      render: text => <Amount value={text} />,
    },
    {
      title: 'DA',
      dataIndex: 'odds_6',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AH',
      dataIndex: 'odds_7',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AD',
      dataIndex: 'odds_8',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AA',
      dataIndex: 'odds_9',
      render: text => <Amount value={text} />,
    },
  ],
  CS: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '1:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_1} />
          <Amount value={row.odds_12} />
        </Space>
      ),
    },
    {
      title: '2:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_2} />
          <Amount value={row.odds_13} />
        </Space>
      ),
    },
    {
      title: '2:1',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_3} />
          <Amount value={row.odds_14} />
        </Space>
      ),
    },
    {
      title: '3:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_4} />
          <Amount value={row.odds_15} />
        </Space>
      ),
    },
    {
      title: '3:1',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_5} />
          <Amount value={row.odds_16} />
        </Space>
      ),
    },
    {
      title: '3:2',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_6} />
          <Amount value={row.odds_17} />
        </Space>
      ),
    },
    {
      title: '4:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_7} />
          <Amount value={row.odds_18} />
        </Space>
      ),
    },
    {
      title: '4:1',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_8} />
          <Amount value={row.odds_19} />
        </Space>
      ),
    },
    {
      title: '4:2',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_9} />
          <Amount value={row.odds_20} />
        </Space>
      ),
    },
    {
      title: '4:3',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_10} />
          <Amount value={row.odds_21} />
        </Space>
      ),
    },

    {
      title: '0:0',
      dataIndex: 'odds_23',
      render: text => <Amount value={text} />,
    },
    {
      title: '1:1',
      dataIndex: 'odds_24',
      render: text => <Amount value={text} />,
    },
    {
      title: '2:2',
      dataIndex: 'odds_25',
      render: text => <Amount value={text} />,
    },
    {
      title: '3:3',
      dataIndex: 'odds_26',
      render: text => <Amount value={text} />,
    },
    {
      title: '4:4',
      dataIndex: 'odds_27',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AOS',
      dataIndex: 'odds_11',
      render: text => <Amount value={text} />,
    },
  ],
  FHCS: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '1:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_1} />
          <Amount value={row.odds_12} />
        </Space>
      ),
    },
    {
      title: '2:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_2} />
          <Amount value={row.odds_13} />
        </Space>
      ),
    },
    {
      title: '2:1',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_3} />
          <Amount value={row.odds_14} />
        </Space>
      ),
    },
    {
      title: '3:0',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_4} />
          <Amount value={row.odds_15} />
        </Space>
      ),
    },
    {
      title: '3:1',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_5} />
          <Amount value={row.odds_16} />
        </Space>
      ),
    },
    {
      title: '3:2',
      render: row => (
        <Space direction="vertical">
          <Amount value={row.odds_6} />
          <Amount value={row.odds_17} />
        </Space>
      ),
    },

    {
      title: '0:0',
      dataIndex: 'odds_23',
      render: text => <Amount value={text} />,
    },
    {
      title: '1:1',
      dataIndex: 'odds_24',
      render: text => <Amount value={text} />,
    },
    {
      title: '2:2',
      dataIndex: 'odds_25',
      render: text => <Amount value={text} />,
    },
    {
      title: '3:3',
      dataIndex: 'odds_26',
      render: text => <Amount value={text} />,
    },
    {
      title: 'AOS',
      dataIndex: 'odds_11',
      render: text => <Amount value={text} />,
    },
  ],
  FGM: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Free Kick',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Header',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'No Goal',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Own Goal',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Penalty',
      dataIndex: 'odds_5',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Shot',
      dataIndex: 'odds_6',
      render: text => <Amount value={text} />,
    },
  ],
  TOTFG: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: '27th Minute Onwards',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Up To And Including The 26th Minute',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'No Goal',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
  ],
  ITA: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
      ellipsis: true,
    },
    {
      title: 'None',
      dataIndex: 'odds_6',
      render: text => <Amount value={text} />,
    },
    {
      title: '1 Min',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: '2 Min',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: '3 Min',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: '4 Min',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
    {
      title: '5 Min More',
      dataIndex: 'odds_5',
      render: text => <Amount value={text} />,
    },
  ],
  WM: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home 1 Goal',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home 2 Goal',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home 3 Goal',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home 4 Goal',
      dataIndex: 'odds_5',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away 1 Goal',
      dataIndex: 'odds_6',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away 2 Goal',
      dataIndex: 'odds_7',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away 3 Goal',
      dataIndex: 'odds_8',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away 4 Goal',
      dataIndex: 'odds_9',
      render: text => <Amount value={text} />,
    },
    {
      title: 'No Goal',
      dataIndex: 'odds_10',
      render: text => <Amount value={text} />,
    },
  ],
  HNB: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Away Team',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  ANB: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Home Team',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  DNB: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Home',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  '3WH': [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Hdp',
      dataIndex: 'handicap',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home Team',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away Team',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
  ],
  CSH: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Home Yes',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Home No',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away Yes',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away No',
      dataIndex: 'odds_4',
      render: text => <Amount value={text} />,
    },
  ],
  YN: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Yes',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'No',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  HA: [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
    },
    {
      title: 'Home',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Away',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
  ],
  '12HD': [
    {
      title: 'Game Type',
      dataIndex: 'game_type',
      render: text => gameTypeDescription[text]?.long,
      width: 250,
      ellipsis: true,
    },
    {
      title: '1st Half',
      dataIndex: 'odds_1',
      render: text => <Amount value={text} />,
    },
    {
      title: '2nd Half',
      dataIndex: 'odds_2',
      render: text => <Amount value={text} />,
    },
    {
      title: 'Draw',
      dataIndex: 'odds_3',
      render: text => <Amount value={text} />,
    },
  ],
}
const TableGameType = ({ dataSource, columns, setOnRow }) => {
  if (dataSource.length === 0) return null

  return (
    <Table
      size="small"
      bordered
      dataSource={dataSource}
      columns={columns}
      rowKey="game_type"
      pagination={false}
      onRow={setOnRow}
      scroll={{ x: 'max-content' }}
    />
  )
}

const getOddsString = item => {
  switch (item.game_type) {
    case 28:
    case 37:
    case 38:
      return generateOdds_String(2, item)
    case 15:
    case 25:
    case 36:
    case 39:
      return generateOdds_String(3, item)
    case 7:
    case 40:
      return generateOdds_String(4, item)
    case 14:
      return generateOdds_String(5, item)
    case 21:
    case 27:
      return generateOdds_String(6, item)
    case 9:
      return generateOdds_String(9, item)
    case 10:
    case 13:
      return generateOdds_String(27, item)
    case 35:
      return generateOdds_String(10, item)
    case listGT.OE.includes(item.game_type):
    case listGT.YN.includes(item.game_type):
    case listGT.HA.includes(item.game_type):
      return generateOdds_String(2, item)
    case listGT['1X2'].includes(item.game_type):
    case listGT['12HD'].includes(item.game_type):
      return generateOdds_String(3, item)
    default:
      return ''
  }
}
const generateOdds_String = (length, item) => {
  const odds_string = []
  for (let i = 1; i <= length; i += 1) {
    odds_string.push(item[`odds_${i}`])
  }
  return odds_string.join('^')
}

export default connect(null, mapDispatchToProps)(ContentSoccer)
