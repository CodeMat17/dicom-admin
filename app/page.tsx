import { Button } from '@/components/ui/button';
import Image from 'next/image'
import React from 'react'

const Home = () => {
  return (
    <div className='w-full min-h-screen p-4'>
      <div>
        <p className='text-center text-2xl font-medium'>Hero Section</p>

        <div className='mt-6'>
          <div className='flex justify-center'>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mx-auto gap-3'>
              <Image
                alt=''
                priority
                width={300}
                height={150}
                src='/hero1.jpg'
                className='rounded-lg w-full md:max-w-[250px] aspect-video'
              />
              <Image
                alt=''
                priority
                width={300}
                height={150}
                src='/hero1.jpg'
                className='rounded-lg w-[250px] aspect-video'
              />
              <Image
                alt=''
                priority
                width={300}
                height={150}
                src='/hero1.jpg'
                className='rounded-lg w-[250px] aspect-video'
              />
            </div>
          </div>

          <div className='mt-8 flex justify-center'>
            <Button>Add More</Button>
          </div>
        </div>
        <div className='mt-8'>
          <p className='text-center text-2xl font-medium'>Latest Achievements</p>
          <div>
            
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home