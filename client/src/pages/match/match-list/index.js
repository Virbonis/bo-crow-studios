import React, { useState } from 'react'
import {
  Col,
  DatePicker,
  Form,
  Row,
  Input,
  Select,
  Table,
  Space,
  Switch,
  Button,
  Drawer,
  Tooltip,
  Popconfirm,
} from 'antd'
import { DeleteOutlined, EditOutlined, ReloadOutlined } from '@ant-design/icons'
import { connect } from 'react-redux'
import authEnum from 'authorize'
import actionLeague from 'redux/league/actions'
import actions from 'redux/match-list/actions'
import { categoryName, getScoreGameTypeFGLG, validatorNumeric } from 'helper'
import {
  HomeAwayWithTraderIcon,
  useFormWithPagination2,
  useGetDateTimeBusinessHour,
  // useFormWithPagination,
} from 'components/blaise'
import useSelectOptions from 'components/blaise/shared-components/useSelectOptions'
import './custom.scss'
import Edit from './edit'
import Detail from './detail'
import List from './list'
import Info from './info'
import AddSpecial from './add-special'

const mapStateToProps = ({ auth, matchList }) => ({
  canEdit: !auth.user.user_auth_ids.includes(authEnum.DISALLOW_EDIT_MATCH),
  canDelete: !auth.user.user_auth_ids.includes(authEnum.DISALLOW_DELETE_MATCH),
  loading: matchList.loading,
  dataTable: matchList.data?.result,
  totalResult: matchList.data?.total,
})

const mapDispatchToProps = dispatch => ({
  LoadLeague: (payload, successCallback) => {
    dispatch({
      type: actionLeague.LOAD_SELECT_IN_MATCHLIST,
      payload,
      source: 'Match List',
      successCallback,
    })
  },
  Load: (payload, successCallback) => {
    dispatch({
      type: actions.LOAD,
      payload,
      source: 'Match List',
      successCallback,
    })
  },
  Delete: (payload, successCallback) => {
    dispatch({
      type: actions.DELETE,
      payload,
      successCallback,
      source: 'Match List',
    })
  },
  CleanUp: () => dispatch({ type: actions.CLEAN_UP }),
})

const matchCategoryOptions = [
  { value: '', label: 'All Category' },
  { value: '0', label: 'Normal' },
  { value: '3', label: 'World Cup' },
  { value: '2', label: 'Olympic' },
  { value: '4', label: 'EURO' },
  { value: '5', label: 'COPA' },
  { value: '1', label: 'Special - Normal' },
  { value: '31', label: 'Special - World Cup' },
  { value: '21', label: 'Special - Olympic' },
  { value: '41', label: 'Special - EURO' },
  { value: '51', label: 'Special - COPA' },
]

const listSpecialMatch = ['1', '31', '21', '41', '51']

export const sportSpecial = [10, 11, 12, 16, 32, 38, 52, 35, 22]
export const sportSpecialMore = [10, 11, 12, 32]

