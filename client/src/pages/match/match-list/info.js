import { Checkbox, Form, Input, Spin } from 'antd'
import React from 'react'
import { connect } from 'react-redux'
import actions from 'redux/match-list/actions'

const mapStateToProps = ({ matchList }) => ({
  loading: matchList.loadingInfo,
  dataTable: matchList.dataInfo,
})

const mapDispatchToProps = dispatch => ({
  LoadMatchInfo: payload => {
    dispatch({
      type: actions.LOAD_MATCH_INFO,
      payload,
      source: 'Match List',
    })
  },
  UpdateMatchInfo: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_MATCH_INFO,
      payload,
      successCallback,
      source: 'Match List',
    })
  },
})

const InfoMatchList = ({
  infoValue,
  successCallback,
  loading,
  dataTable,
  UpdateMatchInfo,
  LoadMatchInfo,
}) => {
  const [form] = Form.useForm()

  React.useEffect(() => {
    LoadMatchInfo(infoValue)
  }, [LoadMatchInfo, infoValue])

  const initialValues = React.useMemo(
    () => ({
      ...dataTable,
      st_information: dataTable.st_information === 'Y',
    }),
    [dataTable],
  )
  React.useEffect(() => {
    form.resetFields()
  }, [form, initialValues])

  return (
    <Spin spinning={loading}>
      <Form
        id="info-form"
        form={form}
        labelAlign="left"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={initialValues}
        onFinish={values => {
          UpdateMatchInfo(
            {
              ...infoValue,
              ...values,
              st_information: values.st_information === true ? 'Y' : 'N',
            },
            successCallback,
          )
        }}
      >
        <Form.Item label="Match ID">{dataTable.match_id}</Form.Item>
        <Form.Item label="Sport">{dataTable.sport_name}</Form.Item>
        <Form.Item label="League">{dataTable.league_name}</Form.Item>
        <Form.Item label="Home - Away">
          {dataTable.home_name} - {dataTable.away_name}
        </Form.Item>
        <Form.Item label="Show" name="st_information" valuePropName="checked">
          <Checkbox />
        </Form.Item>
        <Form.Item name="information_en" label="English">
          <Input />
        </Form.Item>
        <Form.Item name="information_ch" label="Mandarin">
          <Input />
        </Form.Item>
        <Form.Item name="information_th" label="Thai">
          <Input />
        </Form.Item>
        <Form.Item name="information_jp" label="Japanese">
          <Input />
        </Form.Item>
        <Form.Item name="information_kr" label="Korean">
          <Input />
        </Form.Item>
        <Form.Item name="information_vn" label="Vietnamese">
          <Input />
        </Form.Item>
        <Form.Item name="information_id" label="Indonesia">
          <Input />
        </Form.Item>
      </Form>
    </Spin>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(InfoMatchList)
