import React from 'react'
import { Button, Checkbox, Col, Form, Row, Space, Table } from 'antd'
import { Amount } from 'components/blaise'
import StatusAutoOdds from 'helper/status-auto-odds'
import { FormItemOdds } from './form-item-odds'

const FormItemOddsCS = props => <FormItemOdds game_type={10} {...props} />
const SubSettingCS = ({
  game_type,
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

  const columns = React.useMemo(() => {
    const tempColumns = [
      {
        title: '1:0',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds1" />
            <FormItemOddsCS name="odds12" />
          </Space>
        ),
      },
      {
        title: '2:0',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds2" />
            <FormItemOddsCS name="odds13" />
          </Space>
        ),
      },
      {
        title: '2:1',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds3" />
            <FormItemOddsCS name="odds14" />
          </Space>
        ),
      },
      {
        title: '3:0',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds4" />
            <FormItemOddsCS name="odds15" />
          </Space>
        ),
      },
      {
        title: '3:1',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds5" />
            <FormItemOddsCS name="odds16" />
          </Space>
        ),
      },
      {
        title: '3:2',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds6" />
            <FormItemOddsCS name="odds17" />
          </Space>
        ),
      },
      {
        title: '4:0',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds7" />
            <FormItemOddsCS name="odds18" />
          </Space>
        ),
      },
      {
        title: '4:1',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds8" />
            <FormItemOddsCS name="odds19" />
          </Space>
        ),
      },
      {
        title: '4:2',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds9" />
            <FormItemOddsCS name="odds20" />
          </Space>
        ),
      },
      {
        title: '4:3',
        align: 'center',
        render: () => (
          <Space direction="vertical">
            <FormItemOddsCS name="odds10" />
            <FormItemOddsCS name="odds21" />
          </Space>
        ),
      },
      {
        title: '0:0',
        align: 'center',
        render: () => <FormItemOddsCS name="odds23" />,
      },
      {
        title: '1:1',
        align: 'center',
        render: () => <FormItemOddsCS name="odds24" />,
      },
      {
        title: '2:2',
        align: 'center',
        render: () => <FormItemOddsCS name="odds25" />,
      },
      {
        title: '3:3',
        align: 'center',
        render: () => <FormItemOddsCS name="odds26" />,
      },
      {
        title: '4:4',
        align: 'center',
        render: () => <FormItemOddsCS name="odds27" />,
      },
      {
        title: 'AOS',
        align: 'center',
        render: () => <FormItemOddsCS name="odds11" />,
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
    // 13: FH. Correct Score
    if (game_type === 13) {
      return tempColumns.filter((e, index) => ![6, 7, 8, 9, 14].includes(index))
    }
    return tempColumns
  }, [game_type])

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
        scroll={{ x: 'max-content' }}
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

export default SubSettingCS
