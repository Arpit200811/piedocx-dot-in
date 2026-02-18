// Branch mapping configuration
export const getBranchGroup = (branch) => {
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
    const y = year.toString().toLowerCase();
    
    // Check for 3rd or 4th year patterns first
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

    // Default to 1-2 for everything else (1st, 2nd, Freshers, etc.)
    return '1-2';
};
