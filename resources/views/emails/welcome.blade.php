@component('mail::message')
# Welcome to QRCode Platform, {{ $userName }}! 🎉

We're excited to have you on board! QRCode Platform makes it easy to create, manage, and track beautiful QR codes for your business.

## Get Started

Here's what you can do right now:

@component('mail::button', ['url' => $createQRUrl])
Create Your First QR Code
@endcomponent

## What You Can Do

- **Create Dynamic QR Codes** - Update destination URLs without changing the QR code
- **Track Scans** - See detailed analytics on who scans your QR codes
- **Customize Designs** - Add your logo, colors, and patterns
- **Team Collaboration** - Invite team members and manage permissions
- **Export in Multiple Formats** - PNG, SVG, PDF, and EPS

@component('mail::panel')
💡 **Pro Tip:** Start by creating a simple URL QR code to get familiar with the platform. You can always customize it later!
@endcomponent

Need help getting started? Check out our [Help Center]({{ config('app.url') }}/help) or reply to this email.

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
If you have any questions, feel free to reach out to our support team.
@endcomponent
@endcomponent
