import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useData } from '../context/DataContext';
// FIX: Import `Modal` component which was used but not imported.
import { Card, Button, Modal } from './ui';
import SignaturePad from './SignaturePad';
import { Rental, Vehicle, Customer } from '../types';

interface ContractViewProps {
    previewRental?: Rental;
    vehicle?: Vehicle;
    customer?: Customer;
    onCustomerSignRequest?: () => void;
    onCompanySignRequest?: () => void;
}

const ContractView: React.FC<ContractViewProps> = ({ 
    previewRental, 
    vehicle: previewVehicle, 
    customer: previewCustomer,
    onCustomerSignRequest,
    onCompanySignRequest,
}) => {
    const { id } = useParams<{ id: string }>();
    const { rentals, vehicles, customers, updateRental } = useData();
    const [signingFor, setSigningFor] = useState<'customer' | 'company' | null>(null);

    const isPreview = !!previewRental;
    const rental = isPreview ? previewRental : rentals.find(r => r.id === parseInt(id || ''));
    const vehicle = isPreview ? previewVehicle : rental ? vehicles.find(v => v.id === rental.vehicle_id) : null;
    const customer = isPreview ? previewCustomer : rental ? customers.find(c => c.id === rental.customer_id) : null;
    
    const [customerSignature, setCustomerSignature] = useState(rental?.customer_signature);
    const [companySignature, setCompanySignature] = useState(rental?.company_signature);

    const handleSaveSignature = async (dataUrl: string) => {
        if (!rental) return;
        
        if (signingFor === 'customer') {
            setCustomerSignature(dataUrl);
            if(!isPreview) await updateRental(rental.id, { customer_signature: dataUrl });
        }
        if (signingFor === 'company') {
            setCompanySignature(dataUrl);
            if(!isPreview) await updateRental(rental.id, { company_signature: dataUrl });
        }
        setSigningFor(null);
    };

    if (!rental || !vehicle || !customer) {
        return <div className="p-4">Smlouva nenalezena nebo se načítá...</div>;
    }

    return (
        <div>
             {!isPreview && (
                 <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold">Smlouva o pronájmu vozidla č. {rental.id}</h1>
                    <Button onClick={() => window.print()}>Tisk</Button>
                </div>
            )}
            
            <Card className="prose max-w-none">
                 <h2 className="text-center">Smlouva o nájmu dopravního prostředku</h2>
                <p className="text-center">uzavřená podle § 2321 a násl. zákona č. 89/2012 Sb., občanský zákoník</p>
                
                <h3>Čl. I - Smluvní strany</h3>
                 <div className="grid grid-cols-2 gap-8 not-prose">
                    <div>
                        <h4 className="font-bold">Pronajímatel:</h4>
                        <p>
                            Milan Gula<br/>
                            Ghegova 17, Brno - Nové Sady<br/>
                            IČO: 07031653<br/>
                            Web: pujcimedodavky.cz
                        </p>
                    </div>
                    <div>
                        <h4 className="font-bold">Nájemce:</h4>
                        <p>
                            <strong>{customer.first_name} {customer.last_name}</strong><br />
                            Email: {customer.email}<br />
                            Telefon: {customer.phone}<br />
                            Číslo OP: {customer.id_card_number}<br />
                            Číslo ŘP: {customer.drivers_license_number}
                        </p>
                    </div>
                </div>

                <h3>Čl. II - Předmět nájmu</h3>
                <p>
                    Pronajímatel přenechává nájemci do dočasného užívání následující vozidlo (dále jen "předmět nájmu"):
                </p>
                <ul>
                    <li><strong>Vozidlo:</strong> {vehicle.brand}</li>
                    <li><strong>SPZ:</strong> {vehicle.license_plate}</li>
                    <li><strong>VIN:</strong> {vehicle.vin}</li>
                    <li><strong>Rok výroby:</strong> {vehicle.year}</li>
                </ul>
                
                <h3>Čl. III - Doba nájmu a nájemné</h3>
                <p>
                    Nájem se sjednává na dobu určitou od <strong>{new Date(rental.start_date).toLocaleString()}</strong> do <strong>{new Date(rental.end_date).toLocaleString()}</strong>.
                </p>
                <p>
                    Celková cena nájmu byla sjednána na <strong>{rental.total_price} Kč</strong>.
                </p>
                
                 <h3>Čl. IV - Práva a povinnosti</h3>
                <ol>
                    <li>Nájemce je povinen užívat předmět nájmu s péčí řádného hospodáře, v souladu s jeho účelem a technickými podmínkami.</li>
                    <li>Nájemce je povinen hradit náklady na pohonné hmoty po celou dobu nájmu.</li>
                    <li>Nájemce nesmí přenechat předmět nájmu do podnájmu třetí osobě bez předchozího písemného souhlasu pronajímatele.</li>
                    <li>V případě dopravní nehody, poškození nebo odcizení vozidla je nájemce povinen neprodleně informovat pronajímatele a Policii ČR.</li>
                </ol>

                <h3>Čl. V - Závěrečná ustanovení</h3>
                <p>Tato smlouva nabývá platnosti a účinnosti dnem jejího podpisu oběma smluvními stranami. Smluvní strany prohlašují, že si smlouvu přečetly, s jejím obsahem souhlasí a na důkaz toho připojují své podpisy.</p>
                
                 <div className="grid grid-cols-2 gap-8 pt-8 not-prose">
                    <div>
                        <h4 className="font-bold">Podpis pronajímatele:</h4>
                         {companySignature ? (
                           <img src={companySignature} alt="Podpis pronajímatele" className="h-24 border-b" />
                        ) : (
                           <div className="h-24 border-b"></div>
                        )}
                        {!companySignature && (
                            <Button onClick={isPreview ? onCompanySignRequest : () => setSigningFor('company')} className="mt-2">
                                Podepsat digitálně
                            </Button>
                        )}
                    </div>
                    <div>
                        <h4 className="font-bold">Podpis nájemce:</h4>
                         {customerSignature ? (
                           <img src={customerSignature} alt="Podpis nájemce" className="h-24 border-b" />
                        ) : (
                           <div className="h-24 border-b"></div>
                        )}
                        {!customerSignature && (
                            <Button onClick={isPreview ? onCustomerSignRequest : () => setSigningFor('customer')} className="mt-2">
                                Podepsat digitálně
                            </Button>
                        )}
                    </div>
                </div>
            </Card>

            {/* FIX: `Modal` component was used but not imported. */}
            {!isPreview && signingFor && (
                <Modal isOpen={true} onClose={() => setSigningFor(null)} title={`Digitální podpis (${signingFor === 'customer' ? 'Zákazník' : 'Pronajímatel'})`}>
                    <SignaturePad onSave={handleSaveSignature} onCancel={() => setSigningFor(null)} />
                </Modal>
            )}
        </div>
    );
};

export default ContractView;