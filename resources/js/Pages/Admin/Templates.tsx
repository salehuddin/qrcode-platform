import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, router } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/Components/ui/card';
import { Button } from '@/Components/ui/button';
import { LayoutTemplate, Trash2, Plus } from 'lucide-react';
import { QRCodePreview } from '../QRCode/Partials/QRCodePreview';

interface Template {
    id: number;
    name: string;
    thumbnail: string | null;
    config: any;
    category: string;
}

interface AdminTemplatesProps {
    templates: Template[];
}

export default function AdminTemplates({ templates }: AdminTemplatesProps) {
    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this template?')) {
            router.delete(route('admin.templates.destroy', id));
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-foreground">
                        Template Management
                    </h2>
                    <Button asChild>
                        <a href={route('design.index')}>
                            <Plus className="mr-2 h-4 w-4" />
                            Create Template
                        </a>
                    </Button>
                </div>
            }
        >
            <Head title="Template Management" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>All Templates</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {templates.length > 0 ? (
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                    {templates.map((template) => (
                                        <div 
                                            key={template.id} 
                                            className="group relative border rounded-lg p-4 hover:border-primary transition-colors"
                                        >
                                            <div className="aspect-square bg-muted rounded-md mb-2 flex items-center justify-center overflow-hidden">
                                                <QRCodePreview data="TEMPLATE" customization={template.config} />
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-medium text-sm">{template.name}</p>
                                                <p className="text-xs text-muted-foreground">{template.category}</p>
                                            </div>
                                            <div className="mt-2 flex gap-2">
                                                <Button 
                                                    size="sm" 
                                                    variant="destructive"
                                                    className="w-full"
                                                    onClick={() => handleDelete(template.id)}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12 text-muted-foreground">
                                    <LayoutTemplate className="mx-auto h-12 w-12 opacity-20 mb-4" />
                                    <p>No templates created yet.</p>
                                    <p className="text-sm mt-2">Go to Design Studio to create your first template.</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
