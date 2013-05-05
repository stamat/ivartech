namespace('ivar.time');

//TODO: EMBED IT INTO FRAMEWORK
function fancyDate(then, now, suffix) {
  if(now === undefined)
		now = new Date();
	
	if(suffix === undefined)
		suffix = 'ago';
	
	var thenMs = null;
	typeof then === 'number' ? thenMs = then : thenMs = then.getTime();
	var nowMs = null;
	typeof now === 'number' ? nowMs = now : nowMs = now.getTime();
	var passed = Math.round((nowMs - thenMs) / 1000);
	if (passed > 59) {
		passed = Math.round(passed / 60);
		if (passed > 59) {
			passed = Math.round(passed / 60);
			if (passed > 23) {
				if ((now.getFullYear() - then.getFullYear() > 0)
					&& (12 + now.getMonth() - then.getMonth() > 11)) {
					return then.getDate() + ' '
						+ _months[then.getMonth()] + ' '
							+ then.getFullYear();
				} else {
					return then.getDate() + ' ' +_months[then.getMonth()];
				}
			} else {
				return passed + 'h '+suffix;
			}
		} else {
			return passed + 'm '+suffix;
		}
	} else {
		return passed + 's '+suffix;
	}
};

function utcTimestamp() {
	var now = new Date;
	return now.getTime() + now.getTimezoneOffset()*60*1000;
}
