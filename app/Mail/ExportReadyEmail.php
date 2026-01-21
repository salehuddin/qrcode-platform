<?php

namespace App\Mail;

use App\Models\User;
use App\Models\QrCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ExportReadyEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public string $downloadUrl,
        public QrCode $qrCode,
        public string $format = 'PNG'
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "Your QR Code Export is Ready! 📦",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.export-ready',
            with: [
                'userName' => $this->user->name,
                'qrCodeName' => $this->qrCode->name,
                'downloadUrl' => $this->downloadUrl,
                'format' => $this->format,
                'expiresAt' => now()->addHours(24)->format('M d, Y h:i A'),
            ],
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
