import { Focusable, DialogButton, showModal } from "@decky/ui";
import { MdOpenInBrowser, MdQrCode, MdWarning } from "react-icons/md";
import { QrCodeModal } from "../../QrCodeModal";

export const CommunityScriptsInfo = () => {
    const steamDeckStyle = {
        color: "#e2e8f0",
        fontFamily: '"Motiva Sans", sans-serif',
        padding: "16px",
        minHeight: "100vh",
        maxWidth: "800px", // Approximate width of Steam Deck screen
        margin: "0 auto",
        fontSize: "14px",
        marginBottom: "65px",
    };

    const alertStyle = {
        backgroundColor: "#fef08a", // Light yellow background
        border: "1px solid #facc15", // Darker yellow border
        borderRadius: "4px",
        padding: "12px",
        marginBottom: "16px",
        color: "#854d0e", // Dark yellow text for contrast
    };

    const alertHeaderStyle = {
        display: "flex",
        alignItems: "center",
        fontSize: "16px",
        marginBottom: "8px",
        fontWeight: "bold",
    };

    const listStyle = {
        paddingLeft: "20px",
        marginBottom: "2px",
    };

    const listItemStyle = {
        marginBottom: "2px",
    };

    const bulletPointStyle = {
        position: "absolute",
        left: "0px",
        top: "0px",
    } as React.CSSProperties;

    const paragraphStyle = {
        lineHeight: "1",
        marginBottom: "8px",
    };

    const buttonStyle = {
        minWidth: 0,
        padding: "10px",
        width: "77px",
        height: "77px",
        maxWidth: "77px !important",
    };
    const url = "https://github.com/Gr3gorywolf/decky-script-runner-scripts";

    const handleOpenQRCode = () => {
        showModal(<QrCodeModal title="Community scripts" qrCode={url} />);
    };

    return (
        <div style={steamDeckStyle}>
            <div style={alertStyle}>
                <div style={alertHeaderStyle}>
                    <MdWarning size={24} style={{ marginRight: "8px" }} />
                    <span>Warning</span>
                </div>
                <ol style={listStyle}>
                    <li style={listItemStyle}>
                        <span style={bulletPointStyle}>•</span>
                        Some scripts require root and unlock the Steam Deck filesystem. In those cases, we are not
                        responsible for Steam Deck damages. (Verify the code before running them)
                    </li>
                    <li style={listItemStyle}>
                        <span style={bulletPointStyle}>•</span>
                        Neither the Plugin or Developer are responsible for anything done by the script runner since the plugin was made just
                        for running scripts. Any script that you run will be at your own risk.
                    </li>
                </ol>
            </div>
            <Focusable flow-children="horizontal" style={{ display: "flex", justifyContent:"center" , flexDirection: "row", gap: "16px" }}>
                <DialogButton focusable style={buttonStyle} onClick={handleOpenQRCode}>
                    <MdQrCode size={44} />
                </DialogButton>
                <DialogButton
                    style={buttonStyle}
                    onClick={() => {
                        window.open(`steam://openurl/${url}`, "_blank");
                    }}
                >
                    <MdOpenInBrowser size={44} />
                </DialogButton>
            </Focusable>
            <p style={paragraphStyle}>
                The community scripts are scripts made by the community to facilitate certain automatizations. These
                scripts can be downloaded from the GitHub repo and installed by the sideloader.
            </p>

            <p style={paragraphStyle}>
                These scripts provide various functionalities and enhancements for your Steam Deck, allowing you to
                customize and optimize your gaming experience. However, it's crucial to exercise caution and understand
                the implications of running third-party scripts on your device.
            </p>

            <p style={paragraphStyle}>Before running any community script, make sure to:</p>

            <ul style={listStyle}>
                <li style={listItemStyle}>
                    <span style={bulletPointStyle}>•</span>
                    Review the script's source code if possible
                </li>
                <li style={listItemStyle}>
                    <span style={bulletPointStyle}>•</span>
                    Understand what the script does and its potential impact on your system
                </li>
            </ul>

            <p style={paragraphStyle}>
                Remember, while community scripts can be powerful tools, they should be used responsibly and with a full
                understanding of their effects on your Steam Deck.
            </p>
        </div>
    );
};
