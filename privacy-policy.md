# MODA Privacy Policy

**Effective date:** July 27, 2026
**Last updated:** July 27, 2026

MODA is made by Lorenzo Ventures LLC ("we," "us"). This policy explains what information the MODA app collects, why, and what we do with it — in plain language, because that's how we'd want it explained to us.

**The short version:** we collect your email to run your account, the photos and wardrobe details you add, and anonymous-by-default usage and crash data to make the app better. We never sell your data. You can export or delete everything, any time, from inside the app.

## What we collect

**Account information.** When you create a MODA account, we collect your email address and a password (stored as a secure hash — we never see or store your actual password). That's what we need to sign you in and let you recover your account.

**Your wardrobe content.** The photos of clothing items you add (from your camera or photo library), and the details you attach to them — names, categories, prices, wear logs, outfits, wishlist entries. This is the product; it exists so the app can show you your closet and compute things like cost-per-wear. Camera and photo-library access is used only when you choose to add or edit an item, and only for the photos you pick or take. We do not scan your photo library.

**Photos sent for AI processing.** Some features work by sending the photo you chose to a third-party AI provider to process it — automatic item tagging, image generation where that feature is offered, and background removal. This happens only for the feature you asked for, and only with that photo:

- **Google (Gemini API)** receives the photo and the instructions for that feature. When you add an item from a shop link, it also receives the product details read from that page. It does not receive your email, your account details, or your wardrobe history.
- **remove.bg** receives the photo you submit for background removal, and nothing else.

Neither provider receives your account information, and neither is permitted to use your photos for their own purposes. Each handles what it receives under its own privacy policy, linked below.

**Usage analytics.** We use PostHog to understand how the app is used — events like "item added," "wear logged," or "paywall viewed," along with basic device information (device model, OS version, app version). We use this to see what's working and what's broken. We do not use analytics data for advertising.

**Crash reports.** If the app crashes, Sentry collects a technical crash report (stack trace, device model, OS version) so we can fix it. Crash reports are not used for any other purpose.

**Purchase information.** If you subscribe to MODA+, the purchase is processed entirely by Apple. We receive subscription status (via RevenueCat, our subscription-management provider) — not your payment details. We never see your card number.

**Location (optional, for weather).** If you allow location access, MODA uses your device's location to fetch the local weather forecast so outfit suggestions match the conditions outside. Your coordinates are sent to our weather providers (Open-Meteo and OpenStreetMap's Nominatim, for the area name) to answer that request; they are not stored by us, not saved to your account, and not used for anything else. Weather is optional — if you decline location access, everything else in the app works normally.

## What we don't do

- We do **not** sell your personal information, ever.
- We do **not** show ads or share your data with advertisers or data brokers.
- We do **not** scan or upload your photo library — only the photos you explicitly choose.
- We do **not** track your location. If you enable the weather feature, your coordinates are used only to fetch the forecast (see above) — never stored, never tied to your account.
- We do **not** collect your contacts or anything the app doesn't need.

## Where your data lives

Your account and wardrobe data are stored with Supabase, our database and authentication provider. Analytics events go to PostHog, crash reports to Sentry, and subscription status to RevenueCat. Photos you submit to an AI feature are sent to Google (Gemini API) or remove.bg for that request only, as described above. Each of these providers processes data on our behalf under their own security and privacy commitments; none of them are permitted to use your data for their own purposes.

The providers we use, and their privacy policies:

- Supabase — database, authentication, and file storage ([supabase.com/privacy](https://supabase.com/privacy))
- PostHog — usage analytics ([posthog.com/privacy](https://posthog.com/privacy))
- Sentry — crash reporting ([sentry.io/privacy](https://sentry.io/privacy))
- RevenueCat — subscription management ([revenuecat.com/privacy](https://www.revenuecat.com/privacy))
- Google (Gemini API) — AI processing of photos you submit ([policies.google.com/privacy](https://policies.google.com/privacy))
- remove.bg — background removal ([remove.bg/privacy](https://www.remove.bg/privacy))
- Open-Meteo and OpenStreetMap Nominatim — weather forecast and area name, from coordinates only

## How long we keep it

Your data is kept for as long as your account exists. Delete your account (Settings → Account → Delete Account) and your account record and wardrobe data are permanently deleted. Aggregated analytics and crash data that can't be tied back to you may be retained for product-quality purposes. A photo that a third-party AI provider received in order to process it is retained under that provider's own terms, not ours.

## Your choices and rights

- **Export:** you can export your wardrobe data from the app.
- **Delete:** you can delete individual items, or your entire account, in-app — no email or support ticket required.
- **Access/correction:** everything we hold about your wardrobe is visible and editable in the app. For anything else, contact us at the address below.

Depending on where you live (for example the EU/EEA, UK, or California), you may have additional legal rights over your personal information — including rights to access, correct, delete, or port it, and to object to certain processing. To exercise any of these, contact us; we will respond within the timelines required by applicable law. We do not discriminate against you for exercising your rights.

## Children

MODA is not directed at children under 13, and we do not knowingly collect personal information from them. If you believe a child under 13 has created an account, contact us and we will delete it.

## Changes to this policy

If we change this policy, we'll update the date at the top and, for material changes, tell you in the app before the change takes effect.

## Contact

Questions, requests, or complaints:

**Email:** support@lorenzoventures.co
**Lorenzo Ventures LLC**

