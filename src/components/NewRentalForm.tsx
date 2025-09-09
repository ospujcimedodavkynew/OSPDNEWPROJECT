import React, { useState, useMemo, useCallback } from 'react';
import { useData } from '../context/DataContext';
// FIX: Import `Modal` component which was used but not imported.
import { Card, Button, Input, Label, Stepper, Tabs, SecondaryButton, Select, IconButton, Modal } from './ui';
// FIX: Import `Link` component from react-router-dom.
import { useNavigate, Link } from 'react-router-dom';
import { Customer, Rental, Vehicle } from '../types';
import ContractView from './ContractView';
import SignaturePad from './SignaturePad';
import { SearchIcon } from './Icons';

type Step = 'date' | 'vehicle' | 'customer' | 'contract' | 'confirmation';

const CreateRentalWizard: React.FC = () => {
    const { vehicles, customers, rentals, addCustomer, addRental, sendContractByEmail } = useData();
    const navigate = useNavigate();

    const [currentStep, setCurrentStep] = useState<Step>('date');
    const [startDate, setStartDate] = useState('');
    const [startTime, setStartTime] = useState('09:00');
    const [rentalDuration, setRentalDuration] = useState('day');
    const [rentalDays, setRentalDays] = useState(1);
    
    const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

    const [customerSignature, setCustomerSignature] = useState<string | null>(null);
    const [companySignature, setCompanySignature] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdRentalId, setCreatedRentalId] = useState<number | null>(null);

    const { endDate, totalPrice } = useMemo(() => {
        if (!startDate || !selectedVehicle) return { endDate: null, totalPrice: 0 };

        const startDateTime = new Date(`${startDate}T${startTime}`);
        let endDateTime = new Date(startDateTime);
        let price = 0;

        switch (rentalDuration) {
            case '4h':
                endDateTime.setHours(startDateTime.getHours() + 4);
                price = selectedVehicle.pricing['4h'] || 0;
                break;
            case '12h':
                endDateTime.setHours(startDateTime.getHours() + 12);
                price = selectedVehicle.pricing['12h'] || 0;
                break;
            case 'day':
                endDateTime.setDate(startDateTime.getDate() + 1);
                price = selectedVehicle.pricing.day || 0;
                break;
            case 'days':
                endDateTime.setDate(startDateTime.getDate() + rentalDays);
                price = (selectedVehicle.pricing.day || 0) * rentalDays;
                break;
        }
        
        // Handle month as 30 days
        if (rentalDuration === 'month') {
             endDateTime.setDate(startDateTime.getDate() + 30);
             price = selectedVehicle.pricing.month || (selectedVehicle.pricing.day || 0) * 30;
        }

        return {
            endDate: endDateTime.toISOString(),
            totalPrice: price,
        };
    }, [startDate, startTime, rentalDuration, rentalDays, selectedVehicle]);
    
    const availableVehicles = useMemo(() => {
        if (!endDate) return [];
        const start = new Date(`${startDate}T${startTime}`).getTime();
        const end = new Date(endDate).getTime();
        
        return vehicles.filter(vehicle => {
            const isOverlapping = rentals.some(rental => {
                if (rental.vehicle_id !== vehicle.id) return false;
                const rentalStart = new Date(rental.start_date).getTime();
                const rentalEnd = new Date(rental.end_date).getTime();
                return (start < rentalEnd && end > rentalStart);
            });
            return !isOverlapping;
        });
    }, [startDate, startTime, endDate, vehicles, rentals]);

    const handleNextStep = () => {
        switch (currentStep) {
            case 'date': setCurrentStep('vehicle'); break;
            case 'vehicle': setCurrentStep('customer'); break;
            case 'customer': setCurrentStep('contract'); break;
            case 'contract': handleSubmit(); break;
        }
    };
    
    const handlePrevStep = () => {
         switch (currentStep) {
            case 'vehicle': setCurrentStep('date'); break;
            case 'customer': setSelectedVehicle(null); setCurrentStep('vehicle'); break;
            case 'contract': setCurrentStep('customer'); break;
        }
    }

    const handleSubmit = async () => {
        if (!selectedVehicle || !selectedCustomer || !endDate) {
            alert('Chybí potřebné údaje.');
            return;
        }
        
        setIsSubmitting(true);
        const newRentalData: Omit<Rental, 'id' | 'created_at'> = {
            vehicle_id: selectedVehicle.id,
            customer_id: selectedCustomer.id,
            start_date: new Date(`${startDate}T${startTime}`).toISOString(),
            end_date: endDate,
            total_price: totalPrice,
            status: 'pending',
            customer_signature: customerSignature,
            company_signature: companySignature,
            digital_consent_at: new Date().toISOString(),
        };

        const createdRental = await addRental(newRentalData);
        if(createdRental) {
            await sendContractByEmail(createdRental.id);
            setCreatedRentalId(createdRental.id);
            setCurrentStep('confirmation');
        } else {
            alert('Vytvoření zápůjčky selhalo.');
        }
        setIsSubmitting(false);
    };


    const steps = [
        { id: 'date', name: 'Termín' },
        { id: 'vehicle', name: 'Vozidlo' },
        { id: 'customer', name: 'Zákazník' },
        { id: 'contract', name: 'Smlouva' },
        { id: 'confirmation', name: 'Hotovo' },
    ];
    
    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Nová zápůjčka</h1>
            <Card className="mb-6">
                 <Stepper steps={steps} currentStepId={currentStep} />
            </Card>

            {currentStep === 'date' && (
                <DateStep 
                  startDate={startDate} setStartDate={setStartDate}
                  startTime={startTime} setStartTime={setStartTime}
                  rentalDuration={rentalDuration} setRentalDuration={setRentalDuration}
                  rentalDays={rentalDays} setRentalDays={setRentalDays}
                  onNext={handleNextStep}
                />
            )}
            
            {currentStep === 'vehicle' && (
                <VehicleStep
                  availableVehicles={availableVehicles}
                  allVehicles={vehicles}
                  selectedVehicle={selectedVehicle}
                  setSelectedVehicle={setSelectedVehicle}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                />
            )}
            
            {currentStep === 'customer' && (
                <CustomerStep
                  customers={customers}
                  addCustomer={addCustomer}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                  onNext={handleNextStep}
                  onBack={handlePrevStep}
                />
            )}

            {currentStep === 'contract' && selectedVehicle && selectedCustomer && endDate && (
                 <ContractStep
                    rental={{ 
                        id: 0, 
                        vehicle_id: selectedVehicle.id, 
                        customer_id: selectedCustomer.id, 
                        start_date: new Date(`${startDate}T${startTime}`).toISOString(), 
                        end_date: endDate, 
                        total_price: totalPrice, 
                        status: 'pending', 
                        created_at: '' 
                    }}
                    vehicle={selectedVehicle}
                    customer={selectedCustomer}
                    onCustomerSign={setCustomerSignature}
                    onCompanySign={setCompanySignature}
                    onNext={handleSubmit}
                    onBack={handlePrevStep}
                    isSubmitting={isSubmitting}
                />
            )}
            
            {currentStep === 'confirmation' && createdRentalId && (
                <ConfirmationStep rentalId={createdRentalId} />
            )}
        </div>
    );
};

