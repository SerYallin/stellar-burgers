import { FC, useEffect, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import {
  clearModalOrder,
  getConstructor,
  getModalOrder,
  getUser,
  resetConstructor
} from '@slices';
import { useNavigate } from 'react-router-dom';
import { createOrder, isOrderRequest } from '../../services/slices/order';

type TContructorItems = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};
export const BurgerConstructor: FC = () => {
  /** TODO: взять переменные constructorItems, orderRequest и orderModalData из стора */
  const constructorItems: TContructorItems = useSelector(getConstructor);
  const user = useSelector(getUser);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const orderRequest = useSelector(isOrderRequest);

  const orderModalData = useSelector(getModalOrder);

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) {
      navigate('/login');
    } else {
      const orderData = [];
      orderData.push(constructorItems.bun._id);
      constructorItems.ingredients.forEach((item) => {
        orderData.push(item._id);
      });
      dispatch(createOrder(orderData));
    }
  };
  const closeOrderModal = () => {
    dispatch(clearModalOrder());
  };

  useEffect(() => {
    if (orderModalData) {
      dispatch(resetConstructor());
    }
  }, [orderModalData]);

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
