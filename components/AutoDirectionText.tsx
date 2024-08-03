import React from 'react';
import { isRtlLang } from 'rtl-detect';

interface AutoDirectionTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  text: string;
  className?: string;
}

const AutoDirectionText: React.FC<AutoDirectionTextProps> = ({ text, className = '', ...props }) => {
  const isRtl = isRtlLang(text);
  
  return (
    <span
      className={`${className} ${isRtl ? 'rtl' : 'ltr'}`}
      dir={isRtl ? 'rtl' : 'ltr'}
      {...props}
    >
      {text}
    </span>
  );
};

export default AutoDirectionText;