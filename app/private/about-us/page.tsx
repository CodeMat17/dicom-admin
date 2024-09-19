import StatementModal from "@/components/StatementModal";
import TeamCard from "@/components/TeamCard";
import UploadPhoto from "@/components/UploadPhoto";
import { createClient } from "@/utils/supabase/server";

const AboutUs = async () => {
  const supabase = createClient();

  const { data: statements, error: statementError } = await supabase
    .from("statements")
    .select("id, title, desc")
    .order("created_at", { ascending: true });

  return (
    <div className='w-full min-h-screen p-4'>
      <p className='text-center text-2xl font-semibold'>About Us</p>
      <div className='mt-6'>
        <p className='text-center text-xl font-medium'>Statements</p>
        <div
          className='mt-6 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4
              '>
          {statements &&
            statements.map((statement) => (
              <div key={statement.id} className='relative bg-black/10 p-7 rounded-xl'>
                <p className='text-xl font-medium'>{statement.title}</p>
                <p className='mt-1'>{statement.desc} </p>
                <StatementModal id={statement.id} title={statement.title} desc={statement.desc} />
              </div>
            ))}
        </div>
      </div>
    
      <TeamCard />
    </div>
  );
};

export default AboutUs;
