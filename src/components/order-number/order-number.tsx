import React, { FC } from 'react';
import { useParams } from 'react-router-dom';
import { OrderNumberUI } from '../ui/order-number';

export const OrderNumber: FC = () => {
  const { number } = useParams();

  return <OrderNumberUI number={number || ''} />;
};
