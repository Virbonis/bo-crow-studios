import React from 'react'
import { Button, Col, Form, Row, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { CustomizeCell, useGetDateTimeBusinessHour, wrapperPopup } from 'components/blaise'
import { QueryRequestMoreOGT } from './query'
import DropdownSelectView from './dropdown-select-view'
import 'pages/trading/shared-components/trading.scss'
import TableMoreOGT from './table-more-ogt'

const intervalOptions = [
  { label: 'None', value: 0 },
  { label: '3s', value: 3 },
  { label: '5s', value: 5 },
  { label: '10s', value: 10 },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const RequestMoreOGT = wrapperDate(({ popup_id, defaultDateTime }) => {
  const [viewParameter, setViewParameter] = React.useState({
    popup_id,
    match_time_slot: 'Live',
    interval: 3,
    early_date: [defaultDateTime, defaultDateTime.clone().add(1, 'day')],
  })

  const { data = {}, isFetching, refetch } = QueryRequestMoreOGT({
    ...viewParameter,
    from_early_date: viewParameter.early_date?.[0].format('YYYY-MM-DD'),
    to_early_date: viewParameter.early_date?.[1].format('YYYY-MM-DD'),
    is_show_in_active: viewParameter.is_show_in_active ? 'Y' : 'N',
  })

  const onValuesChange = (changedValues, values) => {
    setViewParameter(prev => ({ ...prev, ...values }))
  }

  return (
    <>
      <Row justify="space-between" align="top">
        <Col>
          <Space align="start">
            <DropdownSelectView
              viewParameter={viewParameter}
              onValuesChange={onValuesChange}
              callbackSubmit={refetch}
            />
            <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
            <Form initialValues={viewParameter} onValuesChange={onValuesChange}>
              <Form.Item name="interval">
                <Select style={{ width: 75 }} options={intervalOptions} />
              </Form.Item>
            </Form>
          </Space>
        </Col>
      </Row>
      <TableMoreOGT
        refetch={refetch}
        dataSource={data.tableData}
        id="table-trading"
        bordered
        size="small"
        pagination={false}
        components={components}
        scroll={scroll}
        rowClassName={record => record.league_group && 'separator-league-color'}
      />
    </>
  )
})
const components = {
  body: {
    cell: CustomizeCell,
  },
}
const scroll = {
  x: 'max-content',
}
export default wrapperPopup(RequestMoreOGT)
