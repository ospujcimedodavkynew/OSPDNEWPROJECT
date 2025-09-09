import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input } from './ui';
import { Link } from 'react-router-dom';
import { EditIcon, SearchIcon } from './Icons';

const Rentals: React.FC = () => {
    const { rentals, vehicles, customers } = useData();
    const [searchTerm, setSearchTerm] = useState('');

    const getVehicleBrand = (id: number) => {
        const vehicle = vehicles.find(v => v.id === id);
        return vehicle ? vehicle.brand : 'Neznámé';
    };

    const getCustomerName = (id: number) => {
        const customer = customers.find(c => c.id === id);
        return customer ? `${customer.first_name} ${customer.last_name}` : 'Neznámý';
    };
    
    const filteredRentals = rentals.filter(r => {
        const customerName = getCustomerName(r.customer_id).toLowerCase();
        const vehicleBrand = getVehicleBrand(r.vehicle_id).toLowerCase();
        const term = searchTerm.toLowerCase();
        return customerName.includes(term) || vehicleBrand.includes(term);
    });

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Půjčovné</h1>
                <Link to="/rentals/new">
                    <Button>Vytvořit novou zápůjčku</Button>
                </Link>
            </div>

            <div className="relative mb-4">
                <Input 
                    type="text"
                    placeholder="Hledat podle jména nebo značky vozidla..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                    <SearchIcon />
                </div>
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
                            <th className="p-2">Smlouva</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredRentals.map(rental => (
                            <tr key={rental.id} className="border-b hover:bg-background">
                                <td className="p-2">{getVehicleBrand(rental.vehicle_id)}</td>
                                <td className="p-2">{getCustomerName(rental.customer_id)}</td>
                                <td className="p-2">{new Date(rental.start_date).toLocaleDateString()}</td>
                                <td className="p-2">{new Date(rental.end_date).toLocaleDateString()}</td>
                                <td className="p-2">{rental.total_price} Kč</td>
                                <td className="p-2">
                                     <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                         rental.status === 'active' ? 'bg-blue-100 text-blue-800' :
                                         rental.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                         'bg-green-100 text-green-800'
                                     }`}>
                                        {rental.status}
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
