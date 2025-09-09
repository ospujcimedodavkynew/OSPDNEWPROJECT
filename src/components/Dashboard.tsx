import React, { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
// FIX: Import `SecondaryButton` to use it for the public form link.
import { Card, Button, SecondaryButton } from './ui';
import RequestApprovalModal from './RequestApprovalModal';
import { RentalRequest } from '../types';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { rentals, vehicles, customers, rentalRequests, updateRentalRequestStatus } = useData();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState<RentalRequest | null>(null);


    const activeRentalsCount = rentals.filter(r => r.status === 'active').length;
    const pendingRequestsCount = rentalRequests.filter(r => r.status === 'pending').length;

    const upcomingReturns = useMemo(() => {
        const now = new Date();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);

        return rentals
            .filter(r => {
                const endDate = new Date(r.end_date);
                return r.status === 'active' && endDate >= now && endDate <= nextWeek;
            })
            .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime());
    }, [rentals]);


    const handleOpenModal = (request: RentalRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const handleApprove = (request: RentalRequest) => {
        updateRentalRequestStatus(request.id, 'approved');
        handleCloseModal();
    };

    const handleReject = (request: RentalRequest) => {
        updateRentalRequestStatus(request.id, 'rejected');
        handleCloseModal();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Přehled</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h2 className="text-xl font-bold">Aktivní zápůjčky</h2>
                    <p className="text-4xl font-bold text-primary">{activeRentalsCount}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold">Celkem vozidel</h2>
                    <p className="text-4xl font-bold text-primary">{vehicles.length}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold">Zákazníci</h2>
                    <p className="text-4xl font-bold text-primary">{customers.length}</p>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                    <h2 className="text-xl font-bold mb-4">Vozidla k vrácení brzy</h2>
                    {upcomingReturns.length > 0 ? (
                        <div className="space-y-2">
                           {upcomingReturns.map(r => {
                               const vehicle = vehicles.find(v => v.id === r.vehicle_id);
                               const customer = customers.find(c => c.id === r.customer_id);
                               return (
                                   <div key={r.id} className="p-2 bg-background rounded-md">
                                      <p className="font-semibold">{vehicle?.brand} ({vehicle?.license_plate})</p>
                                      <p className="text-sm">Vrací: {customer?.first_name} {customer?.last_name} - {new Date(r.end_date).toLocaleDateString()}</p>
                                   </div>
                               )
                           })}
                        </div>
                    ) : (
                        <p className="text-text-secondary">Žádná vozidla k vrácení v následujících 7 dnech.</p>
                    )}
                </Card>
                 <Card>
                    <h2 className="text-xl font-bold mb-4">Čekající žádosti ({pendingRequestsCount})</h2>
                     {pendingRequestsCount > 0 ? (
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="p-2">Jméno</th>
                                    <th className="p-2">Datum</th>
                                    <th className="p-2">Akce</th>
                                </tr>
                            </thead>
                            <tbody>
                                {rentalRequests.filter(r => r.status === 'pending').map(req => (
                                    <tr key={req.id} className="border-b hover:bg-background">
                                        <td className="p-2">{req.first_name} {req.last_name}</td>
                                        <td className="p-2">{new Date(req.created_at).toLocaleDateString()}</td>
                                        <td className="p-2">
                                            <button onClick={() => handleOpenModal(req)} className="text-primary hover:underline">Zobrazit</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                     ) : (
                        <p className="text-text-secondary">Žádné nové žádosti.</p>
                     )}
                     <div className="mt-4">
                        <Link to="/public/request" target="_blank">
                            {/* FIX: The `Button` component does not have a `variant` prop. Use `SecondaryButton` instead. */}
                            <SecondaryButton>Otevřít veřejný formulář</SecondaryButton>
                        </Link>
                    </div>
                </Card>
            </div>

            <RequestApprovalModal 
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                request={selectedRequest}
                onApprove={handleApprove}
                onReject={handleReject}
            />
        </div>
    );
};

export default Dashboard;