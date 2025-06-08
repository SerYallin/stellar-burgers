import { ReactNode } from 'react';

export type TModalProps = {
  title: string | ReactNode;
  onClose: () => void;
  children?: ReactNode;
};
