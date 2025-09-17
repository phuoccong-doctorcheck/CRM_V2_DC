import { Pagination } from 'antd';
import React from 'react';

type Size = 'default' | 'small';

interface CPaginationProps {
  size?: Size;
  current?: number;
  total?: number;
  pageSize?: number;
  onChange?: (page: any, pageSize: any) => void;
  pageSizeOptions?: string[] | number[];
  disabled?: boolean;
  responsive?: boolean;
  showSizeChanger?: boolean;
  simple?: boolean;
  showQuickJumper?: boolean | { goButton: React.ReactNode };
}

const CPagination: React.FC<CPaginationProps> = ({ current, onChange, total, pageSize = 20, size = "default", pageSizeOptions, disabled, responsive = true, showSizeChanger, simple, showQuickJumper }) => {
  return (
    <div className="a-pagination">
      <Pagination
        size={size}
        current={current}
        defaultCurrent={1}
        defaultPageSize={20}
        total={total}
        pageSize={pageSize}
        onChange={onChange}
        pageSizeOptions={pageSizeOptions}
        disabled={disabled}
        responsive={responsive}
        showSizeChanger={showSizeChanger}
        simple={false}
        showQuickJumper={showQuickJumper}
      />
    </div>
  );
}

// CPagination.defaultProps = {
//   pageSize: 20,
//   size: 'default',
//   responsive: true,
// };

export default CPagination;
