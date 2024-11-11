import { Focusable, DialogButton, showModal } from "@decky/ui";
import { MdTerminal, MdPlayArrow, MdStop, MdDelete } from "react-icons/md";
import { ScriptData } from "../types/script-data";
import { FC } from "react";
import { humanizeFileName } from "../utils/helpers";
import { call } from "@decky/api";
import { ScriptConsoleModal } from "./ScriptConsoleModal";

interface props {
  script: ScriptData;
  isRunning: boolean;
}

export const ScriptCard: FC<props> = ({ isRunning, script }) => {
  const containerStyle = {
    display: "flex",
    flexDirection: "row",
    padding: "5px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    maxWidth: "320px",
    margin: "4px auto",
    fontSize: "6px",
  } as React.CSSProperties;

  const containerInfoStyle = {
    display: "flex",
    flexDirection: "row",
  } as React.CSSProperties;

  const imageStyle = {
    width: "40px",
    height: "40px",
    marginRight: "8px",
  };

  const contentStyle = {
    flex: 1,
  };

  const nameStyle = {
    fontSize: "12px",
    fontWeight: "bold",
    margin: "0 0 1px 0",
  };

  const authorStyle = {
    fontSize: "8px",
    color: "#666",
    margin: "0 0 2px 0",
  };

  const descriptionStyle = {
    fontSize: "6px",
    lineHeight: "1.2",
    margin: "0",
  };

  const buttonContainerStyle = {
    display: "flex",
    flexDirection: "row" as const,
    margin: "5px",
    marginLeft: "auto",
    gap: "4px",
  };

  const buttonStyle = {
    minWidth: 0,
    padding: "6px",
    width: "28px",
    height: "28px",
    maxWidth: "23px !important",
  };

  const getImageByLanguage = () => {
    const languageImages = {
      py: "https://github.com/devicons/devicon/raw/refs/heads/master/icons/python/python-original.svg",
      sh: "https://github.com/devicons/devicon/raw/refs/heads/master/icons/bash/bash-original.svg",
      js: "https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/nodejs/nodejs-original.svg",
      lua:"https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/lua/lua-original.svg",
      perl:"https://raw.githubusercontent.com/devicons/devicon/refs/heads/master/icons/perl/perl-original.svg",
      unknown: "https://raw.githubusercontent.com/FortAwesome/Font-Awesome/refs/heads/6.x/svgs/solid/code.svg",
    };
    //@ts-ignore
    const foundImage = languageImages[script.language] ?? languageImages.unknown;
    return foundImage;
  };

  const handleToggleRunningScript = async () => {
    await call<[string], void>("toggle_script_running", script.name);
  };

  const showDetailsModal = () => {
    showModal(<ScriptConsoleModal script={script} />);
  };

  return (
    <div style={containerStyle}>
      <div style={containerInfoStyle}>
        <img src={getImageByLanguage()} alt="Author" style={imageStyle} />
        <div style={contentStyle}>
          <h2 style={nameStyle}>{humanizeFileName(script.name)}</h2>
          {script.author && <p style={authorStyle}>{script.author}</p>}
          {script.description && <p style={descriptionStyle}>{script.description}</p>}
        </div>
      </div>

      <Focusable flow-children="horizontal" style={buttonContainerStyle}>
        <DialogButton focusable style={buttonStyle} onClick={handleToggleRunningScript}>
          {isRunning ? <MdStop /> : <MdPlayArrow />}
        </DialogButton>

        {isRunning && (
          <DialogButton style={buttonStyle} onClick={showDetailsModal}>
            <MdTerminal />
          </DialogButton>
        )}
        <DialogButton style={buttonStyle} onClick={() => {}}>
          <MdDelete />
        </DialogButton>
      </Focusable>
    </div>
  );
};