// Sub-components for each step

const DateStep: React.FC<any> = ({ startDate, setStartDate, startTime, setStartTime, rentalDuration, setRentalDuration, rentalDays, setRentalDays, onNext }) => {
    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">1. Zvolte termín a délku pronájmu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="startDate">Datum začátku</Label>
                    <Input id="startDate" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="startTime">Čas začátku</Label>
                    <Input id="startTime" type="time" value={startTime} onChange={e => setStartTime(e.target.value)} required />
                </div>
                <div>
                    <Label htmlFor="rentalDuration">Délka pronájmu</Label>
                     <Select id="rentalDuration" value={rentalDuration} onChange={e => setRentalDuration(e.target.value)}>
                        <option value="4h">4 hodiny</option>
                        <option value="12h">12 hodin</option>
                        <option value="day">Celý den</option>
                        <option value="days">Na dny</option>
                        <option value="month">Měsíc (30 dní)</option>
                    </Select>
                </div>
                {rentalDuration === 'days' && (
                     <div>
                        <Label htmlFor="rentalDays">Počet dní</Label>
                        <Input id="rentalDays" type="number" min="1" max="29" value={rentalDays} onChange={e => setRentalDays(parseInt(e.target.value))} required />
                    </div>
                )}
            </div>
            <div className="flex justify-end mt-6">
                <Button onClick={onNext} disabled={!startDate}>Pokračovat na výběr vozidla</Button>
            </div>
        </Card>
    );
}

