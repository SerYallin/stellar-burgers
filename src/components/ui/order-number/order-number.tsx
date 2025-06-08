import React, { FC } from 'react';
import { OrderNumberUIProps } from './type';

export const OrderNumberUI: FC<OrderNumberUIProps> = ({ number }) => (
  <span className={`text text_type_digits-default`}>
    #{String(number).padStart(6, '0')}
  </span>
);
