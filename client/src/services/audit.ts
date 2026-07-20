import { apiClient } from '../lib/axios';
import { IAudit, IAuditCreateRequest, IApiResponse } from '../types/audit';

export const createAudit = async (payload: IAuditCreateRequest): Promise<IAudit> => {
  const response = await apiClient.post<IApiResponse<IAudit>>('/api/audits', payload);
  const data = response.data;
  
  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to create audit');
  }

  return data.data;
};

export const getPricingConfig = async (): Promise<any> => {
  const response = await apiClient.get<IApiResponse<any>>('/api/audits/pricing');
  const data = response.data;

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to retrieve pricing config');
  }

  return data.data;
};

export const getAuditBySlug = async (slug: string): Promise<IAudit> => {
  const response = await apiClient.get<IApiResponse<IAudit>>(`/api/audits/${slug}`);
  const data = response.data;

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to retrieve audit');
  }

  return data.data;
};

export interface ILeadCreateRequest {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
  website?: string; // Honeypot field — must be empty for legitimate submissions
}

export interface ILead {
  _id: string;
  auditId: string;
  email: string;
  companyName: string | null;
  role: string | null;
  teamSize: number | null;
  emailSent: boolean;
  createdAt: string;
}

export const createLead = async (payload: ILeadCreateRequest): Promise<ILead> => {
  const response = await apiClient.post<IApiResponse<ILead>>('/api/leads', payload);
  const data = response.data;

  if (!data.success || !data.data) {
    throw new Error(data.message || 'Failed to create lead');
  }

  return data.data;
};
export type { IAudit };

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api';

/**
 * Fetches an audit by its slug from the backend for use in Server Components.
 * Utilizes Next.js fetch caching capabilities.
 */
export async function getServerAuditBySlug(slug: string): Promise<IAudit | null> {
  try {
    const res = await fetch(`${API_BASE}/audits/${slug}`, {
      next: { revalidate: 3600 }, // cache for 1 hour
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data ?? null;
  } catch {
    return null;
  }
}
