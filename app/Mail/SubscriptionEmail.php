<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class SubscriptionEmail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public string $emailType, // payment_success, renewal, payment_failed
        public array $data = []
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subjects = [
            'payment_success' => 'Payment Confirmed - Thank You!',
            'renewal' => 'Your Subscription is Renewing Soon',
            'payment_failed' => 'Payment Failed - Action Required',
        ];

        return new Envelope(
            subject: $subjects[$this->emailType] ?? 'Subscription Update',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        $templates = [
            'payment_success' => 'emails.subscription.payment-confirmation',
            'renewal' => 'emails.subscription.subscription-renewal',
            'payment_failed' => 'emails.subscription.payment-failed',
        ];

        return new Content(
            markdown: $templates[$this->emailType] ?? 'emails.subscription.payment-confirmation',
            with: array_merge([
                'userName' => $this->user->name,
                'billingUrl' => route('billing'),
            ], $this->data),
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
