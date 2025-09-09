import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Session, User } from '@supabase/supabase-js';
import { Vehicle, Customer, Rental, RentalRequest } from '../types';

export interface DataContextType {
    session: Session | null;
    user: User | null;
    loading: boolean;
    vehicles: Vehicle[];
    customers: Customer[];
    rentals: Rental[];
    rentalRequests: RentalRequest[];
    login: (email: string, pass: string) => Promise<boolean>;
    logout: () => Promise<void>;
    addVehicle: (vehicle: Omit<Vehicle, 'id' | 'created_at'>) => Promise<void>;
    updateVehicle: (id: number, updates: Partial<Omit<Vehicle, 'id' | 'created_at'>>) => Promise<void>;
    deleteVehicle: (id: number) => Promise<void>;
    addCustomer: (customer: Omit<Customer, 'id' | 'created_at'>) => Promise<Customer | null>;
    updateCustomer: (id: number, updates: Partial<Omit<Customer, 'id' | 'created_at'>>) => Promise<void>;
    deleteCustomer: (id: number) => Promise<void>;
    addRental: (rental: Omit<Rental, 'id' | 'created_at'>) => Promise<Rental | null>;
    updateRental: (id: number, updates: Partial<Omit<Rental, 'id' | 'created_at'>>) => Promise<void>;
    addRentalRequest: (request: Omit<RentalRequest, 'id' | 'created_at' | 'status'>) => Promise<void>;
    updateRentalRequestStatus: (id: number, status: 'approved' | 'rejected') => Promise<void>;
    sendContractByEmail: (rentalId: number) => Promise<void>;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [session, setSession] = useState<Session | null>(null);
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [rentals, setRentals] = useState<Rental[]>([]);
    const [rentalRequests, setRentalRequests] = useState<RentalRequest[]>([]);

    const fetchData = useCallback(async () => {
        const { data: vehiclesData, error: vehiclesError } = await supabase.from('vehicles').select('*');
        if (vehiclesData) setVehicles(vehiclesData);
        if (vehiclesError) console.error('Error fetching vehicles:', vehiclesError);

        const { data: customersData, error: customersError } = await supabase.from('customers').select('*');
        if (customersData) setCustomers(customersData);
        if (customersError) console.error('Error fetching customers:', customersError);

        const { data: rentalsData, error: rentalsError } = await supabase.from('rentals').select('*');
        if (rentalsData) setRentals(rentalsData);
        if (rentalsError) console.error('Error fetching rentals:', rentalsError);

        const { data: requestsData, error: requestsError } = await supabase.from('rental_requests').select('*');
        if (requestsData) setRentalRequests(requestsData);
        if (requestsError) console.error('Error fetching rental requests:', requestsError);
    }, []);

    useEffect(() => {
        setLoading(true);
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) {
                fetchData();
            }
            setLoading(false);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setUser(session?.user ?? null);
            if (session) {
                fetchData();
            }
        });

        return () => subscription.unsubscribe();
    }, [fetchData]);
    
    // Realtime subscriptions
    useEffect(() => {
        const vehiclesSub = supabase.channel('public:vehicles').on('postgres_changes', { event: '*', schema: 'public', table: 'vehicles' }, () => fetchData()).subscribe();
        const customersSub = supabase.channel('public:customers').on('postgres_changes', { event: '*', schema: 'public', table: 'customers' }, () => fetchData()).subscribe();
        const rentalsSub = supabase.channel('public:rentals').on('postgres_changes', { event: '*', schema: 'public', table: 'rentals' }, () => fetchData()).subscribe();
        const rentalRequestsSub = supabase.channel('public:rental_requests').on('postgres_changes', { event: '*', schema: 'public', table: 'rental_requests' }, () => fetchData()).subscribe();

        return () => {
            supabase.removeChannel(vehiclesSub);
            supabase.removeChannel(customersSub);
            supabase.removeChannel(rentalsSub);
            supabase.removeChannel(rentalRequestsSub);
        }
    }, [fetchData]);


    const login = async (email: string, pass: string) => {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pass });
        return !error;
    };

    const logout = async () => {
        await supabase.auth.signOut();
    };

    const addVehicle = async (vehicle: Omit<Vehicle, 'id' | 'created_at'>) => {
        const { error } = await supabase.from('vehicles').insert(vehicle);
        if (error) console.error('Error adding vehicle:', error);
    };

    const updateVehicle = async (id: number, updates: Partial<Omit<Vehicle, 'id' | 'created_at'>>) => {
        const { error } = await supabase.from('vehicles').update(updates).eq('id', id);
        if (error) console.error('Error updating vehicle:', error);
    };

    const deleteVehicle = async (id: number) => {
        const { error } = await supabase.from('vehicles').delete().eq('id', id);
        if (error) console.error('Error deleting vehicle:', error);
    };

    const addCustomer = async (customer: Omit<Customer, 'id' | 'created_at'>): Promise<Customer | null> => {
        const { data, error } = await supabase.from('customers').insert(customer).select().single();
        if (error) console.error('Error adding customer:', error);
        return data;
    };

    const updateCustomer = async (id: number, updates: Partial<Omit<Customer, 'id' | 'created_at'>>) => {
        const { error } = await supabase.from('customers').update(updates).eq('id', id);
        if (error) console.error('Error updating customer:', error);
    };

    const deleteCustomer = async (id: number) => {
        const { error } = await supabase.from('customers').delete().eq('id', id);
        if (error) console.error('Error deleting customer:', error);
    };

    const addRental = async (rental: Omit<Rental, 'id' | 'created_at'>): Promise<Rental | null> => {
        const { data, error } = await supabase.from('rentals').insert(rental).select().single();
        if (error) console.error('Error adding rental:', error);
        return data;
    };
    
    const updateRental = async (id: number, updates: Partial<Omit<Rental, 'id' | 'created_at'>>) => {
        const { error } = await supabase.from('rentals').update(updates).eq('id', id);
        if (error) console.error('Error updating rental:', error);
    };

    const addRentalRequest = async (request: Omit<RentalRequest, 'id' | 'created_at' | 'status'>) => {
        const { error } = await supabase.from('rental_requests').insert({ ...request, status: 'pending' });
        if (error) console.error('Error adding rental request:', error);
    };

    const updateRentalRequestStatus = async (id: number, status: 'approved' | 'rejected') => {
        const { error } = await supabase.from('rental_requests').update({ status }).eq('id', id);
        if (error) console.error('Error updating rental request status:', error);
    };

    const sendContractByEmail = async (rentalId: number) => {
        // This would typically call a Supabase Edge Function
        console.log(`Sending contract email for rental ID: ${rentalId}`);
        try {
            // Example of how you might call an edge function
            // const { data, error } = await supabase.functions.invoke('send-contract', {
            //     body: { rentalId },
            // });
            // if (error) throw error;
            // console.log('Function response:', data);
            await Promise.resolve(); // Placeholder
        } catch (error) {
            console.error('Error sending contract email:', error);
        }
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
        addVehicle,
        updateVehicle,
        deleteVehicle,
        addCustomer,
        updateCustomer,
        deleteCustomer,
        addRental,
        updateRental,
        addRentalRequest,
        updateRentalRequestStatus,
        sendContractByEmail
    };

    return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
    const context = useContext(DataContext);
    if (context === undefined) {
        throw new Error('useData must be used within a DataProvider');
    }
    return context;
};
