@component('mail::message')
# Subscription Renewal Reminder

Hi {{ $userName }},

Your subscription will renew automatically on **{{ $renewalDate ?? 'your next billing date' }}**.

@component('mail::panel')
**Plan:** {{ $plan ?? 'Pro' }}<br>
**Amount:** ${{ number_format($amount ?? 0, 2) }}<br>
**Payment Method:** {{ $paymentMethod ?? 'Card ending in ****' }}
@endcomponent

No action is required - we'll automatically charge your payment method on file.

@component('mail::button', ['url' => $billingUrl])
Manage Subscription
@endcomponent

## Need to Make Changes?

If you'd like to:
- Update your payment method
- Change your plan
- Cancel your subscription

Visit your billing settings before the renewal date.

Thanks for being a valued customer!

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
You can manage your subscription anytime in your [billing settings]({{ $billingUrl }}).
@endcomponent
@endcomponent
