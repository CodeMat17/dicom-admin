"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = {
  id: string;
  title: string;
  desc: string;
//   link: string;
//   email: string;
};

const EditGetInvolved = ({ id, title, desc }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDesc, setNewDesc] = useState(desc);
//   const [newLink, setNewLink] = useState(link);
//   const [newEmail, setNewEmail] = useState(email);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const update = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-involved/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, newTitle, newDesc }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast("ERROR!", {
          description: `${error.message}`,
        });
        throw new Error(error.message);
      }

      toast(`DONE!`, {
        description: `Updated successfully`,
      });

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("ErrorMsg: ", error);
    } finally {
      setLoading(false);
    }
    };
    
     const deleteEvent = async () => {
       setLoadingDelete(true);
       try {
         const response = await fetch(`/api/get-involved/delete`, {
           method: "DELETE",
           headers: {
             "Content-Type": "application/json", // Ensure you're sending JSON data
           },
           body: JSON.stringify({ id }),
         });

         if (!response.ok) {
           const error = await response.json();
           toast("ERROR!", {
             description: `${error.message}`,
           });
           throw new Error(error.message);
         }

         toast(`DONE!`, {
           description: `Item removed successfully`,
         });

         router.refresh();
       } catch (error) {
         console.error("ErrorMsg: ", error);
       } finally {
         setLoadingDelete(false);
       }
     };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger className='sm:text-left'>
        <div className='relative border rounded-xl p-7 bg-white shadow-md space-y-3'>
          <h2 className='text-lg font-medium'>{title}</h2>
          <hr />
          <p>{desc}</p>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you sure you want to edit this event?</DialogTitle>
        </DialogHeader>
        <div className='mt-6 space-y-4'>
          <div>
            <label className='block text-sm'>Title</label>
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className='border-gray-300'
            />
          </div>
          <div>
            <label className='block text-sm'>Description</label>
            <Textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              className='border-gray-300'
            />
          </div>

          <div className='flex justify-between items-center'>
            <Button
              onClick={deleteEvent}
              variant='outline'
              // size='icon'
              className='border-red-500 text-red-500'>
              {loadingDelete ? (
                <MinusIcon className='animate-spin text-red-500' />
              ) : (
                "Delete"
              )}
            </Button>
            <Button onClick={update}>
              {loading ? <MinusIcon className='animate-spin' /> : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditGetInvolved;
