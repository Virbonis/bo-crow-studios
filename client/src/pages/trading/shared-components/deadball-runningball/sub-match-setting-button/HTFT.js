import React from 'react'
import { Button, Checkbox, Col, Form, Row, Table } from 'antd'
import { Amount } from 'components/blaise'
import StatusAutoOdds from 'helper/status-auto-odds'
import { FormItemOdds } from './form-item-odds'

const FormItemOddsHTFT = props => <FormItemOdds game_type={9} {...props} />
const SubSettingHTFT = ({
  // game_type,
  match_time_slot,

  initialValuesSetting,
  onFinishSetting,
  onFormSettingValuesChange,
}) => {
  const [formSetting] = Form.useForm()
  const { follow_leeching } = initialValuesSetting

  React.useEffect(() => {
    formSetting.resetFields()
  }, [formSetting, initialValuesSetting])

  const columns = [
    {
      title: 'HH',
      dataIndex: 'odds1',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds1" />,
    },
    {
      title: 'HD',
      dataIndex: 'odds2',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds2" />,
    },
    {
      title: 'HA',
      dataIndex: 'odds3',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds3" />,
    },
    {
      title: 'DH',
      dataIndex: 'odds4',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds4" />,
    },
    {
      title: 'DD',
      dataIndex: 'odds5',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds5" />,
    },
    {
      title: 'DA',
      dataIndex: 'odds6',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds6" />,
    },
    {
      title: 'AH',
      dataIndex: 'odds7',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds7" />,
    },
    {
      title: 'AD',
      dataIndex: 'odds8',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds8" />,
    },
    {
      title: 'AA',
      dataIndex: 'odds9',
      align: 'center',
      render: () => <FormItemOddsHTFT name="odds9" />,
    },
    {
      title: 'Margin',
      align: 'center',
      width: 100,
      render: () => (
        <Form.Item name="odds_margin" noStyle>
          <Amount />
        </Form.Item>
      ),
    },
  ]

  return (
    <Form
      labelCol={{ span: 12 }}
      wrapperCol={{ span: 12 }}
      labelAlign="right"
      form={formSetting}
      initialValues={initialValuesSetting}
      onFinish={onFinishSetting}
      onValuesChange={onFormSettingValuesChange(formSetting)}
    >
      <Table
        size="small"
        columns={columns}
        dataSource={[initialValuesSetting]}
        pagination={false}
        bordered
      />
      <br />
      <Row>
        <Col span={8}>
          <Form.Item name="lock_leeching" label="Lock Leeching" valuePropName="checked">
            <Checkbox disabled />
          </Form.Item>
          <Form.Item label="Follow Leeching">{StatusAutoOdds(follow_leeching)}</Form.Item>
          <Form.Item name="auto_pause" label="Auto Pause" valuePropName="checked">
            <Checkbox disabled />
          </Form.Item>
          <Form.Item name="sub_match_parlay_status" label="Parlay" valuePropName="checked">
            <Checkbox />
          </Form.Item>
        </Col>
      </Row>
      {match_time_slot !== 'Started' && (
        <div align="right">
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </div>
      )}
    </Form>
  )
}

export default SubSettingHTFT
