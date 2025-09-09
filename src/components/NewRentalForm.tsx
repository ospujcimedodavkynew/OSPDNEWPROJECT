import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Label } from './ui';
import { useNavigate } from 'react-router-dom';

const NewRentalForm: React.FC = () => {
    const { vehicles, customers } = useData();
    const navigate = useNavigate();
    const [selectedVehicleId, setSelectedVehicleId] = useState<string>('');
    const [selectedCustomerId, setSelectedCustomerId] = useState<string>('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        if (selectedVehicleId && startDate && endDate) {
            const vehicle = vehicles.find(v => v.id === parseInt(selectedVehicleId));
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (vehicle && start < end) {
                const days = (end.getTime() - start.getTime()) / (1000 * 3600 * 24);
                setTotalPrice(days * vehicle.price_per_day);
            } else {
                setTotalPrice(0);
            }
        }
    }, [selectedVehicleId, startDate, endDate, vehicles]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Here you would call a function from useData to add the new rental
        console.log({
            vehicleId: parseInt(selectedVehicleId),
            customerId: parseInt(selectedCustomerId),
            startDate,
            endDate,
            totalPrice,
        });
        // Redirect to rentals list
        navigate('/rentals');
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Nová půjčka</h1>
            <Card>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <Label htmlFor="vehicle">Vozidlo</Label>
                        <select
                            id="vehicle"
                            value={selectedVehicleId}
                            onChange={(e) => setSelectedVehicleId(e.target.value)}
                            required
                            className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="" disabled>Vyberte vozidlo</option>
                            {vehicles.filter(v => v.available).map(v => (
                                <option key={v.id} value={v.id}>{v.brand} {v.model} ({v.license_plate})</option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <Label htmlFor="customer">Zákazník</Label>
                        <select
                            id="customer"
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                            required
                             className="w-full px-3 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="" disabled>Vyberte zákazníka</option>
                            {customers.map(c => (
                                <option key={c.id} value={c.id}>{c.first_name} {c.last_name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="startDate">Datum od</Label>
                            <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                        </div>
                        <div>
                            <Label htmlFor="endDate">Datum do</Label>
                            <Input id="endDate" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} required />
                        </div>
                    </div>
                    
                    <div className="pt-4">
                        <h3 className="text-lg font-semibold">Celková cena: {totalPrice} Kč</h3>
                    </div>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={totalPrice <= 0}>Vytvořit půjčku</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default NewRentalForm;
