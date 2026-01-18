import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import OrganizationSettingsForm from './Partials/OrganizationSettingsForm';

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
    return (
        <AuthenticatedLayout
            header={<h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">Organization Settings</h2>}
        >
            <Head title="Organization Settings" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <OrganizationSettingsForm 
                        organization={organization} 
                        canUpdate={can.update} 
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
