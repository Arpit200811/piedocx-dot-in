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
    if (yearNum === 1 || yearNum === 2 || String(year).includes('1st') || String(year).includes('2nd')) {
        return '1-2';
    }
    if (yearNum === 3 || String(year).includes('3rd')) {
        return '3';
    }
    return '1-2'; // Default
};
