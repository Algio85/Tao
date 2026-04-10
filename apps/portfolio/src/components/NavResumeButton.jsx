import React from 'react';
import { Button } from '../../../storybook/src/components/Button/Button.jsx';

const DownloadIcon = () => (
  <svg width="14" height="14" viewBox="0 0 256 256" aria-hidden="true" style={{ flexShrink: 0 }}>
    <path d="M224,152v56a16,16,0,0,1-16,16H48a16,16,0,0,1-16-16V152a8,8,0,0,1,16,0v56H208V152a8,8,0,0,1,16,0Zm-101.66,5.66a8,8,0,0,0,11.32,0l40-40a8,8,0,0,0-11.32-11.32L136,132.69V40a8,8,0,0,0-16,0v92.69L103.66,106.34a8,8,0,0,0-11.32,11.32Z" fill="currentColor"/>
  </svg>
);

export function NavResumeButton() {
  return (
    <Button
      as="a"
      href="/ATS - CV Alessandro Giordano.pdf"
      variant="primary"
      size="md"
      label="Resume"
      iconRight={<DownloadIcon />}
    />
  );
}
