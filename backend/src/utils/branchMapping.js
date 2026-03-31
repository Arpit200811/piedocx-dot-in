export const getBranchGroup = (branch) => {
    if (!branch) return 'CORE';
    
    const csItRegex = /\b(CSE|IT|Computer Science|Information Technology|CS|Software Engineering|AI|Data Science|DS|BCA|MCA|Computer Applications|BSCIT|MSCIT|PGDCA)\b/i;
    const coreRegex = /\b(ECE|EE|ME|Civil|Auto|Automobile|Electronics|Electrical|Mechanical|Civil Engineering|Mechanical Engineering|Electrical Engineering)\b/i;
    
    if (csItRegex.test(branch)) {
        return 'CS-IT';
    }
    if (coreRegex.test(branch)) {
        return 'CORE';
    }  
    return 'CORE';
};
export const getYearGroup = (year) => {
    if (!year) return '1-2';
    const y = year.toString().toLowerCase();
    if (
        y.includes('3') || 
        y.includes('4') || 
        y.includes('3rd') || 
        y.includes('4th') || 
        y.includes('third') || 
        y.includes('fourth') || 
        y.includes('final') || 
        y.includes('graduated')
    ) {
        return '3-4';
    }
    return '1-2';
};
