import React from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, IconButton } from './ui';
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-3">Jméno</th>
                                <th className="p-3">Email</th>
                                <th className="p-3">Telefon</th>
                                <th className="p-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map(customer => (
                                <tr key={customer.id} className="border-b hover:bg-background">
                                    <td className="p-3">{customer.first_name} {customer.last_name}</td>
                                    <td className="p-3">{customer.email}</td>
                                    <td className="p-3">{customer.phone}</td>
                                    <td className="p-3 text-right">
                                        <div className="flex justify-end space-x-2">
                                            <IconButton><EditIcon/></IconButton>
                                            <IconButton className="text-red-500"><TrashIcon/></IconButton>
                                        </div>
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

export default Customers;
