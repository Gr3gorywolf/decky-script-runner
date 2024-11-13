import { PanelSection, PanelSectionRow, staticClasses, DialogButton, Focusable } from "@decky/ui";
import {
  addEventListener,
  removeEventListener,
  definePlugin,
  toaster,
  call,
  // routerHook
} from "@decky/api";
import { useEffect, useState } from "react";
import { MdCode, MdSettingsInputAntenna, MdSettings } from "react-icons/md";
import { ScriptData } from "./types/script-data";
import { ScriptCard } from "./components/ScriptCard";
import { SideloaderAlert } from "./components/SideloaderAlert";

function Content() {
  const [serverRunning, setServerRunning] = useState<boolean>(false);
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [runningScripts, setRunningScripts] = useState<string[]>([]);
  const [deckIp, setDeckIp] = useState("");
  const fetchData = async () => {
    let isRunning = await call<[], boolean>("is_server_running");
    let scriptsData = await call<[], string>("get_scripts_data");
    let runningScripts = await call<[], string[]>("get_running_scripts");
    let deckIp = await call<[], string>("get_device_ip");
    setScripts(JSON.parse(scriptsData));
    setServerRunning(isRunning);
    setRunningScripts(runningScripts);
    setDeckIp(deckIp);
  };
  useEffect(() => {
    fetchData();
    const serverStatusListener = addEventListener("server_status_change", (status: boolean) => {
      if (status) {
        toaster.toast({ title: "Sideloading server Started", body: "Available on port 9696" });
      } else {
        toaster.toast({ title: "Sideloading server stopped", body: "Sideloading server has been stopped" });
      }
    });
    const interval = setInterval(fetchData, 1000);
    return () => {
      clearInterval(interval);
      removeEventListener("server_status_change", serverStatusListener);
    };
  }, []);

  const toggleServer = async () => {
    await call<[], void>("toggle_server");
  };
  const sideloadingUrl = `${deckIp}:9696`;
  return (
    <>
      <PanelSection>
        <div style={{ marginBottom: "-16px" }}>
          {serverRunning && <SideloaderAlert deckIp={deckIp} sideloadingUrl={sideloadingUrl} />}
          <PanelSectionRow>
            <Focusable flow-children="horizontal" style={{ display: "flex", padding: 0, gap: "8px" }}>
              <DialogButton style={{ minWidth: 0, width: "15%", height: "28px", backgroundColor: serverRunning ? "#1b5e20" : undefined, padding: "6px" }} onClick={toggleServer}>
                <MdSettingsInputAntenna />
              </DialogButton>
              <DialogButton style={{ minWidth: 0, width: "15%", height: "28px", padding: "6px" }} onClick={() => {}}>
                <MdSettings />
              </DialogButton>
            </Focusable>
          </PanelSectionRow>
        </div>
      </PanelSection>

      <PanelSection title="Scripts">
        {scripts.map((script) => (
          <PanelSectionRow>
            <ScriptCard isRunning={runningScripts.includes(script.name)} script={script} />
          </PanelSectionRow>
        ))}
      </PanelSection>
    </>
  );
}

export default definePlugin(() => {
  console.log("Template plugin initializing, this is called once on frontend startup");

  // serverApi.routerHook.addRoute("/decky-plugin-test", DeckyPluginRouterTest, {
  //   exact: true,
  // });

  // Add an event listener to the "timer_event" event from the backend
  const listener = addEventListener<[test1: string, test2: boolean, test3: number]>("timer_event", (test1, test2, test3) => {
    console.log("Template got timer_event with:", test1, test2, test3);
    toaster.toast({
      title: "template got timer_event",
      body: `${test1}, ${test2}, ${test3}`,
    });
  });

  return {
    // The name shown in various decky menus
    name: "Script Loader",
    // The element displayed at the top of your plugin's menu
    titleView: <div className={staticClasses.Title}>Script Loader</div>,
    // The content of your plugin's menu
    content: <Content />,
    // The icon displayed in the plugin list
    icon: <MdCode />,
    // The function triggered when your plugin unloads
    onDismount() {
      console.log("Unloading");
      removeEventListener("timer_event", listener);
      // serverApi.routerHook.removeRoute("/decky-plugin-test");
    },
  };
});
