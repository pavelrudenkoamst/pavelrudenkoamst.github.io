import React from 'react';
import LoadMoreButton from './LoadMoreButton';
import styles from './StatsGrid.module.css';

const StatsGrid = ({ filteredQuestions, filteredStatistics, statistics, onLoadMore, loadingMore, loading, countdown }) => {
  const categoryCount = Object.keys(filteredStatistics?.categoryCounts || statistics?.categoryCounts || {}).length;
  
  return (
    <div className={styles.grid}>
      <div className={styles.card}>
        <p className={styles.value}>{filteredQuestions.length} questions</p>
        <p className={styles.subvalue}>
          in {categoryCount} {categoryCount === 1 ? 'category' : 'categories'}
        </p>
      </div>
      <LoadMoreButton
        onClick={onLoadMore}
        disabled={loadingMore || loading || countdown > 0}
        loading={loadingMore}
        countdown={countdown}
      />
    </div>
  );
};

export default StatsGrid;

