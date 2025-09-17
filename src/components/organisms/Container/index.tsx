import React from 'react';
import {
  Col, ColProps, Row, RowProps,
} from 'react-bootstrap';
import mapModifiers from 'utils/functions';

export type StylesContainer = 'fullScreen' | 'noPaddingRight' | 'noPaddingLeft' | 'fullScreenTabletUp' | 'formLogin' | 'shadown' | 'left' | 'smaillForm' | 'confirm' | 'profile' | 'profile_child' | 'web-app';

interface ContainerProps {
  modifiers?: (StylesContainer)[];
  children?: React.ReactNode;
}

export const CustomRow: React.FC<RowProps> = ({ children }) => (
  <Row className="o-container_row">{children}</Row>
);
export const CustomCol: React.FC<ColProps> = ({ children, ...props }) => (
  <Col className="o-container_col" {...props}>{children}</Col>
);

const Container: React.FC<ContainerProps> = ({ children, modifiers }) => (
  <div className={`container ${mapModifiers('o-container', modifiers)}`}>
    {children}
  </div>
);

Container.defaultProps = {
  children: undefined,
};

export default Container;