const wrapperDate = Component => props => {
  const defaultDateTime = useGetDateTimeBusinessHour()
  if (!defaultDateTime) return null
  return <Component {...props} defaultDateTime={defaultDateTime} />
}
const MatchList = wrapperDate(
  ({
    canEdit,
    canDelete,

    loading,
    dataTable,
    totalResult,

    // isEmpty,
    LoadLeague,
    Load,
    Delete,
    defaultDateTime,
    CleanUp,
  }) => {
    React.useEffect(() => CleanUp, [CleanUp])

    const [form] = Form.useForm()

    const [visibleEdit, setVisibleEdit] = useState(false)
    const [editValue, setEditValue] = useState()
    const btnSubmitEditRef = React.useRef()

    const [visibleDetail, setVisibleDetail] = useState(false)
    const [detailValue, setDetailValue] = useState()

    const [visibleListSubMenu, setVisibleListSubMenu] = useState(false)
    const [listSubMenuValue, setListSubMenuValue] = useState()

    const [visibleInfo, setVisibleInfo] = useState(false)
    const [infoValue, setInfoValue] = useState()

    const [visibleAddSpecial, setVisibleAddSpecial] = useState(false)
    const [addSpecialValue, setAddSpecialValue] = useState()

    const fetch = React.useCallback(
      (values, successCallback) => {
        Load(
          {
            ...values,
            date_start: values?.dateRange?.[0].format('YYYY-MM-DD'),
            date_end: values?.dateRange?.[1].format('YYYY-MM-DD'),
            order_by: values?.order_by ? 'time' : 'normal',
            current_page: values.page,
            page_size: values.pageSize,
          },
          successCallback,
        )
      },
      [Load],
    )
    const { formProps, paginationProps, reload } = useFormWithPagination2(form, fetch, totalResult)
    const reloadLeague = React.useCallback(() => {
      const values = form.getFieldsValue()
      const oldLeagueID = values.league_id
      LoadLeague(
        {
          ...values,
          date_start: values.dateRange[0].format('YYYY-MM-DD'),
          date_end: values.dateRange[1].format('YYYY-MM-DD'),
          sport_ids: values.sport_id,
        },
        (league_select_in_matchlist = []) => {
          if (league_select_in_matchlist.findIndex(e => e.league_id === oldLeagueID) === -1)
            form.resetFields(['league_id'])
        },
      )
    }, [form, LoadLeague])

    const columns = React.useMemo(
      () => [
        {
          title: 'Match ID',
          dataIndex: 'match_id',
          align: 'center',
          width: 80,
        },
        {
          title: (
            <>
              Match Date
              <br />
              Create Date
            </>
          ),
          width: 120,
          align: 'center',
          render: (_text, { match_date, created_date }) => {
            return (
              <>
                {match_date.formatDateTime()}
                <br />
                <span className="text-warning">{created_date.formatDateTime()}</span>
              </>
            )
          },
        },
        {
          title: 'Profile',
          dataIndex: 'profile_id',
          align: 'center',
          width: 100,
        },
        {
          title: 'League',
          dataIndex: 'league_name',
          width: 200,
        },
        {
          title: (
            <>
              Home
              <br />
              Away
            </>
          ),
          render: (text, record) => <HomeAwayWithTraderIcon {...record} />,
          onCell: ({ match_confirmed_status }) => ({
            className: match_confirmed_status === 'N' && 'unconfirmed',
          }),
          width: 220,
        },
        {
          title: 'Leech',
          dataIndex: 'auto_odds',
          align: 'center',
          width: 100,
        },
        {
          title: 'Category',
          dataIndex: 'category',
          align: 'center',
          width: 120,
          render: text => (
            <span style={{ whiteSpace: 'pre-wrap' }}>
              {text
                .split('^')
                .map(value => categoryName[value])
                .join(', \n')}
            </span>
          ),
        },
        {
          title: 'Open',
          width: 80,
          dataIndex: 'match_open_status',
          align: 'center',
          render: text => {
            if (text === 'Y') return 'Open'
            if (text === 'N') return <span className="text-danger"> Close</span>
            return ''
          },
        },
        {
          title: 'Live',
          width: 80,
          dataIndex: 'match_live_status',
          align: 'center',
          render: text => {
            if (text === 'Y') return <span className="text-success">Live</span>
            if (text === 'N') return '-'
            return ''
          },
        },
        {
          title: 'Has Live',
          width: 80,
          dataIndex: 'match_has_live_status',
          align: 'center',
          render: text => {
            if (text === 'Y') return <span className="text-success">Has Live</span>
            if (text === 'N') return '-'
            return ''
          },
        },
        {
          title: 'Has Parlay',
          width: 80,
          dataIndex: 'match_has_parlay_status',
          align: 'center',
          render: text => {
            if (text === 'Y') return <span className="text-success">Has Parlay</span>
            if (text === 'N') return '-'
            return ''
          },
        },
        {
          title: 'Score',
          children: [
            {
              title: 'Half Time',
              width: 80,
              align: 'center',
              render: (data, record) => {
                const ScoreHT = () => {
                  if (record.ht_score_status === 'C')
                    return <span className="text-danger">{record.ht_score_desc}</span>
                  if (record.ht_score_status === 'Y') return `${record.ht_home} - ${record.ht_away}`
                  return null
                }
                const ProcessHT = () => {
                  if (record.ht_process_status === 'Y')
                    return <span className="text-success">Processed</span>
                  if (record.ht_process_status === '0') return 'Queue'
                  if (record.ht_process_status === '1') return 'Running'
                  return null
                }

                return (
                  <>
                    <ScoreHT />
                    <br />
                    <ProcessHT />
                  </>
                )
              },
            },
            {
              title: 'Full Time',
              width: 80,
              align: 'center',
              render: (data, record) => {
                const ScoreFT = () => {
                  if (record.ft_score_status === 'C')
                    return <span className="text-danger">{record.ft_score_desc}</span>
                  if (record.ft_score_status === 'Y') {
                    if (record.st_void_choice === 1) return `DNF - ${record.fs_away}`
                    if (record.st_void_choice === 2) return `${record.fs_home} - DNF`
                    return `${record.fs_home} - ${record.fs_away}`
                  }
                  return null
                }
                const ProcessFT = () => {
                  if (record.ft_process_status === 'Y')
                    return <span className="text-success">Processed</span>
                  if (record.ft_process_status === '0')
                    return <span className="text-warning">Queue</span>
                  if (record.ft_process_status === '1')
                    return <span className="text-warning">Running</span>
                  return null
                }

                return (
                  <>
                    <ScoreFT />
                    <br />
                    <ProcessFT />
                  </>
                )
              },
            },
            {
              title: 'FGLG',
              width: 80,
              align: 'center',
              render: ({
                match_has_fglg_status,
                fglg_score_status,
                process_fglg_status,
                fg_team,
                lg_team,
              }) => {
                if (match_has_fglg_status !== 'Y') return <span className="text-danger">NA</span>

                const ScoreFGLG = () => {
                  if (fglg_score_status !== 'Y') return null
                  return getScoreGameTypeFGLG(fg_team, lg_team)
                }

                const ProcessFGLG = () => {
                  if (match_has_fglg_status !== 'Y') return null

                  if (process_fglg_status === 'Y')
                    return <span className="text-success">Processed</span>
                  if (process_fglg_status === '0')
                    return <span className="text-warning">Queue</span>
                  if (process_fglg_status === '1')
                    return <span className="text-warning">Running</span>
                  return null
                }

                return (
                  <>
                    <ScoreFGLG />
                    <br />
                    <ProcessFGLG />
                  </>
                )
              },
            },
          ],
        },
        {
          title: 'Special',
          fixed: 'right',
          align: 'center',
          width: 80,
          render: (text, record) => {
            return (
              record.is_match_has_gt_special === 'Y' && (
                <Button
                  type="link"
                  onClick={() => {
                    setVisibleDetail(true)
                    setDetailValue({ match_id: record.match_id })
                  }}
                >
                  Detail
                </Button>
              )
            )
          },
        },
        {
          title: 'Action',
          fixed: 'right',
          width: 75,
          render: (text, record) => {
            const onEditMatch = () => {
              setVisibleEdit(true)
              setEditValue({
                match_id: record.match_id,
                sport_id: record.sport_id,
                match_date: record.match_date,
              })
            }
            const onDeleteMatch = () => {
              Delete({ match_id: record.match_id }, reload)
            }
            const onListMatch = () => {
              setVisibleListSubMenu(true)
              setListSubMenuValue({ match_id: record.match_id })
            }
            const onInfoMatch = () => {
              setVisibleInfo(true)
              setInfoValue({ match_id: record.match_id })
            }

            return (
              <>
                <Button type="link" icon={<EditOutlined />} onClick={onEditMatch} />
                {record.match_has_ticket_status === 'N' &&
                  record.ht_process_status === 'N' &&
                  record.ft_process_status === 'N' &&
                  record.fglg_process_status === 'N' &&
                  record.is_match_has_lottery === 'N' &&
                  canDelete && (
                    <Popconfirm title="Are you sure delete this?" onConfirm={onDeleteMatch}>
                      <Button type="link" className="text-danger" icon={<DeleteOutlined />} />
                    </Popconfirm>
                  )}
                <br />
                <Button className="px-1" type="link" onClick={onListMatch}>
                  List
                </Button>
                <Button className="px-1" type="link" onClick={onInfoMatch}>
                  Info
                </Button>
              </>
            )
          },
        },
        {
          title: 'Special',
          fixed: 'right',
          width: 80,
          render: (text, record) => {
            const listCategory = record.category.split('^')
            const isContainSpecial = listSpecialMatch.some(e => listCategory.includes(e))
            return (
              <>
                {sportSpecial.includes(record.sport_id) &&
                  record.is_etpen !== 'Y' &&
                  !record.category.includes('Special') &&
                  !isContainSpecial && (
                    <Button
                      className="p-0"
                      type="link"
                      onClick={() => {
                        setVisibleAddSpecial(true)
                        setAddSpecialValue({
                          sport_id: record.sport_id,
                          match_id: record.match_id,
                          league_name: record.league_name,
                          home_name: record.home_name,
                          away_name: record.away_name,
                        })
                      }}
                    >
                      Add Special
                    </Button>
                  )}
                {record.is_match_has_gt_special === 'Y' && (
                  <Button
                    className="p-0"
                    type="link"
                    onClick={() => {
                      setVisibleDetail(true)
                      setDetailValue({ match_id: record.match_id })
                    }}
                  >
                    Detail
                  </Button>
                )}
              </>
            )
          },
        },
      ],
      [canDelete, Delete, reload],
    )

    return (
      <>
        <div className="card">
          <div className="card-header">
            <FilterMatchList
              reload={reload}
              reloadLeague={reloadLeague}
              defaultDateTime={defaultDateTime}
              form={form}
              formProps={formProps}
            />
          </div>
          <div className="card-body">
            <Table
              rowKey="match_id"
              columns={columns}
              loading={loading}
              dataSource={dataTable}
              pagination={paginationProps}
            />
          </div>
          <div className="card-footer">
            <b>
              Note:
              <br />
              1. If filter by MatchID, other filters will ignored
              <br />
              2. <span style={{ backgroundColor: 'PeachPuff' }}>Peach color</span> means Unconfirmed
              Match
            </b>
          </div>
        </div>
        <Drawer
          title="Edit Match"
          width={800}
          open={visibleEdit}
          onClose={() => setVisibleEdit(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleEdit(false)}>Cancel</Button>
              <Button
                form="edit-match-form"
                type="primary"
                htmlType="submit"
                ref={btnSubmitEditRef}
                disabled={!canEdit}
              >
                Submit
              </Button>
            </Space>
          }
        >
          <Edit
            editValue={editValue}
            successCallback={React.useCallback(() => {
              setVisibleEdit(false)
              reload()
            }, [reload])}
            btnSubmitEditRef={btnSubmitEditRef}
          />
        </Drawer>
        <Drawer
          title="Detail Special Match"
          width={900}
          open={visibleDetail}
          onClose={() => setVisibleDetail(false)}
          destroyOnClose
        >
          <Detail
            detailValue={detailValue}
            successCallback={React.useCallback(() => {
              setVisibleDetail(false)
              reload()
            }, [reload])}
          />
        </Drawer>
        <Drawer
          title="List Sub Match"
          width="80%"
          open={visibleListSubMenu}
          onClose={() => setVisibleListSubMenu(false)}
          destroyOnClose
        >
          <List
            listSubMenuValue={listSubMenuValue}
            successCallback={React.useCallback(() => {
              setVisibleListSubMenu(false)
              reload()
            }, [reload])}
          />
        </Drawer>
        <Drawer
          title="Match Information"
          width={800}
          open={visibleInfo}
          onClose={() => setVisibleInfo(false)}
          destroyOnClose
          footer={
            <Space>
              <Button onClick={() => setVisibleInfo(false)}>Cancel</Button>
              <Button form="info-form" type="primary" htmlType="submit">
                Submit
              </Button>
            </Space>
          }
        >
          <Info
            infoValue={infoValue}
            successCallback={React.useCallback(() => {
              setVisibleInfo(false)
              reload()
            }, [reload])}
          />
        </Drawer>
        <Drawer
          title="Add Special Match"
          width="80%"
          open={visibleAddSpecial}
          onClose={() => setVisibleAddSpecial(false)}
          destroyOnClose
        >
          <AddSpecial
            addSpecialValue={addSpecialValue}
            successCallback={React.useCallback(() => {
              setVisibleAddSpecial(false)
              reload()
            }, [reload])}
          />
        </Drawer>
      </>
    )
  },
)

