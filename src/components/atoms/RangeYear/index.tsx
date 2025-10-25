import { DatePicker } from 'antd'
import dayjs from 'dayjs'
import React, { useState } from 'react'
import 'dayjs/locale/vi'

interface YearSelectorProps {
  onChange?: (from: Date, to: Date, year: number) => void
  defaultYear?: number
}

const YearSelector: React.FC<YearSelectorProps> = ({
  onChange,
  defaultYear = new Date().getFullYear(),
}) => {
  const [year, setYear] = useState(defaultYear)

  const handleYearChange = (date: dayjs.Dayjs | null) => {
    if (!date) return
    const y = date.year()
    setYear(y)

    const fromDate = dayjs().year(y).startOf('year').toDate()
    const toDate = dayjs().year(y).endOf('year').toDate()

    if (onChange) {
      onChange(fromDate, toDate, y)
    }
  }

  return (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center', padding:5, borderRadius: 5 }}>
    
      <DatePicker
        picker="year"
        value={dayjs().year(year)}
        onChange={handleYearChange}
        format="YYYY"
      />
      
    </div>
  )
}

export default YearSelector
