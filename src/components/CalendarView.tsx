import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import { Link } from 'react-router-dom';

const CalendarView: React.FC = () => {
    const { rentals, vehicles, customers } = useData();

    // This is a simplified calendar view. A real implementation would use a library like FullCalendar.
    const today = new Date();
    const upcomingRentals = rentals
        .filter(r => new Date(r.end_date) >= today)
        .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

    const getVehicleBrand = (id: number) => vehicles.find(v => v.id === id)?.brand || 'Neznámé';
    const getCustomerName = (id: number) => {
        const c = customers.find(c => c.id === id);
        return c ? `${c.first_name} ${c.last_name}` : 'Neznámý';
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kalendář zápůjček</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4">Nadcházející a aktivní zápůjčky</h2>
                <div className="space-y-4">
                    {upcomingRentals.length > 0 ? (
                        upcomingRentals.map(rental => (
                            <Link to={`/rentals/contract/${rental.id}`} key={rental.id}>
                                <div className="p-4 border rounded-lg bg-background hover:shadow-md transition-shadow">
                                    <p className="font-bold">{getVehicleBrand(rental.vehicle_id)}</p>
                                    <p className="text-sm">Zákazník: {getCustomerName(rental.customer_id)}</p>
                                    <p className="text-sm text-text-secondary">
                                        {new Date(rental.start_date).toLocaleDateString()} - {new Date(rental.end_date).toLocaleDateString()}
                                    </p>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p>Nejsou naplánovány žádné budoucí zápůjčky.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CalendarView;
