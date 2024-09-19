"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MinusIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const AddNewGetInvolved = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [loading, setLoading] = useState(false);

  const postEvent = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/get-involved/post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, desc }),
      });

      if (!response.ok) {
        const error = await response.json();
        toast("ERROR!", {
          description: `${error.message}`,
        });
        throw new Error(error.message);
      }

      toast(`DONE!`, {
        description: `New event posted successfully`,
      });
        setTitle('')
        setDesc('')

      router.refresh();
      setOpen(false);
    } catch (error) {
      console.error("ErrorMsg: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add new event</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Event</DialogTitle>
        </DialogHeader>
        <div className='mt-6 space-y-4'>
          <div>
            <label className='block text-sm'>Title</label>
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter event title'
              className='border-gray-300'
            />
          </div>
          <div>
            <label className='block text-sm'>Description</label>
            <Textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder='Enter event date'
              className='border-gray-300'
            />
          </div>
          <Button onClick={postEvent}>
            {loading ? <MinusIcon className='animate-spin' /> : "Post"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddNewGetInvolved;
