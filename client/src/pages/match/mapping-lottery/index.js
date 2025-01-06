import React, { useEffect, useState } from 'react'
import { Select, DatePicker, Row, Col, Input, Form, Table, Button, Tooltip } from 'antd'
import { connect } from 'react-redux'
import actionLeague from 'redux/league/actions'
import action from 'redux/mapping-lottery/actions'
import { useGetDateTimeDBServer } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'

const mapStateToProps = ({ mappingLottery }) => ({
  loading: mappingLottery.loadingData,
  dataTable: mappingLottery.data,
})

const mapDispatchToProps = dispatch => ({
  LoadTable: payload =>
    dispatch({
      type: action.LOAD,
      payload,
      source: 'Mapping Lottery',
    }),
  LoadLeague: payload => {
    dispatch({
      type: actionLeague.LOAD_SELECT_IN_MAPPING_LOTTERY,
      payload,
      source: 'Mapping Lottery',
    })
  },
  CopyToLottery: (payload, successCallback) => {
    dispatch({
      type: action.COPY_TO_LOTTERY,
      payload,
      successCallback,
      source: 'Mapping Lottery',
    })
  },
  CleanUp: () => dispatch({ type: action.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTimeServer = useGetDateTimeDBServer()
  if (!defaultDateTimeServer) return null
  return <Component {...props} defaultDateTimeServer={defaultDateTimeServer} />
}

const MappingToLottery = wrapperDate(
  ({
    defaultDateTimeServer,
    dataTable,
    loading,
    LoadLeague,
    LoadTable,
    CopyToLottery,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])
    const { sportOptions, leagueInMappingLotteryOptions: leagueOptions } = useSelectOptions()

    const [form] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])

    const reload = React.useCallback(() => {
      setSelectedRowKeys([])
      form.submit()
    }, [form])
    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        ...values,
        date_start: values.date_range[0].format('YYYY-MM-DD'),
        date_end: values.date_range[1].format('YYYY-MM-DD'),
      })
      form.setFieldsValue({ league_id: '' })
    }, [form, LoadLeague])

    useEffect(() => {
      reloadLeague()
      reload()
    }, [form, reload, reloadLeague])

    const columns = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 100,
      },
      {
        title: 'League Name',
        dataIndex: 'league_name',
        width: 400,
      },
      {
        title: 'Home',
        dataIndex: 'home_name',
        width: 200,
      },
      {
        title: 'Away',
        dataIndex: 'away_name',
        width: 200,
      },
      {
        title: 'Match Date',
        dataIndex: 'match_date',
        align: 'center',
        width: 150,
        render: text => text.formatDateTime(),
      },
      {
        title: 'Status',
        dataIndex: 'status',
        align: 'center',
        width: 120,
      },
    ]

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse">
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={reload} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                layout="vertical"
                initialValues={{
                  date_range: [defaultDateTimeServer, defaultDateTimeServer],
                  sport_id: 10,
                  league_id: '',
                }}
                onValuesChange={changedValues => {
                  // if changedvalues is not league_id, then reloadLeague
                  if (!('league_id' in changedValues)) reloadLeague()
                  reload()
                }}
                onFinish={values => {
                  LoadTable({
                    ...values,
                    date_start: values.date_range[0].format('YYYY-MM-DD'),
                    date_end: values.date_range[1].format('YYYY-MM-DD'),
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="date_range">
                      <DatePicker.RangePicker
                        className="w-100"
                        allowClear={false}
                        format="YYYY-MM-DD"
                      />
                    </Form.Item>
                    <Form.Item name="sport_id">
                      <Select options={sportOptions} showSearch />
                    </Form.Item>
                    <Form.Item name="league_id">
                      <Select options={leagueOptions} showSearch />
                    </Form.Item>
                    <Form.Item
                      name="match_id"
                      extra="*If filter by Match ID, other filters will be ignored"
                      rules={[{ validator: validatorNumeric }]}
                    >
                      <Input placeholder="Match ID" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item
                      name="league_name"
                      extra="*If filter by League Name, will search matches by Sport and League Name"
                    >
                      <Input placeholder="League Name" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              rowKey="match_id"
              columns={columns}
              loading={loading}
              dataSource={dataTable}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              pagination={false}
              title={() => (
                <Button
                  type="primary"
                  disabled={selectedRowKeys.length === 0}
                  onClick={() =>
                    CopyToLottery(
                      dataTable
                        .map(e => (selectedRowKeys.includes(e.match_id) ? e : ''))
                        .filter(x => x !== ''),
                      reload,
                    )
                  }
                >
                  Copy to Lottery
                </Button>
              )}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(MappingToLottery)
