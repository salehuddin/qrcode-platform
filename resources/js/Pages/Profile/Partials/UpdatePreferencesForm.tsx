import { Button } from "@/Components/ui/button";
import { Label } from "@/Components/ui/label";
import { Switch } from "@/Components/ui/switch";
import { useForm } from "@inertiajs/react";
import { FormEventHandler } from "react";

export default function UpdatePreferencesForm({ className = "" }: { className?: string }) {
    const { data, setData, post, processing, recentlySuccessful } = useForm({
        email_marketing: true,
        email_security: true,
        browser_notifications: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        // Mock submission
        console.log("Preferences updated", data);
    };

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    Account Preferences
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage your notification settings and other account preferences.
                </p>
            </header>

            <form onSubmit={submit} className="mt-6 space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email_marketing">Marketing Emails</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about new features and offers.
                            </p>
                        </div>
                        <Switch
                            id="email_marketing"
                            checked={data.email_marketing}
                            onCheckedChange={(checked) => setData("email_marketing", checked)}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="email_security">Security Alerts</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive emails about account security and login attempts.
                            </p>
                        </div>
                        <Switch
                            id="email_security"
                            checked={data.email_security}
                            onCheckedChange={(checked) => setData("email_security", checked)}
                            disabled
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                            <Label htmlFor="browser_notifications">Browser Notifications</Label>
                            <p className="text-sm text-muted-foreground">
                                Receive push notifications in your browser.
                            </p>
                        </div>
                        <Switch
                            id="browser_notifications"
                            checked={data.browser_notifications}
                            onCheckedChange={(checked) => setData("browser_notifications", checked)}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <Button disabled={processing}>Save</Button>

                    {recentlySuccessful && (
                        <p className="text-sm text-muted-foreground">
                            Saved.
                        </p>
                    )}
                </div>
            </form>
        </section>
    );
}
