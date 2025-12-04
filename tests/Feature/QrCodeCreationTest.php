<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class QrCodeCreationTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_qr_code()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('qr-codes.store'), [
            'name' => 'Test QR',
            'type' => 'url',
            'mode' => 'static',
            'content' => 'https://example.com',
            'design' => ['color' => 'black'],
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('qr_codes', [
            'name' => 'Test QR',
            'type' => 'url',
            'content' => 'https://example.com',
            'user_id' => $user->id,
        ]);
    }

    public function test_user_can_create_dynamic_qr_code()
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->post(route('qr-codes.store'), [
            'name' => 'Dynamic QR',
            'type' => 'url',
            'mode' => 'dynamic',
            'content' => 'https://example.com', // destination
            'permalink' => 'https://example.test/r/dynamic-qr',
            'destination_url' => 'https://example.com',
        ]);

        $response->assertRedirect();
        $this->assertDatabaseHas('qr_codes', [
            'name' => 'Dynamic QR',
            'mode' => 'dynamic',
            'permalink' => 'https://example.test/r/dynamic-qr',
        ]);
    }
}
