const API_KEY = import.meta.env.VITE_IMAGEBB_API_KEY;

export const uploadImage = async (file) => {
  try {
    if (!API_KEY) {
      throw new Error('ImageBB API key is missing. Check your environment variables.');
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('key', API_KEY);

    const response = await fetch('https://api.imgbb.com/1/upload', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Image upload failed: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.success) {
      return { 
        url: data.data.url,
        displayUrl: data.data.display_url,
        thumbnailUrl: data.data.thumb?.url, 
        error: null 
      };
    } else {
      throw new Error('Image upload failed');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return { url: null, error: error.message };
  }
};

export const validateImageFile = (file) => {
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
  
  // Check MIME type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'Please select an image file.' };
  }

  // Check file extension
  const extension = file.name.split('.').pop().toLowerCase();
  if (!allowedExtensions.includes(extension)) {
    return { valid: false, error: 'Invalid file extension. Allowed: jpg, jpeg, png, gif, webp.' };
  }
  
  // Check file size (limit to 2MB)
  if (file.size > 2 * 1024 * 1024) {
    return { valid: false, error: 'Image size should be less than 2MB.' };
  }
  
  return { valid: true, error: null };
};
