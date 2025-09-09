import React, { useState, useEffect } from 'react';
import { useData } from '../context/DataContext';
import { Card, Button, Input, Label, Modal, IconButton } from './ui';
import { Vehicle, VehiclePricing } from '../types';
import { EditIcon, TrashIcon, SearchIcon } from './Icons';

type FormVehicle = Omit<Vehicle, 'id' | 'created_at'>;

const emptyForm: FormVehicle = {
    brand: '',
    license_plate: '',
    vin: '',
    year: new Date().getFullYear(),
    pricing: { '4h': 0, '12h': 0, day: 0, month: 0 },
    stk_date: '',
    insurance_info: '',
    vignette_until: '',
};

const Fleet: React.FC = () => {
    const { vehicles, addVehicle, updateVehicle, deleteVehicle } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
    const [formState, setFormState] = useState<FormVehicle>(emptyForm);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (editingVehicle) {
            const { id, created_at, ...editableFields } = editingVehicle;
            setFormState(editableFields);
            setIsModalOpen(true);
        } else {
            setFormState(emptyForm);
        }
    }, [editingVehicle]);

    const handleOpenModal = () => {
        setEditingVehicle(null);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingVehicle(null);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormState(prev => ({ ...prev, [id]: value }));
    };
    
    const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target as { id: keyof VehiclePricing, value: string };
        setFormState(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [id]: parseFloat(value) || 0 }
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingVehicle) {
            await updateVehicle(editingVehicle.id, formState);
        } else {
            await addVehicle(formState);
        }
        handleCloseModal();
    };
    
    const handleDelete = (id: number) => {
        if (window.confirm('Opravdu si přejete smazat toto vozidlo?')) {
            deleteVehicle(id);
        }
    };
    
    const filteredVehicles = vehicles.filter(v =>
        v.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        v.license_plate.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vozový park</h1>
                <Button onClick={handleOpenModal}>Přidat nové vozidlo</Button>
            </div>

            <div className="relative mb-4">
                <Input 
                    type="text"
                    placeholder="Hledat podle značky nebo SPZ..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="pl-10"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-text-secondary">
                    <SearchIcon />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredVehicles.map(vehicle => (
                    <Card key={vehicle.id} className="flex flex-col">
                        <div className="flex-grow">
                            <div className="flex justify-between items-start">
                                <h2 className="text-xl font-bold">{vehicle.brand}</h2>
                                <div className="flex space-x-2">
                                    <IconButton onClick={() => setEditingVehicle(vehicle)}><EditIcon /></IconButton>
                                    <IconButton onClick={() => handleDelete(vehicle.id)}><TrashIcon /></IconButton>
                                </div>
                            </div>
                            <p className="text-text-secondary">{vehicle.license_plate}</p>
                            <div className="mt-4 text-sm space-y-1">
                                {Object.entries(vehicle.pricing).map(([key, value]) => value ? (
                                    <div key={key} className="flex justify-between">
                                        <span>Cena ({key}):</span>
                                        <span className="font-semibold">{value} Kč</span>
                                    </div>
                                ) : null)}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
            
            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingVehicle ? "Upravit vozidlo" : "Přidat nové vozidlo"}>
                <form onSubmit={handleSubmit} className="space-y-4">
                     <div className="grid grid-cols-2 gap-4">
                        {/* FIX: Wrapped sibling Label and Input components in a fragment to resolve "multiple children" error. */}
                        <div><><Label htmlFor="brand">Značka</Label><Input id="brand" value={formState.brand} onChange={handleInputChange} required /></></div>
                        <div><><Label htmlFor="license_plate">SPZ</Label><Input id="license_plate" value={formState.license_plate} onChange={handleInputChange} required /></></div>
                    </div>
                     <div className="grid grid-cols-2 gap-4">
                        <div><><Label htmlFor="vin">VIN</Label><Input id="vin" value={formState.vin} onChange={handleInputChange} required /></></div>
                        <div><><Label htmlFor="year">Rok výroby</Label><Input id="year" type="number" value={formState.year} onChange={handleInputChange} required /></></div>
                    </div>
                    <h3 className="text-lg font-semibold pt-2">Ceník</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div><><Label htmlFor="4h">Cena za 4h (Kč)</Label><Input id="4h" type="number" value={formState.pricing['4h'] || ''} onChange={handlePricingChange} /></></div>
                        <div><><Label htmlFor="12h">Cena za 12h (Kč)</Label><Input id="12h" type="number" value={formState.pricing['12h'] || ''} onChange={handlePricingChange} /></></div>
                        <div><><Label htmlFor="day">Cena za den (Kč)</Label><Input id="day" type="number" value={formState.pricing.day || ''} onChange={handlePricingChange} /></></div>
                        <div><><Label htmlFor="month">Cena za měsíc (Kč)</Label><Input id="month" type="number" value={formState.pricing.month || ''} onChange={handlePricingChange} /></></div>
                    </div>
                     <h3 className="text-lg font-semibold pt-2">Další informace</h3>
                     <div className="grid grid-cols-2 gap-4">
                        <div><><Label htmlFor="stk_date">STK do</Label><Input id="stk_date" type="date" value={formState.stk_date} onChange={handleInputChange} required /></></div>
                        <div><><Label htmlFor="vignette_until">Dálniční známka do</Label><Input id="vignette_until" type="date" value={formState.vignette_until || ''} onChange={handleInputChange} /></></div>
                    </div>
                    <div><><Label htmlFor="insurance_info">Informace o pojištění</Label><Input id="insurance_info" value={formState.insurance_info || ''} onChange={handleInputChange} /></></div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">{editingVehicle ? 'Uložit změny' : 'Vytvořit vozidlo'}</Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Fleet;