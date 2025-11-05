import React from 'react';
import styles from './ErrorScreen.module.css';

const ErrorScreen = ({ error }) => {
  return (
    <div className="app">
      <div className={styles.container}>
        <h2>Error</h2>
        <p>{error}</p>
        <button className={styles.button} onClick={() => window.location.reload()}>Retry</button>
      </div>
    </div>
  );
};

export default ErrorScreen;

