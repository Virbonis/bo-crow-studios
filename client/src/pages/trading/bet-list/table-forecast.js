import React from 'react'
import { Button, Divider, message, Modal, Table } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { Amount } from 'components/blaise'
import FormForecast from './form-forecast'

const columns = [
  {
    title: 'Home',
    dataIndex: 'score_home',
    width: 60,
  },
  {
    title: 'Away',
    dataIndex: 'score_away',
    width: 60,
  },
  {
    title: 'Amount',
    dataIndex: 'amount',
    width: 80,
    render: text => <Amount value={text} int />,
  },
]
const TableForecast = ({ editValue, listGameType, GetForecast }) => {
  const [listForecast, setListForecast] = React.useState([])
  React.useEffect(() => {
    setListForecast([])
  }, [editValue])

  const [visible, setVisible] = React.useState(false)
  const showForm = () => setVisible(true)
  const hideForm = () => setVisible(false)

  const onClickAdd = showForm
  const onClickDelete = () => {
    setListForecast(old => old.filter(x => x.id !== selectedRow))
    setSelectedRow(null)
  }

  const onSubmit = values => {
    const { score_home, score_away } = values
    // validation
    const isExist = listForecast.find(
      x => x.score_home === score_home && x.score_away === score_away,
    )
    if (isExist) {
      message.error('Score already exists')
      return
    }

    const params = {
      match_id: editValue.match_id,
      list_game_type: listGameType,
      score: `${score_home}-${score_away}`,
    }

    const successCallback = responseData => {
      setListForecast(old => [
        ...old,
        { id: uuidv4(), score_home, score_away, amount: responseData },
      ])
      hideForm()
    }
    GetForecast(params, successCallback)
  }
  const onCancel = hideForm

  const [selectedRow, setSelectedRow] = React.useState(null)

  return (
    <>
      <Divider orientation="left" className="m-0">
        Forecast
      </Divider>
      <Table
        id="table-bet-forecast"
        size="small"
        columns={columns}
        dataSource={listForecast}
        rowKey="id"
        pagination={false}
        tableLayout="auto"
        scroll={{
          y: true, // style height/min-height in css .table-bet-listing
        }}
        rowSelection={{
          type: 'radio',
          onChange: selectedRowKeys => {
            setSelectedRow(selectedRowKeys[0])
          },
          selectedRowKeys: [selectedRow],
        }}
        onRow={record => ({
          onClick: () => setSelectedRow(record.id),
        })}
      />
      <Button onClick={onClickAdd}>Add</Button>
      <Button onClick={onClickDelete} disabled={!selectedRow}>
        Delete
      </Button>
      <Modal
        title="Enter Score"
        open={visible}
        onCancel={onCancel}
        width={200}
        okButtonProps={{ htmlType: 'submit', form: 'form-forecast' }}
        focusTriggerAfterClose={false}
        autoFocusButton={null}
        destroyOnClose
      >
        <FormForecast onSubmit={onSubmit} />
      </Modal>
    </>
  )
}

export default TableForecast
