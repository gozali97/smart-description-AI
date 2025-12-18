export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          clerk_id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          ai_model: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          clerk_id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          ai_model?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          clerk_id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          ai_model?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          user_id: string;
          image_url: string;
          product_name: string;
          category: string;
          key_features: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          image_url: string;
          product_name: string;
          category: string;
          key_features: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          image_url?: string;
          product_name?: string;
          category?: string;
          key_features?: string;
          created_at?: string;
        };
      };
      generations: {
        Row: {
          id: string;
          product_id: string;
          platform: string;
          tone_of_voice: string;
          result_text: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          platform: string;
          tone_of_voice: string;
          result_text: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          platform?: string;
          tone_of_voice?: string;
          result_text?: string;
          created_at?: string;
        };
      };
    };
  };
};

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Product = Database["public"]["Tables"]["products"]["Row"];
export type Generation = Database["public"]["Tables"]["generations"]["Row"];
