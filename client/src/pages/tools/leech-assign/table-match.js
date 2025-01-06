import React, { useState } from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Form, Modal, message, Table } from 'antd'
import actions from 'redux/leech-assign/actions'
import PopUp from './table-popup'
import './custom.scss'

const mapStateToProps = ({ leechAssign }) => ({
  loading: leechAssign.loadingData,
  tableData: leechAssign.data,
})

const mapDispatchToProps = dispatch => ({
  Update: (payload, successCallback) =>
    dispatch({
      type: actions.UPDATE_MATCH,
      payload,
      successCallback,
      source: 'Leech Assign',
    }),
})

const TableMatch = ({ loading, tableData, Update, reload, ...restProps }) => {
  const [formMatch] = Form.useForm()
  const [selectedMatch, setSelectedMatch] = useState()
  const [visible, setVisible] = useState(false)
  const [matchID, setMatchID] = useState()

  React.useEffect(() => {
    formMatch.resetFields()
    const initialValue = tableData.reduce((acc, curr) => {
      const {
        match_id,
        auto_odds,
        st_sports_ticker,
        is_reverse_checked_rball,
        is_reverse_checked_bg,
      } = curr
      acc[match_id] = {
        auto_odds,
        st_sports_ticker,
        is_reverse_checked_rball: is_reverse_checked_rball === 'Y',
        is_reverse_checked_bg: is_reverse_checked_bg === 'Y',
      }
      return acc
    }, {})
    formMatch.setFieldsValue(initialValue)
    const defaultChecked = tableData.filter(e => e.is_checked === 1).map(v => v.match_id)
    setSelectedMatch(defaultChecked)
  }, [formMatch, tableData])

  // prevent re-rendering
  const columns = React.useMemo(
    () => [
      Table.SELECTION_COLUMN,
      {
        title: 'Match ID',
        dataIndex: 'match_id',
        width: 70,
      },
      {
        title: 'Match Date',
        dataIndex: 'match_date',
        width: 100,
      },
      {
        title: 'League',
        dataIndex: 'league_name',
        width: 150,
      },
      {
        title: 'Home Away',
        width: 150,
        render: record => (
          <Button
            type="link"
            className="p-0 text-wrap text-left"
            onClick={() => PopUpHandler(record.match_id)}
          >
            {record.home_name} - {record.away_name}
          </Button>
        ),
      },
      {
        title: (
          <Form.Item name={['header', 'auto_odds']}>
            <CheckboxLeechingHeader type={1} formMatch={formMatch} tableData={tableData} />
          </Form.Item>
        ),
        align: 'center',
        width: 80,
        render: record => (
          <Form.Item name={[record.match_id, 'auto_odds']}>
            <CheckboxLeeching type={1} disabled={!record.is_sbo_exist} />
          </Form.Item>
        ),
        onCell: record => {
          return { className: record.auto_odds === 1 && 'custom-on-cell-checkbox' }
        },
      },
      {
        title: (
          <Form.Item name={['header', 'auto_odds']}>
            <CheckboxLeechingHeader type={2} formMatch={formMatch} tableData={tableData} />
          </Form.Item>
        ),
        width: 80,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'auto_odds']}>
            <CheckboxLeeching type={2} disabled={!record.is_ibc_exist} />
          </Form.Item>
        ),
        onCell: record => {
          return { className: record.auto_odds === 2 && 'custom-on-cell-checkbox' }
        },
      },
      {
        title: (
          <Form.Item name={['header', 'auto_odds']}>
            <CheckboxLeechingHeader type={0} formMatch={formMatch} tableData={tableData} />
          </Form.Item>
        ),
        width: 80,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'auto_odds']}>
            <CheckboxLeeching type={0} />
          </Form.Item>
        ),
        onCell: record => {
          return { className: record.auto_odds === 0 && 'custom-on-cell-checkbox' }
        },
      },
      {
        title: null,
        width: 10,
        onCell: () => {
          return { className: 'custom-on-cell-separator' }
        },
      },
      {
        title: (
          <Form.Item name={['header', 'st_sports_ticker']}>
            <CheckboxSportsTickerHeader type="RB" formMatch={formMatch} tableData={tableData} />
          </Form.Item>
        ),
        width: 50,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'st_sports_ticker']}>
            <CheckboxSportsTicker type="RB" disabled={record.rb_status === 'N'} />
          </Form.Item>
        ),
        onCell: record => {
          return { className: record.st_sports_ticker === 'RB' && 'custom-on-cell-checkbox' }
        },
      },
      {
        title: (
          <Form.Item name={['header', 'st_sports_ticker']}>
            <CheckboxSportsTickerHeader type="BG" formMatch={formMatch} tableData={tableData} />
          </Form.Item>
        ),
        width: 50,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'st_sports_ticker']}>
            <CheckboxSportsTicker type="BG" disabled={record.bg_status === 'N'} />
          </Form.Item>
        ),
        onCell: record => {
          return { className: record.st_sports_ticker === 'BG' && 'custom-on-cell-checkbox' }
        },
      },
      {
        title: 'Rev RBall',
        width: 50,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'is_reverse_checked_rball']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
      {
        title: 'Rev BG',
        width: 50,
        align: 'center',
        render: record => (
          <Form.Item name={[record.match_id, 'is_reverse_checked_bg']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
      {
        title: 'League',
        width: 200,
        render: record => (
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.match_id]?.st_sports_ticker !==
              currentValues[record.match_id]?.st_sports_ticker
            }
          >
            {({ getFieldValue }) => {
              const checked = getFieldValue([record.match_id, 'st_sports_ticker'])
              if (checked === 'BG' && record.bg_status === 'Y') {
                return record.bg_league_name
              }
              if (checked === 'RB' && record.rb_status === 'Y') {
                return record.rb_league_name
              }
              return ''
            }}
          </Form.Item>
        ),
      },
      {
        title: 'Home Away',
        width: 200,
        render: record => (
          <Form.Item
            shouldUpdate={(prevValues, currentValues) =>
              prevValues[record.match_id]?.st_sports_ticker !==
              currentValues[record.match_id]?.st_sports_ticker
            }
          >
            {({ getFieldValue }) => {
              const checked = getFieldValue([record.match_id, 'st_sports_ticker'])
              if (checked === 'BG' && record.bg_status === 'Y') {
                return `${record.bg_home_name} - ${record.bg_away_name}`
              }
              if (checked === 'RB' && record.rb_status === 'Y') {
                return `${record.rb_home_name} - ${record.rb_away_name}`
              }
              return ''
            }}
          </Form.Item>
        ),
      },
      {
        title: 'Disable Sync Market',
        align: 'center',
        width: 50,
        render: record => (
          <Form.Item name={[record.match_id, 'disable_sync_market']} valuePropName="checked">
            <Checkbox />
          </Form.Item>
        ),
      },
    ],
    [formMatch, tableData],
  )

  const PopUpHandler = matchId => {
    setVisible(true)
    setMatchID(matchId)
  }

  return (
    <>
      <Form
        form={formMatch}
        className="w-100"
        id="table-match-form"
        onFinish={values => {
          if (selectedMatch.length === 0) {
            message.error('Please select one match!')
          } else {
            const convertValue = selectedMatch
              .map(match_id => {
                const x = values[match_id]
                return `${match_id}~${x?.auto_odds}~${x?.st_sports_ticker}~${
                  x?.is_reverse_checked_bg ? 'Y' : 'N'
                }~${x?.is_reverse_checked_rball ? 'Y' : 'N'}~${x?.disable_sync_market ? 'Y' : 'N'}`
              })
              .join(',')
            Update({ match_ids: convertValue.toString() }, reload)
          }
        }}
      >
        <Table
          rowKey="match_id"
          size="small"
          className="w-100"
          bordered
          id="table-match"
          loading={loading}
          dataSource={tableData}
          columns={columns}
          rowSelection={{
            selectedRowKeys: selectedMatch,
            onChange: setSelectedMatch,
          }}
          title={() => (
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          )}
          {...restProps}
        />
      </Form>
      <Modal title="History" open={visible} onCancel={() => setVisible(false)} footer={null}>
        <PopUp matchID={matchID} />
      </Modal>
    </>
  )
}

