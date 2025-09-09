// This file is the single source of truth for all data structures.

export interface VehiclePricing {
  '4h'?: number;
  '12h'?: number;
  day?: number;
  month?: number;
}

export interface Vehicle {
  id: number;
  brand: string;
  license_plate: string;
  vin: string;
  year: number;
  pricing: VehiclePricing;
  stk_date: string;
  insurance_info?: string;
  vignette_until?: string;
  created_at: string;
}

export interface Customer {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  id_card_number: string;
  drivers_license_number: string;
  drivers_license_image_path?: string;
  created_at: string;
}

export interface Rental {
  id: number;
  vehicle_id: number;
  customer_id: number;
  start_date: string;
  end_date: string;
  total_price: number;
  status: 'active' | 'completed' | 'pending';
  customer_signature?: string | null;
  company_signature?: string | null;
  digital_consent_at?: string;
  created_at: string;
}

export interface RentalRequest {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    id_card_number: string;
    drivers_license_number: string;
    drivers_license_image_base64?: string;
    digital_consent_at: string;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
}
