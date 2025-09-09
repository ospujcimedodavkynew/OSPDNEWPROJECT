import React from 'react';
import { RentalRequest } from '../types';
import { Modal, Button, SecondaryButton } from './ui';

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
        <Modal isOpen={isOpen} onClose={onClose} title="Schválení žádosti o zápůjčku">
            <div>
                <h3 className="font-bold text-lg">{request.first_name} {request.last_name}</h3>
                <p>Email: {request.email}</p>
                <p>Telefon: {request.phone}</p>
                <p>Číslo OP: {request.id_card_number}</p>
                <p>Číslo ŘP: {request.drivers_license_number}</p>
                <p className="text-sm text-text-secondary mt-2">Žádost vytvořena: {new Date(request.created_at).toLocaleString()}</p>
                
                <div className="flex justify-end space-x-2 pt-6">
                    <SecondaryButton onClick={() => onReject(request)}>
                        Zamítnout
                    </SecondaryButton>
                    <Button onClick={() => onApprove(request)}>
                        Schválit
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default RequestApprovalModal;
