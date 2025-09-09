import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';

const CalendarView: React.FC = () => {
    const { rentals, vehicles } = useData();

    // This is a simplified calendar view. A real implementation would use a library like FullCalendar.
    const today = new Date();
    const upcomingRentals = rentals
        .filter(r => new Date(r.endDate) >= today)
        .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Kalendář půjček</h1>
            <Card>
                <h2 className="text-xl font-bold mb-4">Nadcházející a aktivní půjčky</h2>
                <div className="space-y-4">
                    {upcomingRentals.length > 0 ? (
                        upcomingRentals.map(rental => {
                            const vehicle = vehicles.find(v => v.id === rental.vehicleId);
                            return (
                                <div key={rental.id} className="p-4 border rounded-lg bg-background">
                                    <p className="font-bold">{vehicle?.brand} ({vehicle?.license_plate})</p>
                                    <p className="text-sm text-text-secondary">
                                        {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            );
                        })
                    ) : (
                        <p>Nejsou naplánovány žádné budoucí půjčky.</p>
                    )}
                </div>
            </Card>
        </div>
    );
};

export default CalendarView;
