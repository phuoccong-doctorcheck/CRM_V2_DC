/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable prefer-const */
/* eslint-disable no-plusplus */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import React, { useEffect, useState } from 'react';
import mapModifiers from 'utils/functions';
import * as XLSX from 'xlsx';

import PublicTable from '../PublicTable';

interface FileProps {
  name: string;
  content: any[];
}

export interface CampaignFormType {
  name: string
  phone?: string
}

export interface PropsCampaignFromExcel {
  data: string[],
  campaign: string,
  subject: string,
  template: string,
  content: string,
  campaignType: string,
}

interface FormAddMarketingCampaignProps {
  handleOnClose?: () => void;
  isClose?: boolean;
  campaigns?: DropdownData[];
  templateSMS?: DropdownData[];
  handleSubmit?: (data: PropsCampaignFromExcel) => void;
  dataOnChange?: (data: CampaignFormType[]) => void;
}

export const AMOUNT_SMS = 390;

const FormAddMarketingCampaign: React.FC<FormAddMarketingCampaignProps> = ({
  handleOnClose, isClose, campaigns, templateSMS, handleSubmit, dataOnChange
}) => {
  const [dataTable, setDataTable] = useState<NonNullable<CampaignFormType[]>>([]);
  const [file, setFile] = useState<FileProps | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sendSMS, setSendSMS] = useState({
    type: '',
    campaignType: sendMessagetype[0] as unknown as GroupRadioType,
    template: undefined as unknown as DropdownData,
    campaign: undefined as unknown as DropdownData,
    content: '',
    subject: '',
  })
  console.log("🚀 ~ sendSMS:", sendSMS);

  const [sendSMSEror, setSendSMSError] = useState({
    subject: '',
    template: '',
    content: '',
    campaign: ''
  });

  const [listCampaign, setListCampaign] = useState({
    templateSMS: undefined as unknown as DropdownData[],
    dropdown: campaigns ?? [],
  });

  useEffect(() => {
    if (dataOnChange) {
      dataOnChange(dataTable ?? [])
    }
  }, [dataTable]);

  useEffect(() => {
    if (!isClose) {
      setDataTable([]);
      setFile(null);
      setIsLoading(false)
      setSendSMS({
        type: '',
        campaignType: sendMessagetype[0] as unknown as GroupRadioType,
        template: undefined as unknown as DropdownData,
        campaign: undefined as unknown as DropdownData,
        content: '',
        subject: '',
      })
    }
  }, [isClose])

  const parseExcelFile = (file: File): Promise<any[]> => new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e: any) => {
      try {
        const data = e.target.result;
        const workbook = XLSX.read(data, {
          type: 'binary',
        });

        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
        const header = rows.shift();

        const result = rows.map((row: any) => {
          const obj: any = {};
          row.forEach((cell: any, index: number) => {
            obj[(header as string[])[index]?.toLowerCase()] = cell;
          });
          return obj;
        });
        setIsLoading(false);
        setDataTable(result);
      } catch (error) {
        reject(error);
      }
    };

    reader.readAsBinaryString(file);
  });

  const handleGetDataFromExcel = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setIsLoading(true);
      const inputfile = event.target.files[0];
      const content = await parseExcelFile(inputfile);

      setFile({
        name: inputfile.name,
        content,
      });
    }
  };

  const handleSubmitForm = () => {
    const body: PropsCampaignFromExcel = {
      data: dataTable?.map((i) => i.phone) as any ?? [],
      campaign: sendSMS.campaign?.value,
      subject: sendSMS.subject,
      template: sendSMS.template?.value,
      content: sendSMS?.campaignType?.value === 'SMS' ? sendSMS.template?.value : sendSMS?.content,
      campaignType: sendSMS.campaignType?.value,
    }
    console.log("🚀 ~ handleSubmitForm ~ body:", body);
    if (handleSubmit) {
      handleSubmit(body);
    }
  }

  const columnTable = [
    {
      title: (<Typography content="STT" modifiers={["12x18", "500", "center", "main"]} />),
      align: "center",
      dataIndex: "index",
      width: 40,
      className: "ant-table-column_wrap",
      render: (record: any, data: any, index: any) => (
        <div className="ant-table-column_item">
          < Typography content={`${index + 1}`} modifiers={['13x18', '600', 'center']} />
        </div>
      ),
    },
    {
      title: <Typography content="Họ tên Khách hàng" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'name',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
    {
      title: <Typography content="Số điện thoại" modifiers={['12x18', '500', 'center', 'uppercase']} />,
      dataIndex: 'phone',
      align: 'center',
      className: "ant-table-column_wrap",
      render: (record: any, data: any) => (
        <div className="ant-table-column_item" style={{ display: 'flex', justifyContent: 'center' }}>
          <Typography content={record} modifiers={['13x18', '600', 'main', 'justify']} />
        </div>
      ),
    },
  ];

  return (
    <div className={mapModifiers("m-form_marketing", !!dataTable?.length && 'data')}>
      <div className="m-form_marketing_wrapper">
        <div className="m-form_marketing_header">
          <div className="m-form_marketing_header_excel">
            <label htmlFor="input_file" className="m-editor_item">
              <Typography type="span" modifiers={['400', '16x24']} content="Nhập từ excel" />
            </label>
            <input type="file" hidden id="input_file" onChange={(e) => handleGetDataFromExcel(e)} multiple accept="*" />
          </div>

        </div>
        <div className="m-form_marketing_body">
          {sendSMS.template && sendSMS.campaignType.value === "SMS" &&
            <div className='m-form_marketing_sms'>
              <div className='m-form_marketing_sms_item'>
                <span>Khách đã chọn:</span> <p>{dataTable?.length}</p>
              </div>
              <div className='m-form_marketing_sms_item'>
                <span>Số tin nhắn (SMS) mỗi Khách:</span> <p>{sendSMS.template?.sms_count}</p>
              </div>
              <div className='m-form_marketing_sms_item'>
                <span>Tổng số tin nhắn (SMS) gởi đi:</span> <p>{(dataTable?.length ?? 0) * sendSMS.template?.sms_count}</p>
              </div>
              <div className='m-form_marketing_sms_item'>
                <span>Tổng tiền dự kiến:</span> <p>{Number((dataTable?.length ?? 0) * sendSMS.template?.sms_count * AMOUNT_SMS)?.toLocaleString('vi-VN')} VNĐ</p>
              </div>
            </div>
          }
          <div style={{ marginBottom: 8 }}>
            <Typography content='Kiểu tin nhắn:' modifiers={['400']} />
            <GroupRadio options={sendMessagetype} value={sendSMS.campaignType} handleOnchangeRadio={(item) => {
              setSendSMS({
                ...sendSMS, campaignType: item,
                template: undefined as any,
                content: '',
              })
              setSendSMSError({
                subject: '',
                template: '',
                content: '',
                campaign: ''
              });
            }} />
          </div>
          <Dropdown label='Chiến dịch' dropdownOption={listCampaign.dropdown || []} variant='simple' isRequired error={sendSMSEror.campaign} values={sendSMS.campaign} handleSelect={(item) => {
            setSendSMS({ ...sendSMS, campaign: item });
            setSendSMSError({ ...sendSMSEror, campaign: '', });
          }} />
          <Input label='Tiêu đề' variant='simple' isRequired error={sendSMSEror.subject} onChange={(event) => {
            setSendSMS({ ...sendSMS, subject: event?.target?.value });
            setSendSMSError({ ...sendSMSEror, subject: '', });
          }} />
          {sendSMS.campaignType?.value === 'SMS' &&
            <Dropdown label='Kịch bản' dropdownOption={templateSMS ?? []} variant='simple' isRequired error={sendSMSEror.template} values={sendSMS.template} handleSelect={(item) => {
              setSendSMS({ ...sendSMS, template: item });
              setSendSMSError({ ...sendSMSEror, template: '', });
            }} />
          }
          <TextArea
            error={sendSMSEror.content}
            label='Nội dung'
            id={''}
            readOnly={sendSMS?.campaignType?.value === 'SMS'}
            isResize
            value={sendSMS?.campaignType?.value === 'SMS' ? sendSMS.template?.value : sendSMS?.content}
            handleOnchange={(event) => {
              setSendSMS({ ...sendSMS, content: event?.target?.value });
              setSendSMSError({ ...sendSMSEror, content: '', });
            }}
          />
        </div>
        <div className="m-form_marketing_header_actions">
          <Button modifiers={['primary']} onClick={handleSubmitForm}>
            <Typography content='Tiến hành gửi' />
          </Button>
          <Button modifiers={['red']} onClick={handleOnClose}>
            <Typography content='Hủy' />
          </Button>
        </div>
      </div >
      {dataTable?.length ?
        <div className={mapModifiers("m-form_marketing_table", sendSMS.campaignType?.value !== 'SMS' && 'other')}>
          <PublicTable
            listData={dataTable}
            column={columnTable}
            isHideRowSelect
            rowClassNames={(record: any, index: any) => {
              return index % 2 === 0 ? 'bg-gay-blur' : ''
            }}
          />
        </div>
        : null
      }
    </div >
  );
};

FormAddMarketingCampaign.defaultProps = {
};

export default FormAddMarketingCampaign;
