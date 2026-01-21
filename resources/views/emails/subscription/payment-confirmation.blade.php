@component('mail::message')
# Payment Confirmed! ✅

Hi {{ $userName }},

Thank you for your payment! Your subscription has been successfully processed.

@component('mail::panel')
**Amount Paid:** ${{ number_format($amount ?? 0, 2) }}<br>
**Plan:** {{ $plan ?? 'Pro' }}<br>
**Next Billing Date:** {{ $nextBillingDate ?? 'N/A' }}
@endcomponent

Your invoice is attached to this email for your records.

@component('mail::button', ['url' => $billingUrl])
View Billing Details
@endcomponent

## What's Included

Your subscription gives you access to:
- Unlimited QR code creation
- Advanced analytics
- Team collaboration
- Priority support
- Custom branding

If you have any questions about your subscription, feel free to reach out to our support team.

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
This is an automated receipt for your payment. Keep this email for your records.
@endcomponent
@endcomponent
