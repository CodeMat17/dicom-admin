"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/utils/supabase/client";
import { EditIcon, MinusIcon } from "lucide-react";
import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

const EditAchievement = () => {
  const supabase = createClient();
  const params = useParams() as { id: string };
  const id = params?.id;
  const imageInputRef = useRef<HTMLInputElement>(null);

  // State variables for form inputs
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [images, setImages] = useState<string[]>(["", "", "", ""]); // 4 image URLs
  const [imageFiles, setImageFiles] = useState<(File | null)[]>([
    null,
    null,
    null,
    null,
  ]); // Hold new files if selected

  const [loading, setLoading] = useState(true);
  const [loadingImage, setLoadingImage] = useState(false);

  useEffect(() => {
    if (id) {
      fetchAchievement();
    }
  }, [id]);

  const fetchAchievement = async () => {
    if (!id) return;
    setLoading(true);

    try {
      const { data } = await supabase
        .from("achievements")
        .select("*")
        .eq("id", id)
        .single();

      if (!data) {
        notFound;
      } else {
        const parsedContent = JSON.parse(data.content[0]);
        setTitle(data.title);
        setDesc(parsedContent.desc);
        setImages(parsedContent.img);
      }
    } catch (error) {
      console.error("ErrorMsg: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Function to delete the old image from Supabase storage
  const deleteOldImage = async (imageUrl: string) => {
    const path = imageUrl.split("/").slice(-2).join("/"); // Extract path from URL
    const { error } = await supabase.storage.from("dicom").remove([path]);

    if (error) {
      console.error("Error deleting old image:", error);
      toast.error("Failed to delete old image.");
    } else {
      console.log("Old image deleted successfully");
    }
  };

  // Function to handle file selection for a specific image slot
  const handleFileSelect = (index: number, file: File | null) => {
    setLoadingImage(true);
    const updatedImageFiles = [...imageFiles];
    updatedImageFiles[index] = file;
    setImageFiles(updatedImageFiles);
    setLoadingImage(false);
  };

  // Function to handle image upload and remove old image
  const handleImageUpload = async (file: File, index: number) => {
    setLoadingImage(true);
    const oldImageUrl = images[index];

    // Remove the old image from Supabase
    if (oldImageUrl) {
      await deleteOldImage(oldImageUrl);
    }

    // Upload the new image
    const fileName = `${Date.now()}-${file.name}`;
    const { data, error } = await supabase.storage
      .from("dicom")
      .upload(`achievements/${Math.random()}-${fileName}`, file);

    if (error) {
      console.error("Image upload error:", error);
      toast.error("Failed to upload image.");
      return;
    }

    const newImageURL = supabase.storage
      .from("dicom")
      .getPublicUrl(`achievements/${fileName}`).data.publicUrl;

    // Update the specific image URL
    const updatedImages = [...images];
    updatedImages[index] = newImageURL;
    setImages(updatedImages);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className='text-center w-full flex justify-center py-32'>
        <MinusIcon className='animate-spin mr-3' /> Loading...
      </div>
    );
  }

  return (
    <div className="text-center py-32">Coming Soon!</div>
    // <div className='p-4'>
    //   <h2 className='text-center font-medium text-lg'>Edit Achievement</h2>
    //   <div className='mt-5 space-y-4'>
    //     <div>
    //       <label className='block mb-0.5'>Title</label>
    //       <Input
    //         type='text'
    //         value={title}
    //         onChange={(e) => setTitle(e.target.value)}
    //         className='w-full border-gray-300 p-2 rounded'
    //         placeholder='Enter achievement title'
    //       />
    //     </div>
    //     <div className=''>
    //       <label className='block mb-0.5'>Description</label>
    //       <Textarea
    //         value={desc}
    //         onChange={(e) => setDesc(e.target.value)}
    //         className='w-full border-gray-300 p-2 rounded'
    //         placeholder='Enter achievement description'
    //         rows={4}
    //       />
    //     </div>
    //     {/* Image Inputs */}
    //     <div>
    //       <label className='block mb-2'>Images</label>
    //       <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5'>
    //         {images.map((image, index) => (
    //           <div
    //             key={index}
    //             className='mb-2 space-y-2 flex flex-col items-center'>
    //             <div className='flex flex-col items-center gap-3'>
    //               <Image
    //                 alt=''
    //                 priority
    //                 width={80}
    //                 height={50}
    //                 src={image}
    //                 className='border rounded-md w-[180px] h-auto'
    //               />

    //               {/* <Input
    //               type='text'
    //               value={image}
    //               onChange={(e) => {
    //                 const newImages = [...images];
    //                 newImages[index] = e.target.value;
    //                 setImages(newImages);
    //               }}
    //               className='w-full border-gray-300 p-2 rounded'
    //               placeholder={`Image ${index + 1} URL`}
    //           /> */}

    //               {/* File input for uploading new image */}
    //               <input
    //                 ref={imageInputRef}
    //                 hidden
    //                 type='file'
    //                 accept='image/*'
    //                 onChange={(e) => {
    //                   if (e.target.files && e.target.files[0]) {
    //                     handleFileSelect(index, e.target.files[0]);
    //                   }
    //                 }}
    //               />
    //               <Button
    //                 onClick={() => imageInputRef.current?.click()}
    //                 size='icon'>
    //                 {loadingImage ? (
    //                   <MinusIcon className='animate-spin' />
    //                 ) : (
    //                   <EditIcon />
    //                 )}
    //               </Button>
    //             </div>
    //           </div>
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
};

export default EditAchievement;
