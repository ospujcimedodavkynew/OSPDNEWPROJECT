import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Label, Select } from './ui';
import { useNavigate } from 'react-router-dom';

const NewRentalForm: React.FC = () => {
    const { vehicles, customers } = useData();
    const navigate = useNavigate();
    const [selectedVehicle, setSelectedVehicle] = useState('');
    const [selectedCustomer, setSelectedCustomer] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would typically save the new rental to your backend
        console.log({
            vehicleId: selectedVehicle,
            customerId: selectedCustomer,
            startDate,
            endDate,
        });
        alert('Nová půjčka vytvořena!');
        navigate('/rentals');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Nová půjčka</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="vehicle">Vozidlo</Label>
                        <Select id="vehicle" value={selectedVehicle} onChange={e => setSelectedVehicle(e.target.value)} required>
                            <option value="" disabled>Vyberte vozidlo</option>
                            {vehicles.map(v => <option key={v.id} value={v.id}>{v.brand} - {v.license_plate}</option>)}
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="customer">Zákazník</Label>
                        <Select id="customer" value={selectedCustomer} onChange={e => setSelectedCustomer(e.target.value)} required>
                            <option value="" disabled>Vyberte zákazníka</option>
                            {customers.map(c => <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>)}
                        </Select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="start-date">Datum od</Label>
                            <Input id="start-date" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="end-date">Datum do</Label>
                            <Input id="end-date" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Vytvořit půjčku</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default NewRentalForm;
