export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      events: {
        Row: {
          city: string | null
          created_at: string
          date: string
          description: string | null
          fight_count: number
          id: string
          name: string
          organizer: string | null
          poster_url: string | null
          slug: string | null
          status: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          date: string
          description?: string | null
          fight_count?: number
          id?: string
          name: string
          organizer?: string | null
          poster_url?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          date?: string
          description?: string | null
          fight_count?: number
          id?: string
          name?: string
          organizer?: string | null
          poster_url?: string | null
          slug?: string | null
          status?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          item_type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          item_type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          item_type?: string
          user_id?: string
        }
        Relationships: []
      }
      fighters: {
        Row: {
          bio: string | null
          city: string | null
          created_at: string
          date_of_birth: string | null
          draws: number
          id: string
          knockouts: number
          losses: number
          name: string
          name_en: string | null
          name_kz: string | null
          nationality: string | null
          p4p_rank: number | null
          photo_url: string | null
          rating: number
          slug: string | null
          stance: string | null
          status: string
          updated_at: string
          weight_class: string | null
          weight_class_id: string | null
          wins: number
        }
        Insert: {
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          draws?: number
          id?: string
          knockouts?: number
          losses?: number
          name: string
          name_en?: string | null
          name_kz?: string | null
          nationality?: string | null
          p4p_rank?: number | null
          photo_url?: string | null
          rating?: number
          slug?: string | null
          stance?: string | null
          status?: string
          updated_at?: string
          weight_class?: string | null
          weight_class_id?: string | null
          wins?: number
        }
        Update: {
          bio?: string | null
          city?: string | null
          created_at?: string
          date_of_birth?: string | null
          draws?: number
          id?: string
          knockouts?: number
          losses?: number
          name?: string
          name_en?: string | null
          name_kz?: string | null
          nationality?: string | null
          p4p_rank?: number | null
          photo_url?: string | null
          rating?: number
          slug?: string | null
          stance?: string | null
          status?: string
          updated_at?: string
          weight_class?: string | null
          weight_class_id?: string | null
          wins?: number
        }
        Relationships: [
          {
            foreignKeyName: "fighters_weight_class_id_fkey"
            columns: ["weight_class_id"]
            isOneToOne: false
            referencedRelation: "weight_classes"
            referencedColumns: ["id"]
          },
        ]
      }
      fights: {
        Row: {
          city: string | null
          created_at: string
          date: string
          event_id: string | null
          fighter1_id: string | null
          fighter2_id: string | null
          id: string
          judge1: string | null
          judge1_score: string | null
          judge2: string | null
          judge2_score: string | null
          judge3: string | null
          judge3_score: string | null
          method: string | null
          notes: string | null
          referee: string | null
          result: string | null
          rounds: number | null
          scheduled_rounds: number | null
          updated_at: string
          venue: string | null
          weight_class: string | null
          winner_id: string | null
        }
        Insert: {
          city?: string | null
          created_at?: string
          date: string
          event_id?: string | null
          fighter1_id?: string | null
          fighter2_id?: string | null
          id?: string
          judge1?: string | null
          judge1_score?: string | null
          judge2?: string | null
          judge2_score?: string | null
          judge3?: string | null
          judge3_score?: string | null
          method?: string | null
          notes?: string | null
          referee?: string | null
          result?: string | null
          rounds?: number | null
          scheduled_rounds?: number | null
          updated_at?: string
          venue?: string | null
          weight_class?: string | null
          winner_id?: string | null
        }
        Update: {
          city?: string | null
          created_at?: string
          date?: string
          event_id?: string | null
          fighter1_id?: string | null
          fighter2_id?: string | null
          id?: string
          judge1?: string | null
          judge1_score?: string | null
          judge2?: string | null
          judge2_score?: string | null
          judge3?: string | null
          judge3_score?: string | null
          method?: string | null
          notes?: string | null
          referee?: string | null
          result?: string | null
          rounds?: number | null
          scheduled_rounds?: number | null
          updated_at?: string
          venue?: string | null
          weight_class?: string | null
          winner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fights_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_fighter1_id_fkey"
            columns: ["fighter1_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_fighter2_id_fkey"
            columns: ["fighter2_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fights_winner_id_fkey"
            columns: ["winner_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      news: {
        Row: {
          author_id: string | null
          category: string | null
          content: string | null
          cover_image_url: string | null
          created_at: string
          excerpt: string | null
          featured: boolean
          id: string
          published_at: string | null
          slug: string | null
          status: string
          tags: string[] | null
          title: string
          updated_at: string
        }
        Insert: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title: string
          updated_at?: string
        }
        Update: {
          author_id?: string | null
          category?: string | null
          content?: string | null
          cover_image_url?: string | null
          created_at?: string
          excerpt?: string | null
          featured?: boolean
          id?: string
          published_at?: string | null
          slug?: string | null
          status?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          city: string | null
          created_at: string
          full_name: string | null
          id: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          city?: string | null
          created_at?: string
          full_name?: string | null
          id?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      ranking_history: {
        Row: {
          created_at: string
          fighter_id: string
          id: string
          is_p4p: boolean
          rank: number
          rating: number
          snapshot_date: string
          weight_class: string | null
        }
        Insert: {
          created_at?: string
          fighter_id: string
          id?: string
          is_p4p?: boolean
          rank: number
          rating: number
          snapshot_date?: string
          weight_class?: string | null
        }
        Update: {
          created_at?: string
          fighter_id?: string
          id?: string
          is_p4p?: boolean
          rank?: number
          rating?: number
          snapshot_date?: string
          weight_class?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ranking_history_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      rankings: {
        Row: {
          change: number
          created_at: string
          fighter_id: string
          id: string
          is_p4p: boolean
          rank: number
          rating: number
          updated_at: string
          weight_class: string
        }
        Insert: {
          change?: number
          created_at?: string
          fighter_id: string
          id?: string
          is_p4p?: boolean
          rank: number
          rating?: number
          updated_at?: string
          weight_class: string
        }
        Update: {
          change?: number
          created_at?: string
          fighter_id?: string
          id?: string
          is_p4p?: boolean
          rank?: number
          rating?: number
          updated_at?: string
          weight_class?: string
        }
        Relationships: [
          {
            foreignKeyName: "rankings_fighter_id_fkey"
            columns: ["fighter_id"]
            isOneToOne: false
            referencedRelation: "fighters"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weight_classes: {
        Row: {
          created_at: string
          id: string
          max_weight: number | null
          min_weight: number | null
          name: string
          name_en: string | null
          name_kz: string | null
          sort_order: number
        }
        Insert: {
          created_at?: string
          id?: string
          max_weight?: number | null
          min_weight?: number | null
          name: string
          name_en?: string | null
          name_kz?: string | null
          sort_order?: number
        }
        Update: {
          created_at?: string
          id?: string
          max_weight?: number | null
          min_weight?: number | null
          name?: string
          name_en?: string | null
          name_kz?: string | null
          sort_order?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "editor" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "editor", "user"],
    },
  },
} as const
