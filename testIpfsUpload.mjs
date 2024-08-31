import { create } from 'ipfs-http-client';
import fs from 'fs';
import path from 'path';

const IPFS_API_URL = 'https://ipfs.infura.io:5001/api/v0'; // Example IPFS URL
const client = create({ url: IPFS_API_URL });

const uploadFile = async () => {
  const filePath = path.join(process.cwd(), 'path/to/your/test/image.jpg'); // Replace with your file path
  const file = fs.readFileSync(filePath);
  try {
    const added = await client.add(file);
    console.log(`Uploaded to IPFS: https://ipfs.infura.io/ipfs/${added.path}`);
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
  }
};

uploadFile();
