import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { useToast } from '@/Components/ui/use-toast';
import { FormEventHandler } from 'react';

interface Organization {
    id: number;
    name: string;
    email: string | null;
    phone: string | null;
    website: string | null;
    description: string | null;
    logo_url: string | null;
}

interface Props {
    auth: any;
    organization: Organization;
    can: {
        update: boolean;
        delete: boolean;
    };
}

export default function OrganizationSettings({ auth, organization, can }: Props) {
    const { toast } = useToast();
    const { data, setData, put, processing, errors } = useForm({
        name: organization.name,
        email: organization.email || '',
        phone: organization.phone || '',
        website: organization.website || '',
        description: organization.description || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        put(route('settings.organization.update'), {
            onSuccess: () => {
                toast({
                    title: "Organization updated",
                    description: "Your organization settings have been saved.",
                });
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Organization Settings</h2>}
        >
            <Head title="Organization Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Organization Details</CardTitle>
                            <CardDescription>
                                Update your organization's profile information.
                            </CardDescription>
                        </CardHeader>
                        <form onSubmit={submit}>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Organization Name</Label>
                                        <Input
                                            id="name"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            disabled={!can.update}
                                            required
                                        />
                                        {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="email">Contact Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            disabled={!can.update}
                                        />
                                        {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone">Phone Number</Label>
                                        <Input
                                            id="phone"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            disabled={!can.update}
                                        />
                                        {errors.phone && <p className="text-sm text-red-500">{errors.phone}</p>}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="website">Website</Label>
                                        <Input
                                            id="website"
                                            type="url"
                                            value={data.website}
                                            onChange={(e) => setData('website', e.target.value)}
                                            disabled={!can.update}
                                            placeholder="https://example.com"
                                        />
                                        {errors.website && <p className="text-sm text-red-500">{errors.website}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        value={data.description}
                                        onChange={(e) => setData('description', e.target.value)}
                                        disabled={!can.update}
                                        rows={4}
                                    />
                                    {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                {can.update && (
                                    <Button type="submit" disabled={processing}>
                                        Save Changes
                                    </Button>
                                )}
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
