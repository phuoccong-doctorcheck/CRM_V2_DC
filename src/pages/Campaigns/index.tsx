/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin } from 'antd';
import { sendMessagetype } from 'assets/data';
import Button from 'components/atoms/Button';
import CTooltip from 'components/atoms/CTooltip';
import Dropdown, { DropdownData } from 'components/atoms/Dropdown';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Icon from 'components/atoms/Icon';
import Input from 'components/atoms/Input';
import Switchs from 'components/atoms/Switchs';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import FormAddMarketingCampaign, { AMOUNT_SMS, CampaignFormType } from 'components/molecules/FormAddMarketingCampaign';
import CDrawer from 'components/organisms/CDrawer';
import CModal from 'components/organisms/CModal';
import MemoizedResultCampaignSMS from 'components/organisms/ResultCampaignSms';
import PublicHeader from 'components/templates/PublicHeader';
import PublicLayout from 'components/templates/PublicLayout';
import moment from 'moment';
import React, { useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { getCampaignLogs, getCampaigns, getSMSTemplates, postMakeOrUpdateCampaigns, postSendCampaign } from 'services/api/point';
import { TemplateSMSItem } from 'services/api/point/types';
import mapModifiers from 'utils/functions';


const Campaigns: React.FC = () => {
  const [listCampaign, setListCampaign] = useState([]);
  const [listCampaignDetail, setListCampaignDetail] = useState([]);
  const [campaignDetail, setCampaignDetail] = useState<any>();
  const [states, setStates] = useState({
    isOpenDetailCampaign: false,
    isLoadingGetDetailCampaign: 0,
    isOpenDrawer: false,
  })
  const [campaign, setCampaign] = useState({
    isOpen: false,
    isOpenAddOrUpdate: false,
    isUpdate: false,
    nameCampaign: '',
    statusCampaign: false,
    id: 0,
  })
  const [templateSMS, setTemplateSMS] = useState<DropdownData[]>();
  const [dataFromExcel, setDataFromExcel] = useState<CampaignFormType[]>([]);

  const [sendSMS, setSendSMS] = useState({
    openModal: false,
    type: '',
    listCS: [],
    campaignType: sendMessagetype[0] as unknown as GroupRadioType,
    template: undefined as unknown as DropdownData,
    campaign: undefined as unknown as DropdownData,
    content: '',
    subject: '',
  })

  const [sendSMSEror, setSendSMSError] = useState({
    subject: '',
    template: '',
    content: '',
    campaign: ''
  });

  const [dataCampaign, setDataCampaign] = useState({
    data: undefined as unknown as DropdownData[],
    dropdown: undefined as unknown as DropdownData[],
  });

  useLayoutEffect(() => {
    getCampaign();
    getTemplateSMSOfCampaign();
 
    document.title = 'Chiến dịch| CRM'


  }, [])

  /* API */
  const { mutate: getCampaign } = useMutation(
    'post-footer-form',
    () => getCampaigns(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setListCampaign(data?.data);
          const newCampaign = await data?.data?.map((item: any) => {
            return {
              id: item.campaign_id,
              label: item.campaign_name,
              value: item.campaign_id,
              active: item.is_active,
            }
          }).filter(Boolean);
          setDataCampaign({
            data: newCampaign,
            dropdown: data?.data?.map((item: any) => {
              if (!item.is_active) return;
              return {
                id: item.campaign_id,
                label: item.campaign_name,
                value: item.campaign_id,
                active: item.is_active,
              }
            }).filter(Boolean)
          });
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getCampaignDetail } = useMutation(
    'post-footer-form',
    (body: any) => getCampaignLogs(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setStates({ ...states, isOpenDetailCampaign: true, isLoadingGetDetailCampaign: 0 });
          setListCampaignDetail(data?.data);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: createOrUpdateCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postMakeOrUpdateCampaigns(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          getCampaign();
          setCampaign({
            ...campaign,
            isOpenAddOrUpdate: false,
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: getTemplateSMSOfCampaign } = useMutation(
    'post-footer-form',
    () => getSMSTemplates(),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          setTemplateSMS(data?.data?.map((item: TemplateSMSItem) => {
            if (!item.is_used) return;
            return {
              id: item.id,
              label: item.name,
              value: item.content,
              sms_count: item.sms_count,
            }
          }))
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: sendCampaign } = useMutation(
    'post-footer-form',
    (body: any) => postSendCampaign(body),
    {
      onSuccess: async (data) => {
        if (data?.status) {
          toast.success(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        } else {
          toast.error(data?.message);
          setSendSMS({
            ...sendSMS,
            openModal: false,
            template: undefined as unknown as DropdownData,
            campaign: undefined as unknown as DropdownData,
            content: '',
            subject: '',
          })
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  /* API */

  const handleAddOrUpdateCampaign = () => {
    if (!campaign.nameCampaign.trim()) {
      toast.error('Vui lòng nhập tên chiến dịch');
      return;
    }
    const body = {
      campaign_id: campaign.id,
      campaign_name: campaign.nameCampaign,
      is_active: campaign.statusCampaign,
    }

    createOrUpdateCampaign(body)
  }

  const handleValidateSendMessage = () => {
    if (sendSMS.campaignType?.value === 'SMS') {
      if (!sendSMS.subject.trim() || !sendSMS.template || !sendSMS.campaign) {
        setSendSMSError({
          ...sendSMSEror,
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          template: !sendSMS.template ? 'Cần chọn template để gửi tin nhắn' : '',
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : ''
        })
        return false;
      }
      return true;
    } else {
      if (!sendSMS.subject.trim() || !sendSMS.content?.trim()) {
        setSendSMSError({
          ...sendSMSEror,
          campaign: !sendSMS.campaign ? 'Vui lòng chọn 1 chiến dịch' : '',
          subject: !sendSMS.subject.trim() ? 'Tiêu đề là bắt buộc để gửi tin nhắn' : '',
          content: !sendSMS.content?.trim() ? 'Cần nhập nội dung tin nhắn để gửi tin nhắn' : ''
        })
        return false;
      }
      return true;
    }
  }

  const handleExcuteSendMessage = () => {
    if (!handleValidateSendMessage()) return;
     const formattedTemplateValue = sendSMS.template.value && sendSMS.template.value.endsWith('02856789999')
  ? sendSMS.template.value.replace('02856789999', '028 56789999') // Thay thế số điện thoại
  : sendSMS.template.value; // Giữ nguyên nếu không khớp
    const to = listCampaignDetail
      .filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))
      .map((i: any) => {
        return { customer_ref: i.customer_ref,current_point: i?.use_points, ago_month:0 };
      });

    const body = {
      send_date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      campaign_id: sendSMS.campaign?.value,
      method: sendSMS.campaignType.value,
      template_id: sendSMS.template.id || '',
      content: sendSMS.campaignType.value === "SMS" ? formattedTemplateValue?.replace('&', 'va') : sendSMS.content?.replace('&', 'va'),
      to: to,
    }
    sendCampaign(body);
  }

  /* Column */
  const memoryTableCampaign = useMemo(() => {
    return (
      listCampaign?.map((item: any) => (
        <div className={mapModifiers("p-campaign_table_item", states.isLoadingGetDetailCampaign === item.campaign_id && 'loading')} key={item?.campaign_id} >
          <span className={mapModifiers('p-campaign_table_item_status', item?.is_active ? 'active' : 'disable')} ></span>
          {states.isLoadingGetDetailCampaign === item.campaign_id ?
            <Spin tip="Tải dữ liệu..." />
            : (
              <>
                <div className="p-campaign_table_item_paragraph" onClick={() => {
                    setCampaignDetail(item);
                    setStates({
                      ...states, isLoadingGetDetailCampaign: item.campaign_id,
                    })
                    const body = {
                      campaign_id: item?.campaign_id,
                      status: "ok",
                    }
                    getCampaignDetail(body);
                      }}>
                  <p>{item?.campaign_name}</p>
                </div>
                <div className="p-campaign_table_item_action">
                  <CTooltip placements="top" title="Danh sách KH đã gửi">
                    <div>
                      <Icon iconName={"detail_crm"} size="24x24" isPointer onClick={() => {
                    setCampaignDetail(item);
                    setStates({
                      ...states, isLoadingGetDetailCampaign: item.campaign_id,
                    })
                    const body = {
                      campaign_id: item?.campaign_id,
                      status: "ok",
                    }
                    getCampaignDetail(body);
                      }} />
                    </div>
                  </CTooltip> 
                  <CTooltip placements="top" title="Sửa chiến dịch">
                 <div> <Icon iconName="edit_crm" size="24x24" isPointer onClick={() => setCampaign({
                    ...campaign,
                      isOpenAddOrUpdate: true,
                      isUpdate: true,
                      nameCampaign: item.campaign_name,
                      statusCampaign: item?.is_active,
                      id: Number(item.campaign_id),
                      })} />
                    </div>
                  </CTooltip>  
                </div>
              </>
            )
          }
        </div>
      ))
    )
  }, [listCampaign, states])

  return (
    <div className='p-campaign'>
      <PublicLayout>
        <PublicHeader
          titlePage={'Chiến dịch'}
          handleGetTypeSearch={() => { }}
          handleFilter={() => { }}
          handleCleanFilter={() => { }}
          isHideFilter
          isHideService
          className='p-campaign_header'
          isDial={false}
          isHideEmergency
          isHideCleanFilter
          listBtn={(
            <>
              <Button modifiers={['foreign']} onClick={() => {
                setStates({
                  ...states, isOpenDrawer: true,
                });
              }}>
                <Typography content='Gửi tin nhắn từ file' modifiers={['400']} />
              </Button>
              <Button onClick={() => {
                setCampaign({
                  ...campaign,
                  isOpenAddOrUpdate: true,
                  isUpdate: false,
                  nameCampaign: '',
                  statusCampaign: false,
                })
              }}>
                <Typography content='Thêm mới' modifiers={['400']} />
              </Button>
            </>
          )}
        />
        <div className='p-campaign_table'>
          {memoryTableCampaign}
        </div>
      </PublicLayout>
      <CDrawer
        isOpen={states.isOpenDetailCampaign}
        positon='bottom'
        height={'95vh'}
        handleOnClose={() => {
          setStates({
            ...states, isOpenDetailCampaign: false,
          });
          setCampaignDetail(undefined);
        }}
        titleHeader={`Kết quả: ${campaignDetail?.campaign_name}`}
        isHaveHeader
        isHaveHeaders
      >
        <div className='p-campaign_info'>
          <div className='p-campaign_info_header'>
            <div className='p-campaign_info_header_left'>
              <div className='p-campaign_info_header_item'>
                <span>Tin nhắn gửi thành công: </span>
                <p>{listCampaignDetail.filter((i: any) => i?.status === "OK")?.length}</p>
              </div>
              <div className='p-campaign_info_header_item'>
                <span>Tin nhắn gửi thất bại: </span>
                <p>{listCampaignDetail.filter((i: any) => i?.status !== "OK")?.length}</p>
              </div>
              <div className='p-campaign_info_header_item'>
                <span>Chi phí: </span>
                <p>{listCampaignDetail?.reduce((init: any, item: any) => init + item?.cost, 0)?.toLocaleString('vi-VN')}</p>
              </div>
            </div>
            <div className='p-campaign_info_header_right'>
              {listCampaignDetail.filter((i: any) => i?.status !== "OK")?.length > 0 &&
                <Button modifiers={['red']} onClick={() => {
                  setSendSMS({
                    ...sendSMS,
                    openModal: true,
                  })
                }}>
                  <Typography content='Tiếp tục với danh sách thất bại' />
                </Button>
              }
            </div>
          </div>
          <div className='p-campaign_info_table'>
            <MemoizedResultCampaignSMS
              listCampaignDetail={listCampaignDetail}
            />
          </div>
        </div>
      </CDrawer>
      <CModal
        isOpen={sendSMS.openModal}
        title="Gửi tin nhắn"
        widths={600}
        textCancel='Thoát'
        textOK='Tiến hành gửi tin nhắn'
        onCancel={() => setSendSMS({
          ...sendSMS, openModal: false,
          listCS: [],
          campaignType: sendMessagetype[0] as unknown as GroupRadioType,
          template: undefined as unknown as DropdownData,
          campaign: undefined as unknown as DropdownData,
          content: '',
          subject: '',
        })}
        onOk={handleExcuteSendMessage}
      >
        {sendSMS.template && sendSMS.campaignType.value === "SMS" &&
          <div className='p-customer_leads_form_sms_header'>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Khách đã chọn:</span> <p>{listCampaignDetail.filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))?.length}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Số tin nhắn (SMS) mỗi Khách:</span> <p>{sendSMS.template?.sms_count}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Tổng số tin nhắn (SMS) gởi đi:</span> <p>{listCampaignDetail.filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))?.length * sendSMS.template?.sms_count}</p>
            </div>
            <div className='p-customer_leads_form_sms_header_item'>
              <span>Tổng tiền dự kiến:</span> <p>{Number(listCampaignDetail.filter((i: any) => i?.status !== "OK" && !!i.customer_phone?.replace('+84-', '0')?.match(/^(03|05|07|08|09)\d{8}$/))?.length * sendSMS.template?.sms_count * AMOUNT_SMS)?.toLocaleString('vi-VN')} VNĐ</p>
            </div>
          </div>
        }
        <div className='p-customer_leads_form_sms'>
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
          <Dropdown label='Chiến dịch' dropdownOption={dataCampaign.dropdown || []} variant='simple' isRequired error={sendSMSEror.campaign} values={sendSMS.campaign} handleSelect={(item) => {
            setSendSMS({ ...sendSMS, campaign: item });
            setSendSMSError({ ...sendSMSEror, campaign: '', });
          }} />
          <Input label='Tiêu đề' variant='simple' isRequired error={sendSMSEror.subject} onChange={(event) => {
            setSendSMS({ ...sendSMS, subject: event?.target?.value });
            setSendSMSError({ ...sendSMSEror, subject: '', });
          }} />
          {sendSMS.campaignType?.value === 'SMS' &&
            <Dropdown label='Kịch bản' dropdownOption={templateSMS || []} variant='simple' isRequired error={sendSMSEror.template} values={sendSMS.template} handleSelect={(item) => {
              setSendSMS({ ...sendSMS, template: item });
              setSendSMSError({ ...sendSMSEror, template: '', });
            }} />
          }
          <TextArea error={sendSMSEror.content} label='Nội dung' id={''} readOnly={sendSMS?.campaignType?.value === 'SMS'} isResize value={sendSMS?.campaignType?.value === 'SMS' ? sendSMS.template?.value : sendSMS?.content}
            handleOnchange={(event) => {
              setSendSMS({ ...sendSMS, content: event?.target?.value });
              setSendSMSError({ ...sendSMSEror, content: '', });
            }}
          />
        </div>
      </CModal>
      <CModal
        isOpen={campaign.isOpenAddOrUpdate}
        title={campaign.isUpdate ? "Cập nhật thông tin chiến dịch" : "Thêm mới chiến dich"}
        onCancel={() => setCampaign({
          ...campaign,
          isOpenAddOrUpdate: false,
          id: 0,
        })}
        textCancel='Thoát'
        textOK={campaign.isUpdate ? 'Cập nhật' : 'Thêm mới'}
        onOk={handleAddOrUpdateCampaign}
      >
        <Input
          isRequired
          label='Tên chiến dịch'
          placeholder='Nhập tên chiến dịch'
          variant='simple'
          value={campaign.nameCampaign}
          onChange={(event) => setCampaign({
            ...campaign,
            nameCampaign: event.target.value
          })}
        />
        <Switchs
          label='Trạng thái'
          checked={campaign.statusCampaign}
          onChange={(check: boolean, event: any) => {
            setCampaign({
              ...campaign,
              statusCampaign: check,
            })
          }} />
      </CModal>
      <CDrawer
        isOpen={states.isOpenDrawer}
        positon='left'
        widths={dataFromExcel?.length ? 1100 : 540}
        handleOnClose={() => {
          setStates({
            ...states, isOpenDrawer: false,
          });
          setCampaignDetail(undefined);
        }}
      >
        <FormAddMarketingCampaign
          campaigns={listCampaign.map((i: any) => {
            if (i?.is_active) {
              return ({
                id: i.campaign_id,
                label: i.campaign_name,
                value: i.campaign_id,
              })
            }
            return;
          }).filter(Boolean) as DropdownData[]}
          isClose={states.isOpenDrawer}
          handleOnClose={() => {
            setStates({
              ...states, isOpenDrawer: false,
            });
          }}
          templateSMS={templateSMS}
          handleSubmit={() => {
            toast.info('Tính năng này đang được phát triển!.');
            setStates({
              ...states, isOpenDrawer: false,
            });
          }}
          dataOnChange={(data) => setDataFromExcel(data)}
        />
      </CDrawer>
    </div>
  );
}

export default Campaigns;
