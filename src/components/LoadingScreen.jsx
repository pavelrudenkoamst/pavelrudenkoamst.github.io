import React from 'react';
import styles from './LoadingScreen.module.css';

const LoadingScreen = () => {
  return (
    <div className="app">
      <div className={styles.container}>
        <div className={styles.spinner}></div>
        <p>Loading questions from Open Trivia DB...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;

