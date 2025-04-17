
import { AirtableResponse, VendorFilter } from "@/types/airtable";

const AIRTABLE_API_KEY = "patcIIK0puzAmZQf3";
const AIRTABLE_BASE_ID = "appuimwDU6QIi9cqp"; // Remplacez par votre Base ID réel
const AIRTABLE_TABLE_NAME = "centre%20val-de-loire"; // Remplacez par le nom exact de votre table

export const fetchVendors = async (filters?: Partial<VendorFilter>): Promise<AirtableResponse> => {
  try {
    let url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${AIRTABLE_TABLE_NAME}?view=Grid%20view`;
    
    // Construire la formule de filtre
    let filterFormulas: string[] = [];
    
    // Filtre par visibilité (toujours appliquer)
    filterFormulas.push("{Visible}=1");
    
    // Filtre par catégorie
    if (filters?.category && filters.category !== "Tous") {
      filterFormulas.push(`{Catégorie}="${filters.category}"`);
    }
    
    // Filtre par région (si spécifié)
    if (filters?.region) {
      filterFormulas.push(`{Région}="${filters.region}"`);
    }
    
    // Filtre par prix (si spécifié)
    if (filters?.priceRange) {
      const [min, max] = filters.priceRange;
      if (min > 0) {
        filterFormulas.push(`{Prix à partir de}>=${min}`);
      }
      if (max < 10000) {
        filterFormulas.push(`{Prix à partir de}<=${max}`);
      }
    }
    
    // Filtre par recherche de texte
    if (filters?.search && filters.search.trim() !== '') {
      const searchTerm = filters.search.trim();
      filterFormulas.push(`OR(FIND("${searchTerm}", LOWER({Nom})), FIND("${searchTerm}", LOWER({Description})))`);
    }
    
    // Combiner tous les filtres avec AND
    if (filterFormulas.length > 0) {
      const filterByFormula = encodeURIComponent(`AND(${filterFormulas.join(',')})`);
      url += `&filterByFormula=${filterByFormula}`;
    }
    
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error(`Erreur API Airtable: ${response.status} ${response.statusText}`);
    }
    
    const data: AirtableResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Erreur lors de la récupération des prestataires:", error);
    throw error;
  }
};
