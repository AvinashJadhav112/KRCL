/* eslint-disable react/prop-types */
import Helmet from 'react-helmet';
import React from 'react';

const TitleComponent = ({ title }) => {
  const defaultTitle = '⚛️ app';
  return (
    <Helmet>
      <meta charSet="utf-8" />
      <title>{title || defaultTitle}</title>
    </Helmet>
  );
};

export default TitleComponent;
