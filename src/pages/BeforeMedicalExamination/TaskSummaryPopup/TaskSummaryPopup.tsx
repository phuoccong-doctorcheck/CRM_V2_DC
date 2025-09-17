"use client";

import { Bell, X } from "lucide-react";
import { useMemo, useState } from "react";

interface Lead {
  task_status?: string | null; // dùng cho "mới" và fallback "còn lại"
  status?: string | null;      // dùng cho "còn lại" nếu có
  [k: string]: any;
}

interface TaskFollowBuckets {
  follow_7?: Lead[];
  follow_14?: Lead[];
  follow_23?: Lead[];
}

interface TaskSummaryPopupProps {
  openListTask: boolean;
  setOpenListTask: (value: boolean) => void;
  data: {
    my_task?: Lead[];                 // <— thêm nhóm này
    task_follow?: TaskFollowBuckets;  // nhóm 7/14/23
  };
  setDataTaskOfDay?: any;
  styleOfTask?: any;
}

const LABEL_BY_KEY: Record<string, string> = {
  my_task: "Task của tôi",
  follow_7: "Task 7 ngày",
  follow_14: "Task 14 ngày",
  follow_23: "Task 23 ngày",
};

// Thứ tự hiển thị: my_task -> 7 -> 14 -> 23
const ORDER = ["my_task", "follow_7", "follow_14", "follow_23"];

export default function TaskSummaryPopup({
  openListTask = false,
  setOpenListTask,
  data,
  setDataTaskOfDay,
  styleOfTask
}: TaskSummaryPopupProps) {
  const [isOpen, setIsOpen] = useState(true);

  // helpers
  const isNew = (v?: string | null) => (v ?? "").toLowerCase() === "new";
  const isInprogress = (v?: string | null) =>
    (v ?? "").toLowerCase() === "inprogress";

  // Chuẩn hoá nguồn dữ liệu
  const buckets = useMemo(() => {
    const tf = data?.task_follow ?? {};
    return {
      my_task: Array.isArray(data?.my_task) ? data!.my_task! : [],
      follow_7: Array.isArray(tf.follow_7) ? tf.follow_7! : [],
      follow_14: Array.isArray(tf.follow_14) ? tf.follow_14! : [],
      follow_23: Array.isArray(tf.follow_23) ? tf.follow_23! : [],
    };
  }, [data]);

  // Gom nhóm + đếm
  const groups = useMemo(() => {
    return ORDER.map((key) => {
      const arr = (buckets as any)[key] as Lead[] | undefined || [];
      const newList = arr.filter((i) => isNew(i.task_status));
      // "Còn lại" ưu tiên field status; nếu không có thì fallback task_status
      const remainingList = arr.filter((i) =>
        isInprogress(i.status ?? i.task_status)
      );
      return {
        key,
        label: LABEL_BY_KEY[key] ?? key,
        newTasks: newList.length,
        remainingTasks: remainingList.length,
        listNew: newList,
        listRemaining: remainingList,
        listAll: arr,
      };
    });
  }, [buckets]);

  // Tổng "còn lại" cho nút thu gọn
  const minimizedTotal = useMemo(
    () => groups.reduce((sum, g) => sum + g.remainingTasks, 0),
    [groups]
  );

  const handleClickNew = (list: Lead[]) => {
    setOpenListTask(true);
    setDataTaskOfDay?.(list);
  };
  const handleClickRemaining = (list: Lead[]) => {
    setOpenListTask(true);
    setDataTaskOfDay?.(list);
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 50,
      }}
    >
      {isOpen ? (
        <div
          style={{
            backgroundColor: "#FFFFFF",
            borderRadius: "0.5rem",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            borderTop: "4px solid #3B82F6",
            width: "100%",
            maxWidth: "20rem",
          }}
        >
          {/* Header */}
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0.75rem 1rem",
            }}
          >
            <h2
              style={{
                fontSize: "1rem",
                fontWeight: 600,
                margin: 0,
              }}
            >
              Tổng quan Task
            </h2>
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Đóng popup"
              style={{
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer",
                padding: "0.25rem",
                borderRadius: "0.375rem",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#6B7280",
              }}
            >
              <X style={{ height: "1rem", width: "1rem" }} />
            </button>
          </div>

          {/* Content */}
          <div
            style={{
              display: "grid",
              gap: "0.5rem",
              padding: "0 1rem 0.75rem 1rem",
            }}
          >
            {groups.map((category, index) => (
              <div
                key={category.key}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "0.5rem 0",
                  borderBottom:
                    index < groups.length - 1 ? "1px solid #E5E7EB" : "none",
                }}
              >
                <span
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#4B5563",
                    marginRight:"40px"
                  }}
                >
                  {category.label}
                </span>

                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1rem",
                  }}
                >
                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        margin: 0,
                      }}
                    >
                      Mới
                    </p>
                    <button
                      onClick={() => {
                         styleOfTask(category.key);
                        handleClickNew(category.listNew)

                      }}
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#2563EB",
                        margin: 0,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label={`Xem task mới của ${category.label}`}
                      title="Xem danh sách task mới"
                    >
                      {category.newTasks}
                    </button>
                  </div>

                  <div style={{ textAlign: "center" }}>
                    <p
                      style={{
                        fontSize: "0.75rem",
                        color: "#6B7280",
                        margin: 0,
                      }}
                    >
                      Còn lại
                    </p>
                    <button
                      onClick={() => {
                        styleOfTask(category.key);
                        handleClickRemaining(category.listRemaining)
                      }}
                      style={{
                        fontSize: "1rem",
                        fontWeight: 700,
                        color: "#1F2937",
                        margin: 0,
                        background: "transparent",
                        border: "none",
                        cursor: "pointer",
                      }}
                      aria-label={`Xem task còn lại của ${category.label}`}
                      title="Xem danh sách task còn lại"
                    >
                      {category.remainingTasks}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          aria-label="Mở popup tổng quan task"
          style={{
            borderRadius: "9999px",
            height: "4rem",
            width: "4rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow:
              "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            backgroundColor: "#2563EB",
            color: "#FFFFFF",
            border: "none",
            cursor: "pointer",
          }}
        >
          <Bell style={{ height: "1.5rem", width: "1.5rem" }} />
          <span
            style={{
              fontSize: "0.75rem",
              fontWeight: 700,
              marginTop: "0.25rem",
            }}
          >
            {minimizedTotal}
          </span>
        </button>
      )}
    </div>
  );
}
