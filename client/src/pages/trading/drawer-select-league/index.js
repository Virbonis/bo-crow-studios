import React from 'react'
import { connect } from 'react-redux'
import { Button, Input, Select, Form, Drawer, Divider } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import SelectMultipleAll from 'components/blaise/custom/SelectMultipleAll'
import actions from 'redux/league/actions'
import TableLeague from './content'
import './custom.scss'

const mapStateToProps = ({ sport }, { os }) => ({
  sportOptions: sport.select
    .filter(data => (os === 'Y' ? data.sport_id !== 10 : true)) // if os skip soccer
    .map(data => ({
      value: data.sport_id,
      label: data.name,
    })),
})
const mapDispatchToProps = (dispatch, { popup_id, group, os, early_date }) => ({
  LoadLeagueSelection: payload => {
    dispatch({
      type: actions.LOAD_SELECT,
      payload: {
        popup_id,
        group,
        os,
        from_early_date: early_date?.[0].format('YYYY-MM-DD'),
        to_early_date: early_date?.[1].format('YYYY-MM-DD'),
        ...payload,
      },
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const DrawerSelectLeague = ({
  sportOptions,
  LoadLeagueSelection,
  CleanUp,
  open,
  closeDrawer,
  callbackSubmit,
  ...restProps
}) => {
  React.useEffect(() => {
    if (!open) CleanUp()
  }, [open, CleanUp])

  return (
    <Drawer
      title="Select League"
      width={700}
      open={open}
      onClose={closeDrawer}
      destroyOnClose
      placement="left"
    >
      <Form
        id="league-form"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
        initialValues={{
          league_name: null,
          sport_ids: sportOptions.map(x => x.value),
          category: '',
        }}
        onFinish={values =>
          LoadLeagueSelection({
            ...values,
            sport_ids: values.sport_ids.join(','),
          })
        }
      >
        <Form.Item name="league_name" label="League Name" className="m-0">
          <Input placeholder="League Name" />
        </Form.Item>
        <Form.Item
          name="sport_ids"
          label="Sport"
          rules={[{ required: true, message: 'Please select sport!' }]}
          className="m-0"
        >
          <SelectMultipleAll options={sportOptions} />
        </Form.Item>
        <Form.Item name="category" label="Category" className="m-0">
          <Select
            options={[
              { value: '', label: 'Show All' },
              { value: 'NORMAL', label: 'Normal' },
              { value: 'SPECIAL', label: 'Special' },
            ]}
          />
        </Form.Item>
        <Divider className="m-0" orientation="right">
          <Button
            form="league-form"
            htmlType="submit"
            type="primary"
            className="bg-success"
            icon={<SearchOutlined />}
          >
            Search
          </Button>
        </Divider>
      </Form>
      <TableLeague
        successCallback={() => {
          if (typeof callbackSubmit === 'function') callbackSubmit()
          closeDrawer()
        }}
        {...restProps}
      />
    </Drawer>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(DrawerSelectLeague)
