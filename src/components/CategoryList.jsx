import React from 'react';
import styles from './CategoryList.module.css';

const CategoryList = ({ categories, selectedCategory, onSelectCategory, onShowAll, categoryCounts }) => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.list}>
        <h2 className={styles.title}>Categories</h2>
        <div className={styles.actions}>
          <button
            className={`${styles.item} ${styles.allCategories} ${selectedCategory === null ? styles.active : ''}`}
            onClick={onShowAll}
          >
            All Categories
          </button>
        </div>
        <div className={styles.items}>
          {categories.map((category) => {
            const isSelected = selectedCategory === category;
            const hasSelection = selectedCategory !== null;
            return (
              <button
                key={category}
                className={`${styles.item} ${isSelected ? styles.active : ''} ${hasSelection && !isSelected ? styles.notSelected : ''}`}
                onClick={() => onSelectCategory(category)}
              >
                <span className={styles.name}>{category}</span>
                <span className={styles.count}>{categoryCounts[category] || 0}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CategoryList;

