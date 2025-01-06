import { Button, Checkbox, Form, Space, Table, message } from 'antd'
import React from 'react'
import actions from 'redux/leeching-assignment/actions'
import { connect } from 'react-redux'
import { priceGroupName } from 'helper'
import SearchLeague from './search-league'
import SelectGroup from './select-group'

const mapStateToProps = ({ leechingAssignment }) => ({
  loadingData: leechingAssignment.loadingLeague,
  tableData: leechingAssignment.leagueData.result,
  totalResults: leechingAssignment.leagueData.total,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Leeching Assignment',
    })
  },
  UpdateLeague: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_LEAGUE,
      payload,
      successCallback,
    })
  },
  CleanUpLeague: () => dispatch({ type: actions.CLEAN_UP_LEAGUE }),
})

const TableLeague = ({
  sportID,
  loadingData,
  tableData = [],
  totalResults,
  LoadLeague,
  UpdateLeague,
  CleanUpLeague,
}) => {
  React.useEffect(() => CleanUpLeague, [CleanUpLeague])

  const [form] = Form.useForm()
  const leagueSearchRef = React.useRef()

  const [parameter, setParameter] = React.useState({
    league_name: '',
    price_group: 1,
    current_page: 1,
    page_size: 50,
  })

  React.useEffect(() => {
    // reset parameter when sportID changed
    leagueSearchRef.current.input.value = ''
    setParameter(prev => ({
      ...prev,
      league_name: '',
      price_group: 1,
      current_page: 1,
    }))
  }, [sportID, setParameter])
  React.useEffect(() => {
    if (sportID === null) return
    LoadLeague({
      sport_id: sportID,
      ...parameter,
    })
  }, [LoadLeague, sportID, parameter])
  const reload = React.useCallback(() => {
    if (sportID === null) return
    LoadLeague({
      sport_id: sportID,
      ...parameter,
    })
  }, [LoadLeague, sportID, parameter])

  React.useEffect(() => {
    const initialValues = tableData?.reduce((acc, curr) => {
      const { league_id, db_auto_odds, rb_auto_odds } = curr
      acc[league_id] = {
        ...curr,
        db_ht: [0, 2].includes(db_auto_odds),
        db_ft: [0, 1].includes(db_auto_odds),
        rb_ht: [0, 2].includes(rb_auto_odds),
        rb_ft: [0, 1].includes(rb_auto_odds),
      }
      return acc
    }, {})
    form.setFieldsValue(initialValues)
  }, [form, tableData])
  const columns = React.useMemo(
    () => [
      {
        title: 'Sport',
        width: 120,
        align: 'center',
        dataIndex: 'sport_name',
      },
      {
        title: (
          <Space direction="vertical" size={0}>
            <span>League Name</span>
            <SearchLeague ref={leagueSearchRef} setViewParameter={setParameter} />
          </Space>
        ),
        dataIndex: 'league_name',
        width: 400,
      },
      {
        title: (
          <Space direction="vertical" size={0}>
            <span>Group</span>
            <SelectGroup setViewParameter={setParameter} viewParameter={parameter} />
          </Space>
        ),
        align: 'center',
        dataIndex: 'price_group',
        render: text => priceGroupName[text],
        width: 150,
      },
      {
        title: 'Dead Ball',
        children: [
          {
            title: 'HT',
            width: 60,
            align: 'center',
            render: record => (
              <Form.Item name={[record.league_id, 'db_ht']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
            ),
          },
          {
            title: 'FT',
            width: 60,
            align: 'center',
            render: record => (
              <Form.Item name={[record.league_id, 'db_ft']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
            ),
          },
        ],
      },
      {
        title: 'Running Ball',
        children: [
          {
            title: 'HT',
            width: 60,
            align: 'center',
            render: record => {
              return (
                <Form.Item name={[record.league_id, 'rb_ht']} valuePropName="checked">
                  <Checkbox />
                </Form.Item>
              )
            },
          },
          {
            title: 'FT',
            width: 60,
            align: 'center',
            render: record => (
              <Form.Item name={[record.league_id, 'rb_ft']} valuePropName="checked">
                <Checkbox />
              </Form.Item>
            ),
          },
        ],
      },
    ],
    [setParameter, parameter],
  )

  return (
    <Form
      size="small"
      form={form}
      onFinish={values => {
        const convertValue = Object.entries(values).map(([key, val]) => {
          const getDBAutoOddsValue = (db_ht, db_ft) => {
            if (db_ft && db_ht) return 0
            if (db_ft) return 1
            if (db_ht) return 2
            return 3
          }
          const getRBAutoOddsValue = (rb_ht, rb_ft) => {
            if (rb_ft && rb_ht) return 0
            if (rb_ft) return 1
            if (rb_ht) return 2
            return 3
          }
          return {
            db_auto_odds: getDBAutoOddsValue(val.db_ht, val.db_ft),
            rb_auto_odds: getRBAutoOddsValue(val.rb_ht, val.rb_ft),
            league_id: Number(key),
          }
        })

        // filter convertValue hanya yang berubah
        const filteredConvertValue = convertValue.filter(
          item =>
            item.db_auto_odds !==
              tableData.find(data => data.league_id === item.league_id).db_auto_odds ||
            item.rb_auto_odds !==
              tableData.find(data => data.league_id === item.league_id).rb_auto_odds,
        )

        if (filteredConvertValue.length === 0) {
          message.info('No changes detected')
          return
        }

        UpdateLeague(filteredConvertValue, reload)
      }}
    >
      <Table
        bordered
        rowKey="league_id"
        size="small"
        dataSource={tableData}
        columns={columns}
        loading={loadingData}
        pagination={{
          showTotal: total => `Total ${total} items`,
          total: totalResults,
          pageSize: parameter.page_size,
          current: parameter.current_page,
          onChange: (current_page, page_size) => {
            setParameter(prev => ({ ...prev, current_page, page_size }))
          },
        }}
        footer={() => (
          <div align="right">
            <Button type="primary" htmlType="submit" disabled={tableData.length === 0}>
              Submit
            </Button>
          </div>
        )}
        scroll={{
          x: 'max-content',
          y: 500,
        }}
      />
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableLeague)
