import { treaty } from '@elysiajs/eden';
import type { App } from '@yield-x/api';

// Use the API URL from environment or fallback to localhost for development
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3005';

export const apiClient = treaty<App>(API_BASE_URL);

export const getTokenBalance = async (
  tokenAddress: string,
  ownerAddress: string
) => {
  try {
    const { data, error } = await apiClient.contract.token.balance.post({
      tokenAddress,
      ownerAddress,
    });

    if (error) {
      console.error('API Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};

export const getTokenInfo = async (tokenAddress: string) => {
  try {
    const { data, error } = await apiClient.contract
      .token({ tokenAddress })
      .get();

    if (error) {
      console.error('API Error:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Network Error:', error);
    return null;
  }
};
