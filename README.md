hetzner-notifier
================

Automatically send slack notifications when Hetzner's server auctions drop below
a certain price threshold.

Usage
=====

```
npm install
node index.js --slack_webhook_url=https://hooks.slack.com/services/aaa/bbb/ccc --country=nl --threshold=51 --ram=32 --text=ssd
```

Parameters
----------

*Slack parameters:*
- `slack_webhook_url` - Required: Slack webhook url

*Hetzner specific parameters:*
- `country` - Optional: The country you're in.
Hetzner charges different prices based on this information (default: US).
- `threshold` - Optional: The price threshold (in euro) below which
notifications are sent (default: 30).
- `ram` - Optional: Minimum RAM (in GB).
- `hdnr` - Optional: Minimum number of HDD's.
- `hdsize` - Optional: Minimum HDD size (in GB).
- `text` - Optional: Miscellaneous text to search (e.g. SSD)
