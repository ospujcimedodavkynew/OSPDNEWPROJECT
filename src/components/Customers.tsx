import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Modal, Input, Label, IconButton } from './ui';
import { Customer } from '../types';
import { EditIcon, TrashIcon, SearchIcon } from './Icons';

type FormCustomer = Omit<Customer, 'id' | 'created_at'>;

const emptyForm: FormCustomer = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    id_card_number: '',
    drivers_license_number: '',
};

const Customers: React.FC = () => {
    const { customers, addCustomer, updateCustomer, deleteCustomer } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [formState, setFormState] = useState<FormCustomer>(emptyForm);
    const [searchTerm, setSearchTerm] = useState('');

     useEffect(() => {
        if (editingCustomer) {
            const { id, created_at, ...editableFields } = editingCustomer;
            setFormState(editableFields);
            setIsModalOpen(true);
        } else {
            setFormState(emptyForm);
        }
    }, [editingCustomer]);

    const handleOpenModal = () => {
        setEditingCustomer(null);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCustomer(null);
    };
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormState(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingCustomer) {
            await updateCustomer(editingCustomer.id, formState);
        } else {
            await addCustomer(formState);
        }
        handleCloseModal();
    };

    const handleDelete = (id: number) => {
        if (window.confirm('Opravdu si přejete smazat tohoto zákazníka?')) {
            deleteCustomer(id);
        }
    };
    
     const filteredCustomers = customers.filter(c =>
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Zákazníci</h1>
                <Button onClick={handleOpenModal}>Přidat nového zákazníka</Button>
            </div>

             <div className="relative mb-4">
                <Input 
                    type="text"
                    placeholder="Hledat podle jména nebo e-mailu..."
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
                            <th className="p-2">Jméno</th>
                            <th className="p-2">Email</th>
                            <th className="p-2">Telefon</th>
                            <th className="p-2">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCustomers.map(customer => (
                            <tr key={customer.id} className="border-b hover:bg-background">
                                <td className="p-2">{customer.first_name} {customer.last_name}</td>
                                <td className="p-2">{customer.email}</td>
                                <td className="p-2">{customer.phone}</td>
                                <td className="p-2 flex space-x-2">
                                     <IconButton onClick={() => setEditingCustomer(customer)}><EditIcon /></IconButton>
                                     <IconButton onClick={() => handleDelete(customer.id)}><TrashIcon /></IconButton>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingCustomer ? 'Upravit zákazníka' : 'Přidat nového zákazníka'}>
                 <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div><Label htmlFor="first_name">Jméno</Label><Input id="first_name" value={formState.first_name} onChange={handleInputChange} required /></div>
                        <div><Label htmlFor="last_name">Příjmení</Label><Input id="last_name" value={formState.last_name} onChange={handleInputChange} required /></div>
                    </div>
                    <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={formState.email} onChange={handleInputChange} required /></div>
                    <div><Label htmlFor="phone">Telefon</Label><Input id="phone" type="tel" value={formState.phone} onChange={handleInputChange} required /></div>
                    <div><Label htmlFor="id_card_number">Číslo OP</Label><Input id="id_card_number" value={formState.id_card_number} onChange={handleInputChange} required /></div>
                    <div><Label htmlFor="drivers_license_number">Číslo ŘP</Label><Input id="drivers_license_number" value={formState.drivers_license_number} onChange={handleInputChange} required /></div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">{editingCustomer ? 'Uložit změny' : 'Vytvořit zákazníka'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Customers;
