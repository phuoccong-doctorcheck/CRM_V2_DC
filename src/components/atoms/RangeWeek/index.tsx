// eslint-disable-next-line import/order
import React from 'react'
import { Select, DatePicker } from 'antd'
import dayjs from 'dayjs'
import 'dayjs/locale/vi'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
import isoWeek from 'dayjs/plugin/isoWeek'
import weekday from 'dayjs/plugin/weekday'

dayjs.extend(weekday)
dayjs.extend(isoWeek)
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)

const { Option } = Select

interface WeekSelectorProps {
  onChange?: (from: Date, to: Date, weekNumber: number) => void
  defaultWeek?: number
  defaultMonth?: number
  defaultYear?: number
}

const WeekSelector: React.FC<WeekSelectorProps> = ({
  onChange,
  defaultWeek = 1,
  defaultMonth = new Date().getMonth(),
  defaultYear = new Date().getFullYear(),
}) => {
  const [month, setMonth] = React.useState(defaultMonth)
  const [year, setYear] = React.useState(defaultYear)
  const [weekOptions, setWeekOptions] = React.useState<{ label: string; value: number; from: dayjs.Dayjs; to: dayjs.Dayjs }[]>([])
  const [selectedWeekIndex, setSelectedWeekIndex] = React.useState(0)

  const generateWeeksInMonth = (m: number, y: number) => {
    const startOfMonth = dayjs().year(y).month(m).startOf('month')
    const endOfMonth = dayjs().year(y).month(m).endOf('month')

    const weeks: { label: string; value: number; from: dayjs.Dayjs; to: dayjs.Dayjs }[] = []

    let current = startOfMonth.startOf('week') // Chủ nhật đầu tiên của tuần chứa ngày 1
    let index = 1

    while (current.isBefore(endOfMonth.endOf('week'))) {
      const from = current
      const to = current.endOf('week')

      // Kiểm tra nếu tuần này có ít nhất 1 ngày trong tháng
      if (to.isSameOrAfter(startOfMonth) && from.isSameOrBefore(endOfMonth)) {
        const displayFrom = from.isBefore(startOfMonth) ? startOfMonth : from
        const displayTo = to.isAfter(endOfMonth) ? endOfMonth : to
        weeks.push({
          label: `Tuần ${index}: ${displayFrom.format('DD/MM')} - ${displayTo.format('DD/MM')}`,
          value: index,
          from: displayFrom,
          to: displayTo,
        })
      }

      current = current.add(1, 'week')
      index += 1
    }

    setWeekOptions(weeks)
    setSelectedWeekIndex(0)

    if (weeks.length > 0 && onChange) {
      onChange(weeks[0].from.toDate(), weeks[0].to.toDate(), weeks[0].value)
    }
  }

  React.useEffect(() => {
    generateWeeksInMonth(month, year)
  }, [month, year])

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (!date) return
    const newMonth = date.month()
    const newYear = date.year()
    setMonth(newMonth)
    setYear(newYear)
  }

  const handleWeekChange = (weekIndex: number) => {
    setSelectedWeekIndex(weekIndex)
    const selected = weekOptions.find(w => w.value === weekIndex)
    if (selected && onChange) {
      onChange(selected.from.toDate(), selected.to.toDate(), selected.value)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', border: '1px solid #d9d9d9', padding: 5, borderRadius: 5 }}>
   
      <Select
        style={{ width: 220 }}
        value={weekOptions[selectedWeekIndex]?.value}
        onChange={handleWeekChange}
      >
        {weekOptions.map((w, idx) => (
          <Option key={w.value} value={w.value}>
            {w.label}
          </Option>
        ))}
      </Select>
      <DatePicker
        picker="month"
        value={dayjs().year(year).month(month)}
        onChange={handleMonthChange}
        format="MM-YYYY"
      />
    </div>
  )
}

export default WeekSelector
