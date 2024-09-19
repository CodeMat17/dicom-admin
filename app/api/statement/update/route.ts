import { supabaseServiceClient } from "@/utils/supabase/service";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
      const { id, newTitle, newDesc } = await request.json();

      // Validate data
      if (!id || !newTitle || !newDesc) {
        return NextResponse.json(
          { error: "Missing required fields" },
          { status: 400 }
        );
      }

      // Update team data in the database
      const { error } = await supabaseServiceClient
        .from("statements")
        .update({
          title: newTitle,
          desc: newDesc,
        })
        .eq("id", id)
        .select();

      if (error) {
        throw error;
      }

      return NextResponse.json(
        { message: "statements updated successfully" },
        { status: 200 }
      );
    } catch (error) {
      // Ensure error is of type Error to access message property
      if (error instanceof Error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      } else {
        return NextResponse.json(
          { error: "Unknown error occurred" },
          { status: 500 }
        );
      }
    }
 }