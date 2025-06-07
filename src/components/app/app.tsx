import {
  ConstructorPage,
  Feed,
  ForgotPassword,
  Login,
  Profile,
  ProfileOrders,
  Register,
  ResetPassword
} from '@pages';
import '../../index.css';
import styles from './app.module.css';
import {
  AppHeader,
  FeedInfo,
  IngredientDetails,
  Modal,
  OrderInfo,
  Wrapper
} from '@components';
import { OnlyAuth, OnlyUnAuth } from '../protected-route/protected-route';
import {
  Route,
  Routes,
  useLocation,
  useMatch,
  useNavigate
} from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import { checkUserAuth, getIngredients, getIsAuthChecked } from '@slices';
import { Preloader } from '@ui';
import { OrderNumber } from '../order-number';

const App = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuth = useSelector(getIsAuthChecked);
  useEffect(() => {
    dispatch(checkUserAuth());
    dispatch(getIngredients());
  }, []);
  const location = useLocation();
  const background = location.state?.background;
  const match = useMatch('/feed/:number');
  const onClose = () => {
    navigate(-1);
  };
  return (
    <div className={styles.app}>
      {(!isAuth && <Preloader />) || (
        <>
          <AppHeader />
          <Routes location={background || location}>
            <Route path='/' element={<ConstructorPage />} />
            <Route
              path='/login'
              element={<OnlyUnAuth component={<Login />} />}
            />
            <Route
              path='/forgot-password'
              element={<OnlyUnAuth component={<ForgotPassword />} />}
            />
            <Route
              path='/reset-password'
              element={<OnlyUnAuth component={<ResetPassword />} />}
            />
            <Route
              path='/register'
              element={<OnlyUnAuth component={<Register />} />}
            />
            <Route
              path='/profile'
              element={<OnlyAuth component={<Profile />} />}
            />
            <Route
              path='/profile/orders'
              element={<OnlyAuth component={<ProfileOrders />} />}
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Wrapper title={<OrderNumber />}>
                  <OnlyAuth component={<OrderInfo />} />
                </Wrapper>
              }
            />
            <Route path='/feed' element={<Feed />} />
            <Route
              path='/feed/:number'
              element={
                <Wrapper title={<OrderNumber />}>
                  <OrderInfo />{' '}
                </Wrapper>
              }
            />
            <Route
              path='/ingredients/:id'
              element={
                <Wrapper title='Детали ингредиента'>
                  <IngredientDetails />
                </Wrapper>
              }
            />
          </Routes>
          {background && (
            <Routes>
              <Route
                path='/ingredients/:id'
                element={
                  <Modal
                    title='Детали ингредиента'
                    onClose={onClose}
                    children={<IngredientDetails />}
                  />
                }
              />
              <Route
                path='/feed/:number'
                element={
                  <Modal
                    title={<OrderNumber />}
                    onClose={onClose}
                    children={<OrderInfo />}
                  />
                }
              />
              <Route
                path='/profile/orders/:number'
                element={
                  <Modal
                    title={<OrderNumber />}
                    onClose={onClose}
                    children={<OrderInfo />}
                  />
                }
              />
            </Routes>
          )}
        </>
      )}
    </div>
  );
};

export default App;
