import { Button, Drawer, Form, Space, Table } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/user-team/actions'

const mapStateToProps = ({ userTeam }) => ({
  loading: userTeam.loadingUser,
  dataTable: userTeam.user,
})

const mapDispatchToProps = dispatch => ({
  LoadMappingUser: payload => {
    dispatch({
      type: actions.LOAD_MAPPING_USER,
      payload,
      source: 'User Team',
    })
  },
  UpdateMappingUser: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MAPPING_USER,
      payload,
      successCallback,
      source: 'User Team',
    })
  },
  ClearUser: () => {
    dispatch({
      type: actions.SET_STATE,
      payload: {
        user: [],
      },
    })
  },
})

const ButtonUser = ({
  data,
  loading,
  dataTable,
  LoadMappingUser,
  UpdateMappingUser,
  ClearUser,
  successCallback,
}) => {
  const [visibleUser, setVisibleUser] = React.useState(false)

  return (
    <>
      <Button type="link" onClick={() => setVisibleUser(true)}>
        User
      </Button>
      <Drawer
        title="User User Team"
        width="25%"
        onClose={() => {
          setVisibleUser(false)
          ClearUser()
        }}
        open={visibleUser}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleUser(false)}>Cancel</Button>
            <Button form="user-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <User
          data={data}
          loading={loading}
          dataTable={dataTable}
          LoadMappingUser={LoadMappingUser}
          UpdateMappingUser={UpdateMappingUser}
          successCallback={() => {
            successCallback()
            setVisibleUser(false)
          }}
        />
      </Drawer>
    </>
  )
}

const columns = [
  {
    title: 'User Name',
    dataIndex: 'username',
    width: 200,
  },
]
const User = ({
  data,
  loading,
  dataTable,
  LoadMappingUser,
  UpdateMappingUser,
  successCallback,
}) => {
  const [selectedRows, setSelectedRows] = React.useState([])
  React.useEffect(() => {
    LoadMappingUser({ team_id: data.team_id })
  }, [LoadMappingUser, data])

  React.useEffect(() => {
    setSelectedRows(dataTable.filter(e => e.is_selected === 'Y').map(x => x.user_id))
  }, [dataTable])

  return (
    <Form
      id="user-form"
      className="h-100"
      onFinish={() => {
        UpdateMappingUser(
          {
            team_id: data.team_id,
            user_id: selectedRows.join(','),
          },
          successCallback,
        )
      }}
    >
      <Table
        rowKey="user_id"
        columns={columns}
        loading={loading}
        dataSource={dataTable}
        pagination={false}
        rowSelection={{
          selectedRowKeys: selectedRows,
          onChange: values => setSelectedRows(values),
        }}
      />
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUser)
