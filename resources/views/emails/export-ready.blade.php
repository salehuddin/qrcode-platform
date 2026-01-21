@component('mail::message')
# Your Export is Ready! 📦

Hi {{ $userName }},

Great news! Your QR code export for **"{{ $qrCodeName }}"** is ready to download.

@component('mail::panel')
**QR Code:** {{ $qrCodeName }}<br>
**Format:** {{ $format }}<br>
**Expires:** {{ $expiresAt }}
@endcomponent

@component('mail::button', ['url' => $downloadUrl])
Download Now
@endcomponent

## Important Notes

- This download link will expire in **24 hours**
- The file is ready for immediate use
- High-quality export suitable for print and digital use

## Need a Different Format?

You can export your QR code in multiple formats:
- **PNG** - Perfect for web and digital use
- **SVG** - Scalable vector for any size
- **PDF** - Ready for print
- **EPS** - Professional design software

Visit your QR code page to export in other formats.

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
If you didn't request this export, you can safely ignore this email. The download link will expire automatically.
@endcomponent
@endcomponent
