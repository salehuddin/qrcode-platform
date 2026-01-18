import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { PageProps } from "@/types";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
import { ArrowLeft, Calendar, QrCode as QrIcon, Activity, ExternalLink } from "lucide-react";
import { Button } from "@/Components/ui/button";

interface ActivityLog {
    id: number;
    description: string;
    event: string;
    created_at: string;
    properties?: any;
}

interface QrCode {
    id: number;
    name: string;
    type: string;
    is_active: boolean;
    created_at: string;
    preview_url?: string; // If you have this
}

interface ShowProps extends PageProps {
    member: {
        id: number;
        name: string;
        email: string;
        profile_photo_url?: string;
        pivot: {
            role: string;
            joined_at: string;
        };
    };
    qr_codes: QrCode[];
    activities: ActivityLog[];
}

export default function TeamShow({ auth, member, qr_codes, activities }: ShowProps) {
    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={route('team.index')}>
                            <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Member Details
                    </h2>
                </div>
            }
        >
            <Head title={`Member: ${member.name}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8 space-y-6">
                    {/* User Profile Card */}
                    <Card>
                        <CardContent className="pt-6">
                            <div className="flex items-start gap-6">
                                <Avatar className="h-24 w-24">
                                    <AvatarImage src={member.profile_photo_url} />
                                    <AvatarFallback className="text-2xl">{member.name.charAt(0)}</AvatarFallback>
                                </Avatar>
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-bold">{member.name}</h3>
                                    <p className="text-muted-foreground">{member.email}</p>
                                    <div className="flex items-center gap-2 pt-2">
                                        <Badge variant="outline" className="capitalize">
                                            {member.pivot.role}
                                        </Badge>
                                        <span className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            Joined {new Date(member.pivot.joined_at).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Tabs defaultValue="qr-codes" className="w-full">
                        <TabsList>
                            <TabsTrigger value="qr-codes" className="flex items-center gap-2">
                                <QrIcon className="h-4 w-4" />
                                QR Codes ({qr_codes.length})
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Activity Log
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="qr-codes" className="mt-6">
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {qr_codes.length === 0 ? (
                                    <div className="col-span-full text-center py-12 text-muted-foreground">
                                        No QR codes created by this user.
                                    </div>
                                ) : (
                                    qr_codes.map((qr) => (
                                        <Card key={qr.id} className="overflow-hidden">
                                            <CardHeader className="p-4 bg-muted/50">
                                                <div className="flex items-center justify-between">
                                                    <Badge variant={qr.is_active ? "default" : "secondary"}>
                                                        {qr.is_active ? "Active" : "Inactive"}
                                                    </Badge>
                                                    <span className="text-xs text-muted-foreground uppercase">{qr.type}</span>
                                                </div>
                                            </CardHeader>
                                            <CardContent className="p-4 relative">
                                                <div className="flex justify-between items-start gap-2">
                                                    <div>
                                                        <h4 className="font-semibold truncate" title={qr.name}>{qr.name}</h4>
                                                        <p className="text-xs text-muted-foreground mt-1">
                                                            Created {new Date(qr.created_at).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 -mt-1 -mr-2" asChild>
                                                        <Link href={route('qr-codes.show', qr.id)}>
                                                            <ExternalLink className="h-4 w-4" />
                                                        </Link>
                                                    </Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))
                                )}
                            </div>
                        </TabsContent>

                        <TabsContent value="activity" className="mt-6">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Activity History</CardTitle>
                                    <CardDescription>Recent actions performed by this user.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="h-[400px] w-full pr-4 overflow-y-auto">
                                        <div className="space-y-4">
                                            {activities.length === 0 ? (
                                                <p className="text-muted-foreground text-sm">No recent activity.</p>
                                            ) : (
                                                activities.map((log) => (
                                                    <div key={log.id} className="flex gap-4 pb-4 border-b last:border-0 last:pb-0">
                                                        <div className="mt-1 bg-primary/10 p-2 rounded-full">
                                                            <Activity className="h-4 w-4 text-primary" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <p className="text-sm font-medium">
                                                                {log.description} <span className="text-muted-foreground font-normal">({log.event})</span>
                                                            </p>
                                                            <p className="text-xs text-muted-foreground">
                                                                {new Date(log.created_at).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
