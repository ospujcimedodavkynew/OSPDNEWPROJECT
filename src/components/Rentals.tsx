import React from 'react';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import { Link } from 'react-router-dom';

const Rentals: React.FC = () => {
    const { rentals, vehicles, customers } = useData();
    
    const getVehicleBrand = (id: string) => vehicles.find(v => v.id === id)?.brand || 'Neznámé vozidlo';
    const getCustomerName = (id: string) => {
        const c = customers.find(c => c.id === id);
        return c ? `${c.first_name} ${c.last_name}` : 'Neznámý zákazník';
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Půjčovné</h1>
                <Link to="/rentals/new">
                    <Button>Vytvořit novou půjčku</Button>
                </Link>
            </div>
            
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Zákazník</th>
                                <th className="p-3">Vozidlo</th>
                                <th className="p-3">Od</th>
                                <th className="p-3">Do</th>
                                <th className="p-3">Stav</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentals.map(rental => (
                                <tr key={rental.id} className="border-b hover:bg-background">
                                    <td className="p-3">{getCustomerName(rental.customerId)}</td>
                                    <td className="p-3">{getVehicleBrand(rental.vehicleId)}</td>
                                    <td className="p-3">{new Date(rental.startDate).toLocaleDateString()}</td>
                                    <td className="p-3">{new Date(rental.endDate).toLocaleDateString()}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs rounded-full ${
                                            rental.status === 'active' ? 'bg-green-200 text-green-800' : 
                                            rental.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                                            'bg-yellow-200 text-yellow-800'
                                        }`}>{rental.status}</span>
                                    </td>
                                    <td className="p-3 text-right">
                                        <Link to={`/rentals/contract/${rental.id}`}>
                                            <Button variant="secondary">Detail</Button>
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default Rentals;