const VehicleStep: React.FC<any> = ({ availableVehicles, allVehicles, selectedVehicle, setSelectedVehicle, onNext, onBack }) => {
    
    const isAvailable = (vehicle: Vehicle) => availableVehicles.some(v => v.id === vehicle.id);

    return (
        <Card>
             <h2 className="text-xl font-bold mb-4">2. Vyberte dostupné vozidlo</h2>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allVehicles.map(vehicle => (
                    <Card 
                        key={vehicle.id}
                        onClick={() => isAvailable(vehicle) && setSelectedVehicle(vehicle)}
                        className={`cursor-pointer transition-all ${
                            selectedVehicle?.id === vehicle.id 
                                ? 'ring-2 ring-primary scale-105' 
                                : isAvailable(vehicle)
                                ? 'hover:shadow-md'
                                : 'opacity-40 cursor-not-allowed'
                        }`}
                    >
                       <h3 className="font-bold">{vehicle.brand}</h3>
                       <p className="text-sm text-text-secondary">{vehicle.license_plate}</p>
                       {!isAvailable(vehicle) && <p className="text-sm font-semibold text-red-500 mt-2">V tomto termínu obsazeno</p>}
                    </Card>
                ))}
             </div>
             <div className="flex justify-between mt-6">
                <SecondaryButton onClick={onBack}>Zpět</SecondaryButton>
                <Button onClick={onNext} disabled={!selectedVehicle}>Pokračovat na zákazníka</Button>
            </div>
        </Card>
    );
};

