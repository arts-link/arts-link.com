+++
title = "Editing"
weight = 50
blurb = "Setting up GitHub, and how you publish from Dreamweaver from now on."
client_name = "Elisha Shapiro"
project_title = "Moving nihilists.net"
phase = "Rescued and staged — awaiting launch decisions"
date = 2026-09-15
lastmod = 2026-09-15

eyebrow = "Moving nihilists.net"
title_heading = "Editing the"
title_emphasis = "site"
lede = "You keep working in Dreamweaver exactly as you always have. Only the last step — the part where you send the changes out — is different."
+++

## The Short Version

You edit and save in Dreamweaver, then press two buttons in a second program to
send the changes out. The site updates itself a minute or so later. There is no
FTP, no password to type each time, and nothing to remember about which files
you touched — the second program works that out for you.

Setting it up is a one-time job, and the first half of it is the part I need
from you.

## Step One — Make a GitHub Account

GitHub is where the site's files live now. It's free, and you need an account of
your own so I can give you access to yours.

1. Go to [github.com/signup](https://github.com/signup) and create an account.
   Any username is fine — it does not have to relate to the site. If you already
   have one, skip this.
2. Confirm the email they send you. The account has to be verified before it can
   be invited to a private project.
3. **Email me the username**, spelled exactly as GitHub shows it. Not the email
   address, the username.
4. I'll invite that account to the private `arts-link/nihilists.net` project.
   GitHub will email you an invitation — open it and accept.

{{< hub/note >}}
**Why I need the exact username.** An invitation to a private project goes to
one named account and nobody else. A near-miss invites a stranger with a similar
name, so I'd rather copy and paste it than guess.
{{< /hub/note >}}

## Step Two — Install GitHub Desktop

[GitHub Desktop](https://desktop.github.com/) is the program that moves your
changes. It is free, made by GitHub, and it exists precisely so that none of
this has to happen at a command line.

1. Download and install it, then sign in with the account you just made.
2. Open the project's page on GitHub, click the green **Code** button and choose
   **Open with GitHub Desktop**. It will offer to put a copy on your computer —
   let it, and note where it puts it.
3. That folder, on your own machine, is now your site. **Point Dreamweaver at it
   as the site root**, in place of whatever folder you use today.

We'll do this part together on a call if you'd rather; it's about ten minutes.

## Step Three — How You Publish From Now On

{{< hub/spine >}}
{{< hub/era years="1" title="Edit in Dreamweaver" >}}
Open the page, make your changes, save. Exactly as you do now.
{{< /hub/era >}}
{{< hub/era years="2" title="Open GitHub Desktop" >}}
It will already be listing what you changed — every edited page and every new
image, without you telling it anything.
{{< /hub/era >}}
{{< hub/era years="3" title="Describe it in a line" >}}
Type a few words about what you did — "updated the 2026 festival dates" — and
press **Commit to main**. That line is how you find this version again later.
{{< /hub/era >}}
{{< hub/era years="4" title="Press Push" >}}
This is the part that actually sends it. Cloudflare picks the change up and
publishes it on its own; the site updates within a minute or two.
{{< /hub/era >}}
{{< /hub/spine >}}

There is no step where anything is deleted or overwritten for good. Every
version is kept, so a mistake is something we can simply step back from.

## Two Small Habits Worth Having

- **Name new files in lowercase, with hyphens instead of spaces** —
  `craft-class.jpg` rather than `Craft Class.jpg`. The new server, unlike the old
  one, treats capital letters as different letters, and spaces in a filename make
  for ugly and fragile links. The files already on the site are fine as they are.
- **Commit little and often.** Four small changes with four descriptions are much
  easier to untangle later than one big one at the end of the day.

And if at any point you would rather not deal with it, sending me the changes is
always fine.
