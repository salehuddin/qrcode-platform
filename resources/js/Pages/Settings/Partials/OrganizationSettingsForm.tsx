import { Button } from '@/Components/ui/button';
import { Input } from '@/Components/ui/input';
import { Label } from '@/Components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/Components/ui/card';
import { Textarea } from '@/Components/ui/textarea';
import { useToast } from '@/Components/ui/use-toast';
import { useForm } from '@inertiajs/react';
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
    organization: Organization;
    canUpdate: boolean;
}

export default function OrganizationSettingsForm({ organization, canUpdate }: Props) {
    const { toast } = useToast();
    const { data, setData, post, processing, errors } = useForm({
        _method: 'PUT',
        name: organization.name,
        email: organization.email || '',
        phone: organization.phone || '',
        website: organization.website || '',
        description: organization.description || '',
        logo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('settings.organization.update'), {
            onSuccess: () => {
                toast({
                    title: "Organization updated",
                    description: "Your organization settings have been saved.",
                });
            },
        });
    };

    return (
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
                        <div className="md:col-span-2 space-y-2">
                            <Label htmlFor="logo">Organization Logo</Label>
                            <div className="flex items-center gap-4">
                                {organization.logo_url && !data.logo && (
                                    <div className="w-16 h-16 rounded-lg border overflow-hidden">
                                        <img src={organization.logo_url} alt="Current logo" className="w-full h-full object-cover" />
                                    </div>
                                )}
                                <div className="flex-1">
                                    <Input
                                        id="logo"
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setData('logo', e.target.files ? e.target.files[0] : null)}
                                        disabled={!canUpdate}
                                    />
                                    <p className="text-xs text-muted-foreground mt-1">
                                        Max 1MB. Recommended size: 200x200px.
                                    </p>
                                </div>
                            </div>
                            {errors.logo && <p className="text-sm text-red-500">{errors.logo}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Organization Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                disabled={!canUpdate}
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
                                disabled={!canUpdate}
                            />
                            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input
                                id="phone"
                                value={data.phone}
                                onChange={(e) => setData('phone', e.target.value)}
                                disabled={!canUpdate}
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
                                disabled={!canUpdate}
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
                            disabled={!canUpdate}
                            rows={4}
                        />
                        {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {canUpdate && (
                        <Button type="submit" disabled={processing}>
                            Save Changes
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    );
}
