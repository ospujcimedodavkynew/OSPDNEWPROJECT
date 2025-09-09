import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { Card, Button } from './ui';
import SignaturePad from './SignaturePad';

const ContractView: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { rentals, vehicles, customers } = useData();
    const [showSignaturePad, setShowSignaturePad] = useState(false);
    const [signature, setSignature] = useState<string | null>(null);

    // This is not efficient, but fine for this example. A real app would fetch by ID.
    const rental = rentals.find(r => r.id === parseInt(id || ''));
    const vehicle = rental ? vehicles.find(v => v.id === rental.vehicleId) : null;
    const customer = rental ? customers.find(c => c.id === rental.customerId) : null;

    const handleSaveSignature = (dataUrl: string) => {
        setSignature(dataUrl);
        // In a real app, you would save this to the rental record
        // e.g., updateRental(rental.id, { contract_signed_base64: dataUrl });
        setShowSignaturePad(false);
    };


    if (!rental || !vehicle || !customer) {
        return <div>Smlouva nenalezena.</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Smlouva o pronájmu vozidla</h1>
                <Button onClick={() => window.print()}>Tisk</Button>
            </div>
            
            <Card className="prose max-w-none">
                <h2>Smluvní strany</h2>
                <div className="grid grid-cols-2 gap-8">
                    <div>
                        <h3>Pronajímatel</h3>
                        <p>
                            <strong>RentalAdmin s.r.o.</strong><br />
                            Adresa 123, 110 00 Praha 1<br />
                            IČO: 12345678
                        </p>
                    </div>
                    <div>
                        <h3>Nájemce</h3>
                        <p>
                            <strong>{customer.first_name} {customer.last_name}</strong><br />
                            {customer.address}<br />
                            Email: {customer.email}<br />
                            Telefon: {customer.phone}<br />
                            Číslo OP: {customer.id_card_number}<br />
                            Číslo ŘP: {customer.drivers_license_number}
                        </p>
                    </div>
                </div>

                <h2>Předmět nájmu</h2>
                <p>
                    Pronajímatel přenechává nájemci do dočasného užívání následující vozidlo:
                </p>
                <ul>
                    <li><strong>Vozidlo:</strong> {vehicle.brand} {vehicle.model}</li>
                    <li><strong>Rok výroby:</strong> {vehicle.year}</li>
                    <li><strong>SPZ:</strong> {vehicle.license_plate}</li>
                    <li><strong>VIN:</strong> {vehicle.vin}</li>
                </ul>
                
                <h2>Doba nájmu a cena</h2>
                <p>
                    Nájem se sjednává na dobu od <strong>{new Date(rental.startDate).toLocaleDateString()}</strong> do <strong>{new Date(rental.endDate).toLocaleDateString()}</strong>.
                </p>
                <p>
                    Celková cena nájmu činí <strong>{rental.totalPrice} Kč</strong>.
                </p>
                
                <h2>Podpisy</h2>
                <div className="grid grid-cols-2 gap-8 pt-8">
                    <div>
                        <p>.................................................</p>
                        <p>Pronajímatel</p>
                    </div>
                    <div>
                        {signature ? (
                           <img src={signature} alt="Podpis nájemce" className="h-24 border-b" />
                        ) : (
                           <div className="h-24 border-b"></div>
                        )}
                        <p>Nájemce</p>
                        {!signature && !showSignaturePad && (
                            <Button onClick={() => setShowSignaturePad(true)} className="mt-2">
                                Podepsat digitálně
                            </Button>
                        )}
                    </div>
                </div>
                
                {showSignaturePad && (
                    <div className="mt-4">
                        <SignaturePad onSave={handleSaveSignature} onCancel={() => setShowSignaturePad(false)} />
                    </div>
                )}
            </Card>
        </div>
    );
};

export default ContractView;
