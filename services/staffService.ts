
import { StaffEntity } from '../types';
import { MOCK_STAFF } from '../constants';

export const fetchStaffEntities = async (): Promise<StaffEntity[]> => {
  // Return the mock staff directly without API calls
  return new Promise((resolve) => {
    // Simulate a small delay for UI effect
    setTimeout(() => {
      resolve(MOCK_STAFF);
    }, 500);
  });
};
