import { useState, useMemo, useCallback } from 'react';
import { processQuestionData } from '../services/api';

export const useCategoryFilter = (questions) => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const filteredQuestions = useMemo(() => {
    if (!selectedCategory) {
      return questions;
    }
    return questions.filter(q => q.category === selectedCategory);
  }, [questions, selectedCategory]);

  const filteredStatistics = useMemo(() => {
    if (filteredQuestions.length > 0) {
      return processQuestionData(filteredQuestions);
    }
    return null;
  }, [filteredQuestions]);

  const handleSelectCategory = useCallback((category) => {
    setSelectedCategory(prev => {
      if (prev === category) {
        return null;
      }
      return category;
    });
  }, []);

  const handleShowAllCategories = useCallback(() => {
    setSelectedCategory(null);
  }, []);

  return {
    selectedCategory,
    filteredQuestions,
    filteredStatistics,
    handleSelectCategory,
    handleShowAllCategories,
  };
};

