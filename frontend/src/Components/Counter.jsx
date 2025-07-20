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
    <div ref={ref} className="p-2 md:p-3 text-white bg-blue-500">
      <div className="flex flex-wrap">
        {stats.map((stat, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/4 py-4">
            <div
              className={`${
                index !== 3 ? "md:border-r border-white" : ""
              } px-4`}
            >
              <h2 className="text-3xl md:text-4xl font-semibold text-center text-white">
                {counts[index]}+
              </h2>
              <p className="text-sm text-center text-white">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Counter;
