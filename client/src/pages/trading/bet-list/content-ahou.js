import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Col, Divider, Form, Row, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/bet-list/actions'
import { Amount } from 'components/blaise'
import { getListGameType, QueryBetList } from './query'
import TableForecast from './table-forecast'
import TableAverage from './table-average'
import TableBetList from './table-betlist'

const mapStateToProps = ({ match, betList }) => ({
  matchOptions: match.select_in_betlist.map(x => ({ value: x.match_id, label: x.team })),
  viewParameter: betList.viewParameter,
})
const mapDispatchToProps = dispatch => ({
  setViewParameter: payload => {
    dispatch({
      type: actions.SET_VIEW_PARAMETER,
      payload,
    })
  },
  GetForecast: (payload, successCallback) => {
    dispatch({
      type: actions.GET_FORECAST,
      payload,
      successCallback,
    })
  },
})
const defaultListGTAHOU = ['AHSW', 'GAH', 'OUGOU', 'NGNC', 'ML']
const ContentAHOU = React.memo(
  ({ matchOptions, editValue, viewParameter, setViewParameter, GetForecast }) => {
    const [valueHome, setValueHome] = React.useState(0)
    const [valueAway, setValueAway] = React.useState(0)
    const listGameType = React.useMemo(() => {
      return getListGameType(viewParameter.list_gt, defaultListGTAHOU)
    }, [viewParameter.list_gt])

    const { data, isFetching, refetch } = QueryBetList({
      match_id: editValue.match_id,
      gt: editValue.gt,
      ...viewParameter,
      sub_match_id: viewParameter.list_gt.length === 0 ? editValue.sub_match_id : -1,
      list_game_type: listGameType,
    })

    const [form] = Form.useForm()
    React.useEffect(() => {
      form.resetFields()
    }, [viewParameter, form])

    const onSelectAll = e => {
      const { checked } = e.target
      setViewParameter({
        list_gt: checked ? defaultListGTAHOU : [],
      })
      if (!checked)
        setViewParameter({
          match_id: editValue.match_id,
          ftht: '',
        })
    }
    const isSelectAll = viewParameter.list_gt.length === defaultListGTAHOU.length

    return (
      <>
        <Row gutter={10}>
          <Col span={8}>
            <Divider orientation="left" className="m-0">
              Filter
            </Divider>
            <Form
              size="small"
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 16 }}
              form={form}
              initialValues={{
                ...editValue,
                ...viewParameter,
              }}
              onValuesChange={values => {
                setViewParameter({ ...values })
              }}
            >
              <Form.Item label="Match" name="match_id" className="mb-0">
                <Select
                  showSearch
                  options={matchOptions}
                  optionFilterProp="label"
                  disabled={!isSelectAll}
                />
              </Form.Item>
              <Form.Item label="Is Running" name="st_live" className="mb-0">
                <Select
                  className="w-100"
                  size="small"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'Y', label: 'Yes' },
                    { value: 'N', label: 'No' },
                  ]}
                />
              </Form.Item>
              <Form.Item label="Is First Half" name="ftht" className="mb-0">
                <Select
                  className="w-100"
                  size="small"
                  options={[
                    { value: '', label: 'All' },
                    { value: 'HT', label: 'Yes' },
                    { value: 'FT', label: 'No' },
                  ]}
                  disabled={!isSelectAll}
                />
              </Form.Item>
              <Checkbox onChange={onSelectAll} checked={isSelectAll}>
                Select All
              </Checkbox>
              <Form.Item name="list_gt" wrapperCol={24}>
                <Checkbox.Group>
                  <Checkbox value={defaultListGTAHOU[0]}>All AH</Checkbox>
                  <Checkbox value={defaultListGTAHOU[1]}>All G.AH</Checkbox>
                  <Checkbox value={defaultListGTAHOU[2]}>All OU/G.OU</Checkbox>
                  <Checkbox value={defaultListGTAHOU[3]}>All NG/NC</Checkbox>
                  <Checkbox value={defaultListGTAHOU[4]}>All ML</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Space>
                <Button
                  size="small"
                  loading={isFetching}
                  icon={<ReloadOutlined />}
                  onClick={refetch}
                >
                  Refresh
                </Button>
                <Form.Item name="interval" noStyle>
                  <Select
                    style={{ width: 75 }}
                    size="small"
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
          </Col>
          <Col span={4}>
            <TableForecast
              editValue={editValue}
              listGameType={listGameType}
              GetForecast={GetForecast}
            />
          </Col>
          <Col span={4}>{!isSelectAll && <TableAverage data={data} />}</Col>
        </Row>
        <Row gutter={10}>
          <Col span={12}>
            <Divider orientation="left" className="font-weight-bold m-0">
              Home
            </Divider>
            <TableBetList data={data?.home} setTotal={setValueHome} />
          </Col>
          <Col span={12}>
            <Divider orientation="left" className="font-weight-bold m-0">
              Away
            </Divider>
            <TableBetList data={data?.away} setTotal={setValueAway} />
          </Col>
        </Row>
        <div style={{ display: 'flex', justifyContent: 'center', fontWeight: 'bold' }}>
          Diff: &nbsp;
          <Amount value={valueHome - valueAway} />
        </div>
      </>
    )
  },
)

export default connect(mapStateToProps, mapDispatchToProps)(ContentAHOU)
