import API_BASE_URL from '../config/api';

export const imageService = {
  // Get image URL with proper formatting
  getImageUrl: (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `${API_BASE_URL}${imagePath.startsWith('/') ? '' : '/'}${imagePath}`;
  },

  // Get all available images
  getAllImages: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/images`);
      if (!response.ok) throw new Error('Failed to fetch images');
      return await response.json();
    } catch (error) {
      console.error('Error fetching images:', error);
      return [];
    }
  },

  // Get specific image by filename
  getImage: async (filename) => {
    try {
      const response = await fetch(`${API_BASE_URL}/images/${filename}`);
      if (!response.ok) throw new Error('Image not found');
      return response.blob();
    } catch (error) {
      console.error('Error fetching image:', error);
      return null;
    }
  }
};
