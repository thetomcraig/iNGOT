ssh -t tom@ariston 'sudo rm /var/log/ingot_app.log'
ssh -t tom@ariston 'sudo systemctl restart ingot'
echo "done"
