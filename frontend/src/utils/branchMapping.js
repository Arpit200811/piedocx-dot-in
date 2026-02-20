// Branch mapping configuration for UI logic
export const getBranchGroup = (branch) => {
    if (!branch) return 'CORE';
    const csItBranches = ['CSE', 'IT', 'Computer Science', 'Information Technology', 'CS', 'Software Engineering', 'AI', 'Data Science', 'DS'];
    const coreBranches = ['ECE', 'EE', 'ME', 'Civil', 'Auto', 'Automobile', 'Electronics', 'Electrical', 'Mechanical'];
    
    const branchUpper = branch.toUpperCase();
    
    if (csItBranches.some(b => branchUpper.includes(b.toUpperCase()))) {
        return 'CS-IT';
    }
    
    if (coreBranches.some(b => branchUpper.includes(b.toUpperCase()))) {
        return 'CORE';
    }
    
    // Default fallback
    return 'CORE';
};

export const getYearGroup = (year) => {
    if (!year) return '1-2';
    const yearNum = parseInt(year);
    const yearStr = String(year).toLowerCase();
    
    // Check for 3rd or 4th year patterns
    if (yearNum === 3 || yearNum === 4 || yearStr.includes('3rd') || yearStr.includes('4th') || yearStr.includes('final')) {
        return '3-4';
    }
    return '1-2'; // Default
};
