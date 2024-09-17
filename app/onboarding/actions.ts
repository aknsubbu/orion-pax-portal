"use server";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function completeProfile(formData: FormData) {
  const supabase = createClient();
  console.log("Server-side: Received formData", formData);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const profile = {
    id: user.id, // Add this line to set the user_id
    username: (user.id + formData.get("roll_num")) as string,
    full_name: formData.get("full_name") as string,
    avatar_url: formData.get("avatar_url") as string,
    website: formData.get("website") as string,
    phone: formData.get("phone") as string,
    year: formData.get("year") as string,
    projects_count: formData.get("projects_count") as string,
    bio: formData.get("bio") as string,
    roll_num: formData.get("roll_num") as string,
    email: user.email,
  };

  console.log("Server-side: Profile data", profile);

  const { error } = await supabase.from("profiles").upsert(profile).select();

  if (error) {
    console.error("Server-side: Error updating profile", error);
    throw new Error(error.message);
  }

  console.log("Server-side: Profile updated successfully");
  return redirect("/account");
}
