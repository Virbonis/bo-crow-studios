import React from 'react'
import { Row, Col } from 'antd'
import { Amount } from 'components/blaise'

const Summary = ({ data }) => {
  if (!data) return null
  if (data.home.length === 0 && data.away.length === 0) return null

  const totalHome = data.home.reduce((prev, item) => {
    if (item.void_id || item.bet_id === 0) return prev
    return prev + item.bet_amount_comp
  }, 0)
  const totalAway = data.away.reduce((prev, item) => {
    if (item.void_id || item.bet_id === 0) return prev
    return prev + item.bet_amount_comp
  }, 0)
  const total = totalHome - totalAway

  return (
    <>
      <Row>
        <Col span={12}>
          <strong>Difference:</strong>
        </Col>
        <Col span={12} className="text-right">
          <Amount bold value={total} />
        </Col>
      </Row>
    </>
  )
}
export default Summary
