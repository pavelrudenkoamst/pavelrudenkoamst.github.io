const API_BASE_URL = 'https://opentdb.com/api.php';
const MAX_QUESTIONS_PER_REQUEST = 50;
const RATE_LIMIT_DELAY = 5500;

const fetchQuestionBatch = async (amount) => {
  const response = await fetch(`${API_BASE_URL}?amount=${amount}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
    },
  });
  
  if (response.status === 429) {
    throw new Error('RATE_LIMIT');
  }
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (data.response_code !== 0) {
    const errorMessages = {
      1: 'No results found - try a different amount',
      2: 'Invalid parameter',
      3: 'Token not found',
      4: 'Token empty session'
    };
    const errorMsg = errorMessages[data.response_code] || 'Unknown API error';
    throw new Error(`API Error: ${errorMsg} (code: ${data.response_code})`);
  }
  
  if (!data.results || data.results.length === 0) {
    throw new Error('No questions returned from API');
  }
  
  return data.results;
};

export const fetchQuestions = async (amount = 50, retries = 3) => {
  if (amount <= MAX_QUESTIONS_PER_REQUEST) {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        return await fetchQuestionBatch(amount);
      } catch (error) {
        if (error.message === 'RATE_LIMIT') {
          if (attempt === retries) {
            return await fetchQuestionsInBatches(amount);
          }
          const delay = 5000 + (attempt * 3000);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        if (attempt === retries) {
          if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
            throw new Error('Network error: Unable to connect to Open Trivia DB. Please check your internet connection and try again.');
          }
          throw error;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
      }
    }
  } else {
    return await fetchMultipleBatches(amount, retries);
  }
};

const fetchMultipleBatches = async (totalAmount, retries = 3) => {
  const batches = Math.ceil(totalAmount / MAX_QUESTIONS_PER_REQUEST);
  const allQuestions = [];
  
  for (let i = 0; i < batches; i++) {
    const currentBatchSize = Math.min(MAX_QUESTIONS_PER_REQUEST, totalAmount - allQuestions.length);
    
    try {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
      
      let batch = null;
      for (let attempt = 1; attempt <= retries; attempt++) {
        try {
          batch = await fetchQuestionBatch(currentBatchSize);
          break;
        } catch (error) {
          if (error.message === 'RATE_LIMIT') {
            if (attempt < retries) {
              const delay = 5000 + (attempt * 3000);
              await new Promise(resolve => setTimeout(resolve, delay));
              continue;
            }
          }
          
          if (attempt === retries) {
            throw error;
          }
          
          await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
        }
      }
      
      if (batch) {
        allQuestions.push(...batch);
      }
    } catch (error) {
      if (allQuestions.length > 0) {
        break;
      } else {
        throw error;
      }
    }
  }
  
  return allQuestions;
};

const fetchQuestionsInBatches = async (totalAmount) => {
  const batchSize = 10;
  const batches = Math.ceil(totalAmount / batchSize);
  const allQuestions = [];
  
  for (let i = 0; i < batches; i++) {
    const currentBatchSize = Math.min(batchSize, totalAmount - allQuestions.length);
    
    try {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      const batch = await fetchQuestionBatch(currentBatchSize);
      allQuestions.push(...batch);
    } catch (error) {
      if (error.message === 'RATE_LIMIT') {
        await new Promise(resolve => setTimeout(resolve, 10000));
        i--;
        continue;
      }
      throw error;
    }
  }
  
  return allQuestions;
};

export const processQuestionData = (questions) => {
  const categoryCounts = {};
  const difficultyCounts = {};
  
  questions.forEach((question) => {
    const category = question.category;
    categoryCounts[category] = (categoryCounts[category] || 0) + 1;
    
    const difficulty = question.difficulty || 'unknown';
    difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
  });
  
  return {
    categoryCounts,
    difficultyCounts,
    totalQuestions: questions.length
  };
};

export const getUniqueCategories = (questions) => {
  const categories = [...new Set(questions.map(q => q.category))];
  return categories.sort();
};

