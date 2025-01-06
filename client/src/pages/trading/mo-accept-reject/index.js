import React from 'react'
import { Button, Form, Row, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import QueryAcceptRejectList from './query'
import FormAcceptReject from './form'
import TableAcceptReject from './table'

const MOAcceptReject = ({ match_id }) => {
  const [viewParameter, setViewParameter] = React.useState({
    interval: 3,
    ftht: 'FTHT',
    game_type: '-99',
  })

  const { data, isFetching, refetch } = QueryAcceptRejectList(
    {
      match_id,
      ...viewParameter,
    },
    () => formRef.current.checkAuto(),
  )

  const tableRef = React.useRef()
  const formRef = React.useRef()

  return (
    <>
      <Row>
        <Form
          size="small"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          initialValues={viewParameter}
          onValuesChange={values => {
            setViewParameter({ ...values })
          }}
          layout="inline"
        >
          <Space>
            <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
              Refresh
            </Button>
            <Form.Item name="interval" noStyle>
              <Select
                style={{ width: 75 }}
                size="small"
                options={[
                  { value: 0, label: 'None' },
                  { value: 3, label: '3s' },
                  { value: 5, label: '5s' },
                  { value: 10, label: '10s' },
                  { value: 15, label: '15s' },
                  { value: 30, label: '30s' },
                  { value: 60, label: '60s' },
                ]}
              />
            </Form.Item>
            <Form.Item name="ftht" noStyle>
              <Select
                style={{ width: 75 }}
                options={[
                  { value: 'FTHT', label: 'FT/HT' },
                  { value: 'FT', label: 'FT' },
                  { value: 'HT', label: 'HT' },
                ]}
              />
            </Form.Item>
            <Form.Item name="game_type">
              <Select
                style={{ width: 100 }}
                size="small"
                options={[
                  { value: '-99', label: 'Show All' },
                  { value: '03', label: 'HDP / OE' },
                  { value: '53', label: 'OU / OE' },
                ]}
              />
            </Form.Item>
          </Space>
        </Form>
      </Row>
      <FormAcceptReject
        match_id={match_id}
        data={data}
        ref={formRef}
        tableRef={tableRef}
        refetch={refetch}
      />
      <TableAcceptReject data={data} ref={tableRef} />
    </>
  )
}

export default MOAcceptReject
