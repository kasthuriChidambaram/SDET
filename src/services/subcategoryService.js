import { supabase } from './supabaseClient'

class SubcategoryService {
    async getSubcategoriesByCategory(categoryId) {
        try {
            const { data, error } = await supabase
                .from('subcategories')
                .select('id, name, slug, category_id')
                .eq('category_id', categoryId)
                .order('name')

            if (error) {
                console.error('Error fetching subcategories:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('Error in getSubcategoriesByCategory:', error)
            return []
        }
    }
}

export const subcategoryService = new SubcategoryService() 