#!/bin/zsh

set -e

if [[ $# -ne 2 ]]; then
    echo "Usage: $0 /path/to/app.ipa <iphone-ip>"
    exit 1
fi

IPA="$1"
PHONE_IP="$2"

if [[ ! -f "$IPA" ]]; then
    echo "Error: IPA not found: $IPA"
    exit 1
fi

WORKDIR=$(mktemp -d)
APPNAME=$(basename "$IPA" .ipa)

echo "Working directory: $WORKDIR"

echo "Extracting IPA..."
unzip -q "$IPA" -d "$WORKDIR"

APP_PATH=$(find "$WORKDIR/Payload" -maxdepth 1 -name "*.app" -type d | head -n 1)

if [[ -z "$APP_PATH" ]]; then
    echo "Error: No .app found in Payload"
    rm -rf "$WORKDIR"
    exit 1
fi

APP_NAME=$(basename "$APP_PATH")

echo "Found app: $APP_NAME"

TAR_FILE="$PWD/$APP_NAME.tar.gz"

echo "Creating tar archive..."
tar -czf "$TAR_FILE" \
    -C "$WORKDIR/Payload" \
    "$APP_NAME"

echo "Created:"
echo "  $TAR_FILE"

echo
echo "Copying to iPhone ($PHONE_IP)..."

scp \
    -o HostkeyAlgorithms=+ssh-rsa,ssh-dss \
    "$TAR_FILE" \
    "root@$PHONE_IP:/tmp/"

if [[ $? -eq 0 ]]; then
    echo "✓ SCP transfer successful"
else
    echo "✗ SCP transfer failed"
    rm -rf "$WORKDIR"
    exit 1
fi

echo
echo "Removing local tar archive..."
rm -f "$TAR_FILE"

echo
echo "SSH into the iPhone with:"
echo
echo "ssh -o HostkeyAlgorithms=+ssh-rsa,ssh-dss root@$PHONE_IP"

echo
echo "Then run on the iPhone:"
echo
cat <<EOF
cd /Applications
tar -xzf /tmp/$APP_NAME.tar.gz && chown -R root:wheel /Applications/$APP_NAME && chmod -R 755 /Applications/$APP_NAME && uicache && killall SpringBoard
EOF

echo
echo "Cleaning up..."
rm -rf "$WORKDIR"

echo "Done."


