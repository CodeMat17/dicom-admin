import FormComponent from "@/components/FormComponent";
import Image from "next/image";

type SearchParamsProps = {
  searchParams: {
    message: string;
  };
};

export default function LoginPage({ searchParams }: SearchParamsProps) {
  return (
    <div className='px-4 py-8 w-full max-w-md mx-auto flex flex-col items-center mt-6'>
    
      <h2 className='mb-6 text-xl font-medium'>Log in</h2>

      {searchParams.message && (
        <p className='text-red-500 bg-red-500/10 rounded-lg p-3 my-2 text-sm text-center'>
          {searchParams.message}
        </p>
      )}

      <FormComponent />
    </div>
  );
}
