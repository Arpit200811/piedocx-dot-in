import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const Counter = () => {
  const stats = [
    { value: 5, label: "Years Experience" },
    { value: 35, label: "Happy Clients" },
    { value: 25, label: "Projects Done" },
    { value: 10, label: "Get Awards" },
  ];

  const [counts, setCounts] = useState(stats.map(() => 0));
  const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.8 });

  useEffect(() => {
    if (!inView) return;

    const intervals = stats.map((stat, index) => {
      return setInterval(() => {
        setCounts((prevCounts) => {
          const newCounts = [...prevCounts];
          if (newCounts[index] < stat.value) {
            newCounts[index] += 1;
          } else {
            clearInterval(intervals[index]);
          }
          return newCounts;
        });
      }, 100);
    });

    return () => intervals.forEach(clearInterval);
  }, [inView]);

  return (
    <div ref={ref} className="py-12 md:py-16 bg-blue-600 text-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="text-center space-y-2 group">
              <div className="inline-block relative">
                 <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter transition-all group-hover:scale-110">
                   {counts[index]}+
                 </h2>
                 <div className="absolute -bottom-1 left-0 w-0 h-1 bg-white/30 group-hover:w-full transition-all duration-500 rounded-full"></div>
              </div>
              <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.2em] opacity-80 group-hover:opacity-100 transition-opacity">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Counter;
