import React from 'react'
import { connect } from 'react-redux'
import { Form, Table } from 'antd'
import actions from 'redux/match-assignment/actions'
import { CheckboxList } from 'components/blaise'

const mapStateToProps = ({ matchAssignment }) => ({
  loading: matchAssignment.loadingDetail,
  data: matchAssignment.dataDetail,
})
const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_DETAIL,
      payload,
      source: 'Match Assignment Detail',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_DETAIL,
      payload,
      successCallback,
      source: 'Match Assignment Detail',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP_DETAIL }),
})

const columns = [
  {
    title: '',
    dataIndex: [0],
    width: 40,
    align: 'center',
    render: key => <>{key}</>,
  },
  {
    title: 'AH',
    dataIndex: [1, 'AH'],
    width: 80,
    render: (items, row) => {
      if (!items) return null

      const name = `${row[0]}AH`
      return (
        <Form.Item className="mb-0" name={name} wrapperCol={{ span: 24 }}>
          <CheckboxList options={items.map(x => ({ label: x.user_id, value: x.user_id }))} />
        </Form.Item>
      )
    },
  },
  {
    title: 'OU',
    dataIndex: [1, 'OU'],
    width: 80,
    render: (items, row) => {
      if (!items) return null

      const name = `${row[0]}OU`
      return (
        <Form.Item className="mb-0" name={name} wrapperCol={{ span: 24 }}>
          <CheckboxList options={items.map(x => ({ label: x.user_id, value: x.user_id }))} />
        </Form.Item>
      )
    },
  },
  {
    title: '1X2',
    dataIndex: [1, '1X2'],
    width: 80,
    render: (items, row) => {
      if (!items) return null

      const name = `${row[0]}1X2`
      return (
        <Form.Item className="mb-0" name={name} wrapperCol={{ span: 24 }}>
          <CheckboxList options={items.map(x => ({ label: x.user_id, value: x.user_id }))} />
        </Form.Item>
      )
    },
  },
]
const Content = ({
  match_id,
  league_id,
  is_pick,
  match_status_live,
  loading,
  data,
  Load,
  Update,
  CleanUp,
  successCallback,
}) => {
  React.useEffect(() => CleanUp, [CleanUp])

  React.useEffect(() => {
    Load({
      match_id,
      league_id,
      is_pick,
      match_status_live,
    })
  }, [Load, match_id, league_id, is_pick, match_status_live])

  const [form] = Form.useForm()
  React.useEffect(() => {
    const defaultValue = Object.keys(data).reduce((obj, key) => {
      return {
        ...obj,
        [key]: data[key].reduce((arr, x) => {
          return x.checked ? arr.concat(x.user_id) : arr
        }, []),
      }
    }, {})
    form.setFieldsValue(defaultValue)
  }, [data, form])

  const dataSource = {
    HT: { AH: data.HTAH, OU: data.HTOU, '1X2': data.HT1X2 },
    FT: { AH: data.FTAH, OU: data.FTOU, '1X2': data.FT1X2 },
  }

  return (
    <Form
      form={form}
      id="detail-match-assignment"
      onFinish={values => {
        Update(
          {
            league_id,
            match_id,
            match_status_live,
            is_pick,
            ...values,
          },
          successCallback,
        )
      }}
    >
      <Table
        loading={loading}
        dataSource={Object.entries(dataSource)}
        columns={columns}
        rowKey={record => record[0]}
        pagination={false}
      />
    </Form>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Content)
