import React, { useEffect, useCallback } from 'react';
import { useQuestions } from './hooks/useQuestions';
import { useCountdown } from './hooks/useCountdown';
import { useCategoryFilter } from './hooks/useCategoryFilter';
import Header from './components/Header';
import LoadingScreen from './components/LoadingScreen';
import ErrorScreen from './components/ErrorScreen';
import CategoryList from './components/CategoryList';
import StatsGrid from './components/StatsGrid';
import ChartsContainer from './components/ChartsContainer';
import './App.css';

function App() {
  const { 
    questions, 
    statistics, 
    categories, 
    loading, 
    loadingMore, 
    error, 
    loadMoreQuestions 
  } = useQuestions();
  
  const { countdown, startCountdown } = useCountdown();
  
  const {
    selectedCategory,
    filteredQuestions,
    filteredStatistics,
    handleSelectCategory,
    handleShowAllCategories,
  } = useCategoryFilter(questions);

  useEffect(() => {
    if (!loading && questions.length > 0) {
      startCountdown();
    }
  }, [loading, questions.length, startCountdown]);

  const handleLoadMore = useCallback(async () => {
    await loadMoreQuestions();
    startCountdown();
  }, [loadMoreQuestions, startCountdown]);

  const displayStatistics = filteredStatistics || statistics;

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return <ErrorScreen error={error} />;
  }

  return (
    <div className="app">
      <Header />

      <main className="app-main">
        <div className="sidebar">
          <CategoryList
            categories={categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onShowAll={handleShowAllCategories}
            categoryCounts={displayStatistics?.categoryCounts || {}}
          />
        </div>

        <div className="content">
          <div className="stats-section">
            <StatsGrid
              filteredQuestions={filteredQuestions}
              filteredStatistics={filteredStatistics}
              statistics={statistics}
              onLoadMore={handleLoadMore}
              loadingMore={loadingMore}
              loading={loading}
              countdown={countdown}
            />
          </div>

          <div className="charts-section">
            <ChartsContainer statistics={displayStatistics} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
