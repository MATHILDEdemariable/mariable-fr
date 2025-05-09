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
      admin_users: {
        Row: {
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets_dashboard: {
        Row: {
          breakdown: Json
          created_at: string
          guests_count: number
          id: string
          project_id: string | null
          region: string
          season: string
          selected_vendors: string[]
          service_level: string
          total_budget: number
          updated_at: string
          user_id: string
        }
        Insert: {
          breakdown: Json
          created_at?: string
          guests_count: number
          id?: string
          project_id?: string | null
          region: string
          season: string
          selected_vendors: string[]
          service_level: string
          total_budget: number
          updated_at?: string
          user_id: string
        }
        Update: {
          breakdown?: Json
          created_at?: string
          guests_count?: number
          id?: string
          project_id?: string | null
          region?: string
          season?: string
          selected_vendors?: string[]
          service_level?: string
          total_budget?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "budgets_dashboard_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      couple_formulaire: {
        Row: {
          category: string
          default_value: string | null
          id: string
          input_type: Database["public"]["Enums"]["input_type"]
          options: Json | null
          question_label: string
          question_order: number
          question_title: string
        }
        Insert: {
          category: string
          default_value?: string | null
          id?: string
          input_type: Database["public"]["Enums"]["input_type"]
          options?: Json | null
          question_label: string
          question_order: number
          question_title: string
        }
        Update: {
          category?: string
          default_value?: string | null
          id?: string
          input_type?: Database["public"]["Enums"]["input_type"]
          options?: Json | null
          question_label?: string
          question_order?: number
          question_title?: string
        }
        Relationships: []
      }
      prestataires: {
        Row: {
          accord_cgv: boolean | null
          accord_referencement: boolean | null
          assurance_nom: string | null
          capacite_invites: number | null
          categorie: Database["public"]["Enums"]["prestataire_categorie"] | null
          categorie_lieu: string | null
          created_at: string
          description: string | null
          email: string | null
          hebergement_inclus: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          nombre_couchages: number | null
          prix_a_partir_de: number | null
          prix_minimum: number | null
          prix_par_personne: number | null
          region: Database["public"]["Enums"]["region_france"] | null
          responsable_bio: string | null
          responsable_nom: string | null
          siret: string | null
          site_web: string | null
          styles: Json | null
          telephone: string | null
          updated_at: string
          ville: string | null
          visible: boolean | null
        }
        Insert: {
          accord_cgv?: boolean | null
          accord_referencement?: boolean | null
          assurance_nom?: string | null
          capacite_invites?: number | null
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          categorie_lieu?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          nombre_couchages?: number | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          siret?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Update: {
          accord_cgv?: boolean | null
          accord_referencement?: boolean | null
          assurance_nom?: string | null
          capacite_invites?: number | null
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          categorie_lieu?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          nombre_couchages?: number | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          siret?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Relationships: []
      }
      prestataires_rows: {
        Row: {
          accord_cgv: boolean | null
          accord_referencement: boolean | null
          assurance_nom: string | null
          capacite_invites: number | null
          categorie: Database["public"]["Enums"]["prestataire_categorie"] | null
          categorie_lieu: string | null
          created_at: string
          description: string | null
          email: string | null
          hebergement_inclus: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string | null
          nombre_couchages: number | null
          prix_a_partir_de: number | null
          prix_minimum: number | null
          prix_par_personne: number | null
          region: Database["public"]["Enums"]["region_france"] | null
          responsable_bio: string | null
          responsable_nom: string | null
          siret: string | null
          site_web: string | null
          styles: Json | null
          telephone: string | null
          updated_at: string
          ville: string | null
          featured: boolean | null
          visible: boolean | null
          prestataires_photos_preprod:{
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
          slug?: string | null
        }
        Insert: {
          accord_cgv?: boolean | null
          accord_referencement?: boolean | null
          assurance_nom?: string | null
          capacite_invites?: number | null
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          categorie_lieu?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string | null
          nombre_couchages?: number | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          siret?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          featured?: boolean | null
          visible: boolean | null
          prestataires_photos_preprod:{
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
          slug?: string | null
        }
        Update: {
          accord_cgv?: boolean | null
          accord_referencement?: boolean | null
          assurance_nom?: string | null
          capacite_invites?: number | null
          categorie?:
            | Database["public"]["Enums"]["prestataire_categorie"]
            | null
          categorie_lieu?: string | null
          created_at?: string
          description?: string | null
          email?: string | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string | null
          nombre_couchages?: number | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          siret?: string | null
          site_web?: string | null
          styles?: Json | null
          telephone?: string | null
          updated_at?: string
          ville?: string | null
          featured?: boolean | null
          visible: boolean | null
          prestataires_photos_preprod:{
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
          slug?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestataires_photos_prestataire_preprod_id_fkey",
            columns: ["id"],
            isOneToOne: true,
            referencedRelation: "prestataires_photos_preprod",
            referencedColumns: ["prestataire_id"]
          }
        ]
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
      prestataires_photos_preprod: {
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
        // Relationships: [
        //   {
        //     foreignKeyName: "prestataires_photos_prestataire_preprod_id_fkey"
        //     columns: ["prestataire_id"]
        //     isOneToOne: false
        //     referencedRelation: "prestataires_row"
        //     referencedColumns: ["id"]
        //   },
        // ]
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
      todos_planification: {
        Row: {
          category: string | null
          completed: boolean
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          label: string
          position: number
          priority: Database["public"]["Enums"]["todo_priority"]
          updated_at: string
          user_id: string
        }
        Insert: {
          category?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          label: string
          position: number
          priority: Database["public"]["Enums"]["todo_priority"]
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string | null
          completed?: boolean
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          label?: string
          position?: number
          priority?: Database["public"]["Enums"]["todo_priority"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vendor_wishlist: {
        Row: {
          created_at: string
          id: string
          user_id: string
          vendor_category: string | null
          vendor_id: string
          vendor_name: string
        }
        Insert: {
          created_at?: string
          id?: string
          user_id: string
          vendor_category?: string | null
          vendor_id: string
          vendor_name: string
        }
        Update: {
          created_at?: string
          id?: string
          user_id?: string
          vendor_category?: string | null
          vendor_id?: string
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendor_wishlist_vendor_id_fkey"
            columns: ["vendor_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
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
      vendors_tracking_preprod: {
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
      input_type: "select" | "input" | "checkbox"
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
      todo_priority: "haute" | "moyenne" | "basse"
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
      input_type: ["select", "input", "checkbox"],
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
      todo_priority: ["haute", "moyenne", "basse"],
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
