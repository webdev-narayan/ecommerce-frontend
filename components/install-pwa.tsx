"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { X } from "lucide-react";
import Cookies from "js-cookie";

export default function InstallPwaPrompt() {
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showPrompt, setShowPrompt] = useState(Cookies.get("pwa_prompt") === "true" ? true : false);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowPrompt(true);
        };

        const handleAppInstalled = () => {
            setShowPrompt(false);
        };

        window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
        window.addEventListener("appinstalled", handleAppInstalled);

        return () => {
            window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
            window.removeEventListener("appinstalled", handleAppInstalled);
        };
    }, []);

    const handleInstallClick = () => {
        if (deferredPrompt) {
            (deferredPrompt as any).prompt();

            (deferredPrompt as any).userChoice.then((choiceResult: any) => {
                if (choiceResult.outcome === "accepted") {
                    console.log("User accepted the install prompt");
                } else {
                    console.log("User dismissed the install prompt");
                }
                setDeferredPrompt(null);
                setShowPrompt(false);
            });
        }
    };

    if (!showPrompt) return null;

    const handleClose = () => {
        Cookies.set("pwa_prompt", "false", { expires: 10 })
        setShowPrompt(false)
    }

    return (
        <div className="fixed bottom-6 right-6 z-50">
            <Card className="shadow-2xl rounded-2xl w-72 relative">
                <CardHeader>
                    Install this app for a better experience!
                </CardHeader>
                <CardContent className="flex flex-col items-start ">
                    <div className="flex items-center justify-between w-full gap-3">
                        {/* <Button onClick={handleInstallClick} className="w-full" variant={"outline"} size={"sm"}>
                            Close
                        </Button> */}
                        <Button onClick={handleInstallClick} className="w-full" size={"sm"}>
                            Install App
                        </Button>
                    </div>
                </CardContent>
                <X onClick={handleClose} className="absolute top-5 right-5 bg-gray-200 rounded" />
            </Card>
        </div>
    );
}
