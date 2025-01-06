import React from 'react'
import { Button, Space, Select, Radio, Divider, Checkbox, Form } from 'antd'
import DrawerSelectLeague from 'pages/trading/drawer-select-league'
import DrawerSelectMatch from 'pages/trading/drawer-select-match'

const DropdownSelectView = React.memo(
  ({ viewParameter, setViewParameter, refetchNewData, page }) => {
    const { popup_id, match_time_slot } = viewParameter
    const [visibleDrawer, setVisibleDrawer] = React.useState()
    const closeDrawer = React.useCallback(() => setVisibleDrawer(null), [])

    const [form] = Form.useForm()
    React.useEffect(() => {
      form.resetFields()
    }, [form, viewParameter])

    return (
      <>
        <Select
          size="small"
          style={{ width: 175 }}
          placeholder="View"
          dropdownRender={() => (
            <Form
              form={form}
              layout="inline"
              initialValues={viewParameter}
              onValuesChange={changedValues => setViewParameter(changedValues)}
            >
              <Space className="p-1 w-100" direction="vertical">
                <Form.Item name="ftht" noStyle>
                  <Select
                    className="w-100"
                    size="small"
                    options={[
                      { value: 'FTHT', label: 'FT/HT' },
                      { value: 'FT', label: 'FT' },
                      { value: 'HT', label: 'HT' },
                    ]}
                  />
                </Form.Item>
                <Form.Item name="show_hide" noStyle>
                  <Radio.Group className="w-100" size="small">
                    <Radio value={1}>Show All</Radio>
                    <Radio value={2}>Hide</Radio>
                  </Radio.Group>
                </Form.Item>
                <Divider style={{ margin: '4px 0' }} />
                {page !== 'MOQuick' && (
                  <>
                    <Form.Item name="match_time_slot" noStyle>
                      <Select
                        className="w-100"
                        size="small"
                        options={[
                          { value: 'Live', label: 'Live' },
                          { value: 'Today', label: 'Today' },
                          { value: 'Early', label: 'Early' },
                        ]}
                      />
                    </Form.Item>
                    <Button
                      className="w-100"
                      type="text"
                      size="small"
                      onClick={() => setVisibleDrawer(`league Y`)}
                    >
                      Select League OS
                    </Button>
                    <Button
                      className="w-100"
                      type="text"
                      size="small"
                      onClick={() => setVisibleDrawer(`league N`)}
                    >
                      Select League
                    </Button>
                    <Button
                      className="w-100"
                      type="text"
                      size="small"
                      onClick={() => setVisibleDrawer(`match`)}
                    >
                      Select Match
                    </Button>
                    <Divider style={{ margin: '4px 0' }} />
                  </>
                )}
                <Form.Item name="move_3_market" noStyle valuePropName="checked">
                  <Checkbox>Move 3 Markets</Checkbox>
                </Form.Item>
              </Space>
            </Form>
          )}
        />
        {page !== 'MOQuick' && (
          <>
            <DrawerSelectLeague
              os={visibleDrawer?.split(' ')[1]}
              open={visibleDrawer?.split(' ')[0] === 'league'}
              closeDrawer={closeDrawer}
              group={`MO-${match_time_slot}`}
              popup_id={popup_id}
              callbackSubmit={refetchNewData}
            />
            <DrawerSelectMatch
              open={visibleDrawer === 'match'}
              closeDrawer={closeDrawer}
              group={`MO-${match_time_slot}`}
              popup_id={popup_id}
              callbackSubmit={refetchNewData}
            />
          </>
        )}
      </>
    )
  },
)

export default DropdownSelectView
