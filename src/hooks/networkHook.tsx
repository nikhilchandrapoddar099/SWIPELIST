import useSWR from 'swr';
import { API_KEY } from '../constants';

// Define the structure of the news data
interface NewsData {
  articles: Array<any>;
}

// Define a function to fetch data from the API
const fetcher = async (url: string) => {
  const response = await fetch(url);
  return response.json();
};

/**
 * Custom hook to fetch user data from the news API.
 * @param page The page number to fetch data for.
 * @returns An object containing the fetched news data, loading state, and error state.
 */
export const useUser = (page: number) => {
  // Use the SWR hook to fetch data from the news API
  const { data, error, isLoading } = useSWR<NewsData>(
    // Construct the API URL with the provided page number
    page
      ? `https://newsapi.org/v2/everything?q=bitcoin&apiKey=${API_KEY}&pageSize=${1}&page=${page}`
      : null,
    fetcher
  );

  // Return the fetched news data, loading state, and error state
  return {
    // Extract the first article from the fetched news data
    newsData: data?.articles[0],
    // Loading state
    isLoading,
    // Error state
    isError: error
  };
};
