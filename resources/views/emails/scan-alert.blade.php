@component('mail::message')
# 🎯 Milestone Reached!

Great news! Your QR code **"{{ $qrCodeName }}"** has reached **{{ number_format($scanCount) }} scans**!

@component('mail::panel')
This is a significant milestone. Your QR code is getting great engagement!
@endcomponent

## Quick Stats

- **Total Scans:** {{ number_format($scanCount) }}
- **QR Code:** {{ $qrCodeName }}
- **Status:** Active

@component('mail::button', ['url' => $analyticsUrl])
View Detailed Analytics
@endcomponent

## What's Next?

Now that your QR code is performing well, consider:

- **Review Analytics** - See where your scans are coming from
- **Optimize Content** - Update the destination URL if needed
- **Share More** - Your QR code is resonating with your audience!

@component('mail::button', ['url' => $qrCodeUrl, 'color' => 'success'])
Manage This QR Code
@endcomponent

Keep up the great work!

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
You're receiving this email because scan alerts are enabled for your account. You can manage your notification preferences in your [account settings]({{ route('settings.preferences') }}).
@endcomponent
@endcomponent
