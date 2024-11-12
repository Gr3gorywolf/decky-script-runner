import { PanelSectionRow } from "@decky/ui";
import { FC } from "react";
import { MdInfo } from "react-icons/md";

interface props{
    sideloadingUrl: string;
    deckIp: string;
}

export const SideloaderAlert:FC<props> = ({sideloadingUrl, deckIp}) =>{
    return (
        <PanelSectionRow >
        <div
          style={{
            backgroundColor: "#262D35",
            color: "#E0E0E0",
            padding: "12px 16px",
            borderRadius: "4px",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            fontSize: "14px",
            marginTop: '10px'
          }}
        >
          <MdInfo
            style={{
              fontSize: "24px",
              marginRight: "12px",
            }}
          />
          <h5 style={{ margin: 0, fontWeight: "normal" }}>
            Sideloading server is running at:{" "}
            <a
              onClick={() => {
                window.open(`steam://openurl/https://gr3gorywolf.github.io/decky-script-runner-sideloader?deckIp=${deckIp}`, "_blank");
              }}
              href="#"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#90CAF9",
                textDecoration: "none",
                fontWeight: "bold",
                borderBottom: "1px solid #90CAF9",
              }}
            >
              {sideloadingUrl}
            </a>
          </h5>
        </div>
      </PanelSectionRow>
    )
}