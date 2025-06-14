import { supabase } from './supabaseClient'

class QuestionService {
    async getQuestionsBySubcategory(subcategoryId) {
        try {
            const { data, error } = await supabase
                .from('questions')
                .select('id, question, answer, difficulty')
                .eq('subcategory_id', subcategoryId)
                .order('id')

            if (error) {
                console.error('Error fetching questions:', error)
                throw error
            }

            return data || []
        } catch (error) {
            console.error('Error in getQuestionsBySubcategory:', error)
            return []
        }
    }
}

export const questionService = new QuestionService() 