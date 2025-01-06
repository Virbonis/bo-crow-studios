import React, { useState } from 'react'
import {
  Col,
  Form,
  Row,
  Input,
  Select,
  Table,
  Button,
  Tooltip,
  Modal,
  InputNumber,
  message,
  Drawer,
  Space,
  Switch,
  Typography,
  Popconfirm,
} from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import { useFormWithPagination } from 'components/blaise'
import actions from 'redux/news-ticker/actions'
import Edit from './edit'
import Create from './create'

const { Text } = Typography
const mapStateToProps = ({ newsTicker }) => ({
  loading: newsTicker.loadingData,
  tableData: newsTicker.data.result,
  totalResults: newsTicker.data.total,
})

const mapDispatchToProps = dispatch => ({
  Load: payload => {
    dispatch({
      type: actions.LOAD_TABLE,
      payload,
      source: 'News Ticker',
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'News Ticker',
    })
  },
})

const languageOptions = [
  { value: 'en-US', label: 'English' },
  { value: 'zh-CN', label: 'Mandarin' },
  { value: 'th-TH', label: 'Thai' },
  { value: 'ja-JP', label: 'Japanese' },
  { value: 'ko-KR', label: 'Korean' },
  { value: 'vi-VN', label: 'Vietnamese' },
  { value: 'id-ID', label: 'Bahasa' },
]
const newsDisplayStatusOptions = [
  { value: '', label: 'Show All Display' },
  { value: 'Y', label: 'Display' },
  { value: 'N', label: 'Hidden' },
]
// const newsTypeOptions = [
//   { value: 'GN', label: 'General' },
//   { value: 'PR', label: 'Personal' },
// ]

