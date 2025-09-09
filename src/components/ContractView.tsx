import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import SignaturePad from './SignaturePad';

const ContractView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { rentals, vehicles, customers, loading } = useData();
    const [showCustomerSignaturePad, setShowCustomerSignaturePad] = useState(false);
    const [showCompanySignaturePad, setShowCompanySignaturePad] = useState(false);

    if (loading) return <div>Načítání...</div>;

    const rental = rentals.find(r => r.id === id);
    if (!rental) return <div>Smlouva nenalezena.</div>;

    const vehicle = vehicles.find(v => v.id === rental.vehicleId);
    const customer = customers.find(c => c.id === rental.customerId);

    if (!vehicle || !customer) return <div>Data pro smlouvu chybí.</div>;
    
    const handleSaveSignature = (type: 'customer' | 'company', dataUrl: string) => {
        // In a real app, you would save this to the database
        console.log(`Saving ${type} signature for rental ${id}:`, dataUrl.substring(0, 30) + '...');
        if(type === 'customer') {
            // Update local state or refetch for demo
            rental.customer_signature = dataUrl;
            setShowCustomerSignaturePad(false);
        } else {
            rental.company_signature = dataUrl;
            setShowCompanySignaturePad(false);
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Detail smlouvy o pronájmu</h1>
            <Card className="prose max-w-none">
                <h2>Smlouva č. {rental.id}</h2>
                <p><strong>Datum uzavření:</strong> {new Date(rental.startDate).toLocaleDateString()}</p>
                
                <h3>Předmět nájmu</h3>
                <p>Vozidlo: {vehicle.brand}, {vehicle.year}</p>
                <p>SPZ: {vehicle.license_plate}</p>
                <p>VIN: {vehicle.vin}</p>
                
                <h3>Nájemce (Zákazník)</h3>
                <p>Jméno: {customer.first_name} {customer.last_name}</p>
                <p>Email: {customer.email}</p>
                <p>Telefon: {customer.phone}</p>
                
                <h3>Doba nájmu</h3>
                <p>Od: {new Date(rental.startDate).toLocaleString()}</p>
                <p>Do: {new Date(rental.endDate).toLocaleString()}</p>
                <p>Cena celkem: {rental.totalPrice} Kč</p>

                <div className="grid grid-cols-2 gap-8 mt-12 not-prose">
                    <div>
                        <h4 className="font-bold">Podpis zákazníka</h4>
                        {rental.customer_signature ? (
                            <img src={rental.customer_signature} alt="Podpis zákazníka" className="border" />
                        ) : (
                            showCustomerSignaturePad ? (
                                <SignaturePad 
                                    onSave={(data) => handleSaveSignature('customer', data)} 
                                    onCancel={() => setShowCustomerSignaturePad(false)}
                                />
                            ) : (
                                <Button onClick={() => setShowCustomerSignaturePad(true)}>Podepsat</Button>
                            )
                        )}
                    </div>
                     <div>
                        <h4 className="font-bold">Podpis pronajímatele</h4>
                         {rental.company_signature ? (
                            <img src={rental.company_signature} alt="Podpis pronajímatele" className="border" />
                        ) : (
                            showCompanySignaturePad ? (
                                <SignaturePad 
                                    onSave={(data) => handleSaveSignature('company', data)} 
                                    onCancel={() => setShowCompanySignaturePad(false)}
                                />
                            ) : (
                                <Button onClick={() => setShowCompanySignaturePad(true)}>Podepsat</Button>
                            )
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
};

export default ContractView;
