import { ReloadOutlined } from '@ant-design/icons'
import {
  Form,
  Switch,
  DatePicker,
  Select,
  Table,
  Row,
  Col,
  Button,
  Tooltip,
  Typography,
  Input,
} from 'antd'
import { useGetDateTimeBusinessHour, useFormWithPagination } from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { validatorNumeric } from 'helper'
import React, { useState } from 'react'
import { connect } from 'react-redux'
import actionLeague from 'redux/league/actions'
import actions from 'redux/popular-pick/actions'

const { Text } = Typography
const mapStateToProps = ({ league, popularPick }) => ({
  leagueOptions: [{ value: 0, label: 'All League' }].concat(
    league.select_in_matchlist.map(e => ({
      value: e.league_id,
      label: e.league_name,
    })),
  ),
  categoryOptions: popularPick.dataCategory.map(e => ({
    value: e.pick_category,
    label: e.pick_category,
  })),
  loadingMatch: popularPick.loadingMatchList,
  dataMatch: popularPick.dataMatchList.result,
  totalMatch: popularPick.dataMatchList.total,

  loadingPicks: popularPick.loading,
  dataPicks: popularPick.data,
  populars: popularPick.select,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actionLeague.LOAD_SELECT_IN_MATCHLIST,
      payload,
      source: 'Popular Picks',
    })
  },
  LoadMatch: payload => {
    dispatch({
      type: actions.LOAD_MATCH_LIST,
      payload,
      source: 'Popular Pick',
    })
  },
  LoadCategory: () => {
    dispatch({
      type: actions.LOAD_CATEGORY,
      source: 'Popular Pick',
    })
  },
  LoadPicks: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Popular Pick',
    })
  },
  InsertPicks: (payload, successCallback) => {
    dispatch({
      type: actions.CREATE,
      payload,
      successCallback,
      source: 'Popular Pick',
    })
  },
  DeletePicks: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Popular Pick',
    })
  },
  ClearFinishPicks: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE_FINISHED,
      payload,
      successCallback,
      source: 'Popular Pick',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}

