import { Button, Form, InputNumber, Radio, Spin, Table } from 'antd'
import React, { useEffect } from 'react'

import { connect } from 'react-redux'
import actions from 'redux/scoring-match/actions'

const mapStateToProps = ({ scoringMatch }) => ({
  loadingData: scoringMatch.loadingDetailData,
  scoreDetail: scoringMatch.detailData.result?.[0],
  scoreDetailLive: scoringMatch.detailData.result_live?.[0],
})

const mapDispatchToProps = dispatch => ({
  LoadScoreDetail: payload => {
    dispatch({
      type: actions.LOAD_SCORING_DETAIL_MATCH,
      payload,
      source: 'Scoring Match',
    })
  },
  UpdateScoreDetail: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORING_DETAIL,
      payload,
      successCallback,
      source: 'Scoring Match',
    })
  },
})

const EditScoringDetail = ({
  editValue,
  successCallback,
  loadingData,
  scoreDetail,
  scoreDetailLive,
  LoadScoreDetail,
  UpdateScoreDetail,
}) => {
  const [form] = Form.useForm()

  useEffect(() => {
    LoadScoreDetail(editValue)
  }, [editValue, LoadScoreDetail])

  useEffect(() => {
    if (scoreDetail) form.setFieldsValue(scoreDetail)
  }, [form, scoreDetail])

  const copyFromLiveScoreHandler = () => {
    const { st_general, ...rest } = scoreDetailLive
    form.setFieldsValue(rest)
  }

  return (
    <Spin spinning={loadingData}>
      <Form
        labelAlign="left"
        form={form}
        id="detail-form"
        onFinish={values => {
          UpdateScoreDetail({ ...values, match_id: editValue.match_id }, successCallback)
        }}
      >
        {[12, 53].includes(editValue.sport_id) && (
          <>
            <Form.Item name="st_general">
              <Radio.Group>
                <Radio value="">by Quarter</Radio>
                <Radio value="H">by Half</Radio>
              </Radio.Group>
            </Form.Item>
          </>
        )}
        <Table
          size="small"
          rowKey={record => record.match_id}
          dataSource={[editValue]}
          columns={getColumns(editValue.sport_id)}
          pagination={false}
        />
        <div className="mt-3">
          {scoreDetailLive && (
            <Button onClick={() => copyFromLiveScoreHandler()} type="primary">
              Copy From Live Score
            </Button>
          )}
        </div>
      </Form>
    </Spin>
  )
}

const getColumns = sport_id => {
  if ([11, 16].includes(sport_id)) {
    return [
      {
        title: '1 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '2 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '3 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '4 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '5 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
    ]
  }
  if ([12, 34, 53].includes(sport_id)) {
    return [
      {
        title: () => ([12, 53].includes(sport_id) ? '1Q/1H' : '1Q'),
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: () => ([12, 53].includes(sport_id) ? '2Q/2H' : '2Q'),
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '3Q',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '4Q',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'OT',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
    ]
  }
  if ([26].includes(sport_id)) {
    return [
      {
        title: '1 Period',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '2 Period',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '3 Period',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'OT',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
    ]
  }
  if ([32].includes(sport_id)) {
    return [
      {
        title: '1 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '2 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '3 Set',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
    ]
  }
  if ([18].includes(sport_id)) {
    return [
      {
        title: '1 st',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_1">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '2 nd',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_2">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '3 rd',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_3">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '4 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_4">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '5 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_5">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '6 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_6">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_6">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '7 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_7">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_7">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '8 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_8">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_8">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: '9 th',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_9">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_9">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
      {
        title: 'EI',
        align: 'center',
        render: () => (
          <>
            <Form.Item name="home_10">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
            <Form.Item name="away_10">
              <InputNumber style={{ width: '35px' }} controls={false} min={0} maxLength={3} />
            </Form.Item>
          </>
        ),
      },
    ]
  }
  return null
}

export default connect(mapStateToProps, mapDispatchToProps)(EditScoringDetail)
