import React from 'react'
import { Button, Checkbox, Col, Form, Space, Row, Table } from 'antd'
import { Amount, InputDecimal } from 'components/blaise'
import StatusAutoOdds from 'helper/status-auto-odds'
import { FormItemOdds } from './form-item-odds'

const FormItemOddsTG = props => <FormItemOdds game_type={7} {...props} />

// Sub Match Setting TG/FHTG(7/36)
const SubSettingTG = ({
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

  const columns = React.useMemo(
    () => [
      {
        title: '0 - 1',
        align: 'center',
        render: () => <FormItemOddsTG name="odds1" />,
      },
      {
        title: '2 - 3',
        align: 'center',
        render: () => <FormItemOddsTG name="odds2" />,
      },
      ...(game_type === 7
        ? [
            {
              title: '4 - 6',
              align: 'center',
              render: () => <FormItemOddsTG name="odds3" />,
            },
            {
              title: '7 & Over',
              align: 'center',
              render: () => <FormItemOddsTG name="odds4" asOddsX={game_type === 7} />,
            },
          ]
        : [
            {
              title: '4 & Over',
              align: 'center',
              render: () => <FormItemOddsTG name="odds3" asOddsX={game_type === 36} />,
            },
          ]),
      {
        title: 'Margin',
        align: 'center',
        width: 100,
        render: () => {
          return (
            <Space>
              <Form.Item name="st_odds_margin" valuePropName="checked" noStyle>
                <Checkbox />
              </Form.Item>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.st_odds_margin !== currentValues.st_odds_margin
                }
              >
                {({ getFieldValue }) => {
                  const isChecked = getFieldValue('st_odds_margin')
                  return (
                    <Form.Item name="odds_margin" noStyle>
                      {!isChecked ? <Amount /> : <InputDecimal />}
                    </Form.Item>
                  )
                }}
              </Form.Item>
            </Space>
          )
        },
      },
    ],
    [game_type],
  )

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

export default SubSettingTG
