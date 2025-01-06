import React from 'react'
import { connect } from 'react-redux'
import { Button, Col, InputNumber, Row, Form, Checkbox, Select, Spin, Space } from 'antd'
import { isEmpty } from 'lodash'
import DragableModal from 'components/blaise/custom/DragableModal'
import actions from 'redux/mo-scoring/actions'

const mapStateToProps = ({ moScoring }) => ({
  editValue: moScoring.editValue,
  data: moScoring.data,
  loading: moScoring.loading,
  visible: !isEmpty(moScoring.editValue),
})
const mapDispatchToProps = dispatch => ({
  CancelEdit: () => dispatch({ type: actions.CLEAN_UP }),
  UpdateScoreMatch: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORE_MATCH,
      payload,
      successCallback,
    })
  },
  GetFinalScore: payload =>
    dispatch({ type: actions.GET_FINAL_SCORE, payload, source: 'mo-scoring' }),
})

const DrawerMOScoring = React.memo(
  ({ loading, data, editValue, visible, CancelEdit, UpdateScoreMatch, GetFinalScore }) => {
    if (!visible) return null
    const { match_id, home_name, away_name } = editValue
    React.useEffect(() => {
      GetFinalScore({ match_id })
    }, [GetFinalScore, match_id])

    return (
      <>
        <DragableModal
          title={`Final Score - ${match_id} - ${home_name} - ${away_name}`}
          open={visible}
          onCancel={CancelEdit}
          footer={null}
          width={300}
        >
          <Content
            data={data}
            UpdateScoreMatch={UpdateScoreMatch}
            CancelEdit={CancelEdit}
            loading={loading}
          />
        </DragableModal>
      </>
    )
  },
)

const Content = React.memo(({ data, loading, UpdateScoreMatch, CancelEdit }) => {
  if (loading && isEmpty(data)) return <Spin />
  const { match_id } = data
  data.fglg_goal = `${data.fglg_first_goal}^${data.fglg_last_goal}`
  data.ht_process = data.ht_process === 'Y'
  data.ft_process = data.ft_process === 'Y'
  data.fglg_process = data.fglg_process === 'Y'

  const zeroFGLG = data.fglg_count === 0
  return (
    <Form
      onFinish={values => {
        // check if any is scoring
        if (
          (!data.ht_process && values.ht_process) ||
          (!data.ft_process && values.ft_process) ||
          (!(data.fglg_process || zeroFGLG) && values.fglg_process)
        ) {
          UpdateScoreMatch(
            {
              match_id,
              fglg_first_goal: Number(values.fglg_goal.split('^')[0]),
              fglg_last_goal: Number(values.fglg_goal.split('^')[1]),
              ...values,
            },
            CancelEdit,
          )
        } else CancelEdit()
      }}
      initialValues={data}
    >
      <Row>
        <Col span={6}>Half Time</Col>
        <Col span={12}>
          <Space.Compact>
            <Form.Item name="ht_home_score" rules={[getValidatorIsEmptyScoring('ht_process')]}>
              <InputNumber
                className="w-100"
                placeholder="Home"
                min={0}
                disabled={data.ht_process}
              />
            </Form.Item>
            <Form.Item name="ht_away_score" rules={[getValidatorIsEmptyScoring('ht_process')]}>
              <InputNumber
                className="w-100"
                placeholder="Away"
                min={0}
                disabled={data.ht_process}
              />
            </Form.Item>
          </Space.Compact>
        </Col>
        <Col span={6} className="text-right">
          <Form.Item name="ht_process" valuePropName="checked">
            <Checkbox disabled={data.ht_process}>Score</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6}>Full Time</Col>
        <Col span={12}>
          <Space.Compact>
            <Form.Item
              name="fs_home_score"
              rules={[
                getValidatorIsEmptyScoring('ft_process'),
                getValidatorIsLowerScoring('ht_home_score'),
              ]}
            >
              <InputNumber
                className="w-100"
                placeholder="Home"
                min={0}
                disabled={data.ft_process}
              />
            </Form.Item>
            <Form.Item
              name="fs_away_score"
              rules={[
                getValidatorIsEmptyScoring('ft_process'),
                getValidatorIsLowerScoring('ht_away_score'),
              ]}
            >
              <InputNumber
                className="w-100"
                placeholder="Away"
                min={0}
                disabled={data.ft_process}
              />
            </Form.Item>
          </Space.Compact>
        </Col>
        <Col span={6} className="text-right">
          <Form.Item name="ft_process" valuePropName="checked">
            <Checkbox disabled={data.ft_process}>Score</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col span={6}>FGLG</Col>
        <Col span={12}>
          <Form.Item name="fglg_goal">
            <Select
              className="w-100"
              disabled={data.fglg_process || zeroFGLG}
              options={[
                { value: '0^0', label: 'NG' },
                { value: '-1^-1', label: 'H - H' },
                { value: '-1^1', label: 'H - A' },
                { value: '1^-1', label: 'A - H' },
                { value: '1^1', label: 'A - A' },
              ]}
            />
          </Form.Item>
        </Col>
        <Col span={6} className="text-right">
          <Form.Item name="fglg_process" valuePropName="checked">
            <Checkbox disabled={data.fglg_process || zeroFGLG}>Score</Checkbox>
          </Form.Item>
        </Col>
      </Row>
      <Row justify="end">
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Row>
    </Form>
  )
})

const getValidatorIsEmptyScoring = (process_field = 'ht_process') => ({ getFieldValue }) => {
  return {
    validator(_, value) {
      const isScoring = getFieldValue(process_field)

      if (isScoring && value === null) return Promise.reject(new Error('Cannot be empty'))
      return Promise.resolve()
    },
  }
}
const getValidatorIsLowerScoring = (ht_field = 'ht_home_score') => ({ getFieldValue }) => ({
  validator(_, fsValue) {
    const isScoring = getFieldValue('ft_process')
    if (!isScoring) return Promise.resolve()

    const htValue = getFieldValue(ht_field)
    if (isScoring && htValue > fsValue)
      return Promise.reject(new Error('Cannot lower than Half Time'))
    return Promise.resolve()
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(DrawerMOScoring)
