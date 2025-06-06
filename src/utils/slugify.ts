function slugify(text: string | number): string {
  return text
    .toString()
    .normalize("NFD")                  
    .replace(/[\u0300-\u036f]/g, "")  
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")      
    .replace(/^-+|-+$/g, "");      
} 
export default slugify;