import { DialogButton, Field, Focusable, showModal } from "@decky/ui";
import { MdOpenInBrowser, MdPeople, MdQrCode, MdQuestionMark, MdStar } from "react-icons/md";
import { QrCodeModal } from "../../QrCodeModal";

export const AboutPage = () => {
    const styles = {
        container: {
            minHeight: "100vh",
            color: "white",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1rem",
            fontFamily: "Arial, sans-serif",
        },
        content: {
            maxWidth: "48rem",
            width: "100%",
        },
        header: {
            marginBottom: "1rem",
            textAlign: "center" as const,
        },
        title: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "1rem",
            background: "linear-gradient(to right, #3B82F6, #8B5CF6)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
        },
        underline: {
            height: "0.25rem",
            width: "6rem",
            backgroundColor: "#3B82F6",
            margin: "0 auto",
            borderRadius: "0.25rem",
        },
        section: {
            backgroundColor: "#1F2937",
            borderRadius: "0.5rem",
            padding: "2rem",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        },
        paragraph: {
            fontSize: "0.85rem",
            marginBottom: "0.5rem",
        },
        footer: {
            marginTop: "2rem",
            textAlign: "center" as const,
            color: "#9CA3AF",
        },
        buttonsContainer: {
            display: "flex",
            flexDirection: "row" as const,
            alignItems: "center",
            margin: "5px",
            marginLeft: "auto",
            gap: "4px",
        },
        buttonStyle: {
            minWidth: 0,
            padding: "6px",
            width: "28px",
            height: "28px",
            maxWidth: "23px !important",
        },
    };

    const helpLinks = [
        {
            title: "Need help?",
            description: "Read the official guide",
            icon: <MdQuestionMark />,
            url: "https://github.com/Gr3gorywolf/decky-script-runner/wiki/Guide",
        },
        {
            title: "Star the repo",
            description: "Support this project",
            icon: <MdStar />,
            url: "https://github.com/Gr3gorywolf/decky-script-runner",
        },
        {
            title: "Want Publish your script?",
            description: "Contribute to our script repository and get it public",
            icon: <MdPeople />,
            url: "https://github.com/Gr3gorywolf/decky-script-runner-scripts",
        },
    ];

    const handleOpenQRCode = (url: string) => {
        showModal(<QrCodeModal title="Url QR code" qrCode={url} />);
    };

    return (
        <Focusable>
            <div style={styles.container}>
                <div style={styles.content}>
                    <header style={styles.header}>
                        <h1 style={styles.title}>About Decky script runner</h1>
                        <div style={styles.underline} />
                    </header>

                    <section style={styles.section}>
                        <p style={styles.paragraph}>
                            Created by Gregory Alexander Cabral (Gr3gorywolf), the Script Launcher plugin was born out
                            of a practical need. Initially developed to automatically delete the <i>userprefs</i> file
                            for the game "God of War: Ragnarok," this plugin solved a persistent problem: the game would
                            freeze on startup if this file was not removed each time.
                        </p>
                        <p style={styles.paragraph}>
                            Instead of navigating to Desktop Mode or retyping the command manually, the Script Launcher
                            provides a convenient solution right from Game Mode. Now, with a simple click, I can execute
                            a script that deletes the userprefs.
                        </p>

                        {helpLinks.map((helpLink) => (
                            <Field
                                label={helpLink.title}
                                key={helpLink.title}
                                icon={helpLink.icon}
                                description={helpLink.description}
                            >
                                <Focusable flow-children="horizontal" style={styles.buttonsContainer}>
                                    <DialogButton
                                        focusable
                                        style={styles.buttonStyle}
                                        onClick={() => {
                                            handleOpenQRCode(helpLink.url);

                                        }}
                                    >
                                        <MdQrCode />
                                    </DialogButton>
                                    <DialogButton
                                        focusable
                                        style={styles.buttonStyle}
                                        onClick={() => {
                                            window.open(`steam://openurl/${helpLink.url}`, "_blank");
                                        }}
                                    >
                                        <MdOpenInBrowser />
                                    </DialogButton>
                                </Focusable>
                            </Field>
                        ))}
                    </section>

                    <footer style={styles.footer}>&copy; {new Date().getFullYear()} Gr3gorywolf.</footer>
                </div>
            </div>
        </Focusable>
    );
};
