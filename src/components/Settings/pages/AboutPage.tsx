import { Button, DialogBody, DialogControlsSection, DialogControlsSectionHeader, Field, Focusable } from "@decky/ui";
import { MdPeople, MdStar } from "react-icons/md";

export const AboutPage = () => {
    return (
        <Focusable>
                <DialogControlsSectionHeader>About Decky Script Runner</DialogControlsSectionHeader>
                <p
                    style={{
                        fontSize: "16px",
                        lineHeight: "1.5",
                        textAlign: "left",
                    }}
                >
                    Created by Gregory Alexander Cabral (Gr3gorywolf), the Script Launcher plugin was born out of a
                    practical need. Initially developed to automatically delete the <i>userprefs</i> file for the game
                    "God of War: Ragnarok," this plugin solves a persistent problem: the game would freeze on startup if
                    this file was not removed each time. Instead of navigating to Desktop Mode or retyping the command
                    manually, the Script Launcher provides a convenient solution right from Game Mode. Now, with a
                    simple click, I can execute a script that deletes the userprefs :v.
                </p>
                <Field label="Star the repo" icon={<MdStar/>} description="Support this project">
                    <Button
                        onClick={() => {}}
                    >
                        Go to the repo
                    </Button>
                </Field>
                <Field label="Publish your script" icon={<MdPeople/>} description="Contribute to our script repository and get public">
                    <Button
                        onClick={() => {}}
                    >
                        Go to the repo
                    </Button>
                </Field>
        </Focusable>
    );
};
