import React from 'react';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import { Link } from 'react-router-dom';
import { EditIcon } from './Icons';

const Rentals: React.FC = () => {
    const { rentals, vehicles, customers } = useData();

    const getVehicleInfo = (id: number) => {
        const vehicle = vehicles.find(v => v.id === id);
        return vehicle ? `${vehicle.brand} ${vehicle.model}` : 'Neznámé';
    };

    const getCustomerInfo = (id: number) => {
        const customer = customers.find(c => c.id === id);
        return customer ? `${customer.first_name} ${customer.last_name}` : 'Neznámý';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Půjčovné</h1>
                <Link to="/rentals/new">
                    <Button>Vytvořit novou půjčku</Button>
                </Link>
            </div>
            <Card>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Vozidlo</th>
                            <th className="p-2">Zákazník</th>
                            <th className="p-2">Od</th>
                            <th className="p-2">Do</th>
                            <th className="p-2">Cena</th>
                            <th className="p-2">Stav</th>
                            <th className="p-2">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rentals.map(rental => (
                            <tr key={rental.id} className="border-b hover:bg-background">
                                <td className="p-2">{getVehicleInfo(rental.vehicleId)}</td>
                                <td className="p-2">{getCustomerInfo(rental.customerId)}</td>
                                <td className="p-2">{new Date(rental.startDate).toLocaleDateString()}</td>
                                <td className="p-2">{new Date(rental.endDate).toLocaleDateString()}</td>
                                <td className="p-2">{rental.totalPrice} Kč</td>
                                <td className="p-2">
                                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                         rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                         rental.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                         'bg-green-100 text-green-800'
                                     }`}>
                                        {rental.status === 'active' ? 'Aktivní' : rental.status === 'completed' ? 'Dokončeno' : 'Nadcházející'}
                                    </span>
                                </td>
                                <td className="p-2 flex space-x-2">
                                    <Link to={`/rentals/contract/${rental.id}`} className="text-text-secondary hover:text-primary"><EditIcon /></Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Rentals;
