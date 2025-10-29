/* eslint-disable consistent-return */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import Button from 'components/atoms/Button';
import Icon from 'components/atoms/Icon';
import Typography from 'components/atoms/Typography';
import CCollapse from 'components/organisms/CCollapse';
import { ResultType } from 'components/templates/RenderExaminationResult';
import _ from 'lodash';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import mapModifiers from 'utils/functions';

interface ListCategoriesResultProps {
  response?: any;
  isRenderOne?: boolean;
  isPintAll?: boolean;
  handleGetBody?: (data: any, type: ResultType) => void;
  handleType?: (data: string) => void;
  handleTitle: (data: string) => void;
  handleRespDataToPrint?: (data: any) => void;
  handleClick?: () => void;
  handlePrintResult?: (id: any) => void;
  customer_id?: string;
  masterId?: string;
}

const ListCategoriesResult: React.FC<ListCategoriesResultProps> = ({
  response, isRenderOne, handleGetBody, handleType, handleTitle, handleRespDataToPrint, handleClick, handlePrintResult, isPintAll,customer_id,masterId
}) => {
  const [datas, setDatas] = useState(response);
  useEffect(() => { setDatas(response); }, [response]);
  console.log("sss",datas)
  const renderMenuBar = (responses: any) => {
    console.log("🚀 ~ responses:", responses)
    return  (
      <>
        {/* <div
          className="m-list_categories_item"
          onClick={(e) => {
            console.log("🚀 ~ responses:", responses)
            if (handleTitle) handleTitle('Tổng kết hồ sơ sức khỏe');
            if (handleType) handleType('overview');
            if (handleGetBody) {
              const body = {
                master_id: responses?.master_id,
              }
  
              handleGetBody(body, 'overview')
            }
          }}
        >
          <div className="m-list_categories_item_title">
            <Icon iconName="list_note" />
            <Typography content={'Tổng kết hồ sơ sức khỏe'} />
          </div>
        </div> */}
        {
        responses.data?.map((item: any, index: any) => (
            <div
              key={index}
              className="m-list_categories_item"
              onClick={(e) => {
                if (_.isEmpty(item.items)) {
                  if (handleClick) handleClick();
                  if (handleTitle) handleTitle(item.group_result_name);
                  console.log(item)
                   if (handleRespDataToPrint) handleRespDataToPrint({
                     master_id: item?.master_id,
                     service_group_type: item?.service_group_type,
                     id: ''
                   });
                  if (handleType) handleType(item.service_group_type);
                  const body = {
                    customer_id:customer_id,
                    master_id: item?.master_id,
                    service_group_type: item.service_group_type,
                    id: item.group_result_id,
                  };
                  console.log("🚀 ~ body:", body,datas)
                  if (handleGetBody) {
                    handleGetBody(body, 'PCD');
                  }
                }
              }}
            >
              <div className="m-list_categories_item_title">
                <Icon iconName="list_note" />
                <Typography content={item.group_result_name} />
              </div>
              {
                !_.isEmpty(item.items) ? item.items.map((children: any) => (
                  <div
                    className="m-list_categories_child"
                    key={children.id}
                    onClick={(e) => {
                      if (handleTitle) handleTitle(children.name);
                      if (handleType) handleType(children.service_group_type);
                      console.log(children,responses)
                      if (handleRespDataToPrint) handleRespDataToPrint({
                        master_id: responses?.master_id,
                        service_group_type: children.service_group_type,
                        id: children.id,
                      });
                      const body = {
                        customer_id:customer_id,
                        master_id: item?.master_id,
                        service_group_type: children.service_group_type,
                        id: children.id,
                      };
                      if (handleGetBody) {
                        handleGetBody(body, 'PCD');
                      }
                    }}
                  >
                    <p>{children.name}</p>
                    
                    <span className={mapModifiers('m-list_categories_child')} style={{color:children?.status?.status === "done" ?"#28a745" :"#ff0000" }}>
                      {children?.status?.displayname}
                    </span>
                 
                  </div>
                )) : null
              }
            </div>
          ))
        }
      </>
    );
  }
  return (
    <div className="m-list_categories">
      {
        isRenderOne ? (
      
     
      
                <div >
                  {renderMenuBar(datas)}
                  <div className="m-list_categories_btn">
                  <Button className="m-form_note"
                    isLoading={isPintAll}
                    disabled={isPintAll}
                    modifiers={['primary']} onClick={() => {
                       if (handlePrintResult) handlePrintResult(masterId as any)
                    }}>
                    <Typography type="span" modifiers={['400', '16x24']} content="Tải kết quả (PDF)" />
                  </Button>
                </div>
                </div>
              
            
        
        ) : (
          !_.isEmpty(datas) && datas?.map((i: any, idx: any) => (
            <div key={idx} className="m-list_categories_collapse">
              <CCollapse title={`${i?.register_date && moment(i?.register_date).format('HH:mm - DD/MM/YYYY')} &nbsp; (#${i?.master_id}) ${i?.is_re_exams ? 'Tái khám' : ''}`} key_default="1">
                {renderMenuBar(i)}
                <div className="m-list_categories_btn">
                  <Button className="m-form_note"
                    isLoading={isPintAll}
                    disabled={isPintAll}
                    modifiers={['primary']} onClick={() => {
                      if (handlePrintResult) handlePrintResult(i?.master_id as any)
                    }}>
                    <Typography type="span" modifiers={['400', '16x24']} content="Tải kết quả (PDF)" />
                  </Button>
                </div>
              </CCollapse>
            </div>
          ))
        )
      }
    </div>
  );
};

ListCategoriesResult.defaultProps = {
};

export default ListCategoriesResult;
