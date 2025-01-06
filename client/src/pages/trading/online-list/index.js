import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Col, DatePicker, Drawer, Form, message, Row, Select, Table, Tooltip } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { SelectMultipleAll, useGetDateTimeBusinessHour } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import actionsLeague from 'redux/league/actions'
import actions from 'redux/online-list/actions'
import OnlineListDetail from './detail'

const mapStateToProps = ({ league, onlineList }) => ({
  leagueOptions: league.select_in_online_list.map(e => ({
    value: e.league_id,
    label: e.league_name,
  })),
  dataTable: onlineList.data,
  loading: onlineList.loading,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => [
    dispatch({
      type: actionsLeague.LOAD_SELECT_IN_ONLINE_LIST,
      payload,
      source: 'Online List',
    }),
  ],
  LoadOnlineList: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Online List',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const columns = [
  {
    title: 'No',
    width: 30,
    align: 'center',
    render: (data, record, index) => index + 1,
  },
  {
    title: 'Match Date',
    dataIndex: 'match_date',
    width: 200,
    render: text => text.formatDateTimeSecond(),
  },
  {
    title: 'League Name',
    dataIndex: 'league_name',
    width: 200,
  },
  {
    title: 'Home Away',
    width: 200,
    render: ({ home_name, away_name }) => {
      return (
        <div>
          {home_name}
          <br />
          {away_name}
        </div>
      )
    },
  },
]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()

  if (!defaultDateTime) return null

  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const OnlineList = wrapperDate(
  ({ defaultDateTime, leagueOptions, dataTable, loading, LoadLeague, LoadOnlineList, CleanUp }) => {
    React.useEffect(() => CleanUp, [CleanUp])
    const { sportOptions } = useSelectOptions()

    const [form] = Form.useForm()
    const [selectedRowKeys, setSelectedRowKeys] = useState([])
    const [showDetail, setShowDetail] = useState(false)
    const [dataDetail, setDataDetail] = useState()

    const reload = React.useCallback(() => {
      setSelectedRowKeys([])
      form.submit()
    }, [form])

    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      LoadLeague({
        sport_id: values.sport_id,
        match_date: values.match_date.format('YYYY-MM-DD'),
      })
      form.resetFields(['league_id'])
    }, [form, LoadLeague])

    useEffect(() => {
      reloadLeague()
      reload()
    }, [form, reload, reloadLeague])

    const onClickReport = reportType => () => {
      if (selectedRowKeys.length === 0) {
        message.warning('Please Select Match')
      } else {
        setShowDetail(true)
        setDataDetail({ match_ids: selectedRowKeys.join(','), reportType })
      }
    }

    return (
      <>
        <div className="card">
          <div className="card-header">
            <div className="d-flex flex-row-reverse justify-content-between">
              <Tooltip placement="top" title="Refresh list">
                <Button icon={<ReloadOutlined />} onClick={() => form.submit()} />
              </Tooltip>
              <Form
                form={form}
                className="w-100"
                initialValues={{
                  match_date: defaultDateTime,
                  sport_id: 10,
                  // league_id: ['all'],
                }}
                onValuesChange={changedValues => {
                  if (!Object.keys(changedValues).includes('league_id')) reloadLeague()
                  reload()
                }}
                onFinish={values => {
                  LoadOnlineList({
                    ...values,
                    league: values.league_id?.join(','),
                    match_date: values.match_date.format('YYYY-MM-DD'),
                  })
                }}
              >
                <Row gutter={[8, 8]}>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="sport_id">
                      <Select showSearch optionFilterProp="label" options={sportOptions} />
                    </Form.Item>
                    <Form.Item name="match_date">
                      <DatePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                    <Form.Item name="league_id">
                      <SelectMultipleAll options={leagueOptions} placeholder="Select League" />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>
          </div>
          <div className="card-body">
            <Table
              rowKey="match_id"
              loading={loading}
              columns={columns}
              dataSource={dataTable}
              pagination={false}
              rowSelection={{
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }}
              title={() => (
                <>
                  <Button onClick={onClickReport('multi3')}>Report 3 (Multiple Score)</Button>
                  <Button onClick={onClickReport('nba')}>Report NBA (Multiple Score)</Button>
                </>
              )}
            />
          </div>
          <Drawer
            title={`Report ${dataDetail?.reportType.toUpperCase()}`}
            width="100%"
            open={showDetail}
            onClose={() => {
              setShowDetail(false)
            }}
            destroyOnClose
          >
            <OnlineListDetail {...dataDetail} />
          </Drawer>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(OnlineList)
