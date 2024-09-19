"use client";

import { createClient } from "@/utils/supabase/client";
import { MinusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const AchievementPost = () => {
  const supabase = createClient();
  // State variables to collect data
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>([]); // For storing image URLs after upload
  const [files, setFiles] = useState<File[]>([]); // Store image files for upload
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);

  // if (images.length > 4) {
  //   alert("You can only upload a maximum of 4 images.");
  //   return;
  // }

  const postAchievements = async () => {
    if (files.length === 0) {
      alert("Please select images before posting.");
      return;
    }

    setLoading(true);

    // const data = {
    //   title,
    //   content: [
    //     {
    //       desc,
    //       img: images,
    //     },
    //   ],
    // };

    try {
      // Upload each image to Supabase and collect the URLs
      const uploadedImageUrls: string[] = [];
      for (const file of files) {
        const { data, error } = await supabase.storage
          .from("dicom")
          .upload(`achievements/${Math.random()}-${file.name}`, file);

        if (error) {
          throw new Error(`Error uploading image: ${error.message}`);
        }

        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dicom/${data.path}`;
        uploadedImageUrls.push(imageUrl);
      }

      // Set the image URLs to state
      setImages(uploadedImageUrls);

      // Construct the data to post
      const data = {
        title,
        content: [
          {
            desc,
            img: uploadedImageUrls,
          },
        ],
      };

      // Send POST request to /api/achievements/post
      const response = await fetch("/api/achievements/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (result.success) {
        toast("DONE!", {
          description: "Achievements posted successfully",
        });
        console.log("Achievement posted successfully");
        setTitle("");
        setDesc("");
        setFiles([]);
        setImages([]);
      } else {
        toast("Error", {
          description: `Error: ${result.message}`,
        });
      }
    } catch (error) {
      console.error("Error posting achievement:", error);
      toast("Error", {
        description: `Error posting achievement: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length + files.length <= 4) {
      setFiles([...files, ...Array.from(selectedFiles)]);
    } else {
      toast("Error", {
        description: "You can only upload a maximum of 4 images.",
      });
    }
  };

  return (
    <div className='pb-4 max-w-2xl mx-auto'>
      <h2 className='text-lg text-center font-medium'>
        Post latest achievement
      </h2>
      <div className='mt-5 space-y-4'>
        <div>
          <label className='block mb-2'>Title</label>
          <Input
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter achievement title'
            required
            className='border-gray-400'
          />
        </div>

        <div>
          <label className='block mb-2'>Description</label>
          <Textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder='Enter achievement description'
            required
            className='border-gray-400'
          />
        </div>

        {/* Image inputs */}
        <div>
          <label className='block mb-2'>Images</label>

          <input
            type='file'
            accept='image/*'
            multiple
            onChange={handleImageChange}
            className='border p-2 mb-2 w-full'
            required
          />
          {files.length > 0 && (
            <div className='mt-2'>
              {files.map((file, index) => (
                <div key={index} className='text-gray-700'>
                  {file.name}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <Button onClick={postAchievements} disabled={loading}>
          {loading ? <MinusIcon className='animate-spin' /> : "Post"}
        </Button>
      </div>
    </div>
  );
};

export default AchievementPost;
