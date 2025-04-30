export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      prestataires: {
        Row: {
          categorie: Database["public"]["Enums"]["prestataire_categorie"] | null
          created_at: string
          description: string | null
          email: string | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          prix_a_partir_de: number | null
          prix_par_personne: number | null
          region: Database["public"]["Enums"]["region_france"] | null
          responsable_bio: string | null
          responsable_nom: string | null
          site_web: string | null
          styles: Json | null
          telephone: string | null
          updated_at: string
          ville: string | null
          visible: boolean | null
        }
        Insert: {
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          prix_a_partir_de?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Update: {
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          created_at?: string
          description?: string | null
          email?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          prix_a_partir_de?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Relationships: []
      }
      prestataires_brochures: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          prestataire_id: string
          size: number | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: string
          prestataire_id: string
          size?: number | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: string
          prestataire_id?: string
          size?: number | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "prestataires_brochures_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      prestataires_photos: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          ordre: number | null
          prestataire_id: string
          principale: boolean | null
          size: number | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: string
          ordre?: number | null
          prestataire_id: string
          principale?: boolean | null
          size?: number | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: string
          ordre?: number | null
          prestataire_id?: string
          principale?: boolean | null
          size?: number | null
          type?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "prestataires_photos_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          budget: number | null
          created_at: string
          guest_count: number | null
          id: string
          location: string | null
          title: string
          updated_at: string
          user_id: string
          wedding_date: string | null
        }
        Insert: {
          budget?: number | null
          created_at?: string
          guest_count?: number | null
          id?: string
          location?: string | null
          title: string
          updated_at?: string
          user_id: string
          wedding_date?: string | null
        }
        Update: {
          budget?: number | null
          created_at?: string
          guest_count?: number | null
          id?: string
          location?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
        }
        Relationships: []
      }
      vendors_tracking: {
        Row: {
          category: string
          contact_date: string | null
          created_at: string
          id: string
          notes: string | null
          prestataire_id: string | null
          project_id: string | null
          response_date: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          updated_at: string
          user_id: string
          vendor_name: string
        }
        Insert: {
          category: string
          contact_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id: string
          vendor_name: string
        }
        Update: {
          category?: string
          contact_date?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          updated_at?: string
          user_id?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_tracking_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_tracking_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      prestataire_categorie:
        | "Lieu de réception"
        | "Traiteur"
        | "Photographe"
        | "Vidéaste"
        | "Coordination"
        | "DJ"
        | "Fleuriste"
        | "Robe de mariée"
        | "Décoration"
      region_france:
        | "Île-de-France"
        | "Auvergne-Rhône-Alpes"
        | "Bourgogne-Franche-Comté"
        | "Bretagne"
        | "Centre-Val de Loire"
        | "Corse"
        | "Grand Est"
        | "Hauts-de-France"
        | "Normandie"
        | "Nouvelle-Aquitaine"
        | "Occitanie"
        | "Pays de la Loire"
        | "Provence-Alpes-Côte d'Azur"
      vendor_status:
        | "à contacter"
        | "contactés"
        | "en attente"
        | "réponse reçue"
        | "à valider"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      prestataire_categorie: [
        "Lieu de réception",
        "Traiteur",
        "Photographe",
        "Vidéaste",
        "Coordination",
        "DJ",
        "Fleuriste",
        "Robe de mariée",
        "Décoration",
      ],
      region_france: [
        "Île-de-France",
        "Auvergne-Rhône-Alpes",
        "Bourgogne-Franche-Comté",
        "Bretagne",
        "Centre-Val de Loire",
        "Corse",
        "Grand Est",
        "Hauts-de-France",
        "Normandie",
        "Nouvelle-Aquitaine",
        "Occitanie",
        "Pays de la Loire",
        "Provence-Alpes-Côte d'Azur",
      ],
      vendor_status: [
        "à contacter",
        "contactés",
        "en attente",
        "réponse reçue",
        "à valider",
      ],
    },
  },
} as const
