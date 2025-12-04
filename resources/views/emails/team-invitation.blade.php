<x-mail::message>
# You've been invited!

**{{ $inviter->name }}** has invited you to join **{{ $organization->name }}** on QRCode Platform.

<x-mail::button :url="$url">
Accept Invitation
</x-mail::button>

If you did not expect this invitation, you can ignore this email.

Thanks,<br>
{{ config('app.name') }}
</x-mail::message>
