"use client";

import QuillEditor from "@/components/QuillEditor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { MinusIcon } from "lucide-react";
import Image from "next/image";
import { notFound, useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type AchievementContent = {
  desc: string;
  img: string[];
};

type Achievement = {
  id: string;
  title: string;
  content: AchievementContent;
};

const MAX_IMAGES = 4;

const EditAchievement = () => {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams() as { id: string };
  const id = params?.id;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [originalImages, setOriginalImages] = useState<string[]>([]);
  const [removedImages, setRemovedImages] = useState<string[]>([]); // Images to delete
  const [images, setImages] = useState<File[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);

  console.log("Title: " + title);
  console.log("Desc: " + desc);
  console.log("OriginalImages: " + originalImages);
  console.log("RemovedImages: " + removedImages);
  console.log("NewImages: " + newImages);

  useEffect(() => {
    if (id) {
      fetchAchievement();
    }
  }, [id]);

  const fetchAchievement = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const { data, error } = await supabase
        .from("achievements")
        .select("title, content")
        .eq("id", id)
        .single();

      if (error || !data) {
        toast.error("Error fetching achievement");
        notFound();
      }

      const parsedContent = JSON.parse(data.content);
      setTitle(data.title);
      setDesc(parsedContent.desc || "");
      setOriginalImages(parsedContent.img || []);
      // setImages(parsedContent.img || []);
    } catch (error) {
      console.error("Error fetching achievement:", error);
      toast.error("Failed to fetch achievement.");
    } finally {
      setLoading(false);
    }
  };

  const handleNewImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (
      files &&
      newImages.length + originalImages.length + files.length <= MAX_IMAGES
    ) {
      setNewImages((prev) => [...prev, ...Array.from(files)]);
    } else {
      toast.error(`You can upload a maximum of ${MAX_IMAGES} images.`);
    }
  };

  const removeOriginalImage = (url: string) => {
    setRemovedImages((prev) => [...prev, url]);
    setOriginalImages((prev) => prev.filter((img) => img !== url));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleUpdate = async () => {
    if (!title.trim() || !desc.trim()) {
      toast.error("Title and description cannot be empty.");
      return;
    }

    setLoading(true);

    try {
      const newImagesData = await Promise.all(
        newImages.map(async (file) => ({
          name: file.name,
          content: await file.text(), // Convert file content to a serializable format
        }))
      );

      const res = await fetch(`/api/achievements/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          title,
          desc,
          originalImages,
          removedImages,
          newImages: newImagesData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        toast("Success", {
          description: "Achievement updated successfully",
        });
        router.push(`/private/our-achievements`);
      } else {
        toast.error(data.error || "Failed to update achievement");
      }

      // const uploadedImageUrls: string[] = [];
      // for (const file of newImages) {
      //   const { data, error } = await supabase.storage
      //     .from("dicom")
      //     .upload(`achievements/${Math.random()}-${file.name}`, file);

      //   if (error) {
      //     throw new Error(`Error uploading image: ${error.message}`);
      //   }

      //   const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/dicom/${data.path}`;
      //   uploadedImageUrls.push(imageUrl);
      // }

      // Delete removed images from Supabase storage
      // for (const url of removedImages) {
      //   const path = url.split("/dicom/")[1];
      //   const { error } = await supabase.storage.from("dicom").remove([path]);
      //   if (error) console.error(`Failed to delete image: ${url}`, error);
      // }

      // Update achievement
      // const updatedContent = JSON.stringify({
      //   desc,
      //   img: [...originalImages, ...uploadedImageUrls],
      // });

      // Update the post in the database
      // const { error } = await supabase
      //   .from("achievements")
      //   .update({
      //     title,
      //     content: updatedContent,
      //   })
      //   .eq("id", id);

      // if (error) {
      //   throw new Error(`Error updating post: ${error.message}`);
      // }
    } catch (error) {
      console.error("Error updating achievement:", error);
      toast("Error", {
        description: `Error updating achievement: ${error}`,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className='text-center w-full flex justify-center py-32'>
        <MinusIcon className='animate-spin mr-3' /> Loading...
      </div>
    );
  }

  return (
    <div className='w-full max-w-4xl mx-auto p-4'>
      <h2 className='text-xl font-bold mb-6'>Edit Achievement</h2>
      <div className='mb-4'>
        <label htmlFor='title' className='block text-sm font-medium mb-2'>
          Title
        </label>
        <Input
          id='title'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder='Enter post title'
        />
      </div>
      <div className='mb-4'>
        <label htmlFor='desc' className='block text-sm font-medium mb-2'>
          Description
        </label>
        <QuillEditor
          content={desc}
          onChange={setDesc}
          // {handleContentChange}
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-2'>Current Images</label>
        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          {originalImages.map((image, index) => (
            <div key={index} className='relative'>
              <Image
                src={image}
                alt={`Image ${index + 1}`}
                width={200}
                height={100}
                className='w-full h-auto max-w-[200px] object-cover rounded-md border'
              />
              <button
                type='button'
                className='absolute top-0 left-0 bg-red-500 text-white px-2 py-0.5 font-semibold rounded-full'
                onClick={() => removeOriginalImage(image)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className='mb-4'>
        <label htmlFor='new-images' className='block text-sm font-medium mb-2'>
          Upload New Images
        </label>
        <Input type='file' multiple onChange={handleNewImages} />
        <div className='mt-2'>
          {newImages.map((file, index) => (
            <div key={index} className='text-sm'>
              {file.name}
              <button
                className='text-red-500 font-bold'
                onClick={() => removeNewImage(index)}>
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
      <Button onClick={handleUpdate} disabled={loading}>
        {loading ? "Updating..." : "Update Achievement"}
      </Button>
    </div>
  );
};

export default EditAchievement;
