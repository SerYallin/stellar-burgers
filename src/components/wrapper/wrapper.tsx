import { FC, memo } from 'react';

import { TWrapperProps } from './type';
import { WrapperUI } from '../ui/wrapper';

const modalRoot = document.getElementById('modals');

export const Wrapper: FC<TWrapperProps> = memo(({ title, children }) => (
  <WrapperUI title={title}>{children}</WrapperUI>
));
