import React, { useEffect, useMemo, useState } from "react";
import { useMutation } from "react-query";
import { sendZNSAPI } from "services/api/zns";
import { useAppDispatch } from "store/hooks";

import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

import { renderHtmlTemplate } from "./index";

type DataZns = {
  c_gender_prefix?: string;
  c_lastname?: string;
  c_id?: string;

  examming_date?: string;
  endoscopic_date?: string;
  treatment_days?: string;

  reexamming_date?: string;
  reexamming_note?: string;
  reexamming_cost?: string;
  reexamming_late_days?: string;

  diagnose_note?: string;

  endoscopic_conclude?: string;
  biopsy_conclude?: string;
  recommended?: string;
  examming_conclude?: string;
  endoscopic_name?: string;

  phone?: string;
};
const MAXLEN_200_KEYS: (keyof DataZns)[] = [
  "reexamming_note",
  "diagnose_note",
  "examming_conclude",
  "endoscopic_conclude",
  "biopsy_conclude",
  "recommended",
];

type ZnsTemplate = {
  key: string;
  name: string;
  is_use: boolean;
  zns_url: string;
  zns_data: {
    phone: string;
    template_id: string;
    template_title: string;
    template_content: string;
    template_data: Record<string, string>;
  };
};

type ScheduleInfo = {
  c_schedule_id: number;
  customer_id: string;
  master_id: string;
};

type Props = {
  template: ZnsTemplate;
  initialData: DataZns;
  schedule: ScheduleInfo;
  stateInfoZNS?: any;
  setStateZNS?: any;
  stateZNS?: any;
  setIsSuccess?: (v: boolean) => void;
  setIsSuccessText?: (v: string) => void;
  setIsError?: (v: boolean) => void;
  setIsErrorText?: (v: string) => void;
  isErrorText?: string;
  isError?: boolean;
  isSuccessText?: string;
  isSuccess?: boolean;
  getListCallReExammingMaster?: any;
  propsData?: any;
};

const READONLY_KEYS: (keyof DataZns)[] = [
  "c_gender_prefix",
  "c_lastname",
  "c_id",
  "examming_date",
  "endoscopic_date",
  "treatment_days",
];

const TEXTAREA_KEYS: (keyof DataZns)[] = [
  "diagnose_note",
  "reexamming_note",
  "endoscopic_conclude",
  "biopsy_conclude",
  "recommended",
  "examming_conclude",
];

const FIELD_ORDER: (keyof DataZns)[] = [
  "c_id",
  "c_gender_prefix",
  "c_lastname",
  "examming_date",
  "endoscopic_date",
  "endoscopic_name",
  "diagnose_note",
  "endoscopic_conclude",
  "biopsy_conclude",
  "examming_conclude",
  "treatment_days",
  "reexamming_date",
  "reexamming_late_days",
  "reexamming_note",
  "recommended",
  "reexamming_cost",
];

const LABELS: Partial<Record<keyof DataZns, string>> = {
  c_gender_prefix: "Xưng hô",
  c_lastname: "Tên",
  c_id: "Mã khách hàng",
  examming_date: "Ngày khám",
  endoscopic_date: "Ngày nội soi",
  treatment_days: "Số ngày điều trị",
  reexamming_date: "Ngày tái khám",
  reexamming_note: "Nội dung tái khám",
  reexamming_cost: "Phí dự kiến",
  reexamming_late_days: "Số ngày trễ hẹn",
  diagnose_note: "Chẩn đoán",
  endoscopic_conclude: "Kết quả nội soi",
  biopsy_conclude: "Kết quả sinh thiết",
  recommended: "Bác sĩ đề nghị",
  examming_conclude: "KQ khám sức khỏe",
  endoscopic_name: "Tên nội soi",
};

