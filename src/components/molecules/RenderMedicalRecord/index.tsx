/* eslint-disable max-len */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { administrative } from 'assets/data';
import Typography from 'components/atoms/Typography';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import PublicTable from '../PublicTable';
import RichTextEditor from '../RichTextEditor';

type AdministrativeType = 'name' | 'gender' | 'yearOfBirth' | 'carrer' | 'phone' | 'address' | 'object' | 'ticketId' | 'timeTicket' | 'KCB' | 'date_medical' | 'doctor' | 'doctorPrescribes' | 'prescriber_employee';

export interface AdministrativeItem {
  id: string | number;
  name: string;
  type: AdministrativeType,
}
interface RenderMedicalRecordProps {
  data?: any;
}

const RenderMedicalRecord: React.FC<RenderMedicalRecordProps> = ({ data }) => {
  const [dataCLSCD, setDataCLSCD] = useState([]);

  useEffect(() => {
    const newService: any[] = [];
    !_.isEmpty(data?.servicepoint?.items) && data?.servicepoint?.items?.map((servicepointItem: any) => {
      const existingGroup = newService.find(
        (group) => group.service_group_id === servicepointItem.service_group_id
      );
      if (existingGroup) {
        existingGroup?.children?.push(servicepointItem as any);
      } else {
        const newGroupService = {
          service_group_id: servicepointItem.service_group_id,
          service_group_name: servicepointItem.service_group_name,
          children: [servicepointItem],
        };
        newService.push(newGroupService);
      }
    });
    setDataCLSCD(newService as any);
  }, [])

  const columTDV = [
    {
      title: <Typography content="Tên Thuốc" modifiers={['14x20', '500', 'center']} />,
      dataIndex: 'drug_name',
      align: 'justify',
      render: (record: any, data: any) => (
        <div>
          <Typography content={`${record} - (${data?.drugs_active_ingredient})`} modifiers={['14x20', '600', 'left']} />
          <p style={{ color: '#333', fontSize: 13, fontStyle: 'italic' }}>{data.how_to_use}</p>
        </div>
      ),
    },
    {
      title: <Typography content="Số lượng" modifiers={['14x20', '500', 'center']} />,
      dataIndex: 'quantity_total',
      align: 'center',
      width: 100,
      render: (record: any) => (
        <Typography content={record || '---'} modifiers={['14x20', '400', 'center']} />
      ),
    },
    {
      title: <Typography content="Đơn vị" modifiers={['14x20', '500', 'center']} />,
      dataIndex: 'unit_id',
      align: 'center',
      width: 100,
      render: (record: any, data: any) => (
        <Typography content={record} modifiers={['14x20', '400', 'left']} />
      ),
    },
  ]

  return (
    <div className="m-medical_record">
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="I. HÀNH CHÍNH:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content">
          {administrative.map((item) => (
            <div className="m-medical_record_chapter_content_item" key={item.id}>
              <span style={{ minWidth: 80 }}> {item.name}:</span>
              <span style={{
                fontWeight: 400,
                color: '#27ACFD',
                marginLeft: 8,
              }}
              >{
                  item.type === 'name' && data?.customer?.customer_fullname
                  || item.type === 'gender' && data?.customer?.gender?.name
                  || item.type === 'yearOfBirth' && data?.customer?.year_of_birth
                  || item.type === 'carrer' && data?.customer?.career?.name
                  || item.type === 'phone' && data?.customer?.customer_phone
                  || item.type === 'address' && data?.customer?.customer_full_address
                  || item.type === 'object' && data?.customer?.diagnose_icd10_text
                  || item.type === 'ticketId' && data?.customer?.diagnose_icd10_text
                  || item.type === 'timeTicket' && data?.customer?.diagnose_icd10_text
                  || item.type === 'KCB' && data?.customer?.diagnose_icd10_text
                  || item.type === 'date_medical' && `${moment(data?.exams?.in_date).format('HH:mm - DD-MM-YYYY') || ''} (KHOA: ${data?.exams?.specialist?.name || ' '})`
                  || item.type === 'doctor' && data?.exams?.doctor_employee?.name
                  || item.type === 'doctorPrescribes' && data?.exams?.prescriber_employee?.name
                  || ''
                }
              </span>
            </div>
          ))}
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="II. LÝ DO KHÁM:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content">
          <span>{data?.exams?.exams_reason}</span>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="III. BỆNH SỬ:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content">
          <span>{data?.exams?.exams_medical_history}</span>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="IV. TIỀN CĂN:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content">
          <span>{data?.exams?.exams_ancient_root}</span>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="V. KHÁM LÂM SÀNG:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content_iv ">
          <RichTextEditor typeText='notHeadernotBordernotBG' isDisabled data={data?.exams?.exams_content?.replace(/\n/g, '</br>')} />
          {data?.vitalsign ? (
            <div className="m-medical_record_chapter_content_iv_info">

              <RichTextEditor
                typeText='notHeadernotBordernotBG'
                isDisabled
                data={`- Mạch: ${data?.vitalsign?.heart_rate} lần/phút </br>
                - Huyết áp: ${data?.vitalsign?.blood_pressure_min}/ mmHg</br>
                - Nhịp thở: ${data?.vitalsign?.respiratory_rate} lần/phút</br>
                - Nhiệt độ: ${data?.vitalsign?.temperature} ℃</br>
                - Chiều cao: ${data?.vitalsign?.height} cm</br>
                - Cân nặng: ${data?.vitalsign?.weight} kg</br>
                - BMI: ${data?.vitalsign?.bmi} kg/m2`}
              />
            </div>
          ) : null}
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="VI. CHỈ ĐỊNH CẬN LÂM SÀNG:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content_vi ">
          <div className="m-medical_record_chapter_content_vi_info">
            {!_.isEmpty(dataCLSCD) && dataCLSCD?.map((item: any) => {
              return (
                <div className="medical_record_chapter_content_vi_info_item" key={item?.servicespoint_detail_id}>
                  <Typography content={`(*) ${item?.service_group_name}`} />
                  {item.children.length && item.children.map((child: any) => (
                    <div className="medical_record_chapter_content_vi_info_item_child" key={child.servicespoint_detail_id}>
                      -&nbsp;<span>{child?.service_name}</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="VII. CHẨN ĐOÁN:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content_vi ">
          <div className="m-medical_record_chapter_content_vii_info">
            <p>{data?.servicepoint?.diagnose_note}</p>
          </div>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="VIII. ĐƠN THUỐC:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content_viii ">
          <div className="m-medical_record_chapter_content_viii_info">
            {data?.prescription?.items?.length ?
              <PublicTable
                column={columTDV}
                isSimpleHeader
                isHideRowSelect
                listData={data?.prescription?.items}
              />
              : <Typography content={`Không tìm thấy đơn thuốc`} modifiers={['cg-red', '400', 'italic']} />
            }
            <div className="m-medical_record_chapter_content_viii_info_item" >
              <Typography content={`Lời dặn của Bác sĩ:`} modifiers={['orange']} />
              <p>{data?.prescription?.doctor_note}</p>
            </div>
          </div>
        </div>
      </div>
      <div className="m-medical_record_chapter">
        <div className="m-medical_record_chapter_heading">
          <Typography content="IX. HẸN KHÁM LẠI:" type="h4" />
        </div>
        <div className="m-medical_record_chapter_content_ix ">
          <div className="m-medical_record_chapter_content_ix_info">
            <div className="m-medical_record_chapter_content_ix_info_item">
              <span>- Ngày hẹn khám lại: </span>
              <span>{moment(data?.re_exams_card?.appointment_date).format('HH:mm - DD-MM-YYYY')} </span>
            </div>
            <div className="m-medical_record_chapter_content_ix_info_item">
              <span>- Nội dung hẹn khám lại:</span>
              <span>{data?.re_exams_card?.appointment_content} </span>
            </div>
            <div className="m-medical_record_chapter_content_ix_info_item">
              <span>- Ghi chú: </span>
              <span>{data?.re_exams_card?.appointment_note} </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

RenderMedicalRecord.defaultProps = {
};

export default RenderMedicalRecord;
