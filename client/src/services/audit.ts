import { API_BASE_URL } from '../lib/api';
import { IAudit, IAuditCreateRequest, IApiResponse } from '../types/audit';

export const createAudit = async (payload: IAuditCreateRequest): Promise<IAudit> => {
  const response = await fetch(`${API_BASE_URL}/audits`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<IAudit> = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message || 'Failed to create audit');
  }

  return json.data;
};

export const getAuditBySlug = async (slug: string): Promise<IAudit> => {
  const response = await fetch(`${API_BASE_URL}/audits/${slug}`);
  const json: IApiResponse<IAudit> = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message || 'Failed to retrieve audit');
  }

  return json.data;
};

export interface ILeadCreateRequest {
  auditId: string;
  email: string;
  companyName?: string;
  role?: string;
  teamSize?: number;
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
  const response = await fetch(`${API_BASE_URL}/leads`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const json: IApiResponse<ILead> = await response.json();
  if (!response.ok || !json.success || !json.data) {
    throw new Error(json.message || 'Failed to create lead');
  }

  return json.data;
};
export type { IAudit };

