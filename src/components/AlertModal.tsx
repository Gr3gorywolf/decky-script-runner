import { ConfirmModal } from "@decky/ui";
import React, { FC } from "react";

interface props {
    title: React.ReactNode;
    okayText: string;
    content?: React.ReactNode;
    onOk?: () => void;
    closeModal?(): void;
}

export const AlertModal: FC<props> = ({ onOk, closeModal, title, content, okayText }) => {
    return (
        <ConfirmModal
            closeModal={closeModal}
            onOK={onOk}
            strTitle={
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                    {title}
                </div>
            }
            strOKButtonText={okayText}
        >
            {content && content}
        </ConfirmModal>
    );
};
