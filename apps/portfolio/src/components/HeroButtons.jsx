import React from 'react';
import { Button } from '../../../storybook/src/components/Button/Button.jsx';

const ArrowRight = () => <span aria-hidden="true">→</span>;

export function HeroButtons() {
  return (
    <>
      <Button
        as="a"
        href="#work"
        variant="primary"
        size="lg"
        label="View Case Studies"
        iconRight={<ArrowRight />}
      />
      <Button
        as="a"
        href="#contact"
        variant="outline"
        size="lg"
        label="Contact me"
      />
    </>
  );
}
