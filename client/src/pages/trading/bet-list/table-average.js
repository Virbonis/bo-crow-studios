import { Descriptions, Divider, Tooltip } from 'antd'
import React from 'react'
import Amount from 'components/blaise/custom/Amount'

const TableAverage = ({ data, gt }) => {
  if (!data) return null

  if (gt !== '1X2') {
    return (
      <>
        <Divider orientation="left" className="m-0">
          Average Odds
        </Divider>
        <Descriptions title="" layout="vertical" bordered size="small">
          <Descriptions.Item label="Home">
            <Tooltip title="Malay Odds">
              <Amount value={data.average.sum_my_odds_home} />
            </Tooltip>
          </Descriptions.Item>
          <Descriptions.Item label="Away">
            <Tooltip title="Malay Odds">
              <Amount value={data.average.sum_my_odds_away} />
            </Tooltip>
          </Descriptions.Item>
        </Descriptions>
      </>
    )
  }
  return (
    <>
      <Divider orientation="left" className="m-0">
        Average Odds
      </Divider>
      <Descriptions title="" layout="vertical" bordered size="small">
        <Descriptions.Item label="Home">
          <Tooltip title="Decimal Odds">
            <Amount value={getAverageOdds(data.home)} />
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Draw">
          <Tooltip title="Decimal Odds">
            <Amount value={getAverageOdds(data.draw)} />
          </Tooltip>
        </Descriptions.Item>
        <Descriptions.Item label="Away">
          <Tooltip title="Decimal Odds">
            <Amount value={getAverageOdds(data.away)} />
          </Tooltip>
        </Descriptions.Item>
      </Descriptions>
    </>
  )
}

const getAverageOdds = data => {
  if (!data) return 0
  if (data.length === 0 && data.length === 0) return 0
  let jumArray = 0
  const totalOdds = data.reduce((prev, item) => {
    if (item.void_id || item.bet_id === 0) return prev
    jumArray += 1
    return prev + item.odds
  }, 0)

  return totalOdds / jumArray
}

export default TableAverage