const PopularPick = wrapperDate(
  ({
    leagueOptions,
    categoryOptions,
    loadingMatch,
    dataMatch,
    totalMatch,
    loadingPicks,
    dataPicks,
    defaultDateTime,
    LoadLeague,
    LoadMatch,
    LoadCategory,
    LoadPicks,
    InsertPicks,
    DeletePicks,
    ClearFinishPicks,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const { sportOptions } = useSelectOptions()

    const { RangePicker } = DatePicker
    const [formMatch] = Form.useForm()
    const [formPicks] = Form.useForm()
    const [selectedCategory, setSelectedCategory] = useState()
    const [selectedRowMatch, setSelectedRowMatch] = useState([])
    const [selectedRowPicks, setSelectedRowPicks] = useState([])

    React.useEffect(() => {
      LoadCategory()
    }, [LoadCategory])

    React.useEffect(() => {
      setSelectedCategory(categoryOptions[0]?.value)
      reloadPicks()
      formMatch.submit()
    }, [categoryOptions[0]?.value]) // eslint-disable-line react-hooks/exhaustive-deps

    const columnMatch = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 75,
      },
      {
        title: (
          <>
            <Text>Match Date</Text>
            <br />
            <Text>Created Date</Text>
          </>
        ),
        align: 'center',
        render: (text, { match_date, created_date }) => {
          return (
            <>
              {match_date.formatDateTime()}
              <br />
              <Typography.Text className="text-warning">
                {created_date.formatDateTime()}
              </Typography.Text>
            </>
          )
        },
        width: 125,
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        ellipsis: true,
        width: 200,
      },
      {
        title: 'Home Away',
        width: 200,
        render: (text, record) => {
          return (
            <>
              {record.home_name}
              <br />
              {record.away_name}
            </>
          )
        },
      },
      Table.SELECTION_COLUMN,
    ]
    const columnPicks = [
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        align: 'center',
        width: 75,
      },
      {
        title: (
          <>
            <Text>Match Date</Text>
            <br />
            <Text>Stamp Date</Text>
          </>
        ),
        align: 'center',
        render: (text, { match_date, stamp_date }) => {
          return (
            <>
              {match_date.formatDateTime()}
              <br />
              <Typography.Text className="text-warning">
                {stamp_date.formatDateTime()}
              </Typography.Text>
            </>
          )
        },
        width: 125,
      },
      {
        title: 'League',
        render: (text, record) => {
          return (
            <>
              {record.sport_name}
              <br />
              {record.league_name}
            </>
          )
        },
        ellipsis: true,
        width: 200,
      },
      {
        title: 'Home Away',
        width: 200,
        render: (text, record) => {
          return (
            <>
              {record.home_name}
              <br />
              {record.away_name}
            </>
          )
        },
      },
      Table.SELECTION_COLUMN,
    ]

    const reloadLeague = React.useCallback(() => {
      const values = formMatch.getFieldsValue()
      LoadLeague({
        ...values,
        date_start: values.dateRange[0].format('YYYY-MM-DD'),
        date_end: values.dateRange[1].format('YYYY-MM-DD'),
        sport_ids: values.sport_id,
      })
      formMatch.resetFields(['league_id'])
    }, [formMatch, LoadLeague])

    const reloadMatch = React.useCallback(() => {
      setSelectedRowMatch([])
      formMatch.submit()
    }, [formMatch])
    const reloadPicks = React.useCallback(() => {
      setSelectedRowPicks([])
      formPicks.submit()
    }, [formPicks])

    const fetch = React.useCallback(
      values => {
        setSelectedRowMatch([])
        LoadMatch({
          ...values,
          date_start: values?.dateRange?.[0].format('YYYY-MM-DD'),
          date_end: values?.dateRange?.[1].format('YYYY-MM-DD'),
          order_by: values?.order_by ? 'time' : 'normal',
        })
      },
      [LoadMatch],
    )
    const { formProps, paginationProps } = useFormWithPagination(formMatch, fetch, totalMatch)

    const onSubmitPicks = () =>
      InsertPicks(
        {
          match_ids: selectedRowMatch.join(),
          category: selectedCategory,
        },
        reloadPicks,
      )

    const onDeletePicks = () =>
      DeletePicks(
        {
          match_ids: selectedRowPicks.join(),
          category: selectedCategory,
        },
        reloadPicks,
      )

    const onClearFinishPicks = () =>
      ClearFinishPicks(
        {
          category: selectedCategory,
        },
        reloadPicks,
      )

    return (
      <>
        <div className="card">
          <div className="card-header">
            <Row gutter={8} align="bottom">
              <Col span={11}>
                <Form
                  className="w-100"
                  form={formMatch}
                  initialValues={{
                    dateRange: [defaultDateTime, defaultDateTime],
                    sport_id: 10,
                    league_id: 0,
                  }}
                  {...formProps}
                  onValuesChange={(changedValues, allValues) => {
                    formProps.onValuesChange(changedValues, allValues)
                    const key = Object.keys(changedValues)[0]
                    if (!['order_by', 'league_id', 'match_id'].includes(key)) reloadLeague()
                  }}
                  onKeyPress={e => {
                    formProps.onKeyPress(e)
                    if (e.key === 'Enter') reloadLeague()
                  }}
                >
                  <Row gutter={[8, 8]}>
                    <Col span={8}>
                      <Form.Item
                        name="match_id"
                        className="mb-0"
                        rules={[{ validator: validatorNumeric }]}
                      >
                        <Input className="w-100" placeholder="Match ID" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="dateRange">
                        <RangePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
                      </Form.Item>
                    </Col>
                    <Col span={8}>
                      <Form.Item name="sport_id">
                        <Select options={sportOptions} showSearch optionFilterProp="label" />
                      </Form.Item>
                      <Form.Item name="league_id">
                        <Select options={leagueOptions} showSearch optionFilterProp="label" />
                      </Form.Item>
                      <Form.Item name="order_by" valuePropName="checked">
                        <Switch checkedChildren="Sort Normal" unCheckedChildren="Sort by Time" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
              <Col span={11} offset={2}>
                <Form
                  className="w-100"
                  form={formPicks}
                  onValuesChange={reloadPicks}
                  onFinish={values => {
                    if (selectedCategory)
                      LoadPicks({
                        ...values,
                        order_by: values.order_by ? 'time' : 'normal',
                        pick_category: selectedCategory,
                      })
                  }}
                >
                  <Row gutter={[8, 8]}>
                    <Col span={6}>
                      <Form.Item name="order_by" valuePropName="checked">
                        <Switch checkedChildren="Sort Normal" unCheckedChildren="Sort by Time" />
                      </Form.Item>
                    </Col>
                  </Row>
                </Form>
              </Col>
            </Row>
          </div>
          <div className="card-body">
            <Row gutter={8} className="h-100">
              <Col span={11} className="h-100">
                <Table
                  size="small"
                  rowKey="match_id"
                  columns={columnMatch}
                  loading={loadingMatch}
                  dataSource={dataMatch}
                  rowSelection={{
                    selectedRowKeys: selectedRowMatch,
                    onChange: selectedRowKeys => {
                      setSelectedRowMatch(selectedRowKeys)
                    },
                  }}
                  pagination={paginationProps}
                  title={() => {
                    return (
                      <div className="d-flex justify-content-end">
                        <Button
                          type="primary"
                          onClick={onSubmitPicks}
                          disabled={!selectedRowMatch.length}
                        >
                          Submit Picks
                        </Button>
                      </div>
                    )
                  }}
                />
              </Col>
              <Col span={2}>
                <div className="d-flex flex-column" style={{ gap: 8 }}>
                  <Tooltip placement="top" title="Refresh list">
                    <Button
                      className="w-100"
                      icon={<ReloadOutlined />}
                      onClick={() => {
                        reloadMatch()
                        reloadPicks()
                      }}
                    />
                  </Tooltip>
                  <Select
                    className="w-100"
                    placeholder="Category"
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={value => {
                      setSelectedCategory(value)
                      reloadPicks()
                    }}
                  />
                  <Button
                    type="primary"
                    onClick={onClearFinishPicks}
                    className="text-wrap h-100 p-1"
                  >
                    Clear Finished Pick
                  </Button>
                </div>
              </Col>
              <Col span={11} className="h-100">
                <Table
                  size="small"
                  rowKey="match_id"
                  columns={columnPicks}
                  loading={loadingPicks}
                  dataSource={dataPicks}
                  rowSelection={{
                    selectedRowKeys: selectedRowPicks,
                    onChange: selectedRowKeys => {
                      setSelectedRowPicks(selectedRowKeys)
                    },
                  }}
                  pagination={false}
                  title={() => {
                    return (
                      <>
                        <div className="d-flex justify-content-end">
                          <Button
                            type="primary"
                            onClick={onDeletePicks}
                            disabled={!selectedRowPicks?.length}
                          >
                            Delete Picks
                          </Button>
                        </div>
                      </>
                    )
                  }}
                />
              </Col>
            </Row>
          </div>
        </div>
      </>
    )
  },
)
export default connect(mapStateToProps, mapDispatchToProps)(PopularPick)
