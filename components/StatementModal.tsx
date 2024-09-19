"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FilePenLineIcon, MinusIcon } from "lucide-react";
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
};

const StatementModal = ({ id, title, desc }: Props) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const [newDesc, setNewDesc] = useState(desc);
  const [loading, setLoading] = useState(false);

  const update = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/statement/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          newTitle,
          newDesc,
        }),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message);
      }

      toast(`DONE!`, {
        description: `${newTitle} updated successfully`,
      });

      router.refresh();
      setOpen(false);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild className='absolute top-3 right-3'>
        <Button size='icon' className='rounded-full'>
          <FilePenLineIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Edit <span>{title}</span>
          </DialogTitle>
        </DialogHeader>
        <div className='space-y-4'>
          <Input
            name='title'
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className='border-gray-400'
          />
          <Textarea
            name='bio'
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className='border-gray-400'
          />
          <div className='flex justify-end'>
            <Button onClick={update}>
              {loading ? <MinusIcon className='animate-spin' /> : "Update"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StatementModal;
