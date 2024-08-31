import { getNFTMetadataFromIPFS } from "~~/utils/simpleNFT/ipfs";

export async function POST(request: Request) {
  try {
    const { ipfsHash } = await request.json();
    if (!ipfsHash) {
      return new Response(JSON.stringify({ error: "IPFS hash is required" }), { status: 400 });
    }
    const metadata = await getNFTMetadataFromIPFS(ipfsHash);
    return new Response(JSON.stringify(metadata), { status: 200 });
  } catch (error) {
    console.error("Error getting metadata from IPFS", error);
    return new Response(JSON.stringify({ error: "Error getting metadata from IPFS" }), { status: 500 });
  }
}
