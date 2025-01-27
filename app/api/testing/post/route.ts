// /pages/api/achievements/post.ts

import { NextApiRequest, NextApiResponse } from "next";
import { supabaseServiceClient } from "@/utils/supabase/service";



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Ensure the method is POST
  if (req.method === "POST") {
    const { title, content } = req.body;

    try {
      const { data, error } = await supabaseServiceClient
        .from("testing")
        .insert([{ title, content }]).select();

      if (error) throw error;

      res
        .status(200)
        .json({ message: "Testing posted successfully", data });
    } catch (error) {
      res.status(500).json({ error: error });
    }
  } else {
    // Return 405 if the method is not POST
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
