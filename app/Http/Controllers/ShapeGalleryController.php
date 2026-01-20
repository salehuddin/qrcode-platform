<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class ShapeGalleryController extends Controller
{
    public function index()
    {
        return Inertia::render('Design/ShapeGallery');
    }
}
