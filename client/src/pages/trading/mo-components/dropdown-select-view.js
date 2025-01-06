import React from 'react'
import { Button, Space, Select, Radio, Divider, Checkbox, Form, Popover } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'
import actions from 'redux/league/actions'
import { ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'

const mapStateToProps = ({ league }) => ({
  loadingLeagueRefresh: league.loadingRefresh,
})

const mapDispatchToProps = dispatch => ({
  RefreshLeague: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SELECT_REFRESH,
      successCallback,
      payload,
    })
  },
})

const DropdownSelectView = ({
  viewParameter,
  setViewParameter,
  isFetching,
  RefreshLeague,
  loadingLeagueRefresh,
  refetch, // refetch only
  refetchNewData, // refetch with resetSelectedRow and resetHiddenRows
  page, // 'MO5','MO5Euro','MOCS','MOOE','MOOS','MOTennis','MOQuick','MOView'
}) => {
  const { popup_id, match_time_slot } = viewParameter
  const [visibleDrawer, setVisibleDrawer] = React.useState()
  const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

  const showFormFTHT = page !== 'MOOE'
  const showFormMatchTimeSlot = ['MO5', 'MO5Euro', 'MOOE', 'MOOS', 'MOTennis', 'MOView'].includes(
    page,
  )
  const showFormSelectLeagueOS = ['MO5', 'MO5Euro', 'MOOS', 'MOView'].includes(page)
  const showFormSelectLeagueMatch = [
    'MO5',
    'MO5Euro',
    'MOCS',
    'MOOE',
    'MOOS',
    'MOTennis',
    'MOView',
  ].includes(page)
  const showFormMove3Market = ['MO5', 'MOOS', 'MOTennis', 'MOQuick'].includes(page)

  const refreshLeague = () =>
    RefreshLeague(
      {
        popup_id,
        group: `MO-${match_time_slot}`,
        from_early_date: '',
        to_early_date: '',
      },
      refetch,
    )

  const content = (
    <Space className="p-1 w-100" direction="vertical">
      {showFormFTHT && (
        <Form.Item name="ftht" noStyle>
          <Select
            className="w-100"
            size="small"
            options={[
              { value: 'FTHT', label: 'FT/HT' },
              { value: 'FT', label: 'FT' },
              { value: 'HT', label: 'HT' },
            ]}
          />
        </Form.Item>
      )}
      <Form.Item name="show_hide" noStyle>
        <Radio.Group className="w-100" size="small">
          <Radio value={1}>Show All</Radio>
          <Radio value={2}>Hide</Radio>
        </Radio.Group>
      </Form.Item>
      <Divider style={{ margin: '4px 0' }} />
      {showFormMatchTimeSlot && (
        <Form.Item name="match_time_slot" noStyle>
          <Select
            className="w-100"
            size="small"
            options={[
              { value: 'Live', label: 'Live' },
              { value: 'Today', label: 'Today' },
              { value: 'Early', label: 'Early' },
            ]}
          />
        </Form.Item>
      )}
      {showFormSelectLeagueOS && (
        <Button
          className="w-100"
          type="text"
          size="small"
          onClick={() => setVisibleDrawer(`league Y`)}
        >
          Select League OS
        </Button>
      )}
      {showFormSelectLeagueMatch && (
        <>
          <Button
            className="w-100"
            type="text"
            onClick={() => setVisibleDrawer(`league ${page !== 'MOTennis' ? 'N' : 'T'}`)}
          >
            Select League
          </Button>
          <Button className="w-100" type="text" onClick={() => setVisibleDrawer(`match`)}>
            Select Match
          </Button>
          <Divider style={{ margin: '4px 0' }} />
        </>
      )}
      <Button
        className="w-100"
        type="text"
        onClick={refreshLeague}
        icon={<ReloadOutlined />}
        loading={loadingLeagueRefresh}
      >
        Refresh League-Match
      </Button>
      {showFormMove3Market && (
        <Form.Item name="move_3_market" noStyle valuePropName="checked">
          <Checkbox>Move 3 Markets</Checkbox>
        </Form.Item>
      )}
    </Space>
  )

  const onValuesChange = (changedValues, values) =>
    setViewParameter(prev => ({ ...prev, ...values }))

  return (
    <>
      <Form layout="inline" initialValues={viewParameter} onValuesChange={onValuesChange}>
        <Space size={0}>
          <Popover
            placement="bottomLeft"
            trigger={['click']}
            content={content}
            overlayInnerStyle={{ width: 200, padding: 0 }}
          >
            <Button style={{ width: 200 }}>View Filter</Button>
          </Popover>
          <Button icon={<ReloadOutlined />} loading={isFetching} onClick={refetch}>
            Refresh
          </Button>
          <Form.Item name="interval" noStyle>
            <Select
              size="small"
              style={{ width: 75 }}
              options={[
                { value: 0, label: 'None' },
                { value: 3, label: '3' },
                { value: 5, label: '5' },
                { value: 10, label: '10' },
                { value: 15, label: '15' },
                { value: 30, label: '30' },
                { value: 60, label: '60' },
              ]}
            />
          </Form.Item>
        </Space>
      </Form>
      <DrawerSelectLeague
        os={visibleDrawer?.split(' ')[1]}
        open={visibleDrawer?.split(' ')[0] === 'league'}
        closeDrawer={closeDrawer}
        group={`MO-${match_time_slot}`}
        popup_id={popup_id}
        callbackSubmit={refetchNewData}
      />
      <DrawerSelectMatch
        open={visibleDrawer === 'match'}
        closeDrawer={closeDrawer}
        group={`MO-${match_time_slot}`}
        popup_id={popup_id}
        callbackSubmit={refetchNewData}
      />
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DropdownSelectView)
