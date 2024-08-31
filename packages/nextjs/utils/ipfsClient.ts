import { create } from "ipfs-http-client";

// Initialize the IPFS client to connect to the local node
const client = create({
  host: "localhost",
  port: 5001,
  protocol: "http",
});

export const uploadToIPFS = async (file) => {
  try {
    const added = await client.add(file);
    console.log("Uploaded file:", added);
    return `http://localhost:8080/ipfs/${added.path}`; // Use the local IPFS gateway
  } catch (error) {
    console.error("Error uploading to IPFS:", error);
    throw new Error("Failed to upload to IPFS");
  }
};