export const ZnsSingleTemplateEditor: React.FC<Props> = ({
  template,
  initialData,
  schedule,
  stateInfoZNS,
  setStateZNS,
  stateZNS,
  setIsSuccess,
  setIsSuccessText,
  setIsError,
  setIsErrorText,
  isErrorText,
  isError,
  isSuccessText,
  isSuccess,
  getListCallReExammingMaster,
  propsData,
}) => {
  const dispatch = useAppDispatch();

  const [formData, setFormData] = useState<DataZns>({
    ...initialData,
  });

  useEffect(() => {
    setFormData({
      ...initialData,
    });
  }, [initialData]);

const handleChange =
  (field: keyof DataZns) =>
  (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (READONLY_KEYS.includes(field)) return;

    let val = e.target.value;

    // Nếu field thuộc nhóm giới hạn 200 ký tự → chặn không cho nhập thêm
    if (MAXLEN_200_KEYS.includes(field)) {
      if (val.length > 200) {
        val = val.slice(0, 200);
      }
    }

    // Update form
    setFormData((prev) => ({
      ...prev,
      [field]: val,
    }));

    // Xóa lỗi khi user sửa
    setErrors((prev) => ({
      ...prev,
      [field]: undefined,
    }));
  };


const [errors, setErrors] = useState<Partial<Record<keyof DataZns, string>>>({});

  const { mutate: sendZNS } = useMutation(
    "post-footer-form",
    (data: any) => sendZNSAPI(data),
    {
      onSuccess: (data) => {
        setStateZNS?.({
          ...stateZNS,
          loadingFormZNS: false,
        });

        if (data.status) {
          if (getListCallReExammingMaster && propsData) {
            dispatch(
              getListCallReExammingMaster({
                ...propsData,
              } as any)
            );
          }
          setIsSuccessText?.(`Gửi ZNS đến khách hàng có số điện thoại ${template.zns_data.phone.replace(/^84/, "0")} thành công!`);
          setIsSuccess?.(true);
              setTimeout(() => {
     setStateZNS?.({
          ...stateZNS,
           openZNS: false,
     });
                  setIsSuccessText?.("");
          setIsSuccess?.(false);
          setIsErrorText?.("");
          setIsError?.(false);
  }, 5000);
        } else {
          setIsError?.(true);
          setIsErrorText?.("Gửi ZNS thất bại. Lý do: Số điện thoại của khách hàng chưa liên kết với Zalo!");
        }
      },
      onError: () => {
        setStateZNS?.({
          ...stateZNS,
          loadingFormZNS: false,
        });
        setIsError?.(true);
        setIsErrorText?.("Gửi ZNS thất bại. Lý do: Số điện thoại của khách hàng chưa liên kết với Zalo!");
      },
    }
  );

  // Các key thực sự có trong template_data
  const templateKeys = useMemo(() => {
    if (!template?.zns_data?.template_data) return [];
    return Object.keys(template.zns_data.template_data) as (keyof DataZns)[];
  }, [template]);

  // chỉ lấy những key có trong template_data, nhưng sắp theo FIELD_ORDER
  const orderedKeys = useMemo(
    () => FIELD_ORDER.filter((k) => templateKeys.includes(k)),
    [templateKeys]
  );

  // HTML preview
  const htmlResult = useMemo(() => {
    const map: Record<string, string> = {};
    templateKeys.forEach((k) => {
      map[k] = formData[k] ?? "";
    });
    return renderHtmlTemplate(template?.zns_data.template_content ?? "", map);
  }, [template, templateKeys, formData]);

  const buildPayload = () => {
    const template_data: Record<string, string> = {};
    templateKeys.forEach((k) => {
      template_data[k] = formData[k] ?? "";
    });

    return {
      c_schedule: {
        c_schedule_id: schedule.c_schedule_id,
        customer_id: schedule.customer_id,
        master_id: schedule.master_id,
      },
      zns: {
        key: stateInfoZNS?.key,
        name: stateInfoZNS?.name,
        is_use: stateInfoZNS?.is_use,
        zns_url: stateInfoZNS?.zns_url,
        zns_data: {
          phone: template.zns_data.phone,
          template_id: template.zns_data.template_id,
          template_title: template.zns_data.template_title,
          template_content: htmlResult,
          template_data,
        },
      },
    };
  };

  // 🔴 Validate trước khi gửi: field thuộc templateKeys nhưng KHÔNG thuộc READONLY_KEYS thì bắt buộc phải có
const validateRequiredFieldsInline = (): boolean => {
  const newErrors: Partial<Record<keyof DataZns, string>> = {};

  templateKeys.forEach((key) => {
    if (READONLY_KEYS.includes(key)) return;

    const val = (formData[key] ?? "").trim();
    const label = LABELS[key] ?? key;

    // Bắt buộc phải nhập
    if (!val) {
      newErrors[key] = `Vui lòng nhập ${label.toLowerCase()}`;
      return;
    }

    // Không vượt quá 200 ký tự
    if (MAXLEN_200_KEYS.includes(key) && val.length > 200) {
      newErrors[key] = `${label} không được vượt quá 200 ký tự`;
    }
  });

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};





  const rowStyle: React.CSSProperties = {
    display: "flex",
    alignItems: "center",
    fontWeight: "bold",
    marginTop: 4,
    gap: 8,
  };

  const inputStyle: React.CSSProperties = {
    flex: 1,
    padding: 4,
    border: "1px solid #ccc",
    outline: "none",
    borderRadius: 4,
  };

  const cellStyle: React.CSSProperties = {
    border: "1px solid #9bbad1",
    padding: 6,
    verticalAlign: "top",
    fontSize: 13,
  };

  const headerCellStyle: React.CSSProperties = {
    ...cellStyle,
    backgroundColor: "#cfe7ff",
    fontWeight: "bold",
    textAlign: "left",
  };

  return (
    <div>
      {isSuccess ? (
        <SuccessAlert message={isSuccessText} />
      ) : isError ? (
        <ErrorAlert message={isErrorText} />
      ) : (
        <table style={{ borderCollapse: "collapse", width: "100%" }}>
          <thead>
            <tr>
              <th style={{ ...headerCellStyle, width: "40%" }}>Thông tin</th>
              <th style={{ ...headerCellStyle, width: "60%" }}>Nội dung</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              {/* Cột form */}
              <td style={cellStyle}>
                {orderedKeys.map((key) => {
                  // bỏ qua c_lastname, vì render chung trong dòng KH
                  if (key === "c_lastname") return null;

                  // DÒNG ĐẶC BIỆT: KH (xưng hô + tên + sđt)
                  if (key === "c_gender_prefix") {
                    const isReadonlyPrefix = READONLY_KEYS.includes(
                      "c_gender_prefix"
                    );
                    const isReadonlyLast = READONLY_KEYS.includes("c_lastname");

                    return (
                      <div style={rowStyle} key="kh-row">
                        <span style={{ minWidth: 105, maxWidth: 105 }}>
                          Khách hàng:
                        </span>

                        {/* Xưng hô */}
                        <input
                          style={{
                            ...inputStyle,
                            maxWidth: 110,
                            backgroundColor: isReadonlyPrefix
                              ? "#ecedf3"
                              : undefined,
                          }}
                          readOnly={isReadonlyPrefix}
                          value={formData.c_gender_prefix ?? ""}
                          onChange={handleChange("c_gender_prefix")}
                          placeholder="Xưng hô (Anh/Chị/Chú...)"
                        />

                        {/* Tên KH */}
                        <input
                          style={{
                            ...inputStyle,
                            maxWidth: 110,
                            backgroundColor: isReadonlyLast
                              ? "#ecedf3"
                              : undefined,
                          }}
                          readOnly={isReadonlyLast}
                          value={formData.c_lastname ?? ""}
                          onChange={handleChange("c_lastname")}
                          placeholder="Tên khách hàng"
                        />

                        {/* SĐT (readonly, từ template.zns_data.phone) */}
                        <input
                          style={{
                            ...inputStyle,
                            maxWidth: 110,
                            backgroundColor: "#ecedf3",
                          }}
                          readOnly
                          value={template.zns_data.phone.replace(/^84/, "0")}
                          placeholder="Số điện thoại"
                        />
                      </div>
                    );
                  }

                  // Các dòng bình thường
                  const label = LABELS[key] ?? key;
                  const isReadonly = READONLY_KEYS.includes(key);
                  const isTextarea = TEXTAREA_KEYS.includes(key);
                  const value = formData[key] ?? "";

                  return (
                    <div style={rowStyle} key={key}>
                      <span style={{ minWidth: 105, maxWidth: 105 }}>
                        {label}:
                      </span>
                        <div style={{display:"flex",flexDirection:"column",flex:"1 1 0%"}}>
  {isTextarea ? (
    <textarea
      style={{
        ...inputStyle,
        resize: "vertical",
        backgroundColor: isReadonly ? "#ecedf3" : undefined,
      }}
      rows={3}
      readOnly={isReadonly}
      value={value}
      onChange={handleChange(key)}
      maxLength={MAXLEN_200_KEYS.includes(key) ? 200 : undefined}
    />
  ) : (
    <input
      style={{
        ...inputStyle,
        backgroundColor: isReadonly ? "#ecedf3" : undefined,
      }}
      readOnly={isReadonly}
      value={value}
      onChange={handleChange(key)}
      maxLength={MAXLEN_200_KEYS.includes(key) ? 200 : undefined}
    />
  )}

  {/* Đếm ký tự */}
  {MAXLEN_200_KEYS.includes(key) && (
    <div style={{ fontSize: 9, color: "red", marginTop: 2 }}>
      {value.length} / 200 ký tự
    </div>
  )}

  {/* Hiển thị lỗi */}
  {errors[key] && (
    <div style={{ color: "red", fontSize: 12, marginTop: 2 }}>
      {errors[key]}
    </div>
  )}
</div>

                    </div>
                  );
                })}
              </td>

              {/* Cột preview */}
              <td style={cellStyle}>
                <div style={{ fontWeight: "bold", marginBottom: 4 }}>
                  {template?.zns_data.template_title}
                </div>
                <div
                  style={{ whiteSpace: "normal" }}
                  dangerouslySetInnerHTML={{ __html: htmlResult }}
                />
              </td>
            </tr>

            {/* Hàng nút gửi */}
            <tr>
                  <td style={{ ...cellStyle,border:"none" }}></td>
              <td style={{ ...cellStyle, textAlign: "center",border:"none" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <div
                    style={{
                      borderRadius: 5,
                      width: "20%",
                      background: "#28a745",
                      justifyContent: "center",
                      padding: "6px 12px",
                      cursor: "pointer",
                      textAlign: "center",
                      color: "#fff",
                    }}
                    onClick={() => {
                      // ⚠ Validate trước
                     const ok = validateRequiredFieldsInline();
                     if (!ok) return;

                      const payload = buildPayload();
                      setStateZNS?.({
                        ...stateZNS,
                        loadingFormZNS: true,
                      });
                      console.log("SEND PAYLOAD:", payload);
                      sendZNS(payload);
                    }}
                  >
                    Gửi
                  </div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      )}
    </div>
  );
};
