// pages/api/fetchImage.js

export async function GET(request: Request) {
    // get the URL parameter from the request with the get param 'imageUrl'
    const imageUrl = new URL(request.url).searchParams.get("imageUrl");
  
    try {
      // Fetch the image from the external source
      const response = await fetch(imageUrl!);
  
      if (!response.ok) {
        throw new Error(`Failed to fetch the image. Status: ${response.status}`);
      }
  
      // Set appropriate headers and stream the image to the client
      const resp = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: {
        //   "Content-Type": response.headers.get("content-type"),
          "Cache-Control": "public, max-age=86400", // Cache for 1 day
        },
      });

      return resp
    } catch (error) {
      console.error("Error fetching image:", error);
    }

    return new Response(null, { status: 500, statusText: "Internal Server Error" });
  }
  