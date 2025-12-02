/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
/* eslint-disable max-len */
/* eslint-disable react/no-array-index-key */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { Spin } from 'antd';
import { interactionHistoryType } from 'assets/data';
import GroupRadio, { GroupRadioType } from 'components/atoms/GroupRadio';
import Loading from 'components/atoms/Loading';
import Typography from 'components/atoms/Typography';
import RichTextEditor from 'components/molecules/RichTextEditor';
import moment from 'moment';
import React, { useEffect, useLayoutEffect, useState } from 'react';
import { NotesItem } from 'services/api/beforeExams/types';
import { getListNotes,  } from 'store/customerInfo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import mapModifiers from 'utils/functions';

interface InteractionHistoryProps {
  options: any;
  id: string;
  isPopup?: boolean;
  loadingNote?: boolean;
  get5Item?: boolean;
  typeNote?: GroupRadioType;
  handleChangeType?: (item: GroupRadioType) => void;
  chatBox?: React.ReactNode;
}

const InteractionHistoryCV: React.FC<InteractionHistoryProps> = ({ options, id, isPopup, get5Item, loadingNote, handleChangeType, typeNote ,chatBox}) => {
  const dispatch = useAppDispatch();


  const listNotesCustomer = useAppSelector((state) => state.infosCustomer.noteLog);

  const [data, setData] = useState(listNotesCustomer.data);
  const [loading, setLoading] = useState(loadingNote);



  useEffect(() => { setData(options); }, [options]);
  useEffect(() => { setData(listNotesCustomer.data); }, [listNotesCustomer]);

  useEffect(() => {
    setLoading(loadingNote);
  }, [loadingNote]);
  console.log(data,listNotesCustomer.data,id)
  return (
    <div className={mapModifiers("o-interact_history", isPopup && 'popup')} >
     
        {chatBox}
      {/* <div className={mapModifiers("o-interact_history_type")}>
        <GroupRadio options={interactionHistoryType} value={typeNote} handleOnchangeRadio={(item) => {
          if (handleChangeType) {
            handleChangeType(item)
          }
        }} />
      </div> */}
      <div className={mapModifiers("o-interact_history_content", isPopup && 'popup')}>
        {loading ? (
          <div className="o-interact_history_content_loading">
            <Spin spinning size='default' />
          </div>
        ) : data?.length ? data.map((note,index:any) => (
          <div className={mapModifiers('o-interact_history_content_item',)} key={index}>
            <div className="o-interact_history_content_item_person">
              <Typography content={note.user_displayname} />
              <div className={mapModifiers('o-interact_history_content_item_person_bottom')}>
              
                <span>{moment(note.node_datetime).format('HH:mm - DD/MM/YYYY')}</span>
              </div>
            </div>
            <div className="o-interact_history_content_item_note">
              <RichTextEditor data={note.cs_node_content} isDisabled typeText='notHeadernotBordernotBGBoxShadown' />
            </div>
          </div>
        )) : <div className={mapModifiers('o-interact_history_content_empty',)} >
          <Typography content="Không tìm thấy tương tác" />
        </div>}
      </div>
    </div>
  );
};

InteractionHistoryCV.defaultProps = {
  isPopup: false,
};

export default InteractionHistoryCV;
