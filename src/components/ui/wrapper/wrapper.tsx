import React, { FC, memo } from 'react';

import { TWrapperUIProps } from './type';
import styles from './../../app/app.module.css';

export const WrapperUI: FC<TWrapperUIProps> = memo(({ title, children }) => (
  <div className={styles.detailPageWrap}>
    <div className={styles.detailHeader}>
      {(React.isValidElement(title) && title) || (
        <h3 className={` text text_type_main-large`}>{title}</h3>
      )}
    </div>
    {children}
  </div>
));
