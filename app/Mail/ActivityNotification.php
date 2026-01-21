<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class ActivityNotification extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(
        public User $user,
        public string $activityType, // member_joined, member_removed, role_changed
        public array $data = []
    ) {}

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        $subjects = [
            'member_joined' => 'New Member Joined Your Organization',
            'member_removed' => 'Member Removed from Organization',
            'role_changed' => 'Member Role Updated',
        ];

        return new Envelope(
            subject: $subjects[$this->activityType] ?? 'Team Activity Update',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'emails.activity',
            with: array_merge([
                'userName' => $this->user->name,
                'activityType' => $this->activityType,
                'teamUrl' => route('team.index'),
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
