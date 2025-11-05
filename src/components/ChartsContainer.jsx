import React from 'react';
import CategoryChart from './CategoryChart';
import DifficultyChart from './DifficultyChart';
import styles from './ChartsContainer.module.css';

const ChartsContainer = ({ statistics }) => {
  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2 className={styles.title}>Questions by Category</h2>
        <CategoryChart data={statistics?.categoryCounts || {}} />
      </div>

      <div className={styles.card}>
        <h2 className={styles.title}>Questions by Difficulty</h2>
        <DifficultyChart data={statistics?.difficultyCounts || {}} />
      </div>
    </div>
  );
};

export default ChartsContainer;

