import React from 'react';

export interface ISeoProps{
  keywords:string,
  description:string
  author:string
}
function SeoHeader({ props: { keywords, description, author } }:{ props:ISeoProps }) {
  return (
    <>
      {keywords && <meta name="keywords" content={keywords} />}
      {description && <meta name="description" content={keywords} />}
      {author && <meta name="author" content={keywords} />}
    </>
  );
}
export default SeoHeader;
