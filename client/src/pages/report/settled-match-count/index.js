import React, { useEffect } from 'react'
import { Button, Table, Tooltip } from 'antd'
import { connect } from 'react-redux'
import actions from 'redux/settled-match-count/actions'
import { Amount, useGetDateTimeBusinessHour } from 'components/blaise'
import { ReloadOutlined } from '@ant-design/icons'

const mapStateToProps = ({ settledMatchCount }) => ({
  tableData: settledMatchCount.data,
  loading: settledMatchCount.loadingData,
})

const mapDispatchToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD_TABLE,
      source: 'Settled Match Count',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()

  if (!defaultDateTime) return null

  const date = {
    '2daysbf': defaultDateTime
      .clone()
      .subtract(2, 'days')
      .format('YYYY-MM-DD'),
    yesterday: defaultDateTime
      .clone()
      .subtract(1, 'days')
      .format('YYYY-MM-DD'),
    today: defaultDateTime.format('YYYY-MM-DD'),
  }
  return <Component {...props} date={date} />
}

const SettledMatchCount = wrapperDate(({ date, loading, tableData, Load, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])
  useEffect(() => {
    Load()
  }, [Load])

  const columns = [
    {
      title: 'Date',
      align: 'center',
      children: [
        {
          title: 'Result',
          dataIndex: 'sport_name',
          align: 'left',
          width: 120,
        },
      ],
    },
    {
      title: date['2daysbf'],
      children: [
        {
          title: 'Entered',
          dataIndex: 'entered_2daysbf',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
        {
          title: 'Non Entered',
          dataIndex: 'nonentered_2daysbf',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
      ],
    },
    {
      title: date.yesterday,
      children: [
        {
          title: 'Entered',
          dataIndex: 'entered_yesterday',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
        {
          title: 'Non Entered',
          dataIndex: 'nonentered_yesterday',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
      ],
    },
    {
      title: date.today,
      children: [
        {
          title: 'Entered',
          dataIndex: 'entered_today',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
        {
          title: 'Non Entered',
          dataIndex: 'nonentered_today',
          render: text => <Amount value={text} int />,
          align: 'right',
          width: 120,
        },
      ],
    },
  ]

  return (
    <>
      <div className="card">
        <div className="card-body">
          <div className="d-flex flex-row-reverse align-items-start h-100" style={{ gap: 8 }}>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={Load} />
            </Tooltip>
            <Table
              className="w-100 h-100"
              size="small"
              bordered
              rowKey="no_sport"
              loading={loading}
              columns={columns}
              dataSource={tableData}
              pagination={false}
            />
          </div>
        </div>
      </div>
    </>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(SettledMatchCount)
