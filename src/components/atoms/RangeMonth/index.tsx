import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import 'dayjs/locale/vi'

interface MonthSelectorProps {
  onChange?: (from: Date, to: Date, month: number, year: number) => void
  defaultMonth?: number // 0-11
  defaultYear?: number
}

const MonthSelector: React.FC<MonthSelectorProps> = ({
  onChange,
  defaultMonth = new Date().getMonth(),
  defaultYear = new Date().getFullYear(),
}) => {
  const [month, setMonth] = useState(defaultMonth)
  const [year, setYear] = useState(defaultYear)

  const handleMonthChange = (date: dayjs.Dayjs | null) => {
    if (!date) return
    const m = date.month()
    const y = date.year()
    setMonth(m)
    setYear(y)

    const fromDate = dayjs().year(y).month(m).startOf('month').toDate()
    const toDate = dayjs().year(y).month(m).endOf('month').toDate()

    if (onChange) {
      onChange(fromDate, toDate, m + 1, y)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '8px', alignItems: 'center',border: "1px solid #d9d9d9", padding:5, borderRadius: 5 }}>
  
      <DatePicker
        picker="month"
        value={dayjs().year(year).month(month)}
        onChange={handleMonthChange}
        format="MM-YYYY"
      />
    </div>
  )
}

export default MonthSelector
