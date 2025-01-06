import React from 'react'
import { Button, Form, InputNumber, Table, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { onlyNumber } from 'utils'

const dataSource = [
  { type: 'EM', type_number: 2 },
  { type: 'TM', type_number: 1 },
  { type: 'TM6', type_number: 4 },
  { type: 'RB', type_number: 3 },
]
const columns = [
  { dataIndex: 'type', align: 'center' },
  {
    title: 'Step',
    align: 'center',
    render: ({ type_number }) => (
      <Form.Item name={`step${type_number}`}>
        <InputNumber controls={false} className="w-100" maxLength={3} onKeyPress={onlyNumber} />
      </Form.Item>
    ),
  },
  {
    title: (
      <>
        <Tooltip title="Odds will jump if liabilities reach this figure" className="mr-1">
          <InfoCircleOutlined />
        </Tooltip>
        Odds Trigger
      </>
    ),
    align: 'center',
    render: ({ type_number }) => (
      <Form.Item name={`odds_trigger${type_number}`}>
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
    ),
  },
  {
    title: (
      <>
        <Tooltip title="Maximum stock of each member on each bet position" className="mr-1">
          <InfoCircleOutlined />
        </Tooltip>
        Max Limit
      </>
    ),
    align: 'center',
    render: ({ type_number }) => (
      <Form.Item name={`max_limit${type_number}`}>
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
    ),
  },
  {
    title: (
      <>
        <Tooltip title="Maximum amount allowed in a single bet" className="mr-1">
          <InfoCircleOutlined />
        </Tooltip>
        Max Bet
      </>
    ),
    align: 'center',
    render: ({ type_number }) => (
      <Form.Item name={`max_bet${type_number}`}>
        <InputNumber
          controls={false}
          className="w-100"
          maxLength={12}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
          onKeyPress={onlyNumber}
        />
      </Form.Item>
    ),
  },
  {
    title: (
      <>
        <Tooltip title="Limit Auto Pause" className="mr-1">
          <InfoCircleOutlined />
        </Tooltip>
        LAP
      </>
    ),
    align: 'center',
    render: ({ type_number }) => (
      <Form.Item name={`lap${type_number}`}>
        <InputNumber controls={false} className="input-right" />
      </Form.Item>
    ),
  },
]
// Sub Match Setting AH(0/2), OU(5/6), OE(3/16), ML(12), WNW(63/64)
const SubMatchProfile = ({
  // match_id,
  // sub_match_id,

  initialValuesProfile,
  onFinishProfile,
}) => {
  const [formProfile] = Form.useForm()

  React.useEffect(() => {
    formProfile.resetFields()
  }, [formProfile, initialValuesProfile])

  return (
    <>
      <Form form={formProfile} initialValues={initialValuesProfile} onFinish={onFinishProfile}>
        <Table
          rowKey="type"
          size="small"
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          title={() => (
            <div align="right">
              <Button type="primary" htmlType="submit">
                Update
              </Button>
            </div>
          )}
        />
      </Form>
      <br />
    </>
  )
}

export default SubMatchProfile
