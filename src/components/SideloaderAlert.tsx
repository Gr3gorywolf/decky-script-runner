import { DialogButton, PanelSectionRow, showModal } from "@decky/ui";
import { FC } from "react";
import { MdInfo, MdQrCode } from "react-icons/md";
import { QrCodeModal } from "./QrCodeModal";

interface props {
    sideloadingUrl: string;
    deckIp: string;
}

export const SideloaderAlert: FC<props> = ({ sideloadingUrl, deckIp }) => {

    const buttonStyle = {
        minWidth: '0px',
        fontSize: '9px',
        padding: '0px',
        width: '16px',
        height: '16px',
        paddingTop: '0px',
        marginLeft: '4px'
      };



    const titleStyle = {
        margin: '0px',
        fontWeight: 'normal',
        display: 'flex',
        fontSize: '9px',
        gap: '1px',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
      } as React.CSSProperties;

    const handleOpenUrl = () => {
        window.open(`steam://openurl/http://${deckIp}:9696`, "_blank");
    };

    const handleOpenQrDialog = () => {
        showModal(<QrCodeModal title="Sideloader URL" qrCode={`http://${sideloadingUrl}`}/>)
    };


    return (
        <PanelSectionRow>
            <div
                style={{
                    backgroundColor: "#262D35",
                    color: "#E0E0E0",
                    padding: "6px 7px",
                    borderRadius: "4px",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                    display: "flex",
                    alignItems: "center",
                    fontSize: "14px",
                    marginBottom: "8px",
                }}
            >
                <MdInfo
                    style={{
                        fontSize: "13px",
                        marginRight: "4px",
                    }}
                />
                <h5 style={titleStyle}>
                    Sideloader running at:{" "}
                    <a
                        onClick={handleOpenUrl}
                        href="#"
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            color: "#90CAF9",
                            textDecoration: "none",
                            fontWeight: "bold",
                            borderBottom: "1px solid #90CAF9",
                            height: "fit-content"
                        }}
                    >
                        {sideloadingUrl}
                    </a>
                    <DialogButton focusable style={buttonStyle} onClick={handleOpenQrDialog}>
                        {<MdQrCode style={{
                            marginLeft: '-1px'
                        }}/>}
                    </DialogButton>
                </h5>
            </div>
        </PanelSectionRow>
    );
};
