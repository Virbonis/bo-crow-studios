import React from 'react'
import { connect } from 'react-redux'
import {
  Col,
  Form,
  Row,
  Input,
  Select,
  Table,
  Button,
  Tooltip,
  Checkbox,
  Modal,
  message,
} from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import { CustomizeCell, useFormWithPagination } from 'components/blaise'
import actions from 'redux/mapping-league/actions'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import './custom.scss'
import SelectOurLeague from './select-our-league'

const mapStateToProps = ({ mappingLeague }) => ({
  loading: mappingLeague.loadingData,
  tableData: mappingLeague.data,
  totalData: mappingLeague.totalData,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'Mapping League',
    })
  },
  Update: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE,
      payload,
      successCallback,
      source: 'Mapping League',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const websiteOptions = [
  { value: '', label: 'All Website' },
  { value: 'SBO', label: 'SBO' },
  { value: 'IBC', label: 'IBC' },
]

const MappingLeague = ({ loading, tableData, totalData, Load, Update, CleanUp }) => {
  React.useEffect(() => CleanUp, [CleanUp])

  const { sportOptions } = useSelectOptions()

  const [form] = Form.useForm()
  const [formTable] = Form.useForm()
  const sportIDSubmitValueRef = React.useRef()

  const fetch = React.useCallback(
    values => {
      Load({
        ...values,
        unmapped: values.unmapped ? 'Y' : 'N',
      })
      sportIDSubmitValueRef.current = values.sport_id
    },
    [Load],
  )
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalData)
  const reload = React.useCallback(
    isForce => {
      if (isForce) {
        form.submit()
        return
      }

      const formTableValue = formTable.getFieldsValue()
      const anyDiff = Object.entries(formTableValue).some(([key, val]) => {
        return (
          val.our_league !== tableData.find(e => e.ibc_league_id === Number(key)).our_league &&
          val.our_league !== null
        )
      })

      if (!anyDiff) {
        form.submit()
        return
      }
      Modal.confirm({
        title: `You have unsaved changes. Are you sure want to reload?`,
        okText: 'Yes',
        cancelText: 'No',
        onOk: () => {
          form.submit()
        },
        onCancel: () => {
          form.submit()
        },
      })
    },
    [form, formTable, tableData],
  )
  React.useEffect(() => {
    formTable.resetFields()
  }, [tableData, formTable])

  // prevent re-render
  const columns = React.useMemo(() => {
    return [
      {
        title: 'Sport Name',
        dataIndex: 'sport_name',
        align: 'center',
        width: 100,
      },
      {
        title: 'Website',
        dataIndex: 'website_name',
        align: 'center',
        width: 120,
      },
      {
        title: 'Leeching League',
        dataIndex: 'ibc_league_name',
        width: 400,
      },
      {
        title: 'Our League',
        width: 400,
        render: ({ ibc_league_id, our_league }) => {
          return (
            <Form.Item
              noStyle
              shouldUpdate={(prevValues, currentValues) =>
                prevValues[ibc_league_id].our_league !== currentValues[ibc_league_id].our_league
              }
            >
              {({ getFieldValue }) => {
                const oldValue = our_league
                const currentValue = getFieldValue([ibc_league_id, 'our_league'])
                let status = null
                if (oldValue !== currentValue && currentValue !== undefined) status = 'warning'
                else if (currentValue === undefined && our_league !== '') status = 'error'
                else status = null
                return (
                  <Form.Item
                    hasFeedback
                    validateStatus={status}
                    name={[ibc_league_id, 'our_league']}
                    rules={[
                      {
                        required: !['', undefined].includes(our_league) && true,
                        message: 'Our League with Leeching League must be filled !',
                      },
                    ]}
                    initialValue={our_league}
                  >
                    <SelectOurLeague
                      sportIDSubmitValueRef={sportIDSubmitValueRef}
                      oldValue={our_league}
                    />
                  </Form.Item>
                )
              }}
            </Form.Item>
          )
        },
      },
    ]
  }, [sportIDSubmitValueRef])

  React.useEffect(() => {
    form.submit()
  }, [form])
  return (
    <div className="card">
      <div className="card-header">
        <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
          <Tooltip placement="top" title="Refresh list">
            <Button icon={<ReloadOutlined />} onClick={() => reload(false)} />
          </Tooltip>
          <Form
            form={form}
            className="w-100"
            initialValues={{
              sport_id: 10,
              website_name: '',
            }}
            {...formProps}
          >
            <Row gutter={[8, 8]}>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="sport_id">
                  <Select showSearch optionFilterProp="label" options={sportOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="website_name">
                  <Select showSearch optionFilterProp="label" options={websiteOptions} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="ibc_league_name">
                  <Input placeholder="Leeching League" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="our_league_name">
                  <Input placeholder="Our League" />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                <Form.Item name="unmapped" valuePropName="checked">
                  <Checkbox>Unmapped</Checkbox>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="card-body">
        <Form
          form={formTable}
          className="w-100"
          onFinish={value => {
            const payload = Object.entries(value)
              // filter only current value !== original value
              .filter(
                ([key, val]) =>
                  val.our_league !==
                    tableData.find(e => e.ibc_league_id === Number(key)).our_league &&
                  val.our_league,
              )
              .map(([key, val]) => {
                const lastString = val.our_league.toString().split(' ')
                const ourLeagueID = lastString[lastString.length - 1].replace(/[()]/g, '')
                return {
                  ibc_league_id: Number(key),
                  our_league_id: Number(ourLeagueID),
                }
              })
            if (payload.length === 0) {
              message.info('No changes detected')
              return
            }
            Update(payload, () => reload(true))
          }}
        >
          <Table
            rowKey="ibc_league_id"
            size="small"
            bordered
            loading={loading}
            dataSource={tableData}
            columns={columns}
            components={{
              body: {
                cell: CustomizeCell,
              },
            }}
            pagination={paginationProps}
            rowClassName={record => record.website_name === 'IBC' && 'row-ibc'}
            title={() => {
              return (
                tableData.length > 0 && (
                  <div align="right">
                    <Tooltip placement="top" title="Save List">
                      <Button type="primary" htmlType="submit">
                        Update
                      </Button>
                    </Tooltip>
                  </div>
                )
              )
            }}
          />
        </Form>
      </div>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MappingLeague)