const FilterMatchList = ({ reload, reloadLeague, defaultDateTime, form, formProps }) => {
  const { sportOptions, leagueInMatchListOptions: leagueOptions } = useSelectOptions()
  return (
    <div className="d-flex flex-row-reverse" style={{ gap: 8 }}>
      <Tooltip placement="top" title="Refresh list">
        <Button icon={<ReloadOutlined />} onClick={reload} />
      </Tooltip>
      <Form
        form={form}
        className="w-100"
        initialValues={{
          dateRange: [defaultDateTime, defaultDateTime],
          sport_id: 10,
          league_id: '',
          auto_odds: '',
          category: '',
          match_open_status: '',
          match_live_status: '',
          match_has_live_status: '',
          match_has_parlay_status: '',
        }}
        {...formProps}
        onValuesChange={(changedValues, allValues) => {
          formProps.onValuesChange(changedValues, allValues)

          const key = Object.keys(changedValues)[0]
          if (!['order_by', 'league_id', 'match_id'].includes(key)) reloadLeague()
        }}
        onKeyPress={e => {
          formProps.onKeyPress(e)

          if (e.key === 'Enter') reloadLeague()
        }}
      >
        <Row gutter={[8, 8]}>
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
            <Form.Item name="dateRange" className="mb-0">
              <DatePicker.RangePicker className="w-100" allowClear={false} format="YYYY-MM-DD" />
            </Form.Item>
            <Form.Item name="sport_id" className="mb-0">
              <Select
                placeholder="Select Sport"
                showSearch
                options={sportOptions}
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item name="league_id" className="mb-0">
              <Select
                placeholder="Select League"
                showSearch
                options={leagueOptions}
                optionFilterProp="label"
              />
            </Form.Item>
            <Form.Item
              name="match_id"
              className="mb-0"
              extra="*If filter by MatchID, other filters will ignored"
              rules={[{ validator: validatorNumeric }]}
            >
              <Input placeholder="Match ID" />
            </Form.Item>
            <Form.Item name="order_by" className="mb-0" valuePropName="checked">
              <Switch checkedChildren="Sort Normal" unCheckedChildren="Sort by Time" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
            <Form.Item name="auto_odds" className="mb-0">
              <Select
                placeholder="Leech"
                options={[
                  { value: '', label: 'All Leech' },
                  { value: '0', label: 'Manual' },
                  { value: '1', label: 'SBO' },
                  { value: '2', label: 'IBC' },
                ]}
              />
            </Form.Item>
            <Form.Item name="category" className="mb-0">
              <Select options={matchCategoryOptions} />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={8} xl={8} xxl={6}>
            <Form.Item name="match_open_status" className="mb-0">
              <Select
                options={[
                  { value: '', label: 'All Match Status' },
                  { value: 'Y', label: 'Open' },
                  { value: 'N', label: 'Close' },
                ]}
              />
            </Form.Item>
            <Form.Item name="match_live_status" className="mb-0">
              <Select
                options={[
                  { value: '', label: 'All Live Status' },
                  { value: 'Y', label: 'Live' },
                  { value: 'N', label: 'No' },
                ]}
              />
            </Form.Item>
            <Form.Item name="match_has_live_status" className="mb-0">
              <Select
                options={[
                  { value: '', label: 'All Has Live Status' },
                  { value: 'Y', label: 'Has Live' },
                  { value: 'N', label: 'No' },
                ]}
              />
            </Form.Item>
            <Form.Item name="match_has_parlay_status" className="mb-0">
              <Select
                options={[
                  { value: '', label: 'All Has Parlay Status' },
                  { value: 'Y', label: 'Has Parlay' },
                  { value: 'N', label: 'No' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(MatchList)
