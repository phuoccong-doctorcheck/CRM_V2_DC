/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react';

export interface MemberItem {
  customer_id: string;
  username: string;
  displayname: string;
  loyalty_points: number;
  pending_points: number;
  use_points: number;
  member_display_text: string;
  relationship_type_name: string;
}

interface FamilyMembersProps {
}

const FamilyMembers: React.FC<FamilyMembersProps> = ({ }) => {
  return (
    <div className="t-family_members">
      FamilyMembers
    </div>
  );
}

FamilyMembers.defaultProps = {
};

export default FamilyMembers;
