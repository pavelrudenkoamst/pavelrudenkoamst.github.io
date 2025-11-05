import React from 'react';
import styles from './Header.module.css';

const Header = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Trivia Questions Visualizer</h1>
      <p className={styles.subtitle}>
        Visualizing data from Open Trivia DB
      </p>
    </header>
  );
};

export default Header;

