import React from 'react';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import { EditIcon, TrashIcon } from './Icons';

const Customers: React.FC = () => {
    const { customers } = useData();

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Zákazníci</h1>
                <Button>Přidat zákazníka</Button>
            </div>
            <Card>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Jméno</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Telefon</th>
                            <th className="p-2">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.map(customer => (
                            <tr key={customer.id} className="border-b hover:bg-background">
                                <td className="p-2">{customer.first_name} {customer.last_name}</td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2">{customer.phone}</td>
                                <td className="p-2 flex space-x-2">
                                    <button className="text-text-secondary hover:text-primary"><EditIcon /></button>
                                    <button className="text-text-secondary hover:text-red-500"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
        </div>
    );
};

export default Customers;
