"use client";

import { Button } from "./button";

interface TrackProps {
  name: string;
}

type TrackedButtonProps = React.ComponentProps<typeof Button> & TrackProps;

export const TrackedButton = ({
  children,
  onClick,
  name,
  ref,
  ...props
}: TrackedButtonProps) => {
  return (
    <Button {...props} ref={ref} onClick={(e) => {}}>
      {children}
    </Button>
  );
};

type TrackedButtonLinkProps = React.ComponentProps<typeof ButtonLink> &
  TrackProps;

export const TrackedButtonLink = ({
  analyticsKey,
  children,
  onClick,
  name,
  ref,
  ...props
}: TrackedButtonLinkProps) => {
  return (
    <Button
      {...props}
      ref={ref}
      onClick={(e) => {
        if (onClick) {
          onClick(e);
        }
      }}
    >
      {children}
    </Button>
  );
};
