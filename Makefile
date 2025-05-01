restart:
	sudo systemctl restart final-act

status:
	sudo systemctl status final-act

check:
	sudo journalctl -u final-act
