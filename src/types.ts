export interface Vehicle {
    id: number;
    brand: string;
    model: string;
    year: number;
    license_plate: string;
    vin: string;
    color: string;
    price_per_day: number;
    available: boolean;
}

export interface Customer {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    address: string;
    id_card_number: string;
    drivers_license_number: string;
}

export interface Rental {
    id: number;
    vehicleId: number;
    customerId: number;
    startDate: string;
    endDate: string;
    totalPrice: number;
    status: 'active' | 'completed' | 'upcoming';
    contract_signed_base64?: string | null;
}

export interface CustomerDetails {
    first_name: string;
    last_name: string;
    email: string;
    phone: string;
    id_card_number: string;
    drivers_license_number: string;
}

export interface RentalRequest {
    id: number;
    customer_details: CustomerDetails;
    status: 'pending' | 'approved' | 'rejected';
    drivers_license_image_base64?: string;
    created_at: string;
}
