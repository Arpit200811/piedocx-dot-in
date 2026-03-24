
/**
 * Dynamic Translation Service
 * Uses a public Google Translate endpoint for automatic translation
 */

export const translateText = async (text, targetLanguage = 'hi') => {
    if (!text || typeof text !== 'string') return text;
    
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        
        // Google Translate response format: [[["translated_text", "source_text", null, null, 3]], null, "en"]
        if (data && data[0] && data[0][0] && data[0][0][0]) {
            return data[0][0][0];
        }
        return text;
    } catch (error) {
        console.error("Translation Error:", error);
        return text; 
    }
};

export const translateQuestions = async (questions, targetLanguage = 'hi') => {
    // This could be heavy, better use on-demand
    return Promise.all(questions.map(async (q) => {
        const translatedText = q.questionTextHindi || await translateText(q.questionText, targetLanguage);
        const translatedOptions = await Promise.all((q.optionsHindi || []).map(async (optHindi, idx) => {
            return optHindi || await translateText(q.options[idx], targetLanguage);
        }));
        
        return {
            ...q,
            questionTextHindi: translatedText,
            optionsHindi: translatedOptions
        };
    }));
};
