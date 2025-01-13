import React from "react";
import "./App.css";

const ADHDPage = () => {
  const tips = [
    {
      category: "Focus and Productivity",
      items: [
        {
          title: "Use Visual Timers",
          description: "A visual timer helps you see how much time is left in a session. Try tools like Pomodoro timers."
        },
        {
          title: "Prioritize Your To-Do List",
          description: "Start with the most important or time-sensitive tasks and break them into smaller steps."
        },
        {
          title: "Eliminate Distractions",
          description: "Turn off notifications, use noise-canceling headphones, or apps like Focus@Will to improve concentration."
        }
      ]
    },
    {
      category: "Organization and Planning",
      items: [
        {
          title: "Create a Morning Routine",
          description: "Start your day with consistent habits to set the tone for productivity."
        },
        {
          title: "Use Digital Tools",
          description: "Apps like Notion, Trello, and Todoist help manage tasks and track progress."
        },
        {
          title: "Set Reminders",
          description: "Use alarms or calendar notifications to remember important tasks and deadlines."
        }
      ]
    },
    {
      category: "Self-Care and Emotional Regulation",
      items: [
        {
          title: "Practice Mindfulness",
          description: "Apps like Headspace or Calm offer guided meditation to reduce anxiety and improve focus."
        },
        {
          title: "Get Sufficient Sleep",
          description: "Establish a bedtime routine and avoid screens an hour before bed."
        },
        {
          title: "Celebrate Small Wins",
          description: "Recognize and reward yourself for completing tasks, no matter how small."
        }
      ]
    }
  ];

  const resources = [
    {
      category: "Websites and Communities",
      links: [
        {
          name: "ADDitude Magazine",
          url: "https://www.additudemag.com/",
          description: "Comprehensive articles and advice for managing ADHD."
        },
        {
          name: "CHADD",
          url: "https://chadd.org/",
          description: "Support and resources for children and adults with ADHD."
        },
        {
          name: "Understood.org",
          url: "https://www.understood.org/",
          description: "Resources for ADHD, learning differences, and related topics."
        }
      ]
    },
    {
      category: "Tools and Apps",
      links: [
        {
          name: "Forest App",
          url: "https://www.forestapp.cc/",
          description: "A focus app that uses gamification to help you stay productive."
        },
        {
          name: "Focus@Will",
          url: "https://www.focusatwill.com/",
          description: "Music scientifically designed to enhance focus."
        },
        {
          name: "Trello",
          url: "https://trello.com/",
          description: "A task management tool with visual boards to organize your tasks."
        }
      ]
    },
    {
      category: "Podcasts",
      links: [
        {
          name: "ADHD Rewired",
          url: "https://www.adhdrewired.com/",
          description: "Podcasts offering tips and support for individuals with ADHD."
        },
        {
          name: "The ADHD Experts Podcast",
          url: "https://www.additudemag.com/tag/podcast/",
          description: "Insights from ADHD experts to help you thrive."
        },
        {
          name: "Hacking Your ADHD",
          url: "https://hackingyouradhd.com/",
          description: "Actionable strategies for managing ADHD."
        }
      ]
    }
  ];

  return (
    <div className="adhd-page">
      <h1>ADHD Support and Solutions</h1>
      <p>
        Welcome to the ADHD Support and Solutions page. This space is designed
        to provide helpful tips, resources, and tools to help you navigate the
        challenges of ADHD and achieve your goals.
      </p>

      <section className="tips-section">
        <h2>Tips and Strategies</h2>
        {tips.map((tipCategory, index) => (
          <div key={index} className="tip-category">
            <h3>{tipCategory.category}</h3>
            <ul>
              {tipCategory.items.map((tip, idx) => (
                <li key={idx}>
                  <strong>{tip.title}</strong>: {tip.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>

      <section className="resources-section">
        <h2>Additional Resources</h2>
        {resources.map((resourceCategory, index) => (
          <div key={index} className="resource-category">
            <h3>{resourceCategory.category}</h3>
            <ul>
              {resourceCategory.links.map((link, idx) => (
                <li key={idx}>
                  <a href={link.url} target="_blank" rel="noopener noreferrer">
                    {link.name}
                  </a>
                  : {link.description}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </div>
  );
};

export default ADHDPage;

