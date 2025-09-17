/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-case-declarations */
/* eslint-disable no-plusplus */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/no-unused-vars */

import Icon from 'components/atoms/Icon';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import ListCategoriesResult from 'components/molecules/ListCategoriesResult';
import RenderExaminationResult, { ResultType } from 'components/templates/RenderExaminationResult';
import _ from 'lodash';
import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useMutation } from 'react-query';
import { getExamDiseaseReport, getResultDetailCustomer, getResultDetailCustomer2, postPrintAllreport, postPrintAnesthesia, postPrintBreathtest, postPrintEcgs, postPrintEndoscopics, postPrintErms, postPrintGynecologies, postPrintLabtest, postPrintMolecule, postPrintOsteoporosis, postPrintPrescriptions, postPrintServicepoint, postPrintSupersonics, postPrintVaccine, postPrintXrays } from 'services/api/customerInfo';
import { getCategoriesCustomer } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers, { downloadBlobPDF, previewBlobPDFOpenLink } from 'utils/functions';

interface CategoriesCustomerProps {
  id: string,
  cid?:string
}
const dataEX1: any[] = [];
const dataEX2: any[] = [];
let dataE = ""
let dataST = ""
let dataST2 = ""
const CategoriesCustomer: React.FC<CategoriesCustomerProps> = ({ id ,cid}) => {
  const dispatch = useAppDispatch();
  const customerInfo = useAppSelector((state) => state.infosCustomer.respCustomerInfo);
  const listCategoriesCustomer = useAppSelector((state) => state.infosCustomer.resultsCategories);
  const resultsCategorieLoading = useAppSelector((state) => state.infosCustomer.resultsCategorieLoading);
  console.log(customerInfo)
  const [categoriesLoading, setCategoriesLoading] = useState(resultsCategorieLoading);
  const [listCategories, setListCategories] = useState(listCategoriesCustomer);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [error, setError] = useState('');
  const [isPrint, setIsPrint] = useState(false);
  const [dataRender, setDataRender] = useState<any>();
   const [dataEX, setDataEX] = useState<any[]>([]);
  const [dataServiceType, setDataServiceType] = useState<any>("");

  const [dataPrint, setDataPrint] = useState<any>();
  const [isPrintOption, setIsPrintOption] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [toggle, setToggle] = useState(!listCategories?.data?.length || false);
  console.log(dataPrint)
const { mutate: getDetailResultByCustomerById } = useMutation(
    'post-footer-form',
    (data1: any) => getResultDetailCustomer2(data1),
    {
        onSuccess: (data) => {
            setIsSuccess(true);
            if (data?.status) {
                // Kiểm tra lại nếu dữ liệu đã tồn tại trước khi thêm vào mảng
                setDataEX((prevDataEX) => {
                   
                        return [...prevDataEX, data.data];
                  
                });
              
              dataEX1.push({
                service_group_type: dataST,
                data: data.data,
                id: dataE
              })
                setDataRender(data?.data);
            } else {
                setError(data?.message);
                setDataRender(undefined);
            }
        },
        onError: (error) => {
            console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
        },
    }
);

  const { mutate: getExamDiseaseReportByMasterId } = useMutation(
    'post-footer-form',
    (data: any) => getExamDiseaseReport(data),
    {
      onSuccess: (data) => {
        setIsSuccess(true)
        if (data?.status) {
           dataEX2.push({
                service_group_type: dataST2,
                data: data.data
              })
          setDataRender(data?.data);
        } else {
          setError(data?.message);
          setDataRender(undefined);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  const { mutate: postPrintAll } = useMutation(
    'post-footer-form',
    (data: any) => postPrintAllreport(data),
    {
      onSuccess: (data) => {
        if (data?.status) {
          setIsPrint(false);
          downloadBlobPDF(data?.data, `${customerInfo?.data?.customer?.customer_fullname}`);
        } else {
          setError(data?.message);
        }
      },
      onError: (error) => {
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );

  // In phieu ket qua Xet Nghiem
  const { mutate: postPrintResult } = useMutation(
    'post-footer-form',
    (data: any) => {
      const { type, ...prevData } = data;

      switch (type) {
        case 'GPB':
        case 'PCD': return postPrintServicepoint({ master_id: prevData?.master_id });
        case 'DT': return postPrintEcgs(prevData);
        case 'XQ': return postPrintXrays(prevData);
        case 'SA': return postPrintSupersonics(prevData);
        case 'NS': return postPrintEndoscopics(prevData);
        case 'XNHT': return postPrintBreathtest(prevData);
        case 'XN': return postPrintLabtest(prevData);
        case 'TDV': return postPrintPrescriptions(prevData);
        case 'EMR': return postPrintErms(prevData);
        case 'KHAMPK': return postPrintGynecologies(prevData);
        case 'VACCINE': return postPrintVaccine(prevData);
        case 'XNSHPT': return postPrintMolecule(prevData);
          case 'SLLX': return postPrintOsteoporosis(prevData);
        default:
          return postPrintAnesthesia(prevData);
      }
    },
    {
      onSuccess: (data) => {
        if (data?.status) {
          setIsPrintOption(false);
          downloadBlobPDF(data?.data, `${customerInfo?.data?.customer?.customer_fullname}-${type}`);
        } else {
          setError(data?.message);
          setIsPrintOption(false);
        }
      },
      onError: (error) => {
        setIsPrintOption(false);
        console.error('🚀 ~ file: index.tsx:159 ~ error:', error);
      },
    },
  );
  
  const handleSetResult = async (body: any) => {
    const request = {
        ...body,
       master_id: id,
       customer:customerInfo?.data?.customer
    };
    setError('');
   
    await getDetailResultByCustomerById(request);
//  const existingData1 = dataEX1.find((item: any) => (item.service_group_type === request.service_group_type && item.id === request.id));
//     dataST = request.service_group_type
//     dataE = request.id
//     if (existingData1) {
//         setDataRender(existingData1.data); // Gán dữ liệu nếu đã tồn tại
//     } else {
//         setIsSuccess(false);
//         await getDetailResultByCustomerById(request);
//     }
};
  const handlePrintResult = async () => {
    const body = {
      customer: {
        ...customerInfo?.data?.customer,
      },
      master_id: id,
    };
    setIsPrint(true);
    await postPrintAll(body);
  };

  const handlePrintCategory = async () => {
    const bodyPublic = {
      type: dataPrint?.service_group_type,
      master_id: id,
      service_group_type: dataPrint?.service_group_type,
      id: dataPrint?.id,
    }
    console.log(bodyPublic, dataPrint)
    setIsPrintOption(true)
    postPrintResult(bodyPublic)
  };
  console.log(dataPrint)
  useEffect(() => {
    setListCategories(listCategoriesCustomer);
    setToggle(!listCategoriesCustomer?.data?.length)
  }, [listCategoriesCustomer?.data])

  useEffect(() => {
    setCategoriesLoading(resultsCategorieLoading);
  }, [resultsCategorieLoading])

  useLayoutEffect(() => {
    // console.log("id", listCategories, id)
    // if (!listCategories?.data && id) {
    const body = {
      master_id: id
    }
      dispatch(getCategoriesCustomer(body));
    // }
  }, [])

  const handleGetReportExaminationDisease = async (body: any) => {
     const existingData2 = dataEX2.find((item: any) => item.service_group_type === body.master_id);
  dataST2 = body.master_id
    if (existingData2) {
        setDataRender(existingData2.data); // Gán dữ liệu nếu đã tồn tại
    } else {
        console.log("Dữ liệu chưa tồn tại, gọi API...");
       
      setIsSuccess(false);
    await getExamDiseaseReportByMasterId(body);
    }

  }
  console.log("dataEX1", listCategories)
  const memoryCategory = useMemo(() => (
    <div className="o-categories_customer_left">
      <ListCategoriesResult
        response={listCategories}
        masterId={id}
        isRenderOne
        handleGetBody={(body: any, type: ResultType) => {
          if (type === 'overview') {
            handleGetReportExaminationDisease(body)
          } else {
            handleSetResult(body);
          }
          // setIsSuccess(false);
        }}
        handleType={(resp: string) => {
          setType(resp);
        }}
        handleTitle={(val: string) => {
          setTitle(val); setError('');
        }}
        handleRespDataToPrint={(data: any) => {
          setDataPrint(data);
        }}
        handlePrintResult={handlePrintResult}
        isPintAll={isPrint}
        customer_id={cid}
      />

    </div>
  ), [listCategoriesCustomer, listCategories?.data,isPrint])

  return (
    listCategories?.data ?
      <div className={mapModifiers("o-categories_customer", toggle && 'close')}>
        {memoryCategory}
        <div className="o-categories_customer_right">
          {
            window.innerWidth < 1280 &&
            <div className="o-categories_customer_right_toggle">
              <Icon iconName={!toggle ? "menu_fold" : "menu_unfold"} onClick={() => setToggle(!toggle)} />
            </div>
          }
      {title.trim() ? ( 
            <div className="o-categories_customer_right_result">
              <RenderExaminationResult
                type={type as any}
                data={dataRender}
                title={title}
                masterId={(listCategories?.data || [])[0]?.master_id}
                registerDate={(listCategories?.data || [])[0]?.register_date}
                error={error}
                handlePrint={handlePrintCategory}
                isPrintOption={isPrintOption}
                isRenderDone={isSuccess}
              />
            </div>
       ) : null}

        </div>
      </div>
      : categoriesLoading ? <div className={mapModifiers('o-categories_customer_loading',)} >
        <Loading />
      </div>
        : <div className={mapModifiers('o-categories_customer_loading',)} >
          <Typography content="Không tìm thấy thông tin kết quả khám gần nhất" />
        </div>

  );
};

CategoriesCustomer.defaultProps = {
};

export default CategoriesCustomer;
