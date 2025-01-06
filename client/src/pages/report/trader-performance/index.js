import React from 'react'
import { Button, Col, DatePicker, Form, Row, Select, Table, Typography } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/trader-performance/actions'
import { getPresetsMinMaxDate, gameTypeDescription } from 'helper'
import {
  Amount,
  CustomizeCell,
  useGetDateTimeBusinessHour,
  useGetLastGLDate,
} from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'

const mapStateToProps = ({ traderPerformance }, { hist }) => ({
  loadingOption: hist ? traderPerformance.loadingOption_Hist : traderPerformance.loadingOption_Post,
  traderOptions: hist
    ? [{ value: '', label: 'Show All Trader' }].concat(
        traderPerformance.listTrader_Hist.map(e => ({
          value: e.trader_name,
          label: e.trader_name,
        })),
      )
    : [{ value: '', label: 'Show All Trader' }].concat(
        traderPerformance.listTrader_Post.map(e => ({
          value: e.trader_name,
          label: e.trader_name,
        })),
      ),
  leagueOptions: hist
    ? [{ value: '', label: 'Show All League' }].concat(
        traderPerformance.listLeague_Hist.map(e => ({
          value: e.league_id,
          label: e.league_name,
        })),
      )
    : [{ value: '', label: 'Show All League' }].concat(
        traderPerformance.listLeague_Post.map(e => ({
          value: e.league_id,
          label: e.league_name,
        })),
      ),
  loading: hist ? traderPerformance.loading_Hist : traderPerformance.loading_Post,
  dataTable: hist ? traderPerformance.data_Hist : traderPerformance.data_Post,
  grandTotal: hist ? traderPerformance.grandTotal_Hist : traderPerformance.grandTotal_Post,
})

const mapDispatchToProps = (dispatch, { hist }) => ({
  LoadTrader: payload => {
    dispatch({
      type: actions.LOAD_TRADER,
      payload,
      source: 'Trader Performance',
    })
  },
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'Trader Performance',
    })
  },
  Load: payload => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Trader Performance',
    })
  },
  CleanUp: () => dispatch({ type: hist ? actions.CLEAN_UP_HIST : actions.CLEAN_UP_POST }),
})

const sectionOptions = [
  { value: '', label: 'Show All Section' },
  { value: 'RB', label: 'RB' },
  { value: 'DB', label: 'DB' },
  { value: 'Pick', label: 'Pick' },
]
const { RangePicker } = DatePicker

