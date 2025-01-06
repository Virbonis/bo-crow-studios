import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, Divider, Row, Select } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/online-list/actions'
import { SelectMultipleAll, useInterval } from 'components/blaise'
import TableDetail from './table-detail'

const mapStateToProps = ({ onlineList }) => ({
  dataTable: onlineList.dataMulti || [],
  loading: onlineList.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadDetail: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Online List',
    })
  },
})

const intervalOptions = [
  { value: 0, label: 'None' },
  { value: 3, label: 3 },
  { value: 5, label: 5 },
  { value: 10, label: 10 },
]
const gameTypeGroupOptions = [
  {
    label: 'Dead Ball',
    options: [
      { value: '0~db', label: 'Handicap' },
      { value: '5~db', label: 'Over/Under' },
      { value: '3~db', label: 'Odd/Even' },
      { value: '1~db', label: '1X2' },
      { value: '2~db', label: 'FH. Handicap' },
      { value: '6~db', label: 'FH. Over/Under' },
      { value: '16~db', label: 'FH. Odd/Even' },
      { value: '8~db', label: 'FH. 1X2' },
    ],
  },
  {
    label: 'Running Ball',
    options: [
      { value: '0~rb', label: 'Handicap' },
      { value: '5~rb', label: 'Over/Under' },
      { value: '2~rb', label: 'FH. Handicap' },
      { value: '6~rb', label: 'FH. Over/Under' },
    ],
  },
]
const getFilterGameType = (type, data) => {
  return data
    ?.filter(e => e.includes(type))
    .join(',')
    .replaceAll(type, '')
}

const OnlineListDetail = ({
  match_ids,
  reportType = 'multi3',
  fromPage = 'deadball',
  dataTable,
  LoadDetail,
  loading,
}) => {
  const [interval, setInterval] = React.useState(3)
  const [gameType, setGameType] = React.useState(
    fromPage === 'deadball' ? ['0~db', '5~db', '1~db', '2~db', '6~db', '8~db'] : ['0~rb', '5~rb'],
  )

  const onFetch = React.useCallback(() => {
    const deadBall = getFilterGameType('~db', gameType)
    const runBall = getFilterGameType('~rb', gameType)
    LoadDetail({ match_ids, game_type_dead: deadBall, game_type_run: runBall })
  }, [LoadDetail, match_ids, gameType])
  const [timer, reload] = useInterval(interval, onFetch)

  return (
    <>
      <Row gutter={(8, 8)}>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
          <Button className="w-50" onClick={reload} icon={<ReloadOutlined />} loading={loading}>
            Refresh {interval !== 0 && ` (${timer})`}
          </Button>
          <Select
            className="w-50"
            options={intervalOptions}
            value={interval}
            onChange={setInterval}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
          <SelectMultipleAll
            className="w-100"
            value={gameType}
            onChange={setGameType}
            options={gameTypeGroupOptions}
          />
        </Col>
      </Row>
      {match_ids.split(',')?.map(e => {
        const dataGameType = dataTable.filter(x => x.match_id === parseInt(e, 10))
        const dataHeader = dataGameType[0] || {}
        return (
          dataGameType.length > 0 && (
            <div key={e}>
              <Divider />
              <TableDetail
                dataTableGameType={dataGameType}
                {...dataHeader}
                reportType={reportType}
              />
            </div>
          )
        )
      })}
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(OnlineListDetail)