const CustomerStep: React.FC<any> = ({ customers, addCustomer, selectedCustomer, setSelectedCustomer, onNext, onBack }) => {
    const [activeTab, setActiveTab] = useState('existing');
    const [searchTerm, setSearchTerm] = useState('');
    const [newCustomer, setNewCustomer] = useState<Omit<Customer, 'id' | 'created_at'>>({
        first_name: '', last_name: '', email: '', phone: '', id_card_number: '', drivers_license_number: ''
    });

    const filteredCustomers = customers.filter(c => 
        `${c.first_name} ${c.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleNewCustomerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewCustomer(prev => ({ ...prev, [e.target.id]: e.target.value }));
    };

    const handleAddCustomer = async (e: React.FormEvent) => {
        e.preventDefault();
        const createdCustomer = await addCustomer(newCustomer);
        if(createdCustomer) {
            setSelectedCustomer(createdCustomer);
            alert('Nový zákazník byl úspěšně vytvořen.');
        }
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">3. Zákazník</h2>
            <Tabs
                tabs={[{ id: 'existing', label: 'Existující zákazník' }, { id: 'new', label: 'Nový zákazník' }]}
                activeTabId={activeTab}
                onTabClick={(id) => setActiveTab(id)}
            />
            <div className="mt-4">
                {activeTab === 'existing' && (
                    <div>
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
                        <div className="max-h-64 overflow-y-auto border rounded-md">
                            {filteredCustomers.map(customer => (
                                <div 
                                    key={customer.id} 
                                    className={`p-3 cursor-pointer hover:bg-background ${selectedCustomer?.id === customer.id ? 'bg-primary text-white' : ''}`}
                                    onClick={() => setSelectedCustomer(customer)}
                                >
                                    <p className="font-semibold">{customer.first_name} {customer.last_name}</p>
                                    <p className="text-sm">{customer.email}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                 {activeTab === 'new' && (
                    <form onSubmit={handleAddCustomer} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div><Label htmlFor="first_name">Jméno</Label><Input id="first_name" value={newCustomer.first_name} onChange={handleNewCustomerChange} required /></div>
                            <div><Label htmlFor="last_name">Příjmení</Label><Input id="last_name" value={newCustomer.last_name} onChange={handleNewCustomerChange} required /></div>
                        </div>
                        <div><Label htmlFor="email">Email</Label><Input id="email" type="email" value={newCustomer.email} onChange={handleNewCustomerChange} required /></div>
                        <div><Label htmlFor="phone">Telefon</Label><Input id="phone" type="tel" value={newCustomer.phone} onChange={handleNewCustomerChange} required /></div>
                        <div><Label htmlFor="id_card_number">Číslo OP</Label><Input id="id_card_number" value={newCustomer.id_card_number} onChange={handleNewCustomerChange} required /></div>
                        <div><Label htmlFor="drivers_license_number">Číslo ŘP</Label><Input id="drivers_license_number" value={newCustomer.drivers_license_number} onChange={handleNewCustomerChange} required /></div>
                        <div className="flex justify-end pt-2">
                           <Button type="submit">Vytvořit a vybrat zákazníka</Button>
                        </div>
                    </form>
                )}
            </div>
             <div className="flex justify-between mt-6">
                <SecondaryButton onClick={onBack}>Zpět</SecondaryButton>
                <Button onClick={onNext} disabled={!selectedCustomer}>Pokračovat na smlouvu</Button>
            </div>
        </Card>
    );
};

const ContractStep: React.FC<any> = ({ rental, vehicle, customer, onCustomerSign, onCompanySign, onNext, onBack, isSubmitting }) => {
    const [signingFor, setSigningFor] = useState<'customer' | 'company' | null>(null);

    const handleSaveSignature = (dataUrl: string) => {
        if (signingFor === 'customer') onCustomerSign(dataUrl);
        if (signingFor === 'company') onCompanySign(dataUrl);
        setSigningFor(null);
    };

    return (
        <Card>
            <h2 className="text-xl font-bold mb-4">4. Souhrn a podpis smlouvy</h2>
            <div className="max-h-[60vh] overflow-y-auto border rounded-md p-4">
                 <ContractView 
                    previewRental={rental}
                    vehicle={vehicle}
                    customer={customer}
                    onCustomerSignRequest={() => setSigningFor('customer')}
                    onCompanySignRequest={() => setSigningFor('company')}
                 />
            </div>
            
             {/* FIX: `Modal` component was used but not imported. */}
             {signingFor && (
                <Modal isOpen={true} onClose={() => setSigningFor(null)} title={`Digitální podpis (${signingFor === 'customer' ? 'Zákazník' : 'Pronajímatel'})`}>
                    <SignaturePad onSave={handleSaveSignature} onCancel={() => setSigningFor(null)} />
                </Modal>
            )}

            <div className="flex justify-between mt-6">
                <SecondaryButton onClick={onBack}>Zpět</SecondaryButton>
                <Button onClick={onNext} disabled={isSubmitting}>
                    {isSubmitting ? 'Vytváření...' : 'Vytvořit zápůjčku a odeslat smlouvu'}
                </Button>
            </div>
        </Card>
    );
};

const ConfirmationStep: React.FC<{ rentalId: number }> = ({ rentalId }) => {
    return (
        <Card className="text-center">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Hotovo!</h2>
            <p className="mb-6">Zápůjčka byla úspěšně vytvořena a smlouva odeslána na e-mail zákazníka.</p>
            {/* FIX: `Link` component was used but not imported. */}
            <Link to={`/rentals/contract/${rentalId}`}>
                <Button>Zobrazit vytvořenou smlouvu</Button>
            </Link>
        </Card>
    );
}


export default CreateRentalWizard;