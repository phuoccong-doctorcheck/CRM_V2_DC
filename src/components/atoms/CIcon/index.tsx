import React from 'react'

interface Props {
  icon: React.ReactNode | string;
}

const CIcon = ({ icon }: Props) => {
  if (typeof icon === 'string') {
    return <div dangerouslySetInnerHTML={{ __html: icon }} />;
  }

  return <div>{icon}</div>;
};

export default CIcon;
