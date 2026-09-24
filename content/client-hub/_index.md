+++
title = "Client hubs"
description = "Where to find your Arts-Link project hub, and what to do if the link won't open."

# Reuses layouts/thanks/list.html, which is the site's data-driven utility
# layout — eyebrow, heading, body, and one way onward. Nothing about it is
# specific to thanking anyone, and this page has no reason to define its own
# markup just to say the same thing once.
type = "thanks"

eyebrow = "Client hubs"
heading = "Wrong turn."
body = "Your project hub lives at clients.arts-link.com, and the link I emailed you opens it directly. If that link has gone missing, or a page won't open when you think it should, tell me and I'll sort it out."

# Deliberately NOT a link to clients.arts-link.com. This page is where Access
# sends someone it has just refused, so a link back to the gated site sends
# them straight into the same refusal and back here again — a loop, with no
# way out but closing the tab.
#
# It becomes safe to point at https://clients.arts-link.com/ only once the
# catch-all Access application admits clients and not just Ben, which is the
# same prerequisite CLIENT_ROUTES has in the hub repo. Until then the only
# exit that cannot loop is one that leaves the gated hostname entirely.
back_href = "/contact/"
back_text = "Get in touch →"
+++
