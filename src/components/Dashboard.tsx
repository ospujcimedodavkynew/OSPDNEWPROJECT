import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import { FleetIcon, RentalsIcon, CustomersIcon } from './Icons';

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <Card className="flex items-center p-4">
        <div className="p-3 mr-4 text-primary bg-primary bg-opacity-10 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm font-medium text-text-secondary">{title}</p>
            <p className="text-2xl font-bold text-text-primary">{value}</p>
        </div>
    </Card>
);


const Dashboard: React.FC = () => {
    const { vehicles, rentals, customers, rentalRequests } = useData();

    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const pendingRequests = rentalRequests.filter(r => r.status === 'pending').length;

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard title="Celkem vozidel" value={vehicles.length} icon={<FleetIcon />} />
                <StatCard title="Aktivní půjčky" value={activeRentals} icon={<RentalsIcon />} />
                <StatCard title="Zákazníci" value={customers.length} icon={<CustomersIcon />} />
                <StatCard title="Nové žádosti" value={pendingRequests} icon={<span className="text-2xl">🔔</span>} />
            </div>

            <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Nedávné Půjčky</h2>
                    {rentals.slice(0, 5).map(rental => (
                        <div key={rental.id} className="flex justify-between items-center py-2 border-b">
                            <span>Vozidlo: {vehicles.find(v => v.id === rental.vehicleId)?.brand}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${rental.status === 'active' ? 'bg-green-200 text-green-800' : 'bg-yellow-200 text-yellow-800'}`}>{rental.status}</span>
                        </div>
                    ))}
                 </Card>
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Nové Žádosti o Půjčku</h2>
                     {rentalRequests.filter(r => r.status === 'pending').slice(0, 5).map(req => (
                        <div key={req.id} className="flex justify-between items-center py-2 border-b">
                            <span>{req.customer_details.first_name} {req.customer_details.last_name}</span>
                            <span>{req.status}</span>
                        </div>
                    ))}
                 </Card>
            </div>
        </div>
    );
};

export default Dashboard;
