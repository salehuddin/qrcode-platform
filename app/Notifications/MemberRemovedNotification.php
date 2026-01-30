<?php

namespace App\Notifications;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class MemberRemovedNotification extends Notification
{
    protected $organization;
    protected $removedBy;

    public function __construct(Organization $organization, User $removedBy)
    {
        $this->organization = $organization;
        $this->removedBy = $removedBy;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        $owner = $this->organization->users()
            ->wherePivot('role', 'owner')
            ->first();

        return (new MailMessage)
            ->subject('Removed from ' . $this->organization->name)
            ->line('You have been removed from ' . $this->organization->name . '.')
            ->line('If you need access again, please contact the organization owner:')
            ->line('Email: ' . ($owner->email ?? 'N/A'))
            ->line('Organization: ' . $this->organization->name);
    }
}
