import React from 'react';
import { useData } from '../context/DataContext';
import { Card } from './ui';
import RequestApprovalModal from './RequestApprovalModal';
import { RentalRequest } from '../types';

const Dashboard: React.FC = () => {
    const { rentals, vehicles, customers, rentalRequests } = useData();
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [selectedRequest, setSelectedRequest] = React.useState<RentalRequest | null>(null);


    const activeRentals = rentals.filter(r => r.status === 'active').length;
    const availableVehicles = vehicles.filter(v => v.available).length;
    const totalVehicles = vehicles.length;

    const handleOpenModal = (request: RentalRequest) => {
        setSelectedRequest(request);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setSelectedRequest(null);
        setIsModalOpen(false);
    };

    const handleApprove = (request: RentalRequest) => {
        console.log("Approving request:", request);
        // In a real app, you'd create a new customer and potentially a new rental.
        // For now, just log and close.
        handleCloseModal();
    };

    const handleReject = (request: RentalRequest) => {
        console.log("Rejecting request:", request);
        // In a real app, you'd update the request status.
        handleCloseModal();
    };

    return (
        <div>
            <h1 className="text-3xl font-bold mb-6">Přehled</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card>
                    <h2 className="text-xl font-bold">Aktivní půjčky</h2>
                    <p className="text-4xl font-bold text-primary">{activeRentals}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold">Dostupná vozidla</h2>
                    <p className="text-4xl font-bold text-primary">{availableVehicles} / {totalVehicles}</p>
                </Card>
                <Card>
                    <h2 className="text-xl font-bold">Zákazníci</h2>
                    <p className="text-4xl font-bold text-primary">{customers.length}</p>
                </Card>
            </div>

            <Card>
                <h2 className="text-xl font-bold mb-4">Nové žádosti o půjčku</h2>
                 {rentalRequests.filter(r => r.status === 'pending').length > 0 ? (
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="p-2">Jméno</th>
                                <th className="p-2">Email</th>
                                <th className="p-2">Datum žádosti</th>
                                <th className="p-2">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {rentalRequests.filter(r => r.status === 'pending').map(req => (
                                <tr key={req.id} className="border-b hover:bg-background">
                                    <td className="p-2">{req.customer_details.first_name} {req.customer_details.last_name}</td>
                                    <td className="p-2">{req.customer_details.email}</td>
                                    <td className="p-2">{new Date(req.created_at).toLocaleDateString()}</td>
                                    <td className="p-2">
                                        <button onClick={() => handleOpenModal(req)} className="text-primary hover:underline">Zobrazit</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                 ) : (
                    <p>Žádné nové žádosti.</p>
                 )}
            </Card>

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
