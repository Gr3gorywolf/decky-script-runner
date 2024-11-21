import { FC, useState } from "react";
import { ScriptData } from "../../../types/script-data";
import { getFullLanguageName } from "../../../utils/helpers";
import { ImageByLanguage } from "../../ImageByLanguage";
import { MdDelete, MdDownload, MdUpgrade } from "react-icons/md";
import { Focusable, DialogButton } from "@decky/ui";

interface props {
    script: ScriptData;
    foundScript?: ScriptData;
    onDownload: () => Promise<void>;
    onDelete: () => void;
}

export const StoreScriptCard: FC<props> = ({ script, onDelete, onDownload, foundScript }) => {
    const [isDownloading,setIsDownloading] = useState(false);
    const handleDownload = async() =>{
        setIsDownloading(true);
        await onDownload()
        setIsDownloading(false);
    }
    const canUpdate = foundScript && parseFloat(script.version) > parseFloat(foundScript.version);
    const buttonStyle = {
        minWidth: 0,
        padding: "6px",
        width: "28px",
        height: "28px",
        maxWidth: "23px !important",
    };
    return (
        <div
            style={{
                backgroundColor: "#1a1a1a",
                borderRadius: "8px",
                padding: "16px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
            }}
        >
            <div style={{ marginRight: "16px" }}>
                {script.image ? (
                    <div style={{ textAlign: "center" }}>
                        <img
                            src={script.image}
                            alt={script.title}
                            style={{ width: "48px", height: "48px", borderRadius: "8px" }}
                        />
                        <div style={{ color: "#a0a0a0", fontSize: "0.7rem", marginTop: "4px" }}>
                            {getFullLanguageName(script.language)}
                        </div>
                    </div>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <ImageByLanguage size={48} script={script} />
                        <div style={{ color: "#a0a0a0", fontSize: "0.7rem", marginTop: "4px" }}>
                            {getFullLanguageName(script.language)}
                        </div>
                    </div>
                )}
            </div>
            <div style={{ flex: 1, marginRight: "10px", display: "flex", flexDirection: "column", gap: "2px" }}>
                <h3 style={{ color: "#ffffff", fontSize: "1rem", margin: 0 }}>{script.title}</h3>
                <p style={{ color: "#a0a0a0", fontSize: "0.8rem", margin: 0 }}>
                    {script.description || "No description available"}
                </p>
                <p style={{ color: "#a0a0a0", fontSize: "0.7rem" }}>
                  {script.root && <span style={{color:"#b71c1c"}}>[ROOT]</span>}  Author: {script.author} | Version: {script.version}
                </p>
            </div>
            <Focusable flow-children="horizontal" style={{ display: "flex", flexDirection: "row", gap: "8px" }}>
                {foundScript && (
                    <DialogButton focusable style={buttonStyle} onClick={onDelete}>
                        <MdDelete />
                    </DialogButton>
                )}
                {(canUpdate || !foundScript) && (
                    <DialogButton disabled={isDownloading} style={buttonStyle} onClick={handleDownload}>
                        {canUpdate ? <MdUpgrade /> : <MdDownload />}
                    </DialogButton>
                )}
            </Focusable>
        </div>
    );
};