const traderAndLeagueValidator = ({ getFieldValue }) => ({
  validator() {
    if (!getFieldValue('trader') && !getFieldValue('league_id'))
      return Promise.reject(new Error('Please select either a trader or a league'))
    return Promise.resolve()
  },
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  const lastGLDate = useGetLastGLDate()
  const { hist } = props

  if (!defaultDateTime || !lastGLDate) return null

  return (
    <Component
      {...props}
      minDate={!hist ? lastGLDate : dayjs('2012-01-01')}
      maxDate={!hist ? defaultDateTime : lastGLDate.clone().subtract(1, 'day')}
      hist={hist}
    />
  )
}

const TraderPerformance = wrapperDate(
  ({
    minDate,
    maxDate,
    hist,
    loadingOption,
    leagueOptions,
    traderOptions,
    loading,
    dataTable,
    grandTotal,

    LoadTrader,
    LoadLeague,
    Load,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()

    const reloadTrader = React.useCallback(
      isResetForm => {
        const { match_date, section, league_id } = form.getFieldsValue()
        LoadTrader({
          from_date: match_date?.[0].format('YYYY-MM-DD'),
          to_date: match_date?.[1]?.format('YYYY-MM-DD'),
          section,
          league_id,
          hist_or_post: hist ? '_Hist' : '_Post',
        })
        if (isResetForm) form.setFieldsValue({ trader: '' })
      },
      [form, hist, LoadTrader],
    )
    const reloadLeague = React.useCallback(
      isResetForm => {
        const { match_date, section, trader } = form.getFieldsValue()
        LoadLeague({
          from_date: match_date?.[0].format('YYYY-MM-DD'),
          to_date: match_date?.[1]?.format('YYYY-MM-DD'),
          section,
          trader,
          hist_or_post: hist ? '_Hist' : '_Post',
        })
        if (isResetForm) form.setFieldsValue({ league_id: '' })
      },
      [form, hist, LoadLeague],
    )

    React.useEffect(() => {
      reloadTrader(true)
      reloadLeague(true)
    }, [reloadTrader, reloadLeague])

    const reloadTraderAndLeague = () => {
      reloadLeague(true)
      reloadTrader(true)
    }

    const [getRowSpan] = React.useMemo(() => {
      const isFirstRow = (match_id, index) => {
        const firstIndex = dataTable.findIndex(x => x.match_id === match_id)
        if (firstIndex === -1) return false
        if (index === firstIndex) return true
        const prev = dataTable[index - 1]
        return prev.match_id !== match_id
      }
      const rowCount = match_id => dataTable.filter(x => x.match_id === match_id).length

      return [
        (match_date, index) => {
          if (!isFirstRow(match_date, index)) return 0
          return rowCount(match_date)
        },
      ]
    }, [dataTable])

    // prevent re-render when dataTable change
    const columns = React.useMemo(() => {
      return [
        {
          title: 'Match Date',
          dataIndex: 'match_date',
          align: 'center',
          width: 100,
          render: (text, row) => {
            if (row.is_sub_total) return <b>Total</b>
            return text.formatDateTimeSecond()
          },
          onCell: ({ is_sub_total, match_id }, index) => ({
            colSpan: is_sub_total ? 6 : 1,
            rowSpan: is_sub_total ? 1 : getRowSpan(match_id, index),
          }),
        },
        {
          title: 'Trader Name',
          dataIndex: 'trader_name',
          width: 150,
          onCell: ({ is_sub_total }) => ({
            colSpan: is_sub_total ? 0 : 1,
          }),
        },
        {
          title: 'Section',
          dataIndex: 'market_time',
          align: 'center',
          width: 55,
          onCell: ({ is_sub_total }) => ({
            colSpan: is_sub_total ? 0 : 1,
          }),
        },
        {
          title: 'Match',
          width: 150,
          render: (text, row) => `${row.home_name} - ${row.away_name}`,
          onCell: ({ is_sub_total }) => ({
            colSpan: is_sub_total ? 0 : 1,
          }),
        },
        {
          title: 'League',
          dataIndex: 'league_name',
          width: 150,
          onCell: ({ is_sub_total }) => ({
            colSpan: is_sub_total ? 0 : 1,
          }),
        },
        {
          title: 'Game Type',
          dataIndex: 'game_type',
          align: 'center',
          width: 80,
          render: text => gameTypeDescription[text]?.long,
          onCell: ({ is_sub_total }) => ({
            colSpan: is_sub_total ? 0 : 1,
          }),
        },
        {
          title: 'Bet Amount',
          dataIndex: 'bet_amount',
          align: 'right',
          width: 80,
          render: (text, row) => <Amount bold={row.is_sub_total} value={text} />,
        },
        {
          title: 'Member Winloss',
          dataIndex: 'winloss',
          align: 'right',
          width: 80,
          render: (text, row) => <Amount bold={row.is_sub_total} value={text} />,
        },
        {
          title: 'Company Winloss',
          dataIndex: 'winloss_company',
          align: 'right',
          width: 80,
          render: (text, row) => <Amount bold={row.is_sub_total} value={text} />,
        },
        {
          title: 'Margin 1',
          dataIndex: 'margin1',
          align: 'right',
          width: 80,
          render: (text, row) => <Amount bold={row.is_sub_total} value={text} />,
        },
        {
          title: 'Margin 2',
          dataIndex: 'margin2',
          align: 'right',
          width: 80,
          render: (text, row) => <Amount bold={row.is_sub_total} value={text} />,
        },
      ]
    }, [getRowSpan])

    return (
      <>
        <div className="card">
          <div className="card-header ">
            <Form
              form={form}
              className="w-100"
              initialValues={{
                match_date: [maxDate, maxDate],
                section: '',
                trader: '',
                league_id: '',
              }}
              onFinish={values => {
                const payload = {
                  ...values,
                  from_date: values.match_date?.[0].format('YYYY-MM-DD'),
                  to_date: values.match_date?.[1]?.format('YYYY-MM-DD'),
                  hist_or_post: hist ? '_Hist' : '_Post',
                }
                Load(payload)
              }}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item
                    name="match_date"
                    extra={
                      <Typography.Text type="danger">
                        {`Valid from ${minDate.format('YYYY-MM-DD')} - ${maxDate.format(
                          'YYYY-MM-DD',
                        )}`}
                      </Typography.Text>
                    }
                  >
                    <RangePicker
                      allowClear={false}
                      format="YYYY-MM-DD"
                      className="w-100"
                      disabledDate={current => current < minDate || current > maxDate}
                      onChange={reloadTraderAndLeague}
                      presets={getPresetsMinMaxDate(minDate, maxDate)}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="section">
                    <Select options={sectionOptions} onChange={reloadTraderAndLeague} />
                  </Form.Item>
                  <Button
                    type="link"
                    loading={loadingOption}
                    icon={<ReloadOutlined />}
                    onClick={reloadTraderAndLeague}
                  >
                    Refresh Trader and League Options
                  </Button>
                  <Form.Item
                    name="trader"
                    rules={[traderAndLeagueValidator]}
                    extra="*Trader Options affected by match date, section & league"
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      loading={loadingOption}
                      options={traderOptions}
                      onChange={() => reloadLeague(false)}
                    />
                  </Form.Item>
                  <Form.Item
                    name="league_id"
                    rules={[traderAndLeagueValidator]}
                    extra="*League Options affected by match date, section & trader"
                  >
                    <Select
                      showSearch
                      optionFilterProp="label"
                      loading={loadingOption}
                      options={leagueOptions}
                      onChange={() => reloadTrader(false)}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
            </Form>
          </div>
          <div className="card-body">
            <Table
              // rowKey={x => `${x.match_date}-${x.match_id}-${x.game_type}-${market_time}`}
              bordered
              loading={loading}
              columns={columns}
              dataSource={dataTable}
              pagination={false}
              components={{
                body: {
                  cell: CustomizeCell,
                },
              }}
              summary={data => {
                return (
                  data.length > 0 && (
                    <Table.Summary fixed="bottom">
                      <Table.Summary.Row align="right" className="font-weight-bold bg-light-yellow">
                        <Table.Summary.Cell index={0} colSpan={6} align="center">
                          <b>Grand Total</b>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount bold value={grandTotal.bet_amount} />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount bold value={grandTotal.winloss} />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount bold value={grandTotal.winloss_company} />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount bold value={grandTotal.margin1} />
                        </Table.Summary.Cell>
                        <Table.Summary.Cell align="right">
                          <Amount bold value={grandTotal.margin2} />
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )
                )
              }}
            />
          </div>
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(TraderPerformance)
