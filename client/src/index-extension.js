import { DatePicker, Table, Select, Popconfirm } from 'antd'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import weekday from 'dayjs/plugin/weekday'
import localeData from 'dayjs/plugin/localeData'
// import { MemoizedCell, MemoizedRow } from 'components/blaise'

Object.assign(dayjs.prototype, {
  toJSON() { return this?.format() } // prettier-ignore
})
dayjs.extend(utc)
dayjs.extend(weekday)
dayjs.extend(localeData)

function containsTimezone(dateString) {
  const timezoneRegex = /Z|([+-][0-9]{2}:[0-9]{2})/
  return timezoneRegex.test(dateString)
}

Object.assign(String.prototype, {
  formatDateTimeSecondMillisecond() {
    return containsTimezone(this) ? dayjs.utc(this).format('YYYY-MM-DD HH:mm:ss.SSS') : dayjs(this).format('YYYY-MM-DD HH:mm:ss.SSS') // prettier-ignore
  },
  formatDateTimeSecond() {
    return containsTimezone(this) ? dayjs.utc(this).format('YYYY-MM-DD HH:mm:ss') : dayjs(this).format('YYYY-MM-DD HH:mm:ss') // prettier-ignore
  },
  formatDateTime() {
    return containsTimezone(this) ? dayjs.utc(this).format('YYYY-MM-DD HH:mm') : dayjs(this).format('YYYY-MM-DD HH:mm') // prettier-ignore
  },
  formatDate() {
    return containsTimezone(this) ? dayjs.utc(this).format('YYYY-MM-DD') : dayjs(this).format('YYYY-MM-DD') // prettier-ignore
  },
  formatTimeSecond() {
    return containsTimezone(this) ? dayjs.utc(this).format('HH:mm:ss') : dayjs(this).format('HH:mm:ss') // prettier-ignore
  },
  formatTime() {
    return containsTimezone(this) ? dayjs.utc(this).format('HH:mm') : dayjs(this).format('HH:mm') // prettier-ignore
  },
})
DatePicker.RangePicker.defaultProps = {
  presets: [
    { label: 'Today', value: [dayjs.utc().startOf('day'), dayjs.utc().endOf('day')] },
    { label: 'This Week', value: [dayjs.utc().startOf('week'), dayjs.utc().endOf('week')] }, // prettier-ignore
    { label: 'This Month', value: [dayjs.utc().startOf('month'), dayjs.utc().endOf('month')] }, // prettier-ignore
    { label: 'This Year', value: [dayjs.utc().startOf('year'), dayjs.utc().endOf('year')] }, // prettier-ignore
  ],
}
Select.defaultProps = {
  optionFilterProp: 'label',
}
Popconfirm.defaultProps = {
  okButtonProps: {
    className: 'button-ok',
  },
  afterOpenChange: () => {
    window.document
      .getElementsByClassName('button-ok')
      .item(0)
      .focus()
  },
  destroyTooltipOnHide: true,
}
Table.defaultProps = {
  bordered: true,
  scroll: { y: true },
  // components: {
  //   body: {
  //     row: MemoizedRow,
  //     cell: MemoizedCell,
  //   },
  // },
}
