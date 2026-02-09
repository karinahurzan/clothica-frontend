export interface UserProfile {
  id: string;
  email: string;
  full_name: string | null;
  phone_number: string | null;
  city: string | null;
  nova_post_number: string | null;
  is_admin: boolean;
}

export interface UserProfileUpdatePayload {
  full_name?: string | null;
  email?: string | null;
  phone_number?: string | null;
  city?: string | null;
  nova_post_number?: string | null;
}
