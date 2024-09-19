'use client'

import {createClient} from '@/utils/supabase/client'
import { FC, useState } from "react";
import { motion } from "framer-motion";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import UploadPhoto from './UploadPhoto';

interface EditModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData: UserData | null;
  onSave: (updatedUser: UserData) => void;
}

interface UserData {
  id: string;
  name: string;
  position: string;
  bio: string;
  photo: string;
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 },
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
  exit: { opacity: 0 },
};

const EditTeamModal: FC<EditModalProps> = ({ isOpen, onClose, userData, onSave }) => {

const supabase = createClient()

  const [formData, setFormData] = useState<UserData | null>(userData);


  if (!isOpen || !formData) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

   const handlePhotoUpload = (url: string) => {
     setFormData((prevData) => (prevData ? { ...prevData, photo: url } : null));
   };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData); // Save the changes
    onClose(); // Close the modal
  };

  return (
    <motion.div
      className='fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50'
      variants={backdropVariants}
      initial='hidden'
      animate='visible'
      exit='exit'
      onClick={onClose}>
      <motion.div
        className='bg-white p-6 rounded-lg shadow-lg w-96 relative'
        variants={modalVariants}
        initial='hidden'
        animate='visible'
        exit='exit'
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}>
        <button
          className='text-red-500 hover:text-red-700 absolute top-0 right-2 text-3xl'
          onClick={onClose}>
          &times;
        </button>
        <h2 className='text-xl font-bold mb-4'>Edit Team Data</h2>
        <form onSubmit={handleSubmit} className='space-y-3'>
          <Input
            type='text'
            name='name'
            placeholder='Name'
            value={formData.name}
            onChange={handleChange}
            className='border-gray-400 bg-gray-50'
          />

          <Input
            type='text'
            placeholder='Name'
            name='position'
            value={formData.position}
            onChange={handleChange}
            className='border-gray-400 bg-gray-50'
          />

          <Textarea
            name='bio'
            value={formData.bio}
            onChange={handleChange}
            className='border-gray-400 bg-gray-50'
          />



          <div>
            <p className='text-sm mb-1'>Change Photo:</p>
            {/* Use the UploadPhoto component */}
            {/* <UploadPhoto onUpload={handlePhotoUpload} /> */}
          </div>

          {/* <Input
            type='url'
            placeholder='Photo URL'
            name='photo'
            value={formData.photo}
            onChange={handleChange}
            className='border-gray-400 bg-gray-50'
          /> */}

          <Button
            type='submit'
            className='w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600'>
            Save Changes
          </Button>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default EditTeamModal;
