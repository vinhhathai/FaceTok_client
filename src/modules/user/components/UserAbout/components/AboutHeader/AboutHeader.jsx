import React from 'react';
import PropTypes from 'prop-types';
import { 
  AboutTitle,
  AboutBio
} from './AboutHeader.styles';

const AboutHeader = ({ bio }) => {
  return (
    <>
      <AboutTitle variant="h6">
        Giới thiệu
      </AboutTitle>

      {bio ? (
        <AboutBio variant="body1">
          {bio}
        </AboutBio>
      ) : (
        <AboutBio variant="body1">
          Người dùng chưa cập nhật thông tin giới thiệu.
        </AboutBio>
      )}
    </>
  );
};

AboutHeader.propTypes = {
  bio: PropTypes.string
};

export default AboutHeader; 