import { Form, Input, Select, Spin } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/cancel-outright/actions'

const mapStateToProps = ({ cancelOutright }, { record }) => ({
  loading: cancelOutright[`loadingTeam_${record.outright_id}`],
  cancelTypeOptions:
    cancelOutright[`dataTeam_${record.outright_id}`]?.map(value => {
      const [status] = value.team_name.split(' ')
      const void_id = status === 'Uncancel' ? 81 : 80
      return {
        value: `${void_id}_${value.no_sequence}`,
        label: value.team_name,
      }
    }) || [],
})

const mapDispatchToProps = dispatch => ({
  LoadSelection: payload => {
    dispatch({
      type: actions.LOAD_CANCEL_OUTRIGHT_TEAM,
      payload,
      source: 'Outright - Add Outright',
    })
  },
})

const FormCancel = ({ form, record, loading, cancelTypeOptions, LoadSelection }) => {
  const { outright_id, outright_score_status } = record
  React.useEffect(() => {
    LoadSelection({ outright_id })
  }, [LoadSelection, outright_id])

  const cancelOptions =
    outright_score_status === 'Cancelled'
      ? [{ value: 81, label: 'Uncancel Outright' }].concat(cancelTypeOptions)
      : [{ value: 80, label: 'Cancel Outright' }].concat(cancelTypeOptions)

  React.useEffect(() => {
    form.setFieldsValue({
      [outright_id]: {
        edited: true,
        void_id: outright_score_status === 'Cancelled' ? 81 : 80,
      },
    })
  }, [form, outright_id, outright_score_status])

  return (
    <Spin spinning={loading}>
      <Form.Item name={[outright_id, 'void_id']} className="w-100">
        <Select className="w-100" options={cancelOptions} placeholder="Cancel Type" />
      </Form.Item>
      <Form.Item name={[outright_id, 'void_reason']} className="w-100">
        <Input className="w-100" placeholder="Reason" />
      </Form.Item>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(FormCancel)
