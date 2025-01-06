import React from 'react'
import { Form } from 'antd'
import SelectBaseballsetout from './components/select-baseballsetout'
import CheckboxBaseball from './components/checkbox-baseball'

const TableBaseball2 = ({ data, refetch }) => {
  return (
    <Form size="small">
      <Form.Item label="Out" className="mb-0">
        <SelectBaseballsetout value={data.home12} successCallback={refetch} />
      </Form.Item>
      <Form.Item label="B1" className="mb-0">
        <CheckboxBaseball value={data.home13} no={1} successCallback={refetch} />{' '}
      </Form.Item>
      <Form.Item label="B2" className="mb-0">
        <CheckboxBaseball value={data.home14} no={2} successCallback={refetch} />
      </Form.Item>
      <Form.Item label="B3" className="mb-0">
        <CheckboxBaseball value={data.home15} no={3} successCallback={refetch} />
      </Form.Item>
    </Form>
  )
}
export default TableBaseball2
