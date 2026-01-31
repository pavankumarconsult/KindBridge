
import React from 'react';
import { Service, ValuePoint } from './types';

export const PROJECT_SERVICES: Service[] = [
  {
    id: 'full_stack',
    title: 'Full-Stack Web Applications',
    description: 'Scalable frontend and backend web applications using modern technologies.',
    imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'ai_ml',
    title: 'AI / ML Model Development',
    description: 'Custom machine learning models for prediction, classification, and automation.',
    imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'automation',
    title: 'Automation & Workflow Systems',
    description: 'Automating repetitive tasks and business workflows using smart systems.',
    imageUrl: 'https://images.unsplash.com/photo-1518433278981-11271f4a7c2b?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'data_analytics',
    title: 'Data Analytics & Dashboards',
    description: 'Interactive dashboards and data insights for informed decision-making.',
    imageUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536339a?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'academic_projects',
    title: 'Academic Final-Year Projects',
    description: 'Complete guidance and development for B.Tech, M.Tech, and MCA projects.',
    imageUrl: 'https://images.unsplash.com/photo-1523240715639-99a8088fb98b?auto=format&fit=crop&q=80&w=800&h=600',
  },
];

export const SMALL_SERVICES: Service[] = [
  {
    id: 'debugging',
    title: 'Code Debugging & Fixes',
    description: 'Identifying and fixing bugs in existing codebases.',
    imageUrl: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'mini_projects',
    title: 'Mini Projects / Assignments',
    description: 'Small academic or practice projects with clean implementation.',
    imageUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'resume_support',
    title: 'Resume & Portfolio Support',
    description: 'Technical resumes and project portfolios for students and job seekers.',
    imageUrl: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'system_design',
    title: 'System Design Diagrams',
    description: 'Architecture diagrams, ER diagrams, flowcharts, and UMLs.',
    imageUrl: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&q=80&w=800&h=600',
  },
  {
    id: 'simplification',
    title: 'Content Simplification',
    description: 'Converting complex technical content into easy-to-understand format.',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&q=80&w=800&h=600',
  },
];

export const ALL_SERVICES = [...PROJECT_SERVICES, ...SMALL_SERVICES];

export const VALUES: ValuePoint[] = [
  {
    title: 'Human-First',
    description: 'Technology should serve people, not the other way around. We prioritize empathy.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
  {
    title: 'Unwavering Trust',
    description: 'We build long-term relationships through transparency and reliable delivery.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
  },
  {
    title: 'Innovative Care',
    description: 'Cutting-edge solutions delivered with meticulous attention to detail.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: 'Global Connectivity',
    description: 'Bridging the gap between diverse needs and expert capabilities.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
];
