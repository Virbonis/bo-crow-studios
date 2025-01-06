import React from 'react'
import { connect } from 'react-redux'
import { Button, Checkbox, Form, Select, Space } from 'antd'
import { ReloadOutlined } from '@ant-design/icons'
import actions from 'redux/mo-scoring-detail/actions'
import { QueryMOScoreDetail } from './query'
import TableBadminton from './table-badminton'
import TableBasket from './table-basket'
import TableTennis from './table-tennis'
import TableHockey from './table-hockey'
import TableBaseball from './table-baseball'
import TableBaseball2 from './table-baseball2'
import TableVolley from './table-volley'

const mapStateToProps = ({ moScoringDetail }) => ({
  viewParameter: moScoringDetail.viewParameter,
})
const mapDispatchToProps = dispatch => ({
  setViewParameter: payload => {
    dispatch({
      type: actions.SET_VIEW_PARAMETER,
      payload,
    })
  },
  UpdateScoreDetail: (payload, successCallback) => {
    dispatch({
      type: actions.UPDATE_SCORE_DETAIL,
      payload,
      successCallback,
    })
  },
})

const Content = ({ editValue, viewParameter, setViewParameter, UpdateScoreDetail }) => {
  const { data, isFetching, refetch } = QueryMOScoreDetail({
    match_id: editValue.match_id,
    ...viewParameter,
  })
  return (
    <>
      <Form
        size="small"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        initialValues={viewParameter}
        onValuesChange={values => {
          setViewParameter({ ...values })
        }}
        layout="inline"
      >
        <Space wrap>
          <Button size="small" loading={isFetching} icon={<ReloadOutlined />} onClick={refetch}>
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
      <br />
      {data && (
        <>
          <CheckboxMember
            editValue={editValue}
            data={data}
            UpdateScoreDetail={UpdateScoreDetail}
            refetch={refetch}
          />
          <TableMOScoring
            editValue={editValue}
            data={data}
            UpdateScoreDetail={UpdateScoreDetail}
            refetch={refetch}
          />
        </>
      )}
    </>
  )
}

const CheckboxMember = React.memo(({ editValue, data, UpdateScoreDetail, refetch }) => {
  const { match_id, sport_id } = editValue
  const { st_livescore } = data
  const isShowMember = React.useMemo(
    () =>
      sport_id === 12 ||
      sport_id === 58 ||
      sport_id === 34 ||
      sport_id === 53 ||
      sport_id === 32 ||
      sport_id === 11 ||
      sport_id === 26 ||
      sport_id === 18 ||
      sport_id === 16,
    [sport_id],
  )
  if (!isShowMember) return null

  const onClickChangeSet = e => {
    UpdateScoreDetail(
      {
        match_id,
        sport_id,
        set: 0,
        point: e.target.checked ? 'Y' : 'N',
        group: 'STLiveScore',
        home_away: '',
      },
      refetch,
    )
  }

  return (
    <Checkbox checked={st_livescore === 'Y'} onChange={onClickChangeSet}>
      Show at Membersite
    </Checkbox>
  )
})
const TableMOScoring = React.memo(({ editValue, data, UpdateScoreDetail, refetch }) => {
  const { sport_id } = editValue
  if (sport_id === 32)
    return (
      <TableBadminton
        editValue={editValue}
        data={data}
        UpdateScoreDetail={UpdateScoreDetail}
        refetch={refetch}
      />
    )
  // Basketball,E-Basketball,Football,Netball
  if (sport_id === 12 || sport_id === 58 || sport_id === 34 || sport_id === 53)
    return (
      <TableBasket
        editValue={editValue}
        data={data}
        UpdateScoreDetail={UpdateScoreDetail}
        refetch={refetch}
      />
    )
  if (sport_id === 11)
    return (
      <TableTennis
        editValue={editValue}
        data={data}
        UpdateScoreDetail={UpdateScoreDetail}
        refetch={refetch}
      />
    )
  if (sport_id === 26)
    return (
      <TableHockey
        editValue={editValue}
        data={data}
        UpdateScoreDetail={UpdateScoreDetail}
        refetch={refetch}
      />
    )
  if (sport_id === 18)
    return (
      <>
        <TableBaseball
          editValue={editValue}
          data={data}
          UpdateScoreDetail={UpdateScoreDetail}
          refetch={refetch}
        />
        <br />
        <TableBaseball2
          editValue={editValue}
          data={data}
          UpdateScoreDetail={UpdateScoreDetail}
          refetch={refetch}
        />
      </>
    )
  if (sport_id === 16)
    return (
      <TableVolley
        editValue={editValue}
        data={data}
        UpdateScoreDetail={UpdateScoreDetail}
        refetch={refetch}
      />
    )
  return null
})

export default connect(mapStateToProps, mapDispatchToProps)(Content)
