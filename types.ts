
import React from 'react';

export type ServiceId = 
  | 'full_stack' 
  | 'ai_ml' 
  | 'automation' 
  | 'data_analytics' 
  | 'academic_projects'
  | 'debugging' 
  | 'mini_projects' 
  | 'resume_support' 
  | 'system_design' 
  | 'simplification';

export interface Service {
  id: ServiceId;
  title: string;
  description: string;
  imageUrl: string;
}

export interface ValuePoint {
  title: string;
  description: string;
  icon: React.ReactNode;
}

export interface FormState {
  name: string;
  contact: string;
  phoneNumber: string;
  service: ServiceId | '';
  message: string;
}
