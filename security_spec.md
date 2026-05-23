# Firebase Security Specification & Invariants - Glacier Barber

## 1. Data Invariants
- **User Integrity**: A user profile can only be read or created by the authentic user matching their authenticated `request.auth.uid`. No user can modify another user's profile roles or override their permissions. Admin role is verified server-side.
- **Booking Invariant**: A booking document MUST contain:
  1. A client booking email corresponding to the client's verified Gmail address, OR an administrator writing the reservation.
  2. A valid service and professional identifier.
  3. No booking can be modified or created without authenticated access.
  4. Client permissions are restricted to creating self bookings, reading self bookings, and raising a cancellation, whereas admins have full read/write state control.

## 2. The "Dirty Dozen" Malicious Payloads
Here are the 12 specific payloads representing attempts to break client isolation or bypass system invariants:
1. **Admin Spoofing**: Attempt to create a user profile with role set to `"admin"` by a client.
2. **Identity Theft**: Attempt to read/write someone else's booking resource.
3. **No Auth Writes**: Submitting write requests without an active `auth` token.
4. **Invalid Duration**: Attempting to set haircuts duration to `-50` or `100000000`.
5. **Negative Pricing**: Registering a haircut service priced at `R$ -200`.
6. **Path Injection**: Attempting to poison booking ID with junk characters of 1.5KB size.
7. **Role Escalation**: Client attempting to self-promote to an admin role on user update block.
8. **Shadow Field Injection**: Attempt to create a user payload containing a ghost/system field.
9. **Spam Booking Blast**: Creating multiple bookings without the required structure, timestamp limit or size constraint.
10. **State Bypass**: Changing a confirmed booking directly to "complete" terminal state from client-side without following workflow logic.
11. **Malicious Image Injections**: Direct injection of arbitrary base64 or unauthorized image URLs in the Haircut collection by a client.
12. **DDoS ID Spoofing**: Attempt to query bookings list using an arbitrary user UID request.

## 3. Evaluated Collections and Security Controls

| Collection | Operations Checked | Identity Spoofing | State Shortcutting | Resource Poisoning |
| :--- | :--- | :--- | :--- | :--- |
| `users` | get, list, create, update, delete | Blocked: strict ID matching | Blocked: strict roles | Guarded by character limit |
| `haircuts` | read, write | Blocked: admin only writes | N/A | Limits on prices, duration & size |
| `barbers` | read, write | Blocked: admin only writes | N/A | Limits on name, roles & sizes |
| `bookings` | get, list, create, update, delete | Blocked: email matching | Client cannot confirm/cancel others | ID regex validation |
