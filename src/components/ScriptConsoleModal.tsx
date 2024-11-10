import { FC, useEffect, useState } from "react";
import { ScriptData } from "../types/script-data";
import { humanizeFileName } from "../utils/helpers";
import { ConfirmModal } from "@decky/ui";
import { call } from "@decky/api";

interface props {
  script: ScriptData;
  closeModal?: () => void;
}

export const ScriptConsoleModal: FC<props> = ({ closeModal, script }) => {
  const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

  const fetchConsoleOutput = async () => {
    let scriptLogs = await call<[string], string>("get_script_logs", script.name);
    setConsoleOutput(scriptLogs.split("\n"));
  }

  useEffect(() => {
    const interval = setInterval(fetchConsoleOutput, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const consoleStyle = {
    color: "#ffffff",
    fontFamily: "monospace",
    padding: "5px",
    borderRadius: "5px",
    maxWidth: "600px",
    width: "100%",
    overflow: "auto",
    minHeight: "240px",
    maxHeight: "240px",
  };

  const lineStyle = {
    margin: "0",
    padding: "2px 0",
    display: "flex",
  };

  const promptStyle = {
    color: "#00ff00",
    marginRight: "8px",
  };

  const infoStyle = {
    color: '#00ffff',
  };

  return (
    <ConfirmModal closeModal={closeModal} bAlertDialog={true}  strTitle={<>Running: {humanizeFileName(script.name)}</>}>
      <div style={consoleStyle}>
        {consoleOutput.map((line, index) => (
          <div key={index} style={lineStyle}>
            <span style={promptStyle}>{`${script.name.slice(0, 15)} >`}</span>
            <span style={infoStyle}>{line}</span>
          </div>
        ))}
      </div>
    </ConfirmModal>
  );
};
