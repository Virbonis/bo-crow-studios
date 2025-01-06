import { Checkbox, Col, Form, Row, Spin } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/scoring-outright/actions'

const mapStateToProps = ({ scoringOutright }, { record }) => ({
  loadingTeam: scoringOutright[`loadingTeam_${record.outright_id}`],
  outrightTeam: scoringOutright[`dataTeam_${record.outright_id}`],
})

const mapDispatchToProps = dispatch => ({
  LoadTeam: payload => {
    dispatch({
      type: actions.LOAD_TEAM,
      payload,
      source: 'Scoring Outright',
    })
  },
})

const ColumnTeam = ({ form, record, LoadTeam, loadingTeam, outrightTeam }) => {
  React.useEffect(() => {
    LoadTeam(record)
  }, [LoadTeam, record])

  React.useEffect(() => {
    if (outrightTeam) {
      form.setFieldsValue({
        [record.outright_id]: {
          check: true,
          chk_team: outrightTeam?.filter(x => x.team_result === 1).map(e => e.team_id),
        },
      })
    }
  }, [form, record.outright_id, outrightTeam])

  return (
    <Spin spinning={loadingTeam}>
      <Form.Item name={[record.outright_id, 'chk_team']}>
        <Checkbox.Group>
          <Row>
            {outrightTeam?.map(e => (
              <Col span={24} key={e.team_id}>
                <Checkbox value={e.team_id}>{e.team_name}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Form.Item>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ColumnTeam)
