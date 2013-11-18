ivar.require('ivar.data.HashMap');
ivar.require('ivar.patt.Events');

/**
 * Communication mockup for easier frontend development
 * 
 * @author Nikola Stamatovic Stamat < stamat@ivartech.com >
 * @copyright ivartech < http://ivartech.com >
 * @version 1.0
 * @date 2013-11-17
 * @namespace ivar.net
 */
ivar.namespace('ivar.net');

ivar.net.CommunicationMockup = function() {
	this.maps = {};
	new ivar.patt.Events(this);
};

/*
 *	Prepare your mockup request response pairs
 *
 * 	@param	{string}		method				Method identificator for binding the events
 *	@param	{any|object}	request
 *	@param  {any|object}	response
 *	@param  {int}			[timeout=1000]		Timeout in milliseconts for the response to arive
 */
ivar.net.CommunicationMockup.prototype.add = function(method, request, response, timeout) {
	if (!ivar.isSet(timeout)) timeout = 1000;
	if(!ivar.isSet(this.maps[method]))
		this.maps[method] = new ivar.data.HashMap();
	this.maps[method].put(request, {response: response, timeout: timeout});
};

/*
 *	Make a mockup request
 *
 * 	@param	{string}		method			Method identificator for binding the events
 *	@param	{any|object}	request		
 *  @param  {boolean}		[fail=false]	Fail the request
 */
ivar.net.CommunicationMockup.prototype.request = function(method, request, local, fail) {

	var res = this.maps[method].get(request);

	this.fire(method+'send', request, local);
	this.fire('send', request, local);
	
	if (!ivar.isSet(fail)) fail = false;
	var self = this;
	setTimeout(function() {
		if(fail) {
			self.fire(method+'-fail', request, res.response, local);
			self.fire('fail', request, res.response, local);
		} else {
			self.fire(method+'-recieve', request, res.response, local);
			self.fire('recieve', request, res.response, local);
		}
	}, res.timeout);
};
