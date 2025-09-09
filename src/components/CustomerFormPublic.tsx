import React, { useState } from 'react';
import { Card, Button, Input, Label } from './ui';
import { useData } from '../context/DataContext';
import { RentalRequest } from '../types';

type PublicFormState = Omit<RentalRequest, 'id' | 'created_at' | 'status'>;

const CustomerFormPublic: React.FC = () => {
    const { addRentalRequest } = useData();
    const [formData, setFormData] = useState<PublicFormState>({
        first_name: '',
        last_name: '',
        email: '',
        phone: '',
        id_card_number: '',
        drivers_license_number: '',
        digital_consent_at: '',
    });
    const [submitted, setSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({...prev, [id]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await addRentalRequest({
            ...formData,
            digital_consent_at: new Date().toISOString()
        });
        setSubmitted(true);
    };
    
    if(submitted) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-background">
                <Card className="w-full max-w-lg text-center p-8">
                    <h1 className="text-2xl font-bold mb-4">Děkujeme!</h1>
                    <p>Vaše žádost o půjčku byla odeslána. Brzy se vám ozveme s potvrzením.</p>
                </Card>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-background py-8">
            <Card className="w-full max-w-lg">
                <h1 className="text-2xl font-bold mb-6 text-center">Žádost o zapůjčení vozidla</h1>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="first_name">Jméno</Label>
                            <Input id="first_name" value={formData.first_name} onChange={handleChange} required />
                        </div>
                        <div>
                            <Label htmlFor="last_name">Příjmení</Label>
                            <Input id="last_name" value={formData.last_name} onChange={handleChange} required />
                        </div>
                    </div>
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="id_card_number">Číslo OP</Label>
                        <Input id="id_card_number" value={formData.id_card_number} onChange={handleChange} required />
                    </div>
                    <div>
                        <Label htmlFor="drivers_license_number">Číslo ŘP</Label>
                        <Input id="drivers_license_number" value={formData.drivers_license_number} onChange={handleChange} required />
                    </div>
                    <div className="pt-4">
                        <Button type="submit" className="w-full">Odeslat žádost</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
};

export default CustomerFormPublic;
