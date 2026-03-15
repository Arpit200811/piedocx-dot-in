import React from 'react';

const Skeleton = ({ className = '', variant = 'rect' }) => {
    const baseClass = "animate-pulse bg-slate-200/60";
    
    let variantClass = "";
    if (variant === 'circle') variantClass = "rounded-full";
    else if (variant === 'rect') variantClass = "rounded-2xl";
    else if (variant === 'text') variantClass = "rounded-md h-3 w-3/4 mb-2";

    return (
        <div className={`${baseClass} ${variantClass} ${className}`} />
    );
};

export const ExamsSkeleton = () => (
    <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl flex flex-col lg:flex-row justify-between items-center gap-10">
        <div className="flex-1 space-y-6 w-full">
            <div className="flex gap-4">
                <Skeleton className="w-24 h-6 rounded-full" />
                <Skeleton className="w-32 h-6 rounded-full" />
            </div>
            <Skeleton className="w-3/4 h-12" />
            <div className="flex gap-8">
                <Skeleton className="w-24 h-6" />
                <Skeleton className="w-24 h-6" />
            </div>
        </div>
        <Skeleton className="w-full lg:w-48 h-16 rounded-2xl" />
    </div>
);

export const ResourcesSkeleton = () => (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="bg-white p-8 rounded-[3rem] border border-slate-100 shadow-xl flex flex-col gap-6">
                <Skeleton variant="circle" className="w-14 h-14" />
                <Skeleton className="w-full h-8" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="w-full h-12 rounded-2xl mt-4" />
            </div>
        ))}
    </div>
);

export const CertificatesSkeleton = () => (
    <div className="bg-white p-12 lg:p-16 rounded-[4rem] border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-16">
        <div className="flex-1 space-y-10 w-full">
            <Skeleton className="w-40 h-8 rounded-full" />
            <Skeleton className="w-full h-24" />
            <Skeleton className="w-2/3 h-6" />
            <Skeleton className="w-48 h-16 rounded-2xl" />
        </div>
        <Skeleton className="w-full md:w-80 h-64 rounded-[3rem]" />
    </div>
);

export default Skeleton;
