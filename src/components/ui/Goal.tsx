import React, { useEffect, useRef, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFlag, faPlay } from "@fortawesome/pro-light-svg-icons";

interface GoalItem {
  title: string;
  items: string[];
}

interface GoalProps {
  goals: GoalItem[];
}

const Goal: React.FC<GoalProps> = ({ goals }) => {
  const lineRef = useRef<HTMLDivElement>(null);
  const [isLineVisible, setIsLineVisible] = useState(false);
  const [visibleGoals, setVisibleGoals] = useState<number[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsLineVisible(true);
            observer.unobserve(entry.target); // Stop observing after visibility
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    if (lineRef.current) {
      observer.observe(lineRef.current);
    }

    return () => {
      if (lineRef.current) {
        observer.unobserve(lineRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const goalObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = parseInt(
            entry.target.getAttribute("data-index") || "0",
            10
          );
          if (entry.isIntersecting) {
            setVisibleGoals((prev) => [...prev, index]);
            goalObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".goal-item").forEach((item) => {
      goalObserver.observe(item);
    });

    return () => {
      document.querySelectorAll(".goal-item").forEach((item) => {
        goalObserver.unobserve(item);
      });
    };
  }, []);

  return (
    <div className="relative z-10 py-12 xl:grid gird-cols-1 xl:grid-cols-3 items-center mt-8">
      <div
        className={`col-span-3 mb-4  bg-orange relative expand-line ${
          isLineVisible ? "is-visible" : ""
        }`}
        ref={lineRef}
      >
        <div className="bg-orange h-[1px] w-[full]"></div>

        <FontAwesomeIcon
          icon={faPlay}
          className="absolute right-0 top-0 translate-x-[100%] -translate-y-1/2 text-orange text-xl"
        />
      </div>
      {goals.map((goal, index) => (
        <div
          key={index}
          data-index={index}
          className={`goal-item flex flex-col h-full px-12 py-6 relative ${
            visibleGoals.includes(index) ? "is-visible" : ""
          }`}
          style={{
            animationDelay: `${index * 0.4}s`, 
          }}
        >
          <FontAwesomeIcon icon={faFlag} className="hidden xl:block absolute left-0 -top-[36px] text-orange text-xl" />
          <p className="text-orange text-2xl font-semibold mb-6">{goal.title}</p>
          <ul className="list-disc ml-6 space-y-2 text-[1rem] tracking-wide leading-7 text-justify text-gray-600">
            {goal.items.map((item, itemIndex) => (
              <li key={itemIndex}>{item}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default Goal;
