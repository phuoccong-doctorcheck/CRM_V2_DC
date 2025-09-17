import React from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';

interface CInfiniteScrollProps {
  children?: React.ReactNode;
  dataLength: number;
  next: () => void;
  hasMore: boolean;
  loader?: React.ReactNode;
}

const CInfiniteScroll: React.FC<CInfiniteScrollProps> = ({ children, dataLength, next, hasMore, loader }) => {
  return (
    <div className="m-infinite_scroll">
      <InfiniteScroll
        dataLength={dataLength}
        next={next}
        hasMore={hasMore}
        loader={loader}
      >
        {children}
      </InfiniteScroll>
    </div>
  );
}

CInfiniteScroll.defaultProps = {
  children: undefined,
};

export default CInfiniteScroll;
