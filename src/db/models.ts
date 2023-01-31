export interface ApiKeyDocument {
  _id: string;
  name: string;
  contactEmail: string;
  organization: string;
  key: string;
  allowedIps: string[];
  allowedDomains: string[];
  requestLimit: string; // disabled is "-1"
  currentRequestCount: number;
  created: Date;
  requestResetDate: Date;
  requestLimitTimeoutInDays: number;
  customerId: string;
  description: string;
  isActive: boolean;
}

export interface UsersDocument {
  _id: string;
  email: string;
  password: string;
  lastLogin: Date;
};