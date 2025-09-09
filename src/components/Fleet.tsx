import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Label, Modal } from './ui';
import { Vehicle } from '../types';
import { EditIcon, TrashIcon } from './Icons';

const Fleet: React.FC = () => {
    const { vehicles, addVehicle } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Omit<Vehicle, 'id' | 'available'>>({
        brand: '',
        model: '',
        year: new Date().getFullYear(),
        license_plate: '',
        vin: '',
        color: '',
        price_per_day: 0,
    });

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value, type } = e.target;
        setNewVehicle(prev => ({
            ...prev,
            [id]: type === 'number' ? parseInt(value) || 0 : value,
        }));
    };

    const handleAddVehicle = (e: React.FormEvent) => {
        e.preventDefault();
        addVehicle({ ...newVehicle, available: true });
        setIsModalOpen(false);
        // Reset form
        setNewVehicle({
            brand: '', model: '', year: new Date().getFullYear(), license_plate: '', vin: '', color: '', price_per_day: 0,
        });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vozový park</h1>
                <Button onClick={() => setIsModalOpen(true)}>Přidat vozidlo</Button>
            </div>
            <Card>
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b">
                            <th className="p-2">Značka</th>
                            <th className="p-2">Model</th>
                            <th className="p-2">SPZ</th>
                            <th className="p-2">Cena/den</th>
                            <th className="p-2">Stav</th>
                            <th className="p-2">Akce</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vehicles.map(vehicle => (
                            <tr key={vehicle.id} className="border-b hover:bg-background">
                                <td className="p-2">{vehicle.brand}</td>
                                <td className="p-2">{vehicle.model}</td>
                                <td className="p-2">{vehicle.license_plate}</td>
                                <td className="p-2">{vehicle.price_per_day} Kč</td>
                                <td className="p-2">
                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${vehicle.available ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {vehicle.available ? 'Dostupné' : 'Půjčené'}
                                    </span>
                                </td>
                                <td className="p-2 flex space-x-2">
                                    <button className="text-text-secondary hover:text-primary"><EditIcon /></button>
                                    <button className="text-text-secondary hover:text-red-500"><TrashIcon /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </Card>
            
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Přidat nové vozidlo">
                <form onSubmit={handleAddVehicle} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="brand">Značka</Label>
                            <Input id="brand" value={newVehicle.brand} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="model">Model</Label>
                            <Input id="model" value={newVehicle.model} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                             <Label htmlFor="year">Rok výroby</Label>
                             <Input id="year" type="number" value={newVehicle.year} onChange={handleInputChange} required />
                        </div>
                        <div>
                            <Label htmlFor="license_plate">SPZ</Label>
                            <Input id="license_plate" value={newVehicle.license_plate} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="color">Barva</Label>
                            <Input id="color" value={newVehicle.color} onChange={handleInputChange} />
                        </div>
                        <div>
                             <Label htmlFor="price_per_day">Cena/den (Kč)</Label>
                             <Input id="price_per_day" type="number" value={newVehicle.price_per_day} onChange={handleInputChange} required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="vin">VIN</Label>
                        <Input id="vin" value={newVehicle.vin} onChange={handleInputChange} />
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Uložit vozidlo</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Fleet;
