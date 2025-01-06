import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Col, Form, Row, Select, Table } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/auto-add-match/actions'
import actionsLeague from 'redux/league/actions'

// in auto-add-match sportOptions is static
const sportOptions = [
  { value: 10, label: 'Soccer' },
  { value: 11, label: 'Tennis' },
  { value: 12, label: 'Basketball' },
  { value: 16, label: 'Volleyball' },
  { value: 18, label: 'Baseball' },
  { value: 19, label: 'Golf' },
  { value: 26, label: 'Ice Hockey' },
  { value: 32, label: 'Badminton' },
  { value: 34, label: 'Football' },
  { value: 35, label: 'Table Tennis' },
  { value: 38, label: 'Pool/Snooker' },
  { value: 52, label: 'E-Sport' },
]

const mapStateToProps = ({ autoAddMatch, league }) => ({
  dataTable: autoAddMatch.data,
  loading: autoAddMatch.loading,
  leagueOptions: league.select_in_autoaddmatch
    .filter(x => x.league_id)
    .map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
})

const mapDispatchToProps = dispatch => ({
  ClearTable: () => dispatch({ type: actions.CLEAN_UP }),
  LoadLeague: payload => {
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_AUTOADDMATCH,
      payload,
      source: 'Auto Add Match',
    })
  },
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Auto Add Match',
    })
  },
  AddMatch: (payload, successCallback) => {
    dispatch({
      type: actions.ADD_MATCH,
      payload,
      successCallback,
      source: 'Auto Add Match',
    })
  },
})

const AutoAddMatch = ({
  leagueOptions,
  dataTable,
  loading,

  Load,
  LoadLeague,
  AddMatch,
  ClearTable,
}) => {
  const [form] = Form.useForm()
  const [selectedRowKeys, setSelectedRowKeys] = useState([])
  const [showCreateQuarter, setShowCreateQuarter] = useState(false)
  const [isCreateQuarter, setIsCreateQuarter] = useState(false)

  const reloadLeague = React.useCallback(() => {
    const sport_id = form.getFieldValue('sport_id')
    LoadLeague({ sport_id })
    form.setFieldsValue({ league_id: '' })
  }, [form, LoadLeague])
  const reload = React.useCallback(() => {
    ClearTable()
    setSelectedRowKeys([])
    form.submit()
  }, [form, ClearTable])

  React.useEffect(() => {
    form.resetFields()
    reloadLeague()
    reload()
  }, [form, reloadLeague, reload])

  const column = [
    {
      title: 'League Name',
      dataIndex: 'league_name',
      width: 400,
    },
    {
      title: 'Home',
      dataIndex: 'home_name',
      width: 250,
    },
    {
      title: 'Away',
      dataIndex: 'away_name',
      width: 250,
    },
    {
      title: 'Match Date',
      dataIndex: 'match_start',
      align: 'center',
      width: 200,
      render: text => text.formatDateTimeSecond(),
    },
  ]

  const onClickAddMatch = React.useCallback(() => {
    const payload = dataTable
      .filter(x => selectedRowKeys.includes(`${x.league_id}-${x.home_id}-${x.away_id}`))
      .map(x => ({ ...x, is_create_main_quarter: isCreateQuarter ? 'Y' : 'N' }))
    AddMatch(payload, () => form.submit())
  }, [dataTable, selectedRowKeys, isCreateQuarter, AddMatch, form])

  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-row-reverse">
          <Form
            form={form}
            id="test"
            className="w-100"
            layout="vertical"
            initialValues={{ sport_id: 10 }}
            onValuesChange={changedValues => {
              // if changedvalues key is sport_id, then reload league
              if (Object.keys(changedValues).includes('sport_id')) {
                reloadLeague()
                setShowCreateQuarter(changedValues.sport_id === 12)
              }
              reload()
            }}
            onFinish={value => {
              if (value.league_id) Load(value)
            }}
            onFinishFailed={({ outOfDate }) => {
              if (outOfDate) reload()
            }}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id">
                  <Select placeholder="Select Sport" showSearch options={sportOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item
                  name="league_id"
                  rules={[{ required: true, message: 'Please select league' }]}
                >
                  <Select
                    placeholder="Select League"
                    showSearch
                    options={leagueOptions}
                    optionFilterProp="label"
                    style={{ width: 300 }}
                  />
                </Form.Item>
                <Button
                  type="link"
                  icon={<ReloadOutlined />}
                  onClick={() => {
                    reloadLeague()
                    reload()
                  }}
                >
                  Refresh League Options
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="card-body">
        <Table
          size="small"
          rowKey={record => `${record.league_id}-${record.home_id}-${record.away_id}`}
          columns={column}
          pagination={false}
          dataSource={dataTable}
          loading={loading}
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          title={() => {
            const disableSubmit = selectedRowKeys.length === 0
            return (
              <>
                <Button type="primary" onClick={onClickAddMatch} disabled={disableSubmit}>
                  Submit
                </Button>
                {showCreateQuarter && (
                  <Checkbox
                    checked={isCreateQuarter}
                    onChange={e => setIsCreateQuarter(e.target.checked)}
                    className="ml-2"
                  >
                    Create Quarter Market
                  </Checkbox>
                )}
              </>
            )
          }}
        />
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(AutoAddMatch)
