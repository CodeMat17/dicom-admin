"use client";

import Image from "next/image";
import { useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

type Props = {
  id: string;
  title: string;
  desc: string;
  imgs: string[];
};

const HeroForm = ({ id, title, desc, imgs }: Props) => {
  const [newTitle, setNewTitle] = useState(title);
  const [newDesc, setNewDesc] = useState(desc);
  const [newImgs, setNewImgs] = useState(imgs);

  return (
    <div className='space-y-4'>
      <div>
        <label className='block text-sm mb-0.5'>Hero title</label>
        <Input value={newTitle} onChange={(e) => setNewTitle(e.target.value)} />
      </div>

      <div>
        <label className='block text-sm mb-0.5'>Hero description</label>
        <Textarea
          value={newDesc}
          onChange={(e) => setNewDesc(e.target.value)}
        />
      </div>

          <div className="flex flex-col justify-center mt-8">
              <p className="text-lg text-center font-medium mb-4">Hero Images</p>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-4'>
          {newImgs &&
            newImgs.map((img, i) => (
              <div key={i}>
             
                  <Image
                    alt=''
                    priority
                    width={300}
                    height={150}
                    src={img}
                    className='w-full sm:w-[200px] aspect-video object-cover rounded-lg '
                  />
          
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default HeroForm;
