import { supabaseServiceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const {
      id,
      title,
      desc,
      originalImages = [],
      removedImages = [],
      newImages = [],
    } = await request.json();

    if (
      !id ||
      !title ||
      !desc ||
      !Array.isArray(originalImages) ||
      !Array.isArray(removedImages) ||
      !Array.isArray(newImages)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid input data" },
        { status: 400 }
      );
    }

    // Upload new images
    const uploadedImageUrls: string[] = [];
    for (const file of newImages) {
      const { content, name } = file;

      const buffer = Buffer.from(content, "utf-8"); // Convert content to Buffer

      const { data, error } = await supabaseServiceClient.storage
        .from("dicom")
        .upload(`achievement/${Date.now()}-${name}`, buffer);

      if (error) {
        throw new Error(`Error uploading image: ${error.message}`);
      }

    const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dicom/${data.path}`;
    uploadedImageUrls.push(imageUrl);
    }

    // Remove old images
    for (const url of removedImages) {
      const pathParts = url.split("/dicom/");
      if (pathParts.length < 2) {
        console.error(`Invalid URL format for removal: ${url}`);
        continue;
      }

      const path = pathParts[1];
      const { error } = await supabaseServiceClient.storage
        .from("dicom")
        .remove([path]);

      if (error) {
        console.error(`Failed to delete image: ${url}`, error);
      }
    }

    // Construct updated content
    const updatedImages = [...originalImages, ...uploadedImageUrls];
    const updatedContent = { desc, img: updatedImages };

    // Update the achievement
    const { error: updateError } = await supabaseServiceClient
      .from("achievements")
      .update({ title, content: updatedContent })
      .eq("id", id);

    if (updateError) {
      throw new Error(`Error updating achievement: ${updateError.message}`);
    }

    return NextResponse.json(
      { success: true, message: "Achievement updated successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in update API route:", error);
    return NextResponse.json(
      { success: false, error: error || "Internal server error" },
      { status: 500 }
    );
  }
}