const CheckboxLeechingHeader = ({ value, onChange, type, tableData, formMatch }) => {
  const isHeaderChecked = value === type
  return (
    <Checkbox
      checked={isHeaderChecked}
      value={value}
      onChange={e => {
        const { checked } = e.target
        // if checked true, set all enabled item to type
        // else, set all enabled item to defaultvalue
        const convertValue = tableData.reduce((acc, curr) => {
          const { match_id, auto_odds } = curr
          acc[match_id] = {
            auto_odds: checked ? type : auto_odds,
          }
          return acc
        }, {})
        formMatch.setFieldsValue(convertValue)
        onChange(isHeaderChecked ? undefined : type)
      }}
    >
      {type === 0 && 'MANUAL'}
      {type === 1 && 'SBO'}
      {type === 2 && 'IBC'}
    </Checkbox>
  )
}
const CheckboxLeeching = ({ value, onChange, type, disabled }) => {
  return (
    <Checkbox
      disabled={disabled}
      checked={value === type && !disabled}
      value={value}
      onChange={e => {
        const { checked } = e.target
        if (checked) onChange(type)
      }}
    />
  )
}

const CheckboxSportsTickerHeader = ({ type, tableData, formMatch, value, onChange }) => {
  const isHeaderChecked = value === type
  return (
    <Checkbox
      checked={isHeaderChecked}
      value={value}
      onChange={e => {
        const { checked } = e.target
        // if checked true, set all enabled item to type
        // else, set all enabled item to defaultvalue
        const convertValue = tableData.reduce((acc, curr) => {
          const { match_id, st_sports_ticker } = curr
          acc[match_id] = {
            st_sports_ticker: checked ? type : st_sports_ticker,
          }
          return acc
        }, {})
        formMatch.setFieldsValue(convertValue)
        onChange(isHeaderChecked ? undefined : type)
      }}
    >
      {type === 'RB' && 'RBall'}
      {type === 'BG' && 'BG'}
    </Checkbox>
  )
}
const CheckboxSportsTicker = ({ value, onChange, type, disabled }) => {
  return (
    <Checkbox
      disabled={disabled}
      checked={value === type && !disabled}
      value={value}
      onChange={e => {
        const { checked } = e.target
        if (checked) onChange(type)
        else onChange(undefined)
      }}
    />
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(TableMatch)
