import { NextResponse } from "next/server";
import { supabaseServiceClient } from "@/utils/supabase/service";

export async function PUT(req: Request) {
  try {
    const { id, title, content } = await req.json();

    const { error } = await supabaseServiceClient
      .from("achievements")
      .update({ title, content })
      .eq("id", id).select();

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Achievement updated successfully",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message });
  }
}