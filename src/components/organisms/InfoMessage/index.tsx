/* eslint-disable @typescript-eslint/no-unused-vars */
import Loading from 'components/atoms/Loading';
import CTabs, { TabItemType } from 'components/molecules/CTabs';
import FormAddContact from 'components/molecules/FormBooking';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import { useMutation } from 'react-query';
import { toast } from 'react-toastify';
import { postSaveCustomerBeforeExams } from 'services/api/beforeExams';
import { useAppDispatch, useAppSelector } from 'store/hooks';

interface InfoMessageProps {

}

const InfoMessage: React.FC<InfoMessageProps> = ({ }) => {
  const dispatch = useAppDispatch();
  const infoAffiliate = useAppSelector((state) => state.pancake.infoAds);

  const getRoles = localStorage.getItem('roles');
  const [listRoles, setListRoles] = useState(getRoles ? JSON.parse(getRoles) : '');

  const [addContactSucces, setAddContactSucces] = useState(false)
  const [adsInfo, setAdsInfo] = useState(infoAffiliate);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setAdsInfo(infoAffiliate);
  }, [infoAffiliate])

  const { mutate: postSaveCustomer } = useMutation(
    'post-footer-form',
    (data: any) => postSaveCustomerBeforeExams(data),
    {
      onSuccess: (data) => {
        if (data.status) {
          toast.success(data.message);
          setAddContactSucces(true);
          setIsLoading(false);
        } else {
          toast.error(data.message);
        }
      },
      onError: (e) => {
        toast.error('Đã có lỗi xảy ra ...!');
      },
    },
  );

  const handleSubmitFormContact = (data: any) => {
    try {
      setIsLoading(true)
      const newData = {
        ...data,
        customer: {
          ...data.customer,
          facebook_ads_id: adsInfo?.id_ads ?? '',
          facebook_ads_title: adsInfo?.title_ads ?? '',
          facebook_ads_image: adsInfo?.image_ads ?? '',
        }
      }
      postSaveCustomer(newData);
    } catch (error) {
      console.log("🚀 ~ file: index.tsx:74 ~ handleSubmitFormContact ~ error:", error)
    }
  }

  const handleLogin = () => {
    window.FB.login((response: any) => {
      if (response.authResponse) {
        const userAccessToken = response.authResponse.accessToken;

        window.FB.api("/me/accounts", { access_token: userAccessToken }, (resp: any) => {
          if (resp && resp.data && resp.data.length > 0) {
            const fanpages = resp.data;
            console.log(" 🚀- DaiNQ - 🚀: -> window.FB.api -> fanpages:", fanpages)

            const url = `https://www.facebook.com/dialog/manage_pages?app_id=${fanpages[0].id}&scope=manage_pages&response_type=${fanpages[0].access_token}`;

            // Mở popup
            window.open(url, 'Manage Pages', 'width=600,height=400');

            // Sau khi người dùng cấp quyền, bạn có thể tiếp tục xử lý tại đây
          } else {
            console.log("User does not manage any pages.");
          }
        });
      } else {
        console.log("Login cancelled");
      }
    });
  };


  const OptionTab = [
    {
      key: 2,
      label: 'Chuyển đổi',
      children: listRoles?.some((role: any) => role?.role_name === 'robot')
        ? <div style={{ display: 'flex', justifyContent: 'center' }}><button onClick={handleLogin}> Đăng nhập facebook</button></div>
        : (isLoading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 'calc(100vh - 200px)' }}>
          <Loading variant="max_content" />
        </div> : <FormAddContact handleSubmitForm={handleSubmitFormContact} isSuccess={addContactSucces} handleReset={() => setAddContactSucces(false)} />),
    },
  ];
  return (
    <div className="m-info_message">

      <CTabs
        options={OptionTab as unknown as TabItemType[]}
        defaultActiveKey="0"
        position="top"
        size="small"
        handleOnTabClick={(data: any) => {

        }}
      />
    </div>
  );
};

InfoMessage.defaultProps = {
};

export default InfoMessage;
