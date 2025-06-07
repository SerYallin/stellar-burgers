import { ReactNode } from 'react';

export type TModalUIProps = {
  title: string | ReactNode;
  onClose: () => void;
  children?: ReactNode;
};
