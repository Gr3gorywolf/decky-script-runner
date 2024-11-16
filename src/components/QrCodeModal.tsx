import QRCode from "react-qr-code";
import { AlertModal } from "./AlertModal";
import { FC } from "react";

interface props {
    title: string;
    qrCode: string;
    closeModal?: () => void;
}

export const QrCodeModal: FC<props> = ({ title, qrCode, closeModal }) => {
    return (
        <AlertModal
            title={title}
            content={
                <div style={{ textAlign: "center" }}>
                    <QRCode value={qrCode} />
                </div>
            }
            closeModal={closeModal}
        />
    );
};
