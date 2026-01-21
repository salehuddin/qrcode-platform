@component('mail::message')
# Payment Failed - Action Required ⚠️

Hi {{ $userName }},

We were unable to process your recent payment for your QRCode Platform subscription.

@component('mail::panel')
**Plan:** {{ $plan ?? 'Pro' }}<br>
**Amount Due:** ${{ number_format($amount ?? 0, 2) }}<br>
**Retry Date:** {{ $retryDate ?? 'Soon' }}
@endcomponent

## What Happens Next?

We'll automatically retry the payment in a few days. To avoid any service interruption, please:

1. Check that your payment method is valid
2. Ensure sufficient funds are available
3. Update your payment method if needed

@component('mail::button', ['url' => $billingUrl, 'color' => 'error'])
Update Payment Method
@endcomponent

## Need Help?

If you're experiencing issues or have questions about your billing, our support team is here to help.

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
**Important:** If payment continues to fail, your account may be downgraded. Update your payment method to maintain uninterrupted service.
@endcomponent
@endcomponent
