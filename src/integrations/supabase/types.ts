export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_access_tokens: {
        Row: {
          created_at: string | null
          expires_at: string | null
          id: string
          is_active: boolean | null
          token: string
        }
        Insert: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          token: string
        }
        Update: {
          created_at?: string | null
          expires_at?: string | null
          id?: string
          is_active?: boolean | null
          token?: string
        }
        Relationships: []
      }
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
      blog_posts: {
        Row: {
          background_image_url: string | null
          category: string | null
          content: string | null
          created_at: string
          featured: boolean
          h1_title: string | null
          h2_titles: Json | null
          id: string
          meta_description: string | null
          meta_title: string | null
          order_index: number
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["blog_status"]
          subtitle: string | null
          tags: Json | null
          title: string
          updated_at: string | null
        }
        Insert: {
          background_image_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured?: boolean
          h1_title?: string | null
          h2_titles?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["blog_status"]
          subtitle?: string | null
          tags?: Json | null
          title: string
          updated_at?: string | null
        }
        Update: {
          background_image_url?: string | null
          category?: string | null
          content?: string | null
          created_at?: string
          featured?: boolean
          h1_title?: string | null
          h2_titles?: Json | null
          id?: string
          meta_description?: string | null
          meta_title?: string | null
          order_index?: number
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["blog_status"]
          subtitle?: string | null
          tags?: Json | null
          title?: string
          updated_at?: string | null
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
      coordination_documents: {
        Row: {
          assigned_to: string | null
          category: string | null
          coordination_id: string
          created_at: string
          description: string | null
          file_path: string | null
          file_size: number | null
          file_type: string | null
          file_url: string
          id: string
          mime_type: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: string | null
          category?: string | null
          coordination_id: string
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          mime_type?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: string | null
          category?: string | null
          coordination_id?: string
          created_at?: string
          description?: string | null
          file_path?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          mime_type?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordination_documents_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "coordination_team"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coordination_documents_coordination_id_fkey"
            columns: ["coordination_id"]
            isOneToOne: false
            referencedRelation: "wedding_coordination"
            referencedColumns: ["id"]
          },
        ]
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
      coordination_pinterest: {
        Row: {
          coordination_id: string
          created_at: string
          description: string | null
          id: string
          pinterest_url: string
          title: string
          updated_at: string
        }
        Insert: {
          coordination_id: string
          created_at?: string
          description?: string | null
          id?: string
          pinterest_url: string
          title: string
          updated_at?: string
        }
        Update: {
          coordination_id?: string
          created_at?: string
          description?: string | null
          id?: string
          pinterest_url?: string
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordination_pinterest_coordination_id_fkey"
            columns: ["coordination_id"]
            isOneToOne: false
            referencedRelation: "wedding_coordination"
            referencedColumns: ["id"]
          },
        ]
      }
      coordination_planning: {
        Row: {
          assigned_to: Json | null
          category: string
          coordination_id: string
          created_at: string
          description: string | null
          duration: number | null
          end_time: string | null
          id: string
          is_ai_generated: boolean | null
          parallel_group: string | null
          position: number | null
          priority: string | null
          start_time: string | null
          title: string
          updated_at: string
        }
        Insert: {
          assigned_to?: Json | null
          category?: string
          coordination_id: string
          created_at?: string
          description?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          is_ai_generated?: boolean | null
          parallel_group?: string | null
          position?: number | null
          priority?: string | null
          start_time?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          assigned_to?: Json | null
          category?: string
          coordination_id?: string
          created_at?: string
          description?: string | null
          duration?: number | null
          end_time?: string | null
          id?: string
          is_ai_generated?: boolean | null
          parallel_group?: string | null
          position?: number | null
          priority?: string | null
          start_time?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordination_planning_coordination_id_fkey"
            columns: ["coordination_id"]
            isOneToOne: false
            referencedRelation: "wedding_coordination"
            referencedColumns: ["id"]
          },
        ]
      }
      coordination_team: {
        Row: {
          coordination_id: string
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          prestataire_id: string | null
          role: string
          type: string
          updated_at: string
        }
        Insert: {
          coordination_id: string
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          prestataire_id?: string | null
          role: string
          type?: string
          updated_at?: string
        }
        Update: {
          coordination_id?: string
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          prestataire_id?: string | null
          role?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "coordination_team_coordination_id_fkey"
            columns: ["coordination_id"]
            isOneToOne: false
            referencedRelation: "wedding_coordination"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "coordination_team_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
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
      dashboard_share_tokens: {
        Row: {
          active: boolean
          created_at: string
          description: string | null
          expires_at: string | null
          filter_role: string | null
          id: string
          token: string
          user_id: string
        }
        Insert: {
          active?: boolean
          created_at?: string
          description?: string | null
          expires_at?: string | null
          filter_role?: string | null
          id?: string
          token: string
          user_id: string
        }
        Update: {
          active?: boolean
          created_at?: string
          description?: string | null
          expires_at?: string | null
          filter_role?: string | null
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
      jeunes_maries: {
        Row: {
          accept_email_contact: boolean | null
          admin_notes: string | null
          budget_approximatif: string | null
          conseils_couples: string | null
          created_at: string
          date_approbation: string | null
          date_mariage: string
          date_soumission: string | null
          email: string
          experience_partagee: string | null
          id: string
          lieu_mariage: string
          nom_complet: string
          nombre_invites: number | null
          note_experience: number | null
          photo_principale_url: string | null
          photos_mariage: Json | null
          prestataires_recommandes: Json | null
          slug: string | null
          status_moderation: string | null
          telephone: string | null
          updated_at: string
          visible: boolean | null
        }
        Insert: {
          accept_email_contact?: boolean | null
          admin_notes?: string | null
          budget_approximatif?: string | null
          conseils_couples?: string | null
          created_at?: string
          date_approbation?: string | null
          date_mariage: string
          date_soumission?: string | null
          email: string
          experience_partagee?: string | null
          id?: string
          lieu_mariage: string
          nom_complet: string
          nombre_invites?: number | null
          note_experience?: number | null
          photo_principale_url?: string | null
          photos_mariage?: Json | null
          prestataires_recommandes?: Json | null
          slug?: string | null
          status_moderation?: string | null
          telephone?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Update: {
          accept_email_contact?: boolean | null
          admin_notes?: string | null
          budget_approximatif?: string | null
          conseils_couples?: string | null
          created_at?: string
          date_approbation?: string | null
          date_mariage?: string
          date_soumission?: string | null
          email?: string
          experience_partagee?: string | null
          id?: string
          lieu_mariage?: string
          nom_complet?: string
          nombre_invites?: number | null
          note_experience?: number | null
          photo_principale_url?: string | null
          photos_mariage?: Json | null
          prestataires_recommandes?: Json | null
          slug?: string | null
          status_moderation?: string | null
          telephone?: string | null
          updated_at?: string
          visible?: boolean | null
        }
        Relationships: []
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
      paiement_accompagnement: {
        Row: {
          created_at: string
          date_mariage: string
          devise: string | null
          email: string
          id: string
          montant: number | null
          nom_complet: string
          notes: string | null
          statut: string
          stripe_payment_id: string | null
          stripe_subscription_id: string | null
          telephone_whatsapp: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          date_mariage: string
          devise?: string | null
          email: string
          id?: string
          montant?: number | null
          nom_complet: string
          notes?: string | null
          statut?: string
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          telephone_whatsapp: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          date_mariage?: string
          devise?: string | null
          email?: string
          id?: string
          montant?: number | null
          nom_complet?: string
          notes?: string | null
          statut?: string
          stripe_payment_id?: string | null
          stripe_subscription_id?: string | null
          telephone_whatsapp?: string
          updated_at?: string
        }
        Relationships: []
      }
      payment_audit: {
        Row: {
          amount: number | null
          created_at: string
          currency: string | null
          customer_email: string | null
          error_message: string | null
          id: string
          payment_intent_id: string | null
          processed_at: string
          session_id: string | null
          status: string
          stripe_event_id: string
          stripe_event_type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          error_message?: string | null
          id?: string
          payment_intent_id?: string | null
          processed_at?: string
          session_id?: string | null
          status: string
          stripe_event_id: string
          stripe_event_type: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          currency?: string | null
          customer_email?: string | null
          error_message?: string | null
          id?: string
          payment_intent_id?: string | null
          processed_at?: string
          session_id?: string | null
          status?: string
          stripe_event_id?: string
          stripe_event_type?: string
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
      planning_share_tokens: {
        Row: {
          coordination_id: string
          created_at: string
          expires_at: string | null
          id: string
          is_active: boolean
          name: string
          roles_filter: Json | null
          token: string
          updated_at: string
        }
        Insert: {
          coordination_id: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          name: string
          roles_filter?: Json | null
          token: string
          updated_at?: string
        }
        Update: {
          coordination_id?: string
          created_at?: string
          expires_at?: string | null
          id?: string
          is_active?: boolean
          name?: string
          roles_filter?: Json | null
          token?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "planning_share_tokens_coordination_id_fkey"
            columns: ["coordination_id"]
            isOneToOne: false
            referencedRelation: "wedding_coordination"
            referencedColumns: ["id"]
          },
        ]
      }
      prestataires: {
        Row: {
          accord_cgv: boolean | null
          accord_referencement: boolean | null
          assurance_nom: string | null
          capacite_invites: number | null
          categorie: Database["public"]["Enums"]["prestataire_categorie"] | null
          categorie_lieu: string | null
          commentaires_internes: string | null
          created_at: string
          date_derniere_contact: string | null
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
          status_crm: Database["public"]["Enums"]["prestataire_status"] | null
          styles: Json | null
          telephone: string | null
          timeline_actions: Json | null
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
          commentaires_internes?: string | null
          created_at?: string
          date_derniere_contact?: string | null
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
          status_crm?: Database["public"]["Enums"]["prestataire_status"] | null
          styles?: Json | null
          telephone?: string | null
          timeline_actions?: Json | null
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
          commentaires_internes?: string | null
          created_at?: string
          date_derniere_contact?: string | null
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
          status_crm?: Database["public"]["Enums"]["prestataire_status"] | null
          styles?: Json | null
          telephone?: string | null
          timeline_actions?: Json | null
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
          is_cover: boolean | null
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
          is_cover?: boolean | null
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
          is_cover?: boolean | null
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
          date_derniere_contact: string | null
          description: string | null
          description_more: string | null
          email: string | null
          featured: boolean | null
          first_price_package: number | null
          first_price_package_description: string | null
          first_price_package_name: string | null
          fourth_price_package: number | null
          fourth_price_package_description: string | null
          fourth_price_package_name: string | null
          google_business_url: string | null
          google_place_id: string | null
          google_rating: number | null
          google_reviews_count: number | null
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
          second_price_package_description: string | null
          second_price_package_name: string | null
          show_brochures: boolean | null
          show_contact_form: boolean | null
          show_description: boolean | null
          show_photos: boolean | null
          show_prices: boolean | null
          show_responsable: boolean | null
          siret: string | null
          site_web: string | null
          slug: string | null
          source_inscription: string | null
          status_crm: Database["public"]["Enums"]["prestataire_status"] | null
          styles: Json | null
          telephone: string | null
          third_price_package: number | null
          third_price_package_description: string | null
          third_price_package_name: string | null
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
          date_derniere_contact?: string | null
          description?: string | null
          description_more?: string | null
          email?: string | null
          featured?: boolean | null
          first_price_package?: number | null
          first_price_package_description?: string | null
          first_price_package_name?: string | null
          fourth_price_package?: number | null
          fourth_price_package_description?: string | null
          fourth_price_package_name?: string | null
          google_business_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
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
          second_price_package_description?: string | null
          second_price_package_name?: string | null
          show_brochures?: boolean | null
          show_contact_form?: boolean | null
          show_description?: boolean | null
          show_photos?: boolean | null
          show_prices?: boolean | null
          show_responsable?: boolean | null
          siret?: string | null
          site_web?: string | null
          slug?: string | null
          source_inscription?: string | null
          status_crm?: Database["public"]["Enums"]["prestataire_status"] | null
          styles?: Json | null
          telephone?: string | null
          third_price_package?: number | null
          third_price_package_description?: string | null
          third_price_package_name?: string | null
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
          date_derniere_contact?: string | null
          description?: string | null
          description_more?: string | null
          email?: string | null
          featured?: boolean | null
          first_price_package?: number | null
          first_price_package_description?: string | null
          first_price_package_name?: string | null
          fourth_price_package?: number | null
          fourth_price_package_description?: string | null
          fourth_price_package_name?: string | null
          google_business_url?: string | null
          google_place_id?: string | null
          google_rating?: number | null
          google_reviews_count?: number | null
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
          second_price_package_description?: string | null
          second_price_package_name?: string | null
          show_brochures?: boolean | null
          show_contact_form?: boolean | null
          show_description?: boolean | null
          show_photos?: boolean | null
          show_prices?: boolean | null
          show_responsable?: boolean | null
          siret?: string | null
          site_web?: string | null
          slug?: string | null
          source_inscription?: string | null
          status_crm?: Database["public"]["Enums"]["prestataire_status"] | null
          styles?: Json | null
          telephone?: string | null
          third_price_package?: number | null
          third_price_package_description?: string | null
          third_price_package_name?: string | null
          updated_at?: string
          ville?: string | null
          visible?: boolean | null
        }
        Relationships: []
      }
      prestataires_timeline: {
        Row: {
          created_at: string
          date_action: string
          description: string
          id: string
          prestataire_id: string | null
          type_action: string
          utilisateur: string | null
        }
        Insert: {
          created_at?: string
          date_action?: string
          description: string
          id?: string
          prestataire_id?: string | null
          type_action: string
          utilisateur?: string | null
        }
        Update: {
          created_at?: string
          date_action?: string
          description?: string
          id?: string
          prestataire_id?: string | null
          type_action?: string
          utilisateur?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "prestataires_timeline_prestataire_id_fkey"
            columns: ["prestataire_id"]
            isOneToOne: false
            referencedRelation: "prestataires"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          guest_count: number | null
          id: string
          last_name: string | null
          subscription_expires_at: string | null
          subscription_type: string | null
          updated_at: string
          wedding_date: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          guest_count?: number | null
          id: string
          last_name?: string | null
          subscription_expires_at?: string | null
          subscription_type?: string | null
          updated_at?: string
          wedding_date?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          guest_count?: number | null
          id?: string
          last_name?: string | null
          subscription_expires_at?: string | null
          subscription_type?: string | null
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
      system_settings: {
        Row: {
          created_at: string
          description: string | null
          id: string
          setting_key: string
          setting_value: boolean
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key: string
          setting_value?: boolean
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          setting_key?: string
          setting_value?: boolean
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
          budget: string | null
          category: string
          contact_date: string | null
          created_at: string
          email: string | null
          email_client: string | null
          email_presta: string | null
          feeling: string | null
          first_date_rdv: string | null
          id: string
          key_prestataire: string | null
          location: string | null
          notes: string | null
          phone: string | null
          points_faibles: string | null
          points_forts: string | null
          prestataire_id: string | null
          project_id: string | null
          response_date: string | null
          second_date_rdv: string | null
          source: string | null
          status: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv: string | null
          updated_at: string
          user_id: string
          user_notes: string | null
          valide_date_rdv: number | null
          vendor_name: string
          website: string | null
        }
        Insert: {
          budget?: string | null
          category: string
          contact_date?: string | null
          created_at?: string
          email?: string | null
          email_client?: string | null
          email_presta?: string | null
          feeling?: string | null
          first_date_rdv?: string | null
          id?: string
          key_prestataire?: string | null
          location?: string | null
          notes?: string | null
          phone?: string | null
          points_faibles?: string | null
          points_forts?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          second_date_rdv?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv?: string | null
          updated_at?: string
          user_id: string
          user_notes?: string | null
          valide_date_rdv?: number | null
          vendor_name: string
          website?: string | null
        }
        Update: {
          budget?: string | null
          category?: string
          contact_date?: string | null
          created_at?: string
          email?: string | null
          email_client?: string | null
          email_presta?: string | null
          feeling?: string | null
          first_date_rdv?: string | null
          id?: string
          key_prestataire?: string | null
          location?: string | null
          notes?: string | null
          phone?: string | null
          points_faibles?: string | null
          points_forts?: string | null
          prestataire_id?: string | null
          project_id?: string | null
          response_date?: string | null
          second_date_rdv?: string | null
          source?: string | null
          status?: Database["public"]["Enums"]["vendor_status"]
          third_date_rdv?: string | null
          updated_at?: string
          user_id?: string
          user_notes?: string | null
          valide_date_rdv?: number | null
          vendor_name?: string
          website?: string | null
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
      wedding_coordination: {
        Row: {
          created_at: string
          description: string | null
          id: string
          slug: string | null
          title: string
          updated_at: string
          user_id: string
          wedding_date: string | null
          wedding_location: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string | null
          title?: string
          updated_at?: string
          user_id: string
          wedding_date?: string | null
          wedding_location?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          slug?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          wedding_date?: string | null
          wedding_location?: string | null
        }
        Relationships: []
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
      generate_coordination_slug: {
        Args: { title_input: string; coordination_id?: string }
        Returns: string
      }
      generate_jeunes_maries_slug: {
        Args: { nom_input: string; jeune_marie_id?: string }
        Returns: string
      }
      get_user_registrations: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: string
          email: string
          created_at: string
          raw_user_meta_data: Json
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_user_premium: {
        Args: { user_uuid: string }
        Returns: boolean
      }
      is_valid_share_token: {
        Args: { token_value: string }
        Returns: boolean
      }
      validate_dashboard_share_token: {
        Args: { token_value: string }
        Returns: {
          is_valid: boolean
          user_id: string
        }[]
      }
      validate_planning_share_token: {
        Args: { token_value: string }
        Returns: {
          is_valid: boolean
          coordination_id: string
        }[]
      }
    }
    Enums: {
      blog_status: "draft" | "published"
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
        | "Mise en beauté"
        | "Voiture"
        | "Invités"
      prestataire_status:
        | "acquisition"
        | "verification"
        | "a_valider"
        | "valide"
        | "en_attente"
        | "actif"
        | "inactif"
        | "blackliste"
        | "exclu"
        | "a_traiter"
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
        | "France entière"
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
      blog_status: ["draft", "published"],
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
        "Mise en beauté",
        "Voiture",
        "Invités",
      ],
      prestataire_status: [
        "acquisition",
        "verification",
        "a_valider",
        "valide",
        "en_attente",
        "actif",
        "inactif",
        "blackliste",
        "exclu",
        "a_traiter",
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
        "France entière",
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
