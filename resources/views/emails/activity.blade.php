@component('mail::message')
# Team Activity Update

Hi {{ $userName }},

@if($activityType === 'member_joined')
**{{ $memberName ?? 'A new member' }}** has joined your organization **{{ $organizationName ?? 'your team' }}**.

@component('mail::panel')
**New Member:** {{ $memberName ?? 'N/A' }}<br>
**Email:** {{ $memberEmail ?? 'N/A' }}<br>
**Role:** {{ $role ?? 'Viewer' }}<br>
**Joined:** {{ $joinedAt ?? 'Just now' }}
@endcomponent

Welcome them to the team and help them get started!

@elseif($activityType === 'member_removed')
**{{ $memberName ?? 'A member' }}** has been removed from **{{ $organizationName ?? 'your organization' }}**.

@component('mail::panel')
**Member:** {{ $memberName ?? 'N/A' }}<br>
**Removed By:** {{ $removedBy ?? 'Admin' }}<br>
**Date:** {{ $removedAt ?? 'Just now' }}
@endcomponent

@elseif($activityType === 'role_changed')
**{{ $memberName ?? 'A member' }}'s** role has been updated in **{{ $organizationName ?? 'your organization' }}**.

@component('mail::panel')
**Member:** {{ $memberName ?? 'N/A' }}<br>
**Previous Role:** {{ $oldRole ?? 'N/A' }}<br>
**New Role:** {{ $newRole ?? 'N/A' }}<br>
**Changed By:** {{ $changedBy ?? 'Admin' }}
@endcomponent

@endif

@component('mail::button', ['url' => $teamUrl])
View Team Members
@endcomponent

Thanks,<br>
The {{ config('app.name') }} Team

@component('mail::subcopy')
You're receiving this email because you're an admin of this organization. You can manage notification preferences in your [account settings]({{ route('settings.preferences') }}).
@endcomponent
@endcomponent
