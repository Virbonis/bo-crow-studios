import React, { useEffect } from 'react'
import { Button, Tooltip, Form, Row, Col, Select, Collapse, Spin } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import actions from 'redux/user-team-matches/actions'
import TableMatch from './table-match'
import './custom.scss'

const { Panel } = Collapse
const mapStateToProps = ({ userTeamMatches }) => ({
  loadingTable: userTeamMatches.loadingCounter,
  dataTable: userTeamMatches.dataCounter,
})

const mapDispatchToProps = dispatch => ({
  LoadCounter: payload => {
    dispatch({
      type: actions.LOAD_COUNTER,
      payload,
      source: 'User Team Matches',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const UserTeamMatches = ({ loadingTable, dataTable, LoadCounter, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  let { userTeamOptions } = useSelectOptions()
  userTeamOptions = [{ value: -99, label: 'Show All Team' }].concat(userTeamOptions)

  const [form] = Form.useForm()
  useEffect(() => {
    form.submit()
  }, [form])
  const [activeKey, setActiveKey] = React.useState()
  React.useEffect(() => {
    setActiveKey([])
  }, [dataTable])

  return (
    <>
      <div className="card">
        <div className="card-header d-flex flex-row-reverse justify-content-between">
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={() => form.submit()} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            initialValues={{
              user_team_id: -99,
            }}
            onValuesChange={() => {
              form.submit()
            }}
            onFinish={values => {
              LoadCounter(values)
              // CleanAllTable()
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="user_team_id">
                  <Select
                    placeholder="Select User Team"
                    className="w-100"
                    allowClear={false}
                    showSearch
                    optionFilterProp="label"
                    options={userTeamOptions}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
        <div className="card-body h-100 overflow-auto">
          <Spin spinning={loadingTable}>
            <Collapse destroyInactivePanel activeKey={activeKey} onChange={setActiveKey}>
              {dataTable.map(({ match_time_slot, counter }) => (
                <Panel key={match_time_slot} header={`${match_time_slot} (${counter})`}>
                  <TableMatch
                    user_team_id={form.getFieldValue('user_team_id')}
                    match_time_slot={match_time_slot}
                  />
                </Panel>
              ))}
            </Collapse>
          </Spin>
        </div>
        <div className="card-footer">
          <div>
            <b>LEGEND</b>
          </div>
          <span className="icon_live" /> Live Games
          <br />
          <span className="icon_delayed" /> Delayed Live Games
          <br />
          <span className="icon_has_live" /> Has Live Games
          <br />
          <span className="icon_trader" /> The User Team Games
          <br />
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(UserTeamMatches)
