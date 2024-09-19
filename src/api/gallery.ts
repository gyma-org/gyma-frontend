export const addGalleryImage = async (image: File): Promise<GalleryImageResponse> => {
    const formData = new FormData();
    formData.append('image', image);
  
    const res = await fetch('/api/gym/gallery/add-image/', {
      method: 'POST',
      body: formData,
    });
  
    if (!res.ok) throw new Error('Failed to add image');
    return res.json();
  };

  import { FeatureRequest } from '../types/feature';

export const removeGalleryImage = async (data: FeatureRequest): Promise<void> => {
  const res = await fetch('/api/gym/gallery/remove_image/', {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!res.ok) throw new Error('Failed to remove image');
};

export const getGalleryImage = async (imageName: string): Promise<Blob> => {
    const res = await fetch(`/api/gym/gallery/${imageName}/`);
  
    if (!res.ok) throw new Error('Failed to retrieve image');
    return res.blob();
  };