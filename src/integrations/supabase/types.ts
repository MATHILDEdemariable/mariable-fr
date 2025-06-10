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
          id: number
          user_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          user_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          user_id?: string | null
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
      budgets_detail: {
        Row: {
          actual: number | null
          category_name: string
          created_at: string
          deposit: number | null
          estimated: number | null
          id: string
          item_id: string
          item_name: string
          payment_note: string | null
          remaining: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          actual?: number | null
          category_name: string
          created_at?: string
          deposit?: number | null
          estimated?: number | null
          id?: string
          item_id: string
          item_name: string
          payment_note?: string | null
          remaining?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          actual?: number | null
          category_name?: string
          created_at?: string
          deposit?: number | null
          estimated?: number | null
          id?: string
          item_id?: string
          item_name?: string
          payment_note?: string | null
          remaining?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      coordination_parameters: {
        Row: {
          created_at: string
          id: string
          name: string
          parameters: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
          parameters?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          parameters?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
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
      dashboard_share_tokens: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          expires_at: string | null
          id: string
          token: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          token: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          token?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_planning: {
        Row: {
          created_at: string
          form_responses: Json
          id: string
          planning_blocks: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          form_responses?: Json
          id?: string
          planning_blocks?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          form_responses?: Json
          id?: string
          planning_blocks?: Json
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      generated_tasks: {
        Row: {
          category: string
          completed: boolean | null
          created_at: string | null
          description: string | null
          due_date: string | null
          id: string
          label: string
          position: number
          priority: string | null
          quiz_result_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          category: string
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          label: string
          position: number
          priority?: string | null
          quiz_result_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          category?: string
          completed?: boolean | null
          created_at?: string | null
          description?: string | null
          due_date?: string | null
          id?: string
          label?: string
          position?: number
          priority?: string | null
          quiz_result_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "generated_tasks_quiz_result_id_fkey"
            columns: ["quiz_result_id"]
            isOneToOne: false
            referencedRelation: "user_quiz_results"
            referencedColumns: ["id"]
          },
        ]
      }
      jour_m_reservations: {
        Row: {
          admin_notes: string | null
          budget: string | null
          contact_jour_j: Json | null
          created_at: string
          current_organization: string
          delegation_tasks: string | null
          deroulement_mariage: string | null
          documents_links: string | null
          email: string
          first_name: string
          guest_count: number
          hear_about_us: string | null
          id: string
          last_name: string
          partner_name: string | null
          phone: string
          prestataires_reserves: Json | null
          processed_at: string | null
          processed_by: string | null
          services_souhaites: Json | null
          specific_needs: string | null
          status: string | null
          updated_at: string
          uploaded_files: Json | null
          wedding_date: string
          wedding_location: string
        }
        Insert: {
          admin_notes?: string | null
          budget?: string | null
          contact_jour_j?: Json | null
          created_at?: string
          current_organization: string
          delegation_tasks?: string | null
          deroulement_mariage?: string | null
          documents_links?: string | null
          email: string
          first_name: string
          guest_count: number
          hear_about_us?: string | null
          id?: string
          last_name: string
          partner_name?: string | null
          phone: string
          prestataires_reserves?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          services_souhaites?: Json | null
          specific_needs?: string | null
          status?: string | null
          updated_at?: string
          uploaded_files?: Json | null
          wedding_date: string
          wedding_location: string
        }
        Update: {
          admin_notes?: string | null
          budget?: string | null
          contact_jour_j?: Json | null
          created_at?: string
          current_organization?: string
          delegation_tasks?: string | null
          deroulement_mariage?: string | null
          documents_links?: string | null
          email?: string
          first_name?: string
          guest_count?: number
          hear_about_us?: string | null
          id?: string
          last_name?: string
          partner_name?: string | null
          phone?: string
          prestataires_reserves?: Json | null
          processed_at?: string | null
          processed_by?: string | null
          services_souhaites?: Json | null
          specific_needs?: string | null
          status?: string | null
          updated_at?: string
          uploaded_files?: Json | null
          wedding_date?: string
          wedding_location?: string
        }
        Relationships: []
      }
      planning_questions: {
        Row: {
          categorie: string
          created_at: string
          duree_minutes: number | null
          id: string
          label: string
          label_affichage_front: string | null
          option_name: string
          options: Json | null
          ordre_affichage: number
          type: string
          updated_at: string
          visible_si: Json | null
        }
        Insert: {
          categorie: string
          created_at?: string
          duree_minutes?: number | null
          id?: string
          label: string
          label_affichage_front?: string | null
          option_name: string
          options?: Json | null
          ordre_affichage: number
          type: string
          updated_at?: string
          visible_si?: Json | null
        }
        Update: {
          categorie?: string
          created_at?: string
          duree_minutes?: number | null
          id?: string
          label?: string
          label_affichage_front?: string | null
          option_name?: string
          options?: Json | null
          ordre_affichage?: number
          type?: string
          updated_at?: string
          visible_si?: Json | null
        }
        Relationships: []
      }
      planning_reponses_utilisateur: {
        Row: {
          date_creation: string
          email: string | null
          id: string
          planning_genere: Json | null
          reponses: Json
          user_id: string
        }
        Insert: {
          date_creation?: string
          email?: string | null
          id?: string
          planning_genere?: Json | null
          reponses?: Json
          user_id: string
        }
        Update: {
          date_creation?: string
          email?: string | null
          id?: string
          planning_genere?: Json | null
          reponses?: Json
          user_id?: string
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
      prestataires_brochures_preprod: {
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
            foreignKeyName: "prestataires_brochures_preprod_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      prestataires_documents_preprod: {
        Row: {
          created_at: string
          filename: string | null
          id: string
          item_id: string
          size: number | null
          type: string | null
          url: string
        }
        Insert: {
          created_at?: string
          filename?: string | null
          id?: string
          item_id: string
          size?: number | null
          type?: string | null
          url: string
        }
        Update: {
          created_at?: string
          filename?: string | null
          id?: string
          item_id?: string
          size?: number | null
          type?: string | null
          url?: string
        }
        Relationships: []
      }
      prestataires_meta: {
        Row: {
          created_at: string
          id: number
          meta_key: string | null
          meta_value: string | null
          prestataire_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          prestataire_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          meta_key?: string | null
          meta_value?: string | null
          prestataire_id?: string | null
        }
        Relationships: []
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
        Relationships: [
          {
            foreignKeyName: "prestataires_photos_preprod_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires_rows"
            referencedColumns: ["id"]
          },
        ]
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
          description_more: string | null
          email: string | null
          featured: boolean | null
          first_price_package: number | null
          hebergement_inclus: boolean | null
          id: string
          latitude: number | null
          longitude: number | null
          nom: string
          nombre_couchages: number | null
          partner: boolean | null
          prix_a_partir_de: number | null
          prix_minimum: number | null
          prix_par_personne: number | null
          region: Database["public"]["Enums"]["region_france"] | null
          responsable_bio: string | null
          responsable_nom: string | null
          second_price_package: number | null
          siret: string | null
          site_web: string | null
          slug: string | null
          styles: Json | null
          telephone: string | null
          third_price_package: number | null
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
          description_more?: string | null
          email?: string | null
          featured?: boolean | null
          first_price_package?: number | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom: string
          nombre_couchages?: number | null
          partner?: boolean | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          second_price_package?: number | null
          siret?: string | null
          site_web?: string | null
          slug?: string | null
          styles?: Json | null
          telephone?: string | null
          third_price_package?: number | null
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
          description_more?: string | null
          email?: string | null
          featured?: boolean | null
          first_price_package?: number | null
          hebergement_inclus?: boolean | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          nom?: string
          nombre_couchages?: number | null
          partner?: boolean | null
          prix_a_partir_de?: number | null
          prix_minimum?: number | null
          prix_par_personne?: number | null
          region?: Database["public"]["Enums"]["region_france"] | null
          responsable_bio?: string | null
          responsable_nom?: string | null
          second_price_package?: number | null
          siret?: string | null
          site_web?: string | null
          slug?: string | null
          styles?: Json | null
          telephone?: string | null
          third_price_package?: number | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          guest_count: number | null
          id: string
          last_name: string | null
          updated_at: string
          wedding_date: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          guest_count?: number | null
          id: string
          last_name?: string | null
          updated_at?: string
          wedding_date?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          guest_count?: number | null
          id?: string
          last_name?: string | null
          updated_at?: string
          wedding_date?: string | null
        }
        Relationships: []
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
      quiz_email_captures: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          id: string
          quiz_score: number | null
          quiz_status: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          quiz_score?: number | null
          quiz_status?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          quiz_score?: number | null
          quiz_status?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      quiz_questions: {
        Row: {
          created_at: string
          id: string
          options: Json
          order_index: number
          "ORDRE D'AFFICHAGE": number | null
          question: string
          scores: Json
          section: Database["public"]["Enums"]["quiz_section"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          options?: Json
          order_index: number
          "ORDRE D'AFFICHAGE"?: number | null
          question: string
          scores?: Json
          section: Database["public"]["Enums"]["quiz_section"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          options?: Json
          order_index?: number
          "ORDRE D'AFFICHAGE"?: number | null
          question?: string
          scores?: Json
          section?: Database["public"]["Enums"]["quiz_section"]
          updated_at?: string
        }
        Relationships: []
      }
      quiz_scoring: {
        Row: {
          categories: Json
          created_at: string
          id: string
          objectives: Json
          score_max: number
          score_min: number
          status: string
          updated_at: string
        }
        Insert: {
          categories?: Json
          created_at?: string
          id?: string
          objectives?: Json
          score_max: number
          score_min: number
          status: string
          updated_at?: string
        }
        Update: {
          categories?: Json
          created_at?: string
          id?: string
          objectives?: Json
          score_max?: number
          score_min?: number
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      team_tasks: {
        Row: {
          created_at: string
          id: string
          is_custom: boolean
          is_hidden: boolean
          phase: string
          position: number
          responsible_person: string | null
          task_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_custom?: boolean
          is_hidden?: boolean
          phase: string
          position?: number
          responsible_person?: string | null
          task_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_custom?: boolean
          is_hidden?: boolean
          phase?: string
          position?: number
          responsible_person?: string | null
          task_name?: string
          updated_at?: string
          user_id?: string
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
      user_planning_responses: {
        Row: {
          completed_steps: string[] | null
          created_at: string | null
          generated_tasks: Json | null
          id: string
          progress_percentage: number | null
          responses: Json
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed_steps?: string[] | null
          created_at?: string | null
          generated_tasks?: Json | null
          id?: string
          progress_percentage?: number | null
          responses?: Json
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed_steps?: string[] | null
          created_at?: string | null
          generated_tasks?: Json | null
          id?: string
          progress_percentage?: number | null
          responses?: Json
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          is_complete: boolean
          step_name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_complete?: boolean
          step_name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          is_complete?: boolean
          step_name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_quiz_results: {
        Row: {
          categories: Json | null
          created_at: string | null
          email: string | null
          id: string
          level: string
          objectives: Json | null
          score: number
          status: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          categories?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          level: string
          objectives?: Json | null
          score: number
          status: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          categories?: Json | null
          created_at?: string | null
          email?: string | null
          id?: string
          level?: string
          objectives?: Json | null
          score?: number
          status?: string
          updated_at?: string | null
          user_id?: string | null
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
            referencedRelation: "prestataires_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      vendors_contact_preprod: {
        Row: {
          client_id: string | null
          created_at: string
          email_client: string | null
          email_presta: string | null
          id: string
          message: string | null
          origin_id: string | null
          origin_user: boolean | null
          prestataire_id: string | null
        }
        Insert: {
          client_id?: string | null
          created_at?: string
          email_client?: string | null
          email_presta?: string | null
          id?: string
          message?: string | null
          origin_id?: string | null
          origin_user?: boolean | null
          prestataire_id?: string | null
        }
        Update: {
          client_id?: string | null
          created_at?: string
          email_client?: string | null
          email_presta?: string | null
          id?: string
          message?: string | null
          origin_id?: string | null
          origin_user?: boolean | null
          prestataire_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vendors_contact_preprod_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires_rows"
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
          email_client: string | null
          email_presta: string | null
          first_date_rdv: string | null
          id: string
          key_prestataire: string | null
          notes: string | null
          prestataire_id: string | null
          project_id: string | null
          response_date: string | null
          second_date_rdv: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv: string | null
          updated_at: string
          user_id: string
          valide_date_rdv: number | null
          vendor_name: string
        }
        Insert: {
          category: string
          contact_date?: string | null
          created_at?: string
          email_client?: string | null
          email_presta?: string | null
          first_date_rdv?: string | null
          id?: string
          key_prestataire?: string | null
          notes?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          second_date_rdv?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv?: string | null
          updated_at?: string
          user_id: string
          valide_date_rdv?: number | null
          vendor_name: string
        }
        Update: {
          category?: string
          contact_date?: string | null
          created_at?: string
          email_client?: string | null
          email_presta?: string | null
          first_date_rdv?: string | null
          id?: string
          key_prestataire?: string | null
          notes?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          second_date_rdv?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv?: string | null
          updated_at?: string
          user_id?: string
          valide_date_rdv?: number | null
          vendor_name?: string
        }
        Relationships: [
          {
            foreignKeyName: "vendors_tracking_preprod_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vendors_tracking_preprod_project_id_fkey1"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "prestataires_rows"
            referencedColumns: ["id"]
          },
        ]
      }
      wedding_faq: {
        Row: {
          answer: string
          category: string
          created_at: string
          id: string
          question: string
          tags: Json
          updated_at: string
        }
        Insert: {
          answer: string
          category: string
          created_at?: string
          id?: string
          question: string
          tags?: Json
          updated_at?: string
        }
        Update: {
          answer?: string
          category?: string
          created_at?: string
          id?: string
          question?: string
          tags?: Json
          updated_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_valid_share_token: {
        Args: { token_value: string }
        Returns: boolean
      }
      validate_share_token: {
        Args: { token_value: string }
        Returns: {
          is_valid: boolean
          user_id: string
        }[]
      }
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
      quiz_section:
        | "Organisation Générale"
        | "Réception"
        | "Cérémonie"
        | "Invités"
        | "Mariés"
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
        | "annuler"
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
      quiz_section: [
        "Organisation Générale",
        "Réception",
        "Cérémonie",
        "Invités",
        "Mariés",
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
        "annuler",
      ],
    },
  },
} as const
