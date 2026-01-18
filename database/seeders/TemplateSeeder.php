<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class TemplateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $templates = [
            [
                'name' => 'Modern Dark',
                'category' => 'Modern',
                'is_public' => true,
                'config' => [
                    'dotsColor' => '#ffffff',
                    'backgroundColor' => '#1a1a1a',
                    'cornersSquareColor' => '#ffffff',
                    'cornersDotsColor' => '#ffffff',
                    'dotsType' => 'rounded',
                    'cornersSquareType' => 'extra-rounded',
                    'cornersDotsType' => 'dot',
                    'gradientEnabled' => false,
                ]
            ],
            [
                'name' => 'Professional Blue',
                'category' => 'Business',
                'is_public' => true,
                'config' => [
                    'dotsColor' => '#0f172a',
                    'backgroundColor' => '#ffffff',
                    'cornersSquareColor' => '#2563eb',
                    'cornersDotsColor' => '#2563eb',
                    'dotsType' => 'square',
                    'cornersSquareType' => 'square',
                    'cornersDotsType' => 'square',
                    'gradientEnabled' => false,
                ]
            ],
            [
                'name' => 'Vibrant Gradient',
                'category' => 'Creative',
                'is_public' => true,
                'config' => [
                    'dotsColor' => '#ffffff',
                    'backgroundColor' => '#ffffff',
                    'cornersSquareColor' => '#c026d3',
                    'cornersDotsColor' => '#7c3aed',
                    'dotsType' => 'classy',
                    'cornersSquareType' => 'extra-rounded',
                    'cornersDotsType' => 'dot',
                    'gradientEnabled' => true,
                    'gradientType' => 'linear',
                    'gradientStartColor' => '#c026d3',
                    'gradientEndColor' => '#7c3aed',
                    'gradientRotation' => 45,
                ]
            ],
        ];

        foreach ($templates as $template) {
            \App\Models\Template::create($template);
        }
    }
}
