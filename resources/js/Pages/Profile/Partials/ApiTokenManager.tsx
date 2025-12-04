import { Button } from "@/Components/ui/button";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { useState } from "react";
import { Copy, Plus, Trash2 } from "lucide-react";

export default function ApiTokenManager({ className = "" }: { className?: string }) {
    const [tokens, setTokens] = useState([
        { id: 1, name: "Development Key", last_used: "2 days ago", token: "sk_test_..." },
    ]);

    return (
        <section className={className}>
            <header>
                <h2 className="text-lg font-medium text-foreground">
                    API Keys
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                    Manage API keys to access the platform programmatically.
                </p>
            </header>

            <div className="mt-6 space-y-6">
                {/* Create Token */}
                <div className="flex gap-4 items-end">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label htmlFor="token_name">Token Name</Label>
                        <Input type="text" id="token_name" placeholder="My App Token" />
                    </div>
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create Token
                    </Button>
                </div>

                {/* Token List */}
                <div className="space-y-4">
                    {tokens.map((token) => (
                        <div key={token.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                            <div>
                                <div className="font-medium">{token.name}</div>
                                <div className="text-sm text-muted-foreground">Last used {token.last_used}</div>
                            </div>
                            <div className="flex items-center gap-2">
                                <code className="bg-muted px-2 py-1 rounded text-xs font-mono">{token.token}</code>
                                <Button variant="ghost" size="icon">
                                    <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
