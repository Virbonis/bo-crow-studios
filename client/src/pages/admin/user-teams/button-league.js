import { Button, Drawer, Form, Input, Select, Space, Table, message } from 'antd'
import { CustomizeCell } from 'components/blaise'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/user-team/actions'

const mapStateToProps = ({ userTeam }) => ({
  loading: userTeam.loadingLeague,
  dataTable: userTeam.league,
  totalData: userTeam.total_data_league,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: payload => {
    dispatch({
      type: actions.LOAD_LEAGUE,
      payload,
      source: 'User Team',
    })
  },
  UpdateLeague: payload => {
    dispatch({
      type: actions.UPDATE_LEAGUE,
      payload,
      source: 'User Team',
    })
  },
  ClearLeague: () => {
    dispatch({
      type: actions.SET_STATE,
      payload: {
        league: [],
      },
    })
  },
})

const sportOptions = [
  { label: 'Soccer', value: 10 },
  { label: 'eSoccer', value: 57 },
]

const ButtonLeague = ({
  data,
  loading,
  dataTable,
  LoadLeague,
  totalData,
  UpdateLeague,
  ClearLeague,
  successCallback,
}) => {
  const [visibleLeague, setVisibleLeague] = React.useState(false)
  return (
    <>
      <Button
        type="link"
        onClick={() => {
          setVisibleLeague(true)
        }}
      >
        League
      </Button>
      <Drawer
        title="League"
        width="50%"
        onClose={() => {
          setVisibleLeague(false)
          ClearLeague()
        }}
        open={visibleLeague}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleLeague(false)}>Cancel</Button>
            <Button form="league-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <League
          data={data}
          loading={loading}
          dataTable={dataTable}
          LoadLeague={LoadLeague}
          totalData={totalData}
          UpdateLeague={UpdateLeague}
          successCallback={() => {
            successCallback()
            setVisibleLeague(false)
          }}
        />
      </Drawer>
    </>
  )
}

const columns = [
  {
    title: 'League',
    dataIndex: 'league',
    width: 200,
  },
]
const League = ({
  data,
  loading,
  dataTable,
  totalData,
  LoadLeague,
  UpdateLeague,
  successCallback,
}) => {
  const [formFilter] = Form.useForm()
  const [parameters, setParameters] = React.useState({ page: 1, display: 50 })
  const [selectedRows, setSelectedRows] = React.useState([])

  const reload = React.useCallback(() => {
    const { sport_id, league } = formFilter.getFieldsValue()
    LoadLeague({
      user_team_id: data.user_team_id,
      user_team_sub_id: data.user_team_sub_id,
      sport_id,
      league,
      current_page: parameters.page,
      page_size: parameters.display,
    })
  }, [parameters, LoadLeague, data.user_team_id, data.user_team_sub_id, formFilter])

  React.useEffect(() => {
    reload()
  }, [reload])

  React.useEffect(() => {
    setSelectedRows(dataTable.filter(e => e.is_selected === 'Y').map(e => e.league_id))
  }, [setSelectedRows, dataTable])

  return (
    <>
      <Form
        form={formFilter}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        onValuesChange={reload}
        initialValues={{
          sport_id: 10,
        }}
      >
        <Form.Item label="Team">{data.team_name}</Form.Item>
        <Form.Item className="w-100" name="sport_id" label="Sport">
          <Select options={sportOptions} />
        </Form.Item>
        <Form.Item name="league" label="League" extra="*Type to search League Name">
          <Input />
        </Form.Item>
      </Form>
      <Form
        id="league-form"
        onFinish={() => {
          const league_removed = dataTable
            .filter(e => e.is_selected === 'Y' && !selectedRows.includes(e.league_id))
            .map(e => e.league_id)
            .join(',')
          const league_added = dataTable
            .filter(e => e.is_selected === 'N' && selectedRows.includes(e.league_id))
            .map(e => e.league_id)
            .join(',')

          if (league_removed === '' && league_added === '') {
            message.warning('No changes')
            return
          }

          UpdateLeague(
            {
              user_team_id: data.user_team_id,
              user_team_sub_id: data.user_team_sub_id,
              sport_id: formFilter.getFieldsValue().sport_id,
              league_removed,
              league_added,
            },
            successCallback(),
          )
        }}
      >
        <Table
          rowKey="league_id"
          loading={loading}
          dataSource={dataTable}
          columns={columns}
          components={{
            body: {
              cell: CustomizeCell,
            },
          }}
          pagination={{
            showTotal: total => `Total ${total} items`,
            total: totalData,
            current: parameters.page,
            pageSize: parameters.display,
            showSizeChanger: true,
          }}
          onChange={pagination => {
            setParameters({
              page: pagination.current,
              display: pagination.pageSize,
            })
          }}
          rowSelection={{
            selectedRowKeys: selectedRows,
            onChange: values => setSelectedRows(values),
          }}
          scroll={{ y: 600 }}
        />
      </Form>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonLeague)
