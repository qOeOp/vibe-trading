import React from 'react';

interface CardProps {
  title: string;
  description: string;
  href: string;
  icon?: React.ReactNode;
}

export function Card({ title, description, href, icon }: CardProps) {
  return (
    <a 
      href={href} 
      className="block p-6 bg-secondary/10 border border-border rounded-lg hover:border-brand hover:shadow-lg transition-all duration-300 no-underline"
    >
      <div className="flex items-center gap-4 mb-2">
        {icon && <div className="text-2xl">{icon}</div>}
        <h3 className="text-xl font-bold m-0 text-text-1">{title}</h3>
      </div>
      <p className="text-text-2 m-0">{description}</p>
    </a>
  );
}
