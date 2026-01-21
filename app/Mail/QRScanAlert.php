<?php

namespace App\Mail;

use App\Models\QrCode;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class QRScanAlert extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public QrCode $qrCode,
        public int $scanCount
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: "🎯 Your QR Code \"{$this->qrCode->name}\" reached {$this->scanCount} scans!",
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.scan-alert',
            with: [
                'qrCodeName' => $this->qrCode->name,
                'scanCount' => $this->scanCount,
                'analyticsUrl' => route('qr-codes.analytics', $this->qrCode->id),
                'qrCodeUrl' => route('qr-codes.show', $this->qrCode->id),
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
