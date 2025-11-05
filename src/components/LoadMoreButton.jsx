import React from 'react';
import styles from './LoadMoreButton.module.css';

const LoadMoreButton = ({ onClick, disabled, loading, countdown }) => {
  const progress = countdown > 0 ? ((5.5 - countdown) / 5.5) * 100 : 0;

  return (
    <div className={styles.card}>
      <button 
        className={styles.button} 
        onClick={onClick}
        disabled={disabled}
        style={{
          '--progress': `${progress}%`
        }}
      >
        <span className={styles.progressBar} style={{
          width: `${progress}%`
        }}></span>
        <span className={styles.content}>
          {loading ? (
            <>
              <span className={styles.spinner}></span>
              Loading...
            </>
          ) : (
            'Load 50 more questions'
          )}
        </span>
      </button>
    </div>
  );
};

export default LoadMoreButton;

