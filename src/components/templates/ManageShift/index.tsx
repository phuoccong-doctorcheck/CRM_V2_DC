

import Dropdown from "components/atoms/Dropdown"
import CModal from "components/organisms/CModal"
import { useState } from "react"
import { useMutation } from "react-query"
import { toast } from "react-toastify"
import { postAssignShiftAPI, postCreateShiftAPI } from "services/api/shift"

interface Employee {
  id: string
  name: string
  position: string
}

interface Shift {
  id: string
  name: string
  startTime: string
  endTime: string
  date: string
  assignedEmployees: Employee[]
  maxEmployees: number
}

interface ShiftAssignment {
  u_id: string
  weekday: number
  shift_type_id: number
}

const mockEmployees: Employee[] = [
  { id: "1", name: "Nguyễn Văn A", position: "Nhân viên" },
  { id: "2", name: "Trần Thị B", position: "Trưởng ca" },
  { id: "3", name: "Lê Văn C", position: "Nhân viên" },
  { id: "4", name: "Phạm Thị D", position: "Nhân viên" },
  { id: "5", name: "Hoàng Văn E", position: "Trưởng ca" },
]
const daysOfWeek = [
  { key: 1, label: "Thứ 2" },
  { key: 2, label: "Thứ 3" },
  { key: 3, label: "Thứ 4" },
  { key: 4, label: "Thứ 5" },
  { key: 5, label: "Thứ 6" },
  { key: 6, label: "Thứ 7" },
  { key: 7, label: "Chủ Nhật" },
]

const shifts1 = [
  { key: 1, label: "Ca 1", time: "06:00 - 14:00" },
  { key: 2, label: "Ca 2", time: "14:00 - 22:00" },
  { key: 3, label: "Ca 3", time: "22:00 - 06:00" },
]
const mockShifts: Shift[] = [
  {
    id: "1",
    name: "Ca sáng",
    startTime: "08:00",
    endTime: "16:00",
    date: "2024-01-15",
    assignedEmployees: [mockEmployees[0], mockEmployees[1]],
    maxEmployees: 4,
  },
  {
    id: "2",
    name: "Ca chiều",
    startTime: "16:00",
    endTime: "00:00",
    date: "2024-01-15",
    assignedEmployees: [mockEmployees[2]],
    maxEmployees: 3,
  },
  {
    id: "3",
    name: "Ca đêm",
    startTime: "00:00",
    endTime: "08:00",
    date: "2024-01-16",
    assignedEmployees: [mockEmployees[3], mockEmployees[4]],
    maxEmployees: 2,
  },
]

