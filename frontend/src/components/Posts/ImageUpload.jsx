import React from 'react'
import { useState, useRef } from 'react';
import { uploadImage, validateImageFile } from '../../services/imageUpload';

export default function ImageUpload({onImageUpload}) {

    const imgRef = useRef(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }
    setError('');
    setIsUploading(true);
    
    try {
      const result = await uploadImage(file);
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      onImageUpload(result.url);
    } catch (err) {
      console.error('Image upload failed:', err);
      setError('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className='ml-2'>
        <label className="block text-sm font-medium text-gray-700  mb-2">
            Upload Image (Optional)
        </label>
        <div>
            <input type = "file" ref={imgRef} onChange={handleFileChange} accept="image/jpeg,image/png,image/gif,image/webp" disabled={isUploading} className='file:mr-4 file:py-1 file:px-2 file:rounded-sm  file:text-xs file:font-semibold  file:text-white file:bg-fuchsia-700'/>
            {isUploading &&<div className=" text-gray-700 text-sm">Uploading...</div>}
        </div>
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        <p className="text-sm text-gray-500">
          Supported formats: JPG, PNG, GIF, WEBP. Max size: 2MB.
        </p>

    </div>
  )
}
