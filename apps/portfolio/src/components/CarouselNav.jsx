import React from 'react';
import { Button } from '../../../storybook/src/components/Button/Button.jsx';
import { ArrowLeftIcon, ArrowRightIcon, XIcon } from '@phosphor-icons/react';

export function CarouselPrev({
  id = 'carousel-prev',
  ariaLabel = 'Previous case study',
  className = 'works__nav-btn',
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={ariaLabel}
      id={id}
      iconLeft={<ArrowLeftIcon size={16} weight="bold" />}
      label=""
      className={className}
    />
  );
}

export function CarouselNext({
  id = 'carousel-next',
  ariaLabel = 'Next case study',
  className = 'works__nav-btn',
}) {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label={ariaLabel}
      id={id}
      iconLeft={<ArrowRightIcon size={16} weight="bold" />}
      label=""
      className={className}
    />
  );
}

export function ModalClose() {
  return (
    <Button
      variant="outline"
      size="icon"
      aria-label="Close case study"
      id="cs-modal-close"
      iconLeft={<XIcon size={16} weight="bold" />}
      label=""
      className="cs-modal__close works__nav-btn"
    />
  );
}
