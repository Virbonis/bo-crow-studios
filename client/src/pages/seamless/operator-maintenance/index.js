import { ReloadOutlined } from '@ant-design/icons'
import { Alert, Button, Checkbox, Form, Table, Tooltip } from 'antd'
import React, { useEffect } from 'react'
import authEnum from 'authorize'
import { connect } from 'react-redux'
import actions from 'redux/operator-maintenance/actions'

const mapStateToProps = ({ operatorMaintenance, auth }) => ({
  dataTable: operatorMaintenance.data || [],
  loading: operatorMaintenance.loading,
  allowToEdit: auth.user.user_auth_ids.includes(authEnum.ALLOWED_TO_SET_OPERATOR_MAINTENANCE),
})

const mapDispatchMapToProps = dispatch => ({
  Load: () => {
    dispatch({
      type: actions.LOAD,
      source: 'Operator Maintenance',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Operator Maintenance',
    })
  },
})

const OperatorMaintenance = ({ dataTable, loading, Load, Update, allowToEdit }) => {
  const [formTable] = Form.useForm()
  const column = [
    {
      title: 'Branch ID',
      dataIndex: 'branch_id',
      width: 100,
    },
    {
      title: 'Branch Name',
      dataIndex: 'branch_name',
      width: 100,
    },
    {
      title: 'Prefix',
      dataIndex: 'prefix',
      width: 100,
    },
    {
      title: 'Operator ID',
      dataIndex: 'operator_id',
      width: 300,
    },
    {
      title: 'Operator Name',
      dataIndex: 'operator_name',
    },
    {
      title: 'Maintenance',
      dataIndex: 'st_maintenance',
      align: 'center',
      render: (data, record) => {
        return (
          <Form.Item name={[record.branch_id]} valuePropName="checked" disabled={!allowToEdit}>
            <Checkbox />
          </Form.Item>
        )
      },
      width: 100,
    },
  ]
  useEffect(() => {
    Load()
  }, [Load])

  useEffect(() => {
    const initialValues = dataTable.reduce((acc, cur) => {
      const { branch_id, st_maintenance } = cur
      acc = { ...acc, [branch_id]: st_maintenance === 1 }
      return acc
    }, {})

    formTable.setFieldsValue(initialValues)
  }, [dataTable, formTable])

  return (
    <>
      <div className="card">
        <div
          className={`card-header d-flex ${allowToEdit &&
            'flex-row-reverse'} justify-content-between`}
        >
          {!allowToEdit && (
            <Alert message="You are not allowed to edit this page" type="error" className="w-50" />
          )}
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={() => Load()} />
          </Tooltip>
        </div>
        <div className="card-body">
          <Form
            form={formTable}
            id="form-table"
            onFinish={values => {
              const upd_string = Object.entries(values)
                .map(([branch_id, st_maintenance]) => `${branch_id}~${st_maintenance ? '1' : '0'}`)
                .join(';')
              Update({ upd_string }, Load)
            }}
          >
            <Table
              rowKey="branch_id"
              loading={loading}
              columns={column}
              pagination={false}
              dataSource={dataTable}
              title={() => (
                <div className="d-flex flex-row-reverse">
                  <Button
                    type="primary"
                    htmlType="submit"
                    form="form-table"
                    disabled={!allowToEdit}
                  >
                    Update
                  </Button>
                </div>
              )}
            />
          </Form>
        </div>
      </div>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchMapToProps)(OperatorMaintenance)
