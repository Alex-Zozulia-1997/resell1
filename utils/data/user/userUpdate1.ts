import { cookies } from 'next/headers';
import { createServerClient } from '@supabase/ssr';

export async function updateUser({
  email,
  resID,
}: {
  email: string;
  resID: string;
}) {
  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );

  try {
    const { data, error } = await supabase
      .from('user') // Assuming your table name is `user`
      .update({ resID }) // Update the `resId` column
      .eq('email', email); // Match the row with the specified email

    if (error) {
      console.error('Error updating user:', error);
      throw new Error(error.message);
    }

    console.log('Updated user data:', data);
    return data;
  } catch (err: any) {
    console.error('Unexpected error:', err.message);
    throw new Error(err.message);
  }
}