export default function ShiftManagement() {
  const [shifts, setShifts] = useState<Shift[]>(mockShifts)
  const [employees] = useState<Employee[]>(mockEmployees)
  const [selectedEmployee, setSelectedEmployee] = useState<string>("")
  const [startDate, setStartDate] = useState<string>("2024-01-15")
  const [endDate, setEndDate] = useState<string>("2024-01-21")
  const [viewMode, setViewMode] = useState<"individual" | "overall">("overall")
  const [selectedShifts, setSelectedShifts] = useState<string[]>([])
  const [selectedEmployeesForAssign, setSelectedEmployeesForAssign] = useState<string[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newShift, setNewShift] = useState({
    name: "",
    shiftCode: "",
    startTime: "",
    endTime: "",
    date: "",
    maxEmployees: 1,
  })
  const [isLoadingAssignments, setIsLoadingAssignments] = useState(false)
  const storeListUser = localStorage.getItem("list_users");
   // eslint-disable-next-line @typescript-eslint/no-unused-vars
   const [listUsers, setListUsers] = useState<any[]>(
      storeListUser ? JSON.parse(storeListUser) : ""
    );
  const getWeekDates = (start: string, end: string) => {
    const dates = []
    const startDate = new Date(start)
    const endDate = new Date(end)

    for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
      dates.push(new Date(d).toISOString().split("T")[0])
    }
    return dates
  }

  const getShiftsForDate = (date: string) => {
    return shifts.filter((shift) => shift.date === date)
  }

  const getEmployeeShifts = (employeeId: string) => {
    const weekDates = getWeekDates(startDate, endDate)
    return weekDates.map((date) => ({
      date,
      shifts: shifts.filter(
        (shift) => shift.date === date && shift.assignedEmployees.some((emp) => emp.id === employeeId),
      ),
    }))
  }

  const handleShiftSelection = (shiftId: string) => {
    setSelectedShifts((prev) => (prev.includes(shiftId) ? prev.filter((id) => id !== shiftId) : [...prev, shiftId]))
  }

  const handleEmployeeSelection = (employeeId: string) => {
    setSelectedEmployeesForAssign((prev) =>
      prev.includes(employeeId) ? prev.filter((id) => id !== employeeId) : [...prev, employeeId],
    )
  }

  const assignEmployeesToShifts = () => {
    if (selectedShifts.length === 0 || selectedEmployeesForAssign.length === 0) {
      alert("Vui lòng chọn ca trực và nhân viên")
      return
    }

    setShifts((prev) =>
      prev.map((shift) => {
        if (selectedShifts.includes(shift.id)) {
          const newEmployees = selectedEmployeesForAssign
            .map((empId) => employees.find((emp) => emp.id === empId))
            .filter((emp) => emp && !shift.assignedEmployees.some((assigned) => assigned.id === emp.id))
            .filter(Boolean) as Employee[]

          if (shift.assignedEmployees.length + newEmployees.length <= shift.maxEmployees) {
            return {
              ...shift,
              assignedEmployees: [...shift.assignedEmployees, ...newEmployees],
            }
          }
        }
        return shift
      }),
    )

    setSelectedShifts([])
    setSelectedEmployeesForAssign([])
    alert("Đã gán nhân viên vào ca trực thành công!")
  }

  const removeEmployeesFromShifts = () => {
    if (selectedShifts.length === 0 || selectedEmployeesForAssign.length === 0) {
      alert("Vui lòng chọn ca trực và nhân viên cần gỡ bỏ")
      return
    }

    setShifts((prev) =>
      prev.map((shift) => {
        if (selectedShifts.includes(shift.id)) {
          return {
            ...shift,
            assignedEmployees: shift.assignedEmployees.filter((emp) => !selectedEmployeesForAssign.includes(emp.id)),
          }
        }
        return shift
      }),
    )

    setSelectedShifts([])
    setSelectedEmployeesForAssign([])
    alert("Đã gỡ bỏ nhân viên khỏi ca trực thành công!")
  }
   const { mutate: postCreateShift } = useMutation(
        "post-footer-form",
        (data: any) => postCreateShiftAPI(data),
        {
          onSuccess: (data) => {
            setNewShift({ name: "", shiftCode:"",startTime: "", endTime: "", date: "", maxEmployees: 1 })
            setShowCreateForm(false)
          },
          onError: (e) => {
            console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
          },
        }
  );
  const { mutate: postAssignShift } = useMutation(
    "post-footer-form",
    (data: any) => postAssignShiftAPI(data),
    {
      onSuccess: (data) => {
        setIsLoadingAssignments(false)
        toast.success("Cập nhật ca trực thành công!");
      },
      onError: (e) => {
        console.error(" 🚀- DaiNQ - 🚀: -> e:", e);
      },
    }
  );
  const createNewShift = () => {
    // if (!newShift.name || !newShift.startTime || !newShift.endTime || !newShift.date) {
    //   alert("Vui lòng điền đầy đủ thông tin ca trực")
    //   return
    // }

    const shift: Shift = {
      id: Date.now().toString(),
      name: newShift.name,
      startTime: newShift.startTime,
      endTime: newShift.endTime,
      date: newShift.date,
      assignedEmployees: [],
      maxEmployees: newShift.maxEmployees,
    }
    const body = {
      shift_name: newShift.name,
      shift_code: newShift.shiftCode,
      time_from: `${newShift.startTime}:00`,
      time_to:`${newShift.endTime}:00`,
    }
   
    setShifts((prev) => [...prev, shift])
  
    postCreateShift(body)
    alert("Tạo ca trực mới thành công!")
  }

  const weekDates = getWeekDates(startDate, endDate)
  //
 
  const [assignments, setAssignments] = useState<ShiftAssignment[]>([
    
  ])

  

  const isAssigned = (employeeId: string, day: number, shift: number): boolean => {
    return assignments.some(
      (assignment) => assignment.u_id === employeeId && assignment.weekday === day && assignment.shift_type_id === shift,
    )
  }

  const toggleAssignment = (day: number, shift: number) => {
    if (!selectedEmployee) {
      alert("Vui lòng chọn nhân viên trước!")
      return
    }

    const existingIndex = assignments.findIndex(
      (assignment) =>
        assignment.u_id === selectedEmployee && assignment.weekday === day && assignment.shift_type_id === shift,
    )

    if (existingIndex >= 0) {
      // Gỡ bỏ ca trực
      setAssignments((prev) => prev.filter((_, index) => index !== existingIndex))
    } else {
      // Thêm ca trực
      setAssignments((prev) => [
        ...prev,
        {
          u_id: selectedEmployee,
          weekday: day,
          shift_type_id: shift,
        },
      ])
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const getAssignmentCount = (employeeId: string) => {
    return assignments.filter((assignment) => assignment.u_id === employeeId).length
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const clearAllAssignments = () => {
    if (!selectedEmployee) {
      alert("Vui lòng chọn nhân viên!")
      return
    }

  
  }

  return (
    <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        maxHeight: "85vh",
        overflowY: "scroll",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          color: "#333",
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: "20px",

        }}
      >
        Quản Lý Lịch Trực
      </h2>
      <div
      style={{
        padding: "20px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f8f9fa",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
        }}
      >
       

        {/* Employee Selection */}
        <div
          style={{
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            marginBottom: "20px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              display: "flex",
              alignItems: "end",
              justifyContent: "space-between",
            
          }}
        >
            <div style={{  display: "flex",
              alignItems: "end",}}>
            <div style={{width: "200px", marginRight: "20px"}}>
            <Dropdown
                                    dropdownOption={listUsers || []}
                                    // defaultValue={valUpdate?.origin as DropdownData}
                                    label="Nhân viên"
                                    placeholder="Chọn 1 nhân viên"
                                     handleSelect={(item) => {
                                      setSelectedEmployee(item.value)
                                     }}
                                    variant="simple"
                                    // values={dataForm.serviceAllowTypeBooking1}
                                   
                                    isRequired
            />
                                </div>
             <button
              onClick={() => {
                setIsLoadingAssignments(true)
                postAssignShift(assignments)
              }}
              disabled={isLoadingAssignments}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
                fontSize: "14px",
              maxHeight: "40px",
            }}
          >
            Cập nhật
          </button>
            </div>
            <button
                onClick={() => setShowCreateForm(true)}
             
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
                fontSize: "14px",
              maxHeight: "40px",
            }}
          >
             Tạo ca trực mới
          </button>
        </div>

        {/* Schedule Grid */}
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                minWidth: "800px",
              }}
            >
              <thead>
                <tr>
                  <th
                    style={{
                      padding: "15px 10px",
                      backgroundColor: "#f8f9fa",
                      border: "1px solid #dee2e6",
                      fontWeight: "bold",
                      color: "#495057",
                      textAlign: "center",
                      minWidth: "120px",
                    }}
                  >
                    Ca Trực
                  </th>
                  {daysOfWeek.map((day) => (
                    <th
                      key={day.key}
                      style={{
                        padding: "15px 10px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        fontWeight: "bold",
                        color: "#495057",
                        textAlign: "center",
                        minWidth: "100px",
                      }}
                    >
                      {day.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shifts1.map((shift) => (
                  <tr key={shift.key}>
                    <td
                      style={{
                        padding: "12px 10px",
                        border: "1px solid #dee2e6",
                        backgroundColor: "#f8f9fa",
                        fontWeight: "bold",
                        color: "#495057",
                      }}
                    >
                      <div>{shift.label}</div>
                      <div
                        style={{
                          fontSize: "12px",
                          color: "#6c757d",
                          marginTop: "4px",
                        }}
                      >
                        {shift.time}
                      </div>
                    </td>
                    {daysOfWeek.map((day) => {
                      const isCurrentlyAssigned = selectedEmployee
                        ? isAssigned(selectedEmployee, day.key, shift.key)
                        : false
                      const hasOtherAssignment = assignments.some(
                        (assignment) =>
                          assignment.u_id !== selectedEmployee &&
                          assignment.weekday === day.key &&
                          assignment.shift_type_id === shift.key,
                      )

                      return (
                        <td
                          key={`${shift.key}-${day.key}`}
                          style={{
                            padding: "8px",
                            border: "1px solid #dee2e6",
                            textAlign: "center",
                            backgroundColor: isCurrentlyAssigned ? "#e8f5e8"  : "white",
                            cursor: selectedEmployee ? "pointer" : "not-allowed",
                            position: "relative",
                          }}
                          onClick={() => toggleAssignment(day.key, shift.key)}
                        >
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              margin: "0 auto",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: "6px",
                              border: isCurrentlyAssigned
                                ? "2px solid #28a745"
                               
                                  : "2px solid #dee2e6",
                              backgroundColor: isCurrentlyAssigned
                                ? "#28a745"
                               
                                  : "transparent",
                              color: isCurrentlyAssigned || hasOtherAssignment ? "white" : "#6c757d",
                              fontWeight: "bold",
                              fontSize: "14px",
                              transition: "all 0.2s ease",
                            }}
                          >
                            {/* {isCurrentlyAssigned ? "✓" : hasOtherAssignment ? "!" : ""} */}
                              {isCurrentlyAssigned ? "✓" : ""}
                          </div>
                          {/* {hasOtherAssignment && !isCurrentlyAssigned && (
                            <div
                              style={{
                                fontSize: "10px",
                                color: "#856404",
                                marginTop: "2px",
                              }}
                            >
                              Đã có người
                            </div>
                          )} */}
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      

      </div>
    </div>
      {/* Controls */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "15px",
            marginBottom: "20px",
          }}
        >
          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Từ ngày:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Đến ngày:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chế độ xem:</label>
            <select
              value={viewMode}
              onChange={(e) => setViewMode(e.target.value as "individual" | "overall")}
              style={{
                width: "100%",
                padding: "8px",
                border: "1px solid #ddd",
                borderRadius: "4px",
              }}
            >
              <option value="overall">Tổng thể</option>
              <option value="individual">Cá nhân</option>
            </select>
          </div>

          {viewMode === "individual" && (
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Chọn nhân viên:</label>
              <select
                value={selectedEmployee}
                onChange={(e) => setSelectedEmployee(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              >
                <option value="">-- Chọn nhân viên --</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id}>
                    {emp.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "20px",
          }}
        >
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            style={{
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            {showCreateForm ? "Hủy tạo ca" : "Tạo ca trực mới"}
          </button>

          <button
            onClick={assignEmployeesToShifts}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2196F3",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Gán nhân viên vào ca
          </button>

          <button
            onClick={removeEmployeesFromShifts}
            style={{
              padding: "10px 20px",
              backgroundColor: "#f44336",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Gỡ bỏ nhân viên khỏi ca
          </button>
        </div>
      </div>

    

      {/* Employee Selection for Assignment/Removal */}
      <div
        style={{
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          marginBottom: "20px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        }}
      >
        <h3 style={{ marginBottom: "15px", color: "#333" }}>Chọn Nhân Viên</h3>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
            gap: "10px",
          }}
        >
          {listUsers.map((emp) => (
            <label
              key={emp.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px",
                backgroundColor: selectedEmployeesForAssign.includes(emp.value) ? "#e3f2fd" : "#f9f9f9",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              <input
                type="checkbox"
                checked={selectedEmployeesForAssign.includes(emp.value)}
                onChange={() => handleEmployeeSelection(emp.value)}
              />
              <span style={{ fontSize: "14px" }}>
                {emp.signature_name} ({emp.value})
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Schedule Display */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "8px",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}
      >
        <h2
          style={{
            padding: "20px",
            margin: "0",
            backgroundColor: "#f8f9fa",
            borderBottom: "1px solid #dee2e6",
            color: "#333",
          }}
        >
          {viewMode === "individual" && selectedEmployee
            ? `Lịch trực của ${employees.find((e) => e.id === selectedEmployee)?.name}`
            : "Lịch Trực Tổng Thể"}
        </h2>

        {viewMode === "overall" ? (
          <div style={{ padding: "20px" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "20px",
              }}
            >
              {weekDates.map((date) => (
                <div
                  key={date}
                  style={{
                    border: "1px solid #dee2e6",
                    borderRadius: "8px",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      backgroundColor: "#007bff",
                      color: "white",
                      padding: "12px",
                      fontWeight: "bold",
                      textAlign: "center",
                    }}
                  >
                    {new Date(date).toLocaleDateString("vi-VN", {
                      weekday: "long",
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </div>

                  <div style={{ padding: "15px" }}>
                    {getShiftsForDate(date).length === 0 ? (
                      <p
                        style={{
                          color: "#6c757d",
                          fontStyle: "italic",
                          textAlign: "center",
                          margin: "0",
                        }}
                      >
                        Không có ca trực
                      </p>
                    ) : (
                      getShiftsForDate(date).map((shift) => (
                        <div
                          key={shift.id}
                          style={{
                            border: selectedShifts.includes(shift.id) ? "2px solid #007bff" : "1px solid #dee2e6",
                            borderRadius: "6px",
                            padding: "12px",
                            marginBottom: "10px",
                            backgroundColor: selectedShifts.includes(shift.id) ? "#f8f9ff" : "#f8f9fa",
                            cursor: "pointer",
                          }}
                          onClick={() => handleShiftSelection(shift.id)}
                        >
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: "8px",
                            }}
                          >
                            <h4 style={{ margin: "0", color: "#333" }}>{shift.name}</h4>
                            <span
                              style={{
                                fontSize: "12px",
                                color: "#6c757d",
                                backgroundColor: "white",
                                padding: "2px 6px",
                                borderRadius: "10px",
                              }}
                            >
                              {shift.assignedEmployees.length}/{shift.maxEmployees}
                            </span>
                          </div>

                          <p
                            style={{
                              margin: "0 0 8px 0",
                              color: "#6c757d",
                              fontSize: "14px",
                            }}
                          >
                            {shift.startTime} - {shift.endTime}
                          </p>

                          <div>
                            <strong style={{ fontSize: "14px", color: "#333" }}>Nhân viên:</strong>
                            {shift.assignedEmployees.length === 0 ? (
                              <span
                                style={{
                                  color: "#dc3545",
                                  fontStyle: "italic",
                                  fontSize: "14px",
                                  marginLeft: "8px",
                                }}
                              >
                                Chưa có nhân viên
                              </span>
                            ) : (
                              <ul
                                style={{
                                  margin: "5px 0 0 0",
                                  paddingLeft: "20px",
                                  fontSize: "14px",
                                }}
                              >
                                {shift.assignedEmployees.map((emp) => (
                                  <li key={emp.id} style={{ marginBottom: "2px" }}>
                                    {emp.name} ({emp.position})
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          selectedEmployee && (
            <div style={{ padding: "20px" }}>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                  gap: "20px",
                }}
              >
                {getEmployeeShifts(selectedEmployee).map(({ date, shifts: employeeShifts }) => (
                  <div
                    key={date}
                    style={{
                      border: "1px solid #dee2e6",
                      borderRadius: "8px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        backgroundColor: "#28a745",
                        color: "white",
                        padding: "12px",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {new Date(date).toLocaleDateString("vi-VN", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>

                    <div style={{ padding: "15px" }}>
                      {employeeShifts.length === 0 ? (
                        <p
                          style={{
                            color: "#6c757d",
                            fontStyle: "italic",
                            textAlign: "center",
                            margin: "0",
                          }}
                        >
                          Không có ca trực
                        </p>
                      ) : (
                        employeeShifts.map((shift) => (
                          <div
                            key={shift.id}
                            style={{
                              border: "1px solid #dee2e6",
                              borderRadius: "6px",
                              padding: "12px",
                              marginBottom: "10px",
                              backgroundColor: "#f8f9fa",
                            }}
                          >
                            <h4 style={{ margin: "0 0 8px 0", color: "#333" }}>{shift.name}</h4>
                            <p
                              style={{
                                margin: "0",
                                color: "#6c757d",
                                fontSize: "14px",
                              }}
                            >
                              {shift.startTime} - {shift.endTime}
                            </p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        )}
      </div>
       <CModal
                    isOpen={showCreateForm}
              onCancel={() => {
              setShowCreateForm(false)
                // setStateDataAssign({
                //   ...stateDataAssign,
                //   openModal: false,
                //   follow_employee_id: listUsers[0],
                // });
              }}
                  
                    widths={600}
                    zIndex={100}
        onOk={createNewShift}
              textCancel='Đóng'
                    textOK='Tạo'
                    className='t-support_libraries_modal'
                  >
                      <div
          style={{
          
            borderRadius: "8px",
            marginBottom: "20px",
        
          }}
        >
          <h3 style={{ marginBottom: "15px", color: "#333" }}>Tạo Ca Trực Mới</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}
          >
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Tên ca:</label>
              <input
                type="text"
                value={newShift.name}
                onChange={(e) => setNewShift((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="VD: Ca sáng"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Mã ca trực:</label>
              <input
                type="text"
                value={newShift.shiftCode}
                onChange={(e) => setNewShift((prev) => ({ ...prev, shiftCode: e.target.value }))}
                placeholder="Shift2704"
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>
            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Giờ bắt đầu:</label>
              <input
                type="time"
                value={newShift.startTime}
                onChange={(e) => setNewShift((prev) => ({ ...prev, startTime: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Giờ kết thúc:</label>
              <input
                type="time"
                value={newShift.endTime}
                onChange={(e) => setNewShift((prev) => ({ ...prev, endTime: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div>

            {/* <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Ngày:</label>
              <input
                type="date"
                value={newShift.date}
                onChange={(e) => setNewShift((prev) => ({ ...prev, date: e.target.value }))}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div> */}

            {/* <div>
              <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>Số nhân viên tối đa:</label>
              <input
                type="number"
                min="1"
                value={newShift.maxEmployees}
                onChange={(e) => setNewShift((prev) => ({ ...prev, maxEmployees: Number.parseInt(e.target.value) }))}
                style={{
                  width: "100%",
                  padding: "8px",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                }}
              />
            </div> */}
          </div>

          {/* <button
            onClick={createNewShift}
            style={{
              marginTop: "15px",
              padding: "10px 20px",
              backgroundColor: "#4CAF50",
              color: "white",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Tạo Ca Trực
          </button> */}
        </div>
            </CModal >
    </div>
  )
}
