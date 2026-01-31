
import React from 'react';
import { Service, ServiceId } from '../types';

interface ServiceCardProps {
  service: Service;
  onSelect: (id: ServiceId) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({ service, onSelect }) => {
  return (
    <div className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 shadow-sm border border-slate-100 dark:border-slate-800 transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      <div className="h-64 overflow-hidden relative">
        <img 
          src={service.imageUrl} 
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 service-card-overlay opacity-80"></div>
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-bold text-white mb-2">{service.title}</h3>
          <p className="text-white/80 text-sm line-clamp-2 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
            {service.description}
          </p>
        </div>
      </div>
      <div className="p-6">
        <button 
          onClick={() => onSelect(service.id)}
          className="w-full py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-semibold rounded-xl border border-slate-100 dark:border-slate-700 group-hover:bg-blue-600 group-hover:text-white transition-all duration-300 flex items-center justify-center gap-2"
        >
          Request This Service
          <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ServiceCard;
