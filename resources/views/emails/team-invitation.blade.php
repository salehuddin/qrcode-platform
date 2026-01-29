@component('mail::message')
# You've Been Invited!

{{ $inviter->name }} has invited you to join **{{ $organization->name }}** on QRCode Platform.

@component('mail::button', ['url' => $url])
Accept Invitation
@endcomponent

This invitation will expire in 7 days.

Thanks,<br>
{{ config('app.name') }}
@endcomponent
