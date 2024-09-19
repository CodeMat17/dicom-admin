// components/UploadPhoto.tsx

"use client";

import { createClient } from "@/utils/supabase/client";
import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";

interface UploadPhotoProps {
  onPhotoUpload: (url: string) => void;
}

const UploadPhoto: React.FC<UploadPhotoProps> = ({ onPhotoUpload }) => {
  const supabase = createClient();
  const [imageUrl, setImageUrl] = useState<string>("");
  const imageInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.");
      }

      const file = e.target.files[0];
      const { data: image, error: uploadError } = await supabase.storage
        .from("dicom")
        .upload(`teams/${Math.random()}-${file.name}`, file);

      if (uploadError) {
        throw uploadError;
      }

      if (image) {
        const { data: imgUrl } = await supabase.storage
          .from("dicom")
          .getPublicUrl(image.path);

        if (imgUrl) {
          setImageUrl(imgUrl.publicUrl);
          onPhotoUpload(imgUrl.publicUrl); // Call parent function with new photo URL
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <div>
        <input
          hidden
          ref={imageInputRef}
          type='file'
          id='single'
          accept='image/*'
          onChange={uploadImage}
        />
        <Button
          onClick={() => imageInputRef.current?.click()}
          disabled={uploading}>
          {uploading ? "Uploading..." : "Change Image"}
        </Button>
      </div>
    </>
  );
};

export default UploadPhoto;
