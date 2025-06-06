import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { getFeeds, selectFeeds, isLoaded } from '@slices';

export const Feed: FC = () => {
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectFeeds);
  const isLoading: boolean = useSelector(isLoaded);
  const dispatch = useDispatch();
  const handleGetFeeds = () => {
    dispatch(getFeeds());
  };
  useEffect(() => {
    handleGetFeeds();
  }, []);
  return !orders.length || isLoading ? (
    <Preloader />
  ) : (
    <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
  );
};
