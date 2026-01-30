<?php

namespace App\Notifications;

use App\Models\Organization;
use App\Models\User;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class MemberRemovedAdminNotification extends Notification
{
    protected $organization;
    protected $removedUser;
    protected $removedBy;

    public function __construct(Organization $organization, User $removedUser, User $removedBy)
    {
        $this->organization = $organization;
        $this->removedUser = $removedUser;
        $this->removedBy = $removedBy;
    }

    public function via($notifiable)
    {
        return ['mail'];
    }

    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Member Removed from ' . $this->organization->name)
            ->line($this->removedUser->name . ' (' . $this->removedUser->email . ') was removed from your organization.')
            ->line('Removed by: ' . $this->removedBy->name)
            ->line('Organization: ' . $this->organization->name);
    }
}
