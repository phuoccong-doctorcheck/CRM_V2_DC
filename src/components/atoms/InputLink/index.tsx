import React from 'react';

interface InputLinkProps {
  lable?: string;
}

const InputLink: React.FC<InputLinkProps> = ({ lable }) => (
  <div className="a-input_links">
    <p>{lable}</p>
  </div>
);

InputLink.defaultProps = {
};

export default InputLink;
