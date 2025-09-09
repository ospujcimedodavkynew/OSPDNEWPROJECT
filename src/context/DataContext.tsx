import React, { createContext, useContext, useState, useEffect } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../supabaseClient';
import { Vehicle, Customer, Rental, RentalRequest } from '../types';

interface DataContextProps {
    session: Session | null;
    user: User | null;
    vehicles: Vehicle[];
    customers: Customer[];
    rentals: Rental[];
    rentalRequests: RentalRequest[];
    loading: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    logout: () => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Promise<void>;
    // Add other functions later
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

// Mock data
const MOCK_VEHICLES: Vehicle[] = [
    { id: 1, brand: 'Skoda', model: 'Octavia', year: 2022, license_plate: '1AB 1234', vin: 'VIN1', color: 'Silver', price_per_day: 1200, available: true },
    { id: 2, brand: 'Volkswagen', model: 'Passat', year: 2021, license_plate: '2CD 5678', vin: 'VIN2', color: 'Black', price_per_day: 1500, available: false },
];

const MOCK_CUSTOMERS: Customer[] = [
    { id: 1, first_name: 'Jan', last_name: 'Novak', email: 'jan.novak@example.com', phone: '123456789', address: 'Prague', id_card_number: '111222333', drivers_license_number: 'AAA111' },
];

const MOCK_RENTALS: Rental[] = [
    { id: 1, vehicleId: 2, customerId: 1, startDate: '2024-07-20', endDate: '2024-07-25', totalPrice: 7500, status: 'active' },
    { id: 2, vehicleId: 1, customerId: 1, startDate: '2024-08-01', endDate: '2024-08-05', totalPrice: 4800, status: 'upcoming' },
];

const MOCK_REQUESTS: RentalRequest[] = [
    { id: 1, customer_details: { first_name: 'Petra', last_name: 'Svobodova', email: 'petra@email.com', phone: '987654321', id_card_number: '444555666', drivers_license_number: 'BBB222' }, status: 'pending', created_at: new Date().toISOString() },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<Vehicle[]>(MOCK_VEHICLES);
    const [customers, setCustomers] = useState<Customer[]>(MOCK_CUSTOMERS);
    const [rentals, setRentals] = useState<Rental[]>(MOCK_RENTALS);
    const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>(MOCK_REQUESTS);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };
        getSession();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    const login = async (email: string, password: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        return !error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };
    
    const addVehicle = async (vehicle: Omit<Vehicle, 'id'>) => {
        // Mock implementation
        const newVehicle = { ...vehicle, id: Math.max(...vehicles.map(v => v.id), 0) + 1, available: true };
        setVehicles(prev => [...prev, newVehicle]);
        console.log("Adding vehicle", newVehicle);
    };


    const value = {
        session,
        user,
        loading,
        vehicles,
        customers,
        rentals,
        rentalRequests,
        login,
        logout,
        addVehicle
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
