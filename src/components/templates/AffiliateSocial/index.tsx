import Container from 'components/organisms/Container';
import React from 'react';

interface AffiliateSocialProps {
}

const AffiliateSocial: React.FC<AffiliateSocialProps> = ({ }) => (
  <Container modifiers={['profile_child']}>
    <div className="t-affiliate">
      1
    </div>
  </Container>
);

AffiliateSocial.defaultProps = {
  children: undefined,
};

export default AffiliateSocial;
