import React, { useState } from 'react';
import { useData } from '../context/DataContext';
import { Vehicle } from '../types';
import { Button, Card, Modal, Input, Label, IconButton } from './ui';
import { EditIcon, TrashIcon } from './Icons';

const Fleet: React.FC = () => {
    const { vehicles, addVehicle } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newVehicle, setNewVehicle] = useState<Partial<Vehicle>>({});

    const handleAddVehicle = async () => {
        // Basic validation
        if (!newVehicle.brand || !newVehicle.license_plate) {
            alert('Značka a SPZ jsou povinné.');
            return;
        }
        
        const vehicleToAdd = {
            brand: newVehicle.brand,
            license_plate: newVehicle.license_plate,
            vin: newVehicle.vin || '',
            year: newVehicle.year || new Date().getFullYear(),
            pricing: { perDay: Number(newVehicle.pricing?.perDay) || 0 },
            stk_date: newVehicle.stk_date || '',
            insurance_info: newVehicle.insurance_info || '',
            vignette_until: newVehicle.vignette_until || '',
        };

        await addVehicle(vehicleToAdd as any);
        setIsModalOpen(false);
        setNewVehicle({});
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Vozový park</h1>
                <Button onClick={() => setIsModalOpen(true)}>Přidat vozidlo</Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {vehicles.map(vehicle => (
                    <Card key={vehicle.id}>
                        <h2 className="text-xl font-bold">{vehicle.brand} ({vehicle.year})</h2>
                        <p className="text-text-secondary">{vehicle.license_plate}</p>
                        <p className="mt-2 font-semibold">{vehicle.pricing.perDay} Kč / den</p>
                        <div className="mt-4 flex justify-end space-x-2">
                            <IconButton><EditIcon/></IconButton>
                            <IconButton className="text-red-500"><TrashIcon/></IconButton>
                        </div>
                    </Card>
                ))}
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Přidat nové vozidlo">
                <div className="space-y-4">
                    <div>
                        <Label>Značka a model</Label>
                        <Input value={newVehicle.brand || ''} onChange={e => setNewVehicle({...newVehicle, brand: e.target.value})} />
                    </div>
                    <div>
                        <Label>SPZ</Label>
                        <Input value={newVehicle.license_plate || ''} onChange={e => setNewVehicle({...newVehicle, license_plate: e.target.value})} />
                    </div>
                    <div>
                        <Label>Cena za den (Kč)</Label>
                        <Input type="number" value={newVehicle.pricing?.perDay || ''} onChange={e => setNewVehicle({...newVehicle, pricing: { perDay: Number(e.target.value) }})} />
                    </div>
                     <div>
                        <Label>Rok výroby</Label>
                        <Input type="number" value={newVehicle.year || ''} onChange={e => setNewVehicle({...newVehicle, year: Number(e.target.value) })} />
                    </div>
                    <div className="flex justify-end space-x-2 pt-4">
                         <Button variant="secondary" onClick={() => setIsModalOpen(false)}>Zrušit</Button>
                         <Button onClick={handleAddVehicle}>Uložit vozidlo</Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Fleet;