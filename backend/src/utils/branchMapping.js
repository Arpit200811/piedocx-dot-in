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
    const yearNum = parseInt(year);
    if (yearNum === 1 || yearNum === 2 || year === '1st' || year === '2nd') {
        return '1-2';
    }
    if (yearNum === 3 || year === '3rd' || yearNum === 4 || year === '4th') {
        return '3-4';
    }
    return '1-2'; // Default
};
