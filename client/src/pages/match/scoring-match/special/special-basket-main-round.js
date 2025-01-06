import { Button, Checkbox, Col, Form, Input, message, Row, Space, Table, Typography } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/scoring-match/actions'

const { Text } = Typography
const mapDispatchToProps = dispatch => ({
  UpdateScore: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORE_MAIN_ROUND,
      payload,
      successCallback,
      source: 'Scoring Match Special',
    })
  },
})

const MainRoundScoreBasketSpecial = ({
  score = [],
  livescore = [],
  home,
  away,
  UpdateScore,
  successCallback,
}) => {
  const [formScore] = Form.useForm()
  const [isHalf, setHalf] = React.useState(false)

  const roundList = ['q1', 'q2', 'q3', 'q4', 'ot', 'ht', 'ft']
  const enableColumn = [
    score[0]?.is_enable_q1 === 'Y',
    score[0]?.is_enable_q2 === 'Y',
    score[0]?.is_enable_q3 === 'Y',
    score[0]?.is_enable_q4 === 'Y',
    score[0]?.is_enable_ot === 'Y',
    score[0]?.is_enable_ht === 'Y',
    score[0]?.is_enable_ft === 'Y',
  ]
  const dataMainRound = [
    {
      name: home,
      q1: score[0]?.home_q1,
      q2: score[0]?.home_q2,
      q3: score[0]?.home_q3,
      q4: score[0]?.home_q4,
      ot: score[0]?.home_ot,
      ht: score[0]?.home_ht,
      ft: score[0]?.home_ft,
    },
    {
      name: away,
      q1: score[0]?.away_q1,
      q2: score[0]?.away_q2,
      q3: score[0]?.away_q3,
      q4: score[0]?.away_q4,
      ot: score[0]?.away_ot,
      ht: score[0]?.away_ht,
      ft: score[0]?.away_ft,
    },
  ]
  const dataLiveScore = [
    {
      name: home,
      q1: livescore[0]?.home_1 || 0,
      q2: livescore[0]?.home_2 || 0,
      q3: livescore[0]?.home_3 || 0,
      q4: livescore[0]?.home_4 || 0,
      ot: livescore[0]?.home_5 || 0,
      ht: livescore[0]?.home_1 || 0,
      ft: livescore[0]?.home_6 || 0,
    },
    {
      name: away,
      q1: livescore[0]?.away_1 || 0,
      q2: livescore[0]?.away_2 || 0,
      q3: livescore[0]?.away_3 || 0,
      q4: livescore[0]?.away_4 || 0,
      ot: livescore[0]?.away_5 || 0,
      ht: livescore[0]?.away_1 || 0,
      ft: livescore[0]?.away_6 || 0,
    },
  ]
  const initialValues = {
    q1: {
      home: dataMainRound[0].q1,
      away: dataMainRound[1].q1,
    },
    q2: {
      home: dataMainRound[0].q2,
      away: dataMainRound[1].q2,
    },
    q3: {
      home: dataMainRound[0].q3,
      away: dataMainRound[1].q3,
    },
    q4: {
      home: dataMainRound[0].q4,
      away: dataMainRound[1].q4,
    },
    ot: {
      home: dataMainRound[0].ot,
      away: dataMainRound[1].ot,
    },
    ht: {
      home: dataMainRound[0].ht,
      away: dataMainRound[1].ht,
    },
    ft: {
      home: dataMainRound[0].ft,
      away: dataMainRound[1].ft,
    },
  }

  React.useEffect(() => {
    formScore.setFieldsValue(initialValues)
  }, [initialValues, formScore])

  const columnMainRound = [
    {
      title: '',
      dataIndex: 'name',
      width: '50%',
    },
    ...roundList
      .map((r, idx) => ({
        title: (
          <Form.Item name={[r, 'selected']} valuePropName="checked">
            <Checkbox disabled={!enableColumn[idx]}>{r.toUpperCase()}</Checkbox>
          </Form.Item>
        ),
        isHalf: ['ht', 'ft'].includes(r),
        render: col => {
          return (
            <Form.Item name={[r, `${col.name === home ? 'home' : 'away'}`]}>
              <Input className="px-1" disabled={!enableColumn[idx]} />
            </Form.Item>
          )
        },
      }))
      .filter(e => e.isHalf === isHalf),
  ]
  const columnLiveScore = [
    {
      title: '',
      dataIndex: 'name',
      width: '50%',
    },
    ...roundList
      .map(val => ({
        title: val.toUpperCase(),
        show: ['ht', 'ft'].includes(val),
        render: col => col[val],
      }))
      .filter(e => e.show === (livescore[0]?.st_general === 'H')),
  ]

  return (
    <>
      <Row gutter={10}>
        <Col span={12}>
          <Form
            form={formScore}
            onFinish={values => {
              const anyChecked = Object.values(values).some(x => x.selected)
              if (anyChecked === false) {
                message.warning('Please at least check one checkbox')
                return
              }
              const payload = Object.entries(values).reduce((acc, [key, val]) => {
                return {
                  ...acc,
                  [`${key}_home`]: val.home === '' ? null : Number(val.home),
                  [`${key}_away`]: val.away === '' ? null : Number(val.away),
                  [`${key}_check`]: val.selected ? 'Y' : 'N',
                }
              }, {})

              UpdateScore(
                {
                  ...payload,
                  match_id: Number(livescore[0].match_id),
                  is_half: isHalf ? 'Y' : 'N',
                },
                successCallback,
              )
            }}
          >
            <Table
              title={() => (
                <div className="text-center font-weight-bold">
                  <Space direction="horizontal">
                    <span>Main Round</span>
                    <Checkbox
                      disabled={score[0]?.is_enable_is_half === 'N' || false}
                      onChange={e => setHalf(e.target.checked)}
                    >
                      By Half
                    </Checkbox>
                  </Space>
                </div>
              )}
              rowKey="name"
              columns={columnMainRound}
              dataSource={dataMainRound}
              pagination={false}
              footer={() => (
                <>
                  <Text className="text-danger mt-10">
                    Note: To reset score in textbox, just make it blank
                  </Text>
                  <br />
                  <Button type="primary" onClick={() => formScore.submit()}>
                    Submit
                  </Button>
                </>
              )}
            />
          </Form>
        </Col>
        <Col span={12}>
          <Table
            title={() => <div className="text-bold text-center">Live Score</div>}
            rowKey="name"
            columns={columnLiveScore}
            dataSource={dataLiveScore}
            pagination={false}
          />
        </Col>
      </Row>
    </>
  )
}

export default connect(null, mapDispatchToProps)(MainRoundScoreBasketSpecial)
