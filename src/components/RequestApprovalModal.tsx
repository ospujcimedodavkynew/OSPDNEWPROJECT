import React from 'react';
import { RentalRequest } from '../types';
import { Modal, Button } from './ui';

interface RequestApprovalModalProps {
    isOpen: boolean;
    onClose: () => void;
    request: RentalRequest | null;
    onApprove: (request: RentalRequest) => void;
    onReject: (request: RentalRequest) => void;
}

const RequestApprovalModal: React.FC<RequestApprovalModalProps> = ({
    isOpen,
    onClose,
    request,
    onApprove,
    onReject,
}) => {
    if (!request) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Schválení žádosti o půjčku">
            <div>
                <h3 className="font-bold text-lg">{request.customer_details.first_name} {request.customer_details.last_name}</h3>
                <p>Email: {request.customer_details.email}</p>
                <p>Telefon: {request.customer_details.phone}</p>
                <p>Číslo OP: {request.customer_details.id_card_number}</p>
                <p>Číslo ŘP: {request.customer_details.drivers_license_number}</p>

                {request.drivers_license_image_base64 && (
                    <div className="mt-4">
                        <h4 className="font-semibold">Snímek řidičského průkazu</h4>
                        <img 
                            src={`data:image/jpeg;base64,${request.drivers_license_image_base64}`} 
                            alt="Řidičský průkaz" 
                            className="max-w-full h-auto border rounded mt-2"
                        />
                    </div>
                )}
                
                <div className="flex justify-end space-x-2 pt-6">
                    <Button variant="secondary" className="bg-red-500 hover:bg-red-600 text-white" onClick={() => onReject(request)}>
                        Zamítnout
                    </Button>
                    <Button onClick={() => onApprove(request)}>
                        Schválit a vytvořit zákazníka
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RequestApprovalModal;
