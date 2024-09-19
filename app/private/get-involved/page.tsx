import AddNewGetInvolved from "@/components/AddNewGetInvolved";
import EditGetInvolved from "@/components/EditGetInvolved";
import { createClient } from "@/utils/supabase/server";

const GetInvolved = async () => {
 const supabase = createClient();

 const { data, error } = await supabase
   .from("getInvolved")
   .select("*")
   .order("created_at", { ascending: true });

  return (
    <div className='p-4 w-full min-h-screen bg-gray-50'>
      <p className='text-center text-lg font-medium mb-2'>Get Involved</p>
      <div className='flex justify-center'>
       <AddNewGetInvolved />
      </div>

      <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4'>
        {data &&
          data.map((event) => (
            <EditGetInvolved
              key={event.id}
              id={event.id}
              title={event.title}
              desc={event.desc}
            />
          ))}
      </div>
    </div>
  );
};

export default GetInvolved;
