import axios from 'axios';

export const uploadToIPFS = async (file: File | Blob): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:5001/api/v0/add', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    console.log('IPFS response:', response.data);

    if (response.data && response.data.Hash) {
      return `https://ipfs.io/ipfs/${response.data.Hash}`;
    } else {
      throw new Error('IPFS response did not contain a valid hash.');
    }
  } catch (error) {
    console.error('Error uploading to IPFS:', error);
    return null;
  }
};
