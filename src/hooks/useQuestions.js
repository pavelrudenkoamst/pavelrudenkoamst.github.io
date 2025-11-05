import { useState, useEffect, useRef, useCallback } from 'react';
import { fetchQuestions, processQuestionData, getUniqueCategories } from '../services/api';

export const useQuestions = () => {
  const [questions, setQuestions] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const hasLoadedRef = useRef(false);

  const formatErrorMessage = useCallback((err) => {
    let errorMessage = err.message || 'Failed to load data';
    
    if (err.message.includes('status: 429') || err.message.includes('RATE_LIMIT')) {
      errorMessage = 'Rate limit exceeded: The API is temporarily limiting requests. The app will automatically retry with smaller batches. Please wait...';
    } else if (err.message.includes('HTTP error! status: 429')) {
      errorMessage = 'Rate limit exceeded: The API is temporarily limiting requests. The app will automatically retry with smaller batches. Please wait...';
    }
    
    return errorMessage;
  }, []);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const fetchedQuestions = await fetchQuestions(50);
      
      setQuestions(fetchedQuestions);
      
      const stats = processQuestionData(fetchedQuestions);
      setStatistics(stats);
      
      const uniqueCategories = getUniqueCategories(fetchedQuestions);
      setCategories(uniqueCategories);
    } catch (err) {
      setError(formatErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [formatErrorMessage]);

  const loadMoreQuestions = useCallback(async () => {
    try {
      setLoadingMore(true);
      setError(null);
      
      const newQuestions = await fetchQuestions(50);
      
      setQuestions(prevQuestions => {
        const updatedQuestions = [...prevQuestions, ...newQuestions];
        
        const uniqueCategories = getUniqueCategories(updatedQuestions);
        setCategories(uniqueCategories);
        
        return updatedQuestions;
      });
    } catch (err) {
      let errorMessage = err.message || 'Failed to load more questions';
      
      if (err.message.includes('status: 429') || err.message.includes('RATE_LIMIT')) {
        errorMessage = 'Rate limit exceeded: Please wait a moment and try again.';
      } else if (err.message.includes('HTTP error! status: 429')) {
        errorMessage = 'Rate limit exceeded: Please wait a moment and try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoadingMore(false);
    }
  }, []);

  useEffect(() => {
    if (hasLoadedRef.current) {
      return;
    }
    hasLoadedRef.current = true;
    loadData();
  }, [loadData]);

  return {
    questions,
    statistics,
    categories,
    loading,
    loadingMore,
    error,
    loadMoreQuestions,
  };
};

