import React from 'react'
import { Col, Row, Popover, Button } from 'antd'

const listVIP = [
  { name: 'VIP 27', style: 'vip_27' },
  { name: 'VIP 28', style: 'vip_28' },
  { name: 'VIP 23', style: 'vip_23' },
  { name: 'VIP 29', style: 'vip_29' },
  { name: 'VIP 18', style: 'vip_18' },
  { name: 'VIP 15', style: 'vip_15' },
  { name: 'VIP 8', style: 'vip_8' },
  { name: 'VIP 11', style: 'vip_11' },
  { name: 'VIP 9', style: 'vip_9' },
  { name: 'VIP 17', style: 'vip_17' },
  { name: 'VIP 14', style: 'vip_14' },
  { name: 'VIP 12', style: 'vip_12' },
  { name: 'VIP 1, 3', style: 'vip_1' },
  { name: 'VIP 16', style: 'vip_16' },
  { name: 'VIP 5', style: 'vip_5' },
  { name: 'VIP 6', style: 'vip_6' },
  { name: 'VIP 7 & 26', style: 'vip_7_26' },
  { name: 'VIP 7', style: 'vip_7' },
  { name: 'VIP 26', style: 'vip_26' },
  { name: 'VIP 10', style: 'vip_10' },
  { name: 'VIP 21', style: 'vip_21' },
  { name: 'VIP 23 & 24', style: 'vip_23_24' },
  { name: 'VIP 25', style: 'vip_25' },
  { name: 'VIP 4', style: 'vip_4' },
  { name: 'VIP 24', style: 'vip_24' },
  { name: 'VIP 13, 2', style: 'vip_13' },
]
const listStatusTicket = [
  { name: 'Pending', style: 'pending_hdp' },
  { name: 'Pending OU', style: 'pending_ou' },
  { name: 'Pending 1X2', style: 'pending_1x2' },
  { name: 'Long Pending', style: 'pending_long' },
  { name: 'Reject', style: 'reject' },
]

const Help = () => {
  return (
    <Popover
      placement="bottomLeft"
      trigger={['click']}
      content={<TableHelp />}
      overlayInnerStyle={{ width: 300 }}
    >
      <Button size="small" type="default">
        Help
      </Button>
    </Popover>
  )
}
const TableHelp = () => {
  return (
    <Row gutter={10}>
      <Col span={12}>
        <table className="w-100 table-bordered text-center">
          <tbody>
            {listVIP.map(item => (
              <tr key={item.name}>
                <td className={item.style}>{item.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Col>
      <Col span={12}>
        <table className="w-100 table-bordered text-center">
          <tbody>
            {listStatusTicket.map(item => (
              <tr key={item.name}>
                <td className={item.style}>&nbsp;</td>
                <td className="column2" style={{ color: 'black' }}>
                  &nbsp; {item.name}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Col>
    </Row>
  )
}

export default Help
