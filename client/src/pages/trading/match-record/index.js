import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, InputNumber, Radio, Row, Space, Form, Typography, message } from 'antd'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import actions from 'redux/match-record/actions'

const { Text } = Typography

const mapStateToProps = ({ matchRecord }) => ({
  editValue: matchRecord.editValue,
  visible: !isEmpty(matchRecord.editValue),
})
const mapDispatchToProps = (dispatch, { successCallback }) => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  UpdateGoal: payload => {
    dispatch({
      type: actions.UPDATE_GOAL,
      payload,
      successCallback: () => successCallback(payload.match_id),
    })
  },
  UpdateCard: payload => {
    dispatch({
      type: actions.UPDATE_CARD,
      payload,
      successCallback: () => successCallback(payload.match_id),
    })
  },
  UpdatePenalty: payload => {
    dispatch({
      type: actions.UPDATE_PENALTY,
      payload,
      successCallback: () => successCallback(payload.match_id),
    })
  },
})
const DrawerMatchRecord = React.memo(
  ({
    editValue,
    visible,
    CancelEdit,
    UpdateGoal,
    UpdateCard,
    UpdatePenalty,
    goal = true,
    card = true,
    penalty = true,
  }) => {
    const { match_id, home_posisi, away_posisi, st_penalty } = editValue
    return (
      <>
        <DragableModal
          title="Match Record"
          open={visible}
          onCancel={CancelEdit}
          footer={null}
          width={500}
        >
          {goal && (
            <GoalSection
              match_id={match_id}
              home_posisi={home_posisi}
              away_posisi={away_posisi}
              UpdateGoal={UpdateGoal}
            />
          )}
          <hr />
          {card && <CardSection data={editValue} UpdateCard={UpdateCard} />}
          <hr />
          {penalty && (
            <PenaltySection
              match_id={match_id}
              st_penalty={st_penalty}
              UpdatePenalty={UpdatePenalty}
            />
          )}
        </DragableModal>
      </>
    )
  },
)
const GoalSection = React.memo(({ match_id, home_posisi, away_posisi, UpdateGoal }) => {
  return (
    <Row align="middle">
      <Col span={6}>
        <Text strong>Goal</Text>
      </Col>
      <Col span={6}>
        <Space direction="vertical" size={0}>
          <Button
            className="w-100 bg-green text-white"
            onClick={() =>
              UpdateGoal({
                match_id,
                home_posisi: home_posisi + 1,
                away_posisi,
              })
            }
          >
            +1
          </Button>
          <Button className="w-100">{home_posisi}</Button>
          <Button
            className="w-100 bg-red text-white"
            onClick={() => {
              if (home_posisi - 1 < 0) return message.error('Score cannot be less than 0')
              return UpdateGoal({
                match_id,
                home_posisi: home_posisi - 1,
                away_posisi,
              })
            }}
          >
            -1
          </Button>
        </Space>
      </Col>
      <Col span={6}>
        <Space direction="vertical" size={0}>
          <Button
            className="w-100 bg-green text-white"
            onClick={() =>
              UpdateGoal({
                match_id,
                home_posisi,
                away_posisi: away_posisi + 1,
              })
            }
          >
            +1
          </Button>
          <Button className="w-100">{away_posisi}</Button>
          <Button
            className="w-100 bg-red text-white"
            onClick={() => {
              if (away_posisi - 1 < 0) return message.error('Score cannot be less than 0')
              return UpdateGoal({
                match_id,
                home_posisi,
                away_posisi: away_posisi - 1,
              })
            }}
          >
            -1
          </Button>
        </Space>
      </Col>
    </Row>
  )
})
const CardSection = React.memo(({ data, UpdateCard }) => {
  const [form] = Form.useForm()

  React.useLayoutEffect(() => {
    form.resetFields()
  }, [data, form])

  return (
    <Form
      form={form}
      onFinish={values => {
        UpdateCard({
          match_id: data.match_id,
          ...values,
        })
      }}
      initialValues={data}
    >
      <Row align="middle">
        <Col span={6}>
          <Text strong type="warning">
            Yellow Card
          </Text>
        </Col>
        <Col span={6}>
          <Form.Item
            className="m-0"
            name="home_yc"
            rules={[{ required: true, message: 'Cannot be empty' }]}
          >
            <InputNumber size="small" placeholder="Home" max={20} min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            className="m-0"
            name="away_yc"
            rules={[{ required: true, message: 'Cannot be empty' }]}
          >
            <InputNumber size="small" placeholder="Away" max={20} min={0} />
          </Form.Item>
        </Col>
      </Row>
      <Row align="middle">
        <Col span={6}>
          <Text strong type="danger">
            Red Card
          </Text>
        </Col>
        <Col span={6}>
          <Form.Item
            className="m-0"
            name="home_rc"
            rules={[{ required: true, message: 'Cannot be empty' }]}
          >
            <InputNumber size="small" placeholder="Home" max={5} min={0} />
          </Form.Item>
        </Col>
        <Col span={6}>
          <Form.Item
            className="m-0"
            name="away_rc"
            rules={[{ required: true, message: 'Cannot be empty' }]}
          >
            <InputNumber size="small" placeholder="Away" max={5} min={0} />
          </Form.Item>
        </Col>
        <Col span={6} className="text-right">
          <Button size="small" type="primary" htmlType="submit">
            Update Card
          </Button>
        </Col>
      </Row>
    </Form>
  )
})
const PenaltySection = React.memo(({ match_id, st_penalty, UpdatePenalty }) => {
  return (
    <Row align="middle">
      <Col span={6}>
        <Text strong>Penalty</Text>
      </Col>
      <Col span={18}>
        <Radio.Group
          defaultValue={st_penalty}
          onChange={e =>
            UpdatePenalty({
              match_id,
              st_penalty: e.target.value,
            })
          }
        >
          <Radio value="H">Home</Radio>
          <Radio value="A">Away</Radio>
          <Radio value="N">No Penalty</Radio>
        </Radio.Group>
      </Col>
    </Row>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMatchRecord)
