import { supabase } from './supabaseClient'

class CategoryService {
    async getAllCategories() {
        try {
            const { data, error } = await supabase
                .from('categories')
                .select('id, name, slug, description, overview')
                .order('name')

            if (error) {
                console.error('Error fetching categories:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('Error in getAllCategories:', error)
            return []
        }
    }
}

export const categoryService = new CategoryService() 