const NewsTicker = ({ loading, Load, tableData, totalResults, Delete }) => {
  const [form] = Form.useForm()
  const [deleteList, setDeleteList] = useState([])
  const [visibleEdit, setVisibleEdit] = useState(false)
  const [editValue, setEditValue] = useState()
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [submitNewsType, setSubmitNewsType] = useState()

  let { websiteOptions } = useSelectOptions()
  websiteOptions = [{ value: -2, label: 'Show All Website' }].concat(websiteOptions)

  const fetch = React.useCallback(
    values => {
      const news_type = values.news_type ? 'PR' : 'GN'
      Load({
        ...values,
        news_type,
      })
      setSubmitNewsType(news_type)
    },
    [Load],
  )
  const { formProps, paginationProps } = useFormWithPagination(form, fetch, totalResults)
  const reload = React.useCallback(() => {
    form.submit()
    setDeleteList([])
  }, [form])
  React.useEffect(() => reload(), [reload])

  const columns = [
    {
      title: 'News ID',
      dataIndex: 'news_id',
      align: 'center',
      width: 60,
    },
    {
      title: 'Website Name',
      dataIndex: 'website_name',
      align: 'center',
      width: 150,
    },
    {
      title: 'Language',
      dataIndex: 'lang',
      render: text => languageOptions.find(data => data.value === text).label,
      align: 'center',
      width: 100,
    },
    {
      title: 'Seq',
      dataIndex: 'news_sequence',
      align: 'center',
      width: 80,
    },
    {
      title: 'Date',
      align: 'center',
      render: record => (
        <>
          <Text className={record.is_straight === 'N' ? 'text-white' : ''}>
            {record.news_from_date}
          </Text>
          <br />
          <Text className={record.is_straight === 'N' ? 'text-white' : ''}>
            {record.news_to_date}
          </Text>
        </>
      ),
      onCell: record => {
        if (record.is_early === 'Y') return { className: 'bg-warning' }
        if (record.is_started === 'Y') return { className: 'bg-danger' }
        return {}
      },
      width: 200,
    },
    {
      title: 'News',
      render: record => {
        return (
          <>
            {record.news}
            <br />
            {submitNewsType === 'PR' && (
              <Text>
                <br />
                Username:{' '}
                {record.username.slice(-1) === ',' ? record.username.slice(0, -1) : record.username}
                {/* {record.username.includes(',') && record.username.slice(-1) === ',' && (
                  record.username.slice(0, -1).replaceAll(',', ', ')
                )}
              {record.username.includes(',')
                ? record.username.slice(0, -1).replaceAll(',', ', ')
                : record.username} */}
              </Text>
            )}
          </>
        )
      },

      width: 800,
    },
    {
      title: 'Display',
      align: 'center',
      dataIndex: 'news_display_status',
      width: 100,
      render: text => {
        const result = newsDisplayStatusOptions.find(data => data.value === text).label
        return (
          <>
            {text === 'Y' && <Text>{result}</Text>}
            {text === 'N' && <Text className="text-danger">{result}</Text>}
          </>
        )
      },
    },
    {
      title: 'Action',
      align: 'center',
      width: 100,
      fixed: 'right',
      render: record => (
        <>
          <Tooltip title="Edit">
            <Button type="link" icon={<EditOutlined />} onClick={() => editHandler(record)} />
          </Tooltip>
          <Tooltip title="Delete">
            <Popconfirm
              title="Are you sure delete this?"
              onConfirm={() => singleDeleteHandler(record, reload)}
            >
              <Button type="link" icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
          {/* <Checkbox
            checked={deleteList.includes(record.news_id)}
            onChange={() =>
              deleteList.includes(record.news_id)
                ? setDeleteList(prev => prev.filter(data => record.news_id !== data))
                : setDeleteList(prev => prev.concat(record.news_id))
            }
          /> */}
        </>
      ),
    },
    Table.SELECTION_COLUMN,
  ]

  const singleDeleteHandler = record => {
    Modal.confirm({
      title: `Confirm DELETE News ID : ${record.news_id}?`,
      okText: 'Yes',
      cancelText: 'No',
      maskClosable: true,
      onOk: () => {
        Delete({ news_ids: [record.news_id] }, reload)
      },
    })
  }
  const multiDeleteHandler = record => {
    const sortedNumber = record.sort()
    if (sortedNumber.length > 0) {
      let printNumber
      if (sortedNumber.length > 2) {
        printNumber = sortedNumber.reduce((acc, curr, index) => {
          if (sortedNumber.length > 2 && index === sortedNumber.length - 1) {
            acc += `and, ${curr}`
          } else {
            acc += `${curr}, `
          }
          return acc
        }, '')
      } else if (sortedNumber.length === 2) {
        printNumber = sortedNumber.toString().replace(',', ' and ')
      }
      Modal.confirm({
        title: `Confirm DELETE News ID : ${
          sortedNumber.length === 1 ? sortedNumber : printNumber
        } ?`,
        okText: 'Yes',
        cancelText: 'No',
        maskClosable: true,
        onOk: () => {
          Delete({ news_ids: sortedNumber }, reload)
        },
      })
    } else {
      message.warning(`You haven't selected any news`)
    }
  }

  const createHandler = () => setVisibleCreate(true)
  const editHandler = record => {
    setVisibleEdit(true)
    setEditValue(record)
  }

  return (
    <>
      <div className="card">
        <div className="card-header">
          <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
            <Tooltip placement="top" title="Refresh list">
              <Button icon={<ReloadOutlined />} onClick={reload} />
            </Tooltip>
            <Button icon={<PlusOutlined />} onClick={createHandler}>
              Create
            </Button>
            <Form
              form={form}
              className="w-100"
              initialValues={{
                website_id: -2,
                lang: 'en-US',
                news_display_status: '',
                news_type: false,
              }}
              {...formProps}
            >
              <Row gutter={[8, 8]}>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="news_id">
                    <Input placeholder="News ID" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="website_id">
                    <Select options={websiteOptions} showSearch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="lang">
                    <Select options={languageOptions} showSearch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="news_sequence">
                    <InputNumber
                      className="w-100"
                      controls={false}
                      maxLength={6}
                      placeholder="Seq"
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="news_display_status">
                    <Select options={newsDisplayStatusOptions} showSearch />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
                  <Form.Item name="news_type" valuePropName="checked">
                    <Switch unCheckedChildren="General" checkedChildren="Personal" />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
        <div className="card-body">
          <Table
            rowKey="news_id"
            size="small"
            bordered
            loading={loading}
            dataSource={tableData}
            columns={columns}
            pagination={paginationProps}
            rowSelection={{
              // type: 'checkbox',
              selectedRowKeys: deleteList,
              onChange: setDeleteList,
            }}
            title={() => (
              <div align="right">
                <Button type="primary" onClick={() => multiDeleteHandler(deleteList)}>
                  Delete
                </Button>
              </div>
            )}
            scroll={{
              x: true,
            }}
          />
        </div>
        <div className="card-footer">
          <b>Legend:</b>
          <br />
          <div className="bg-warning text-white px-1" style={{ width: '100px' }}>
            Early News
          </div>
          <div className="bg-danger text-white px-1" style={{ width: '100px' }}>
            Started News
          </div>
          <b>*filter by News ID, other filters are ignored</b>
        </div>
      </div>
      <Drawer
        title="Create News Ticker"
        width={900}
        open={visibleCreate}
        onClose={() => setVisibleCreate(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleCreate(false)}>Cancel</Button>
            <Button form="create-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Create
          websiteOptions={websiteOptions.filter(data => data.value !== -2)}
          languageOptions={[{ value: 'ALL', label: 'ALL LANGUAGE' }].concat(languageOptions)}
          successCallback={() => {
            reload()
            setVisibleCreate(false)
          }}
        />
      </Drawer>
      <Drawer
        title="Edit News Ticker"
        width={900}
        open={visibleEdit}
        onClose={() => setVisibleEdit(false)}
        destroyOnClose
        footer={
          <Space>
            <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
            <Button form="edit-form" type="primary" htmlType="submit">
              Submit
            </Button>
          </Space>
        }
      >
        <Edit
          newsType={submitNewsType}
          editValue={editValue}
          languageOptions={languageOptions}
          successCallback={() => {
            reload()
            setVisibleEdit(false)
          }}
        />
      </Drawer>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(NewsTicker)
