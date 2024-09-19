import AddNewEvent from "@/components/AddNewEvent";
import EditEvents from "@/components/EditEvents";
import { createClient } from "@/utils/supabase/server";

const UpcomingEvents = async () => {
  const supabase = createClient();

  const { data, error } = await supabase
    .from("events")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className='p-4 w-full min-h-screen bg-gray-50'>
          <p className='text-center text-lg font-medium mb-2'>Upcoming Events</p>
          <div className="flex justify-center">
              <AddNewEvent /> 
          </div>
         
      <div className='mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {data &&
          data.map((event) => (
            <EditEvents
              key={event.id}
              id={event.id}
              title={event.title}
              date={event.date}
            />
          ))}
      </div>
    </div>
  );
};

export default UpcomingEvents;
