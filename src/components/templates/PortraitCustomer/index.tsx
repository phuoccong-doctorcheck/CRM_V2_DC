/* eslint-disable @typescript-eslint/no-unused-vars */
import { OptionCustomerPortraitDigestiveExamination2, OptionCustomerPortraitDigestiveExamination3 } from 'assets/data';
import Checkbox from 'components/atoms/Checkbox';
import GroupRadio from 'components/atoms/GroupRadio';
import Input from 'components/atoms/Input';
import Loading from 'components/atoms/Loading';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import CCollapse from 'components/organisms/CCollapse';
import _ from 'lodash';
import React from 'react';

import men from 'assets/icons/ic_men.svg'
import women from 'assets/icons/ic_woman.svg'

type PortraitType = 'CSTH' | 'CSTKQ' | 'CSBSCD' | any;
interface PortraitCustomerProps {
  type: PortraitType,
  data: any,
  customer_id: string;
}


const PortraitCustomer: React.FC<PortraitCustomerProps> = ({
  type, data, customer_id
}) => {
  const dataFixCSTHQ2 = [
    {
      label: 'Dạ dày',
      value: data?.card?.q2_dd ?? false,
    },
    {
      label: 'Đại Tràng',
      value: data?.card?.q2_dt ?? false,
    },
    {
      label: 'Đại trực tràng',
      value: data?.card?.q2_dtt ?? false,
    },
  ]
  const dataFixCSTHQ8_1 = [
    {
      label: 'Đại Tràng Thường',
      value: data?.card?.q8_1_nsdtt || false,
    },
    {
      label: 'Đại Tràng Mê',
      value: data?.card?.q8_1_nsdtm || false,
    },
    {
      label: 'Dạ Dày Thường',
      value: data?.card?.q8_1_nsddt || false,
    },
    {
      label: 'Dạ Dày Mê',
      value: data?.card?.q8_1_nsddm || false,
    },
    {
      label: 'Nọi Soi Cặp Thường',
      value: data?.card?.q8_1_nsct || false,
    },
    {
      label: 'Nọi Soi Cặp Mê',
      value: data?.card?.q8_1_nscm || false,
    },
  ]

  const renderPortraitCustomer = () => {
    switch (type) {
      case 'CSTH': return (
        <div className='t-portrait_customer_csth'>
          <div className='t-portrait_customer_csth_answer'>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_checkbox'>
              <Typography content={data?.card?.q2 || 'Bệnh lý của Anh Csth?'} />
              <span className='t-portrait_customer_csth_answer_item_checkbox_q2'>
                {
                  dataFixCSTHQ2.map((q2) => (
                    <Checkbox label={q2?.label} checked={q2?.value} />
                  ))
                }
              </span>
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_normal'>
              <Typography content={data?.card?.q3 || 'Triệu chứng của Khách hàng'} />
              <TextArea id={''} readOnly={true} value={data?.card?.q3_tc_text} />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_normal'>
              <Typography content={data?.card?.q4 || 'Tiền sử bệnh của Khách hàng'} />
              <TextArea id={''} readOnly={true} value={data?.card?.q4_tsb_text} />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_normal'>
              <Typography content={data?.card?.q5 || 'Bệnh sử của Khách hàng?'} />
              <TextArea id={''} readOnly={true} value={data?.card?.q5_bs_text} />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
              <Typography content={data?.card?.q6 || 'Khách hàng đã bị bao lâu rồi'} />
              <Input value={data?.card?.q6_time_text} variant='simple' />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
              <Typography content={data?.card?.q7 || 'Khách hàng đã từng điều trị ở đâu chưa?'} />
              <Input value={data?.card?.q7_time_text} variant='simple' />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
              <Typography content={data?.card?.q8 || 'Khách hàng đã từng nội soi chưa?'} />
              <GroupRadio
                options={OptionCustomerPortraitDigestiveExamination2}
                defaultVal={data?.card?.q8_ns_yes ? OptionCustomerPortraitDigestiveExamination2[1] : OptionCustomerPortraitDigestiveExamination2[0]}
                isDisable
              />
            </div>
            {data?.card?.q8_ns_yes ? (
              <>
                <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_checkbox6'>
                  <Typography content={data?.card?.q8_1 || 'Loại nội soi Khách hàng đã thực hiện:'} />
                  <span className='t-portrait_customer_csth_answer_item_checkbox6_q8'>
                    {
                      dataFixCSTHQ8_1.map((q2) => (
                        <span className='t-portrait_customer_csth_answer_item_checkbox6_q8_item'>
                          <Checkbox label={q2?.label} checked={q2?.value} />
                        </span>
                      ))
                    }
                  </span>
                </div>
                <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
                  <Typography content={data?.card?.q8_2 || 'Lần nội soi gần nhất'} />
                  <Input value={data?.card?.q8_2_time_text} variant='simple' />
                </div>

                <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
                  <Typography content={data?.card?.q8_3 || 'Hiệu quả của lần khám trước như thế nào?'} />
                  <GroupRadio
                    options={OptionCustomerPortraitDigestiveExamination3}
                    defaultVal={data?.card?.q8_3_khb_yesno ? OptionCustomerPortraitDigestiveExamination3[1] : OptionCustomerPortraitDigestiveExamination3[0]}
                    isDisable
                  />
                </div>
                <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_flex'>
                  <Typography content={data?.card?.q8_4 || 'Kết quả như thế nào'} />
                  <TextArea value={data?.card?.q8_4_time_text} variant='simple' id={''} readOnly={false} />
                </div>
              </>

            ) : null}
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_normal'>
              <Typography content={data?.card?.q9 || 'Mong muốn của Anh Csth:'} />
              <TextArea value={data?.card?.q9_time_text} variant='simple' id={''} readOnly={false} />
            </div>
            <div className='t-portrait_customer_csth_answer_item t-portrait_customer_csth_answer_item_normal'>
              <Typography content={data?.card?.q10 || 'Thông tin khác'} />
              <TextArea value={data?.card?.q10_text} variant='simple' id={''} readOnly={false} />
            </div>
          </div>
        </div >
      );
      case 'CSKTQ': return (
        <div className='t-portrait_customer_csktq'>
          <div className='t-portrait_customer_csktq_answer'>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_flex'>
              <Typography content={data?.card?.q2 || 'Anh/Chị đã từng trải nghiệm dịch vụ khám tổng quát ở cơ sở y tế nào chưa?'} />
              <GroupRadio
                options={OptionCustomerPortraitDigestiveExamination2}
                defaultVal={data?.card?.q2_tn_yes ? OptionCustomerPortraitDigestiveExamination2[1] : OptionCustomerPortraitDigestiveExamination2[0]}
                isDisable
              />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_flex'>
              <Typography content={data?.card?.q3 || 'Chị Csktq có hay đi khám định kỳ không?'} />
              <GroupRadio
                options={OptionCustomerPortraitDigestiveExamination2}
                defaultVal={data?.card?.q3_kdk_yes ? OptionCustomerPortraitDigestiveExamination2[1] : OptionCustomerPortraitDigestiveExamination2[0]}
                isDisable
              />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_flex'>
              <Typography content={data?.card?.q4 || 'Lần khám trước cách đây bao lâu?'} />
              <TextArea value={data?.card?.q4_tsb_text || 'Không cung cấp'} variant="simple" id={''} readOnly={true} />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_normal'>
              <Typography content={data?.card?.q5 || 'Tiền sử bệnh của Anh Csth?'} />
              <TextArea value={data?.card?.q5_time_text || 'Không cung cấp'} variant="simple" id={''} readOnly={true} />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_normal'>
              <Typography content={data?.card?.q6 || 'Bệnh sử của Anh Csth?'} />
              <TextArea value={data?.card?.q6_time_text || 'Không cung cấp'} variant="simple" id={''} readOnly={true} />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_normal'>
              <Typography content={data?.card?.q7 || 'Chị Csktq có triệu chứng bất thường gần đây không?'} />
              <TextArea value={data?.card?.q7_time_text || 'Không cung cấp'} variant="simple" id={''} readOnly={true} />
            </div>
            <div className='t-portrait_customer_csktq_item t-portrait_customer_csktq_item_normal'>
              <Typography content={data?.card?.q8 || 'Thông tin khác'} />
              <TextArea value={data?.card?.q8_text || 'Không cung cấp'} variant="simple" id={''} readOnly={true} />
            </div>
          </div>
        </div>);
      case 'CSBSCD': return (
        <ul className='t-portrait_customer_csbscd'>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q2}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q3}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q4}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q5}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q6}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q7}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q8}</span>
          </li>
          <li className='t-portrait_customer_csbscd_item'>
            <span>{data?.card?.q9}</span>
          </li>
        </ul>
      );
    }
  }

  return (
    <div className='t-portrait_customer'>{
      _.isEmpty(data) ? (
        <div className='t-portrait_customer_loading'>
          Không tìm thấy dữ liệu
        </div>
      ) : (
        <>
          {
            _.isEmpty(type) ? (<h4 style={{ textAlign: 'center', color: '#f00' }}>Chưa cập nhật chân dung cho khách hàng</h4>) :
              (
                <div className='t-portrait_customer_content'>
                  <div className='t-portrait_customer_content_portrait'>
                    {
                      renderPortraitCustomer()
                    }
                  </div>
                </div>
              )
          }
        </>
      )}
    </div>
  );
}

PortraitCustomer.defaultProps = {
  type: undefined,
};

export default PortraitCustomer;
