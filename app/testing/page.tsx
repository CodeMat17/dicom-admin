'use client'

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function PostTesting() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length <= 4) {
      setImages(selectedFiles);
    } else {
      alert("You can only upload a maximum of 4 images");
    }
  };

  const uploadImages = async (): Promise<string[]> => {
    const imageUrls: string[] = [];

     for (const image of images) {
       const filePath = `testing/${image.name}`; // Folder 'testing' inside bucket 'dicom'
       const { data, error } = await supabase.storage
         .from("dicom") // Use the 'dicom' bucket
         .upload(filePath, image);

       if (error) throw error;

       const { data: publicData } = supabase.storage
         .from("dicom")
         .getPublicUrl(filePath);

       if (publicData) {
         imageUrls.push(publicData.publicUrl); // Push the public URL
       }
     }

    return imageUrls;
  };

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const imageUrls = await uploadImages();

      const content = {
        desc,
        images: imageUrls,
      };

      const response = await fetch("/api/testing/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Testing posted successfully");
      } else {
        alert(result.error);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='max-w-lg mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Post Testing</h1>

      <div className='mb-4'>
        <label className='block mb-2 font-medium'>Title</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded'
          placeholder='Enter achievement title'
        />
      </div>

      <div className='mb-4'>
        <label className='block mb-2 font-medium'>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          className='w-full p-2 border border-gray-300 rounded'
          placeholder='Enter description'
        />
      </div>

      <div className='mb-4'>
        <label className='block mb-2 font-medium'>Upload Images (max 4)</label>
        <input
          type='file'
          accept='image/*'
          multiple
          onChange={handleFileChange}
          className='w-full p-2 border border-gray-300 rounded'
        />
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className={`w-full p-2 text-white bg-blue-500 rounded ${
          loading ? "opacity-50" : ""
        }`}>
        {loading ? "Posting..." : "Post Achievement"}
      </button>
    </div>
  );
}
