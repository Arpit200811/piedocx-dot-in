
/**
 * AI Results Doctor - Sophisticated Performance Analyzer
 * Mimics high-level AI logic to provide personalized feedback (Item #1)
 */
export const generateAIAnalysis = (score, total, correct, wrong, violations = 0) => {
    const percentage = Math.round((score / total) * 100);
    
    let analysis = "";
    let recommendations = [];

    // Part 1: Skill Gap Identification
    if (percentage >= 90) {
        analysis = "Outstanding performance! Aapka conceptual foundation ekdam strong hai. Aapne topics ko deeply samajha hai.";
        recommendations = [
            { title: "Advanced System Architecture", link: "https://example.com/advanced", type: "VIDEO" },
            { title: "Competitive Programming Masterclass", link: "https://example.com/cp", type: "QUIZ" }
        ];
    } else if (percentage >= 70) {
        analysis = "Great job! Aapka Logic strong hai lekin kuch technical terms aur depth mein improvement ki gunjayish hai. Aap precision par focus karein.";
        recommendations = [
            { title: "Deep Dive into Core Concepts", link: "https://example.com/core", type: "ARTICLE" },
            { title: "Mock Interview Series", link: "https://example.com/mock", type: "VIDEO" }
        ];
    } else if (percentage >= 50) {
        analysis = "Average performance. Aap basic concepts toh samajhte hain par complex problems mein confusion ho raha hai. Reverse-engineering approach try karein.";
        recommendations = [
            { title: "Fundamentals Refresher Guide", link: "https://example.com/基礎", type: "PDF" },
            { title: "Problem Solving Lab", link: "https://example.com/lab", type: "QUIZ" }
        ];
    } else {
        analysis = "Needs improvement. Conceptual gaps kaafi hain. Foundation weak hone ki wajah se aap technical questions mein fas rahe hain. Ek baar basics phir se padhein.";
        recommendations = [
            { title: "Step-by-Step Basics", link: "https://example.com/basics", type: "VIDEO" },
            { title: "Beginner Handbook", link: "https://example.com/handbook", type: "PDF" }
        ];
    }

    // Part 2: Behavioral Analysis (Proctoring/Security) - Adds more "AI" weight
    if (violations > 0) {
        analysis += ` Security Logs suggest ${violations} focus-loss incidents. Focus improve karne ke liye Pomodoro technique best rahegi.`;
    } else {
        analysis += " Integrity score perfect hai! Aapka focus level kaafi impressive raha.";
    }

    return { analysis, recommendations };
};
