import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../supabaseClient';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { Vehicle, Customer, Rental, RentalRequest } from '../types';

interface DataContextProps {
    session: Session | null;
    user: User | null;
    vehicles: Vehicle[];
    customers: Customer[];
    rentals: Rental[];
    rentalRequests: RentalRequest[];
    loading: boolean;
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id' | 'serviceHistory'>) => Promise<any>;
    // Add other data manipulation functions as needed
}

const DataContext = createContext<DataContextProps | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

    useEffect(() => {
        const getSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        };
        
        getSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            async (_event: AuthChangeEvent, session: Session | null) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            }
        );

        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    const fetchData = async () => {
        if (!session) return;
        setLoading(true);
        // In a real app, you'd handle errors for each of these
        const { data: vehiclesData } = await supabase.from('vehicles').select('*');
        const { data: customersData } = await supabase.from('customers').select('*');
        const { data: rentalsData } = await supabase.from('rentals').select('*');
        const { data: requestsData } = await supabase.from('rental_requests').select('*');
        
        setVehicles(vehiclesData as Vehicle[] || []);
        setCustomers(customersData as Customer[] || []);
        setRentals(rentalsData as Rental[] || []);
        setRentalRequests(requestsData as RentalRequest[] || []);
        setLoading(false);
    }
    
    useEffect(() => {
        if (session) {
            fetchData();
        }
    }, [session]);

    const login = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        return !error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };
    
    const addVehicle = async (vehicle: Omit<Vehicle, 'id'| 'serviceHistory'>) => {
        const { data, error } = await supabase.from('vehicles').insert([vehicle]).select();
        if(error) {
            console.error("Error adding vehicle", error);
            return null;
        }
        if(data) {
            setVehicles(prev => [...prev, data[0] as Vehicle]);
            return data[0];
        }
        return null;
    }

    const value = {
        session,
        user,
        vehicles,
        customers,
        rentals,
        rentalRequests,
        loading: loading,
        login,
        logout,
        addVehicle,
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
