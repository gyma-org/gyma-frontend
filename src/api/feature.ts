import { FeatureRequest } from '../types/feature';

export const addFeature = async (data: FeatureRequest): Promise<void> => {
  const res = await fetch('/api/gym/features/add/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to add feature');
};

export const removeFeature = async (data: FeatureRequest): Promise<void> => {
    const res = await fetch('/api/gym/features/remove/', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    if (!res.ok) throw new Error('Failed to remove feature');
  };