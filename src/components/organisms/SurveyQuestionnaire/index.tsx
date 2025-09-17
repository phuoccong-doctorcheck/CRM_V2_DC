/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { surveyExample } from 'assets/data';
import Checkbox from 'components/atoms/Checkbox';
import Input from 'components/atoms/Input';
import TextArea from 'components/atoms/TextArea';
import Typography from 'components/atoms/Typography';
import _ from 'lodash';
import React, { useEffect, useMemo, useState } from 'react';
import { useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

interface SurveyQuestionnaireProps {
}

const SurveyQuestionnaire: React.FC<SurveyQuestionnaireProps> = ({ }) => {
  const infoSurvey = useAppSelector((state) => state.infosCustomer.responseSurvey);
  const infosurveyNotices = useAppSelector((state) => state.infosCustomer.surveyNotices);

  const [dataSurvey, setDataSurvey] = useState(infoSurvey);
  const [dataSurveyNotices, setDataSurveyNotices] = useState(infosurveyNotices);

  const handleRenderAllowType = (data: any) => {
    switch (data?.type) {
      case "text": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          <TextArea value={data?.anwers} id={''} readOnly={false} />
        </div>
      );
      case "radio": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          {data?.child.length ? data?.child?.map((child: any) => {
            return (
              child?.child_type === 'text' ?
                (
                  <div className="o-survey_item-radio_child_custom" key={child?.child_id}>
                    <Typography content={child?.child_question} />
                    <Input value={child?.child_answer} variant="simple" multiple />
                  </div>
                ) :
                <div className="o-survey_item-radio_child" key={child?.child_id}>
                  <Typography content={child?.child_question} />
                  <div className="o-survey_item-radio_child_result">
                    <Checkbox label='Có' defaultChecked={child?.child_answer[1]} />
                    <Checkbox label='Không' defaultChecked={child?.child_answer[0]} />
                    <Checkbox label='Không rõ' defaultChecked={child?.child_answer[2]} />
                  </div>
                </div>
            )
          }) : null}
        </div>
      );
      case "group_radio": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          <div className={mapModifiers('o-survey_item-group_radio')}>
            {data?.child?.length ?
              data?.child?.map((child: any) => (
                <div className="o-survey_item-group_radio_child" key={child?.child_id}>
                  <Typography content={child?.title} />
                  <div className="o-survey_item-group_radio_child_result">
                    <Checkbox label='Có' defaultChecked={child?.anwers[0]} />
                    <Checkbox label='Không' defaultChecked={child?.anwers[1]} />
                  </div>
                </div>
              ))
              : null}
          </div>
        </div>
      );
      case "field": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          <div className={mapModifiers('o-survey_item-field_wrap')}>
            {data?.child.length ?
              data?.child.map((item: any) => (
                <div className='o-survey_item-field_item' key={item?.id}>
                  <Typography content={item?.title} />
                  <Input value={item?.anwser} variant="simple" />
                </div>
              ))
              : null}
          </div>
        </div>
      );
      case "text_row": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          {data?.child.length ? data?.child?.map((row: any, idx: any) => (
            <div className='o-survey_item-text_row_item' key={`${Math.floor(Math.random()) * 1000}-${idx}`}>
              {
                row?.child_answer.map((answer: any, index: any) => (
                  <div className='o-survey_item-text_row_item_feild' key={`${Math.floor(Math.random()) * 1000}-${index}`}>
                    <span>{answer?.title}</span>
                    <Input value={answer?.anwers} variant="simple" />
                  </div>
                ))
              }
            </div>
          )) : null}

        </div>
      );
      case "radio_custom": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          {data?.child?.length ? data?.child.map((y: any, idx: any) => (
            <div className='o-survey_item-radio_custom_wrap' key={idx}>
              <Typography content={y?.title} />
              <div className="o-survey_item-radio_custom_result" key={y?.child_id}>
                {y?.child_answer?.map((child: any, idx: any) => (
                  <Checkbox label={child?.title} defaultChecked={child?.anwers} key={idx} />
                ))}
              </div>
            </div>
          )) : null}
        </div>
      );
      case "yes_no": return (
        <div className={mapModifiers('o-survey_item', data?.type)}>
          <Typography content={`${data?.id}. ${data?.question}`} />
          <div className='o-survey_item-yes_no_result'>
            <Checkbox label='Có' defaultChecked={data?.anwser[0]} />
            <Checkbox label='Không' defaultChecked={data?.anwser[1]} />
          </div>
        </div>
      );
    }
  }

  useEffect(() => {
    setDataSurveyNotices(infosurveyNotices);
  }, [infosurveyNotices])

  useEffect(() => {
    setDataSurvey(infoSurvey);
  }, [infoSurvey])

  const memorySurvey = useMemo(() => (
    <div className="o-survey_list">
      {dataSurvey?.length ? dataSurvey.map((survey: any, index: any) => (
        handleRenderAllowType(survey)
      )) : null}
    </div>
  ), [infoSurvey]);

  const handleCheckCard = (card: any) => {
    const listkey: string[] = [];
    if (card) {
      for (const [key, value] of Object.entries(card)) {
        if (value && typeof value === 'boolean') {
          const prefix = key.split('_')[0];
          const checkKey = listkey.find(key => key === prefix);
          if (!checkKey) {
            listkey.push(prefix, key);
          } else {
            listkey.push(key);
          }
        }
      }
    }


    return (<>
      {listkey.length ? listkey.map((key, index) => {
        const getField = (surveyExample as any)[key];
        const checkKey = key.split('_');
        return (
          <li className={mapModifiers('o-survey_content_item', checkKey.length == 1 ? 'full' : 'normal')} key={index}>
            {checkKey.length == 1 ? (
              <Typography content={getField} modifiers={['600']} />
            ) : (
              <>
                <Typography content={getField} />
                <div className="o-survey_item-radio_child_result">
                  <Checkbox label='Có' defaultChecked />
                </div>
              </>
            )}
          </li>
        )
      }) : null}
    </>)
  }

  const render = () => {
    return (
      <div className="o-survey_note">
        <div className="o-survey_heading">
          <Typography content='NHỮNG DẤU HIỆU BẤT THƯỜNG CẦN LƯU Ý:' />
        </div>
        <ul className="o-survey_content">
          {handleCheckCard(dataSurveyNotices?.card)}
        </ul>
      </div>
    );
  }

  return (
    <div className={mapModifiers("o-survey", !_.isUndefined(infoSurvey?.data) ? '' : 'null')}>
      {!_.isUndefined(infoSurvey) ?
        <>
          {render()}
          {memorySurvey}
        </>
        : (<div className='t-portrait_customer_loading'>
          Không tìm thấy dữ liệu
        </div>)}

    </div>
  );
}

// SurveyQuestionnaire.defaultProps = {

// };

export default SurveyQuestionnaire;
