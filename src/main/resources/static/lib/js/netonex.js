var objectclass=function(){};
objectclass.extend=function(a,c){var e=objectclass.prototype.extend;objectclass._prototyping=true;var d=new this;e.call(d,a);d.base=function(){};delete objectclass._prototyping;var g=d.constructor,b=d.constructor=function(){if(!objectclass._prototyping)if(this._constructing||this.constructor==b){this._constructing=true;g.apply(this,arguments);delete this._constructing}else if(arguments[0]!=null)return(arguments[0].extend||e).call(arguments[0],d)};b.ancestor=this;b.extend=this.extend;b.forEach=this.forEach;
b.implement=this.implement;b.prototype=d;b.toString=this.toString;b.valueOf=function(h){return h=="object"?b:g.valueOf()};e.call(b,c);typeof b.init=="function"&&b.init();return b};
objectclass.prototype={extend:function(a,c){if(arguments.length>1){var e=this[a];if(e&&typeof c=="function"&&(!e.valueOf||e.valueOf()!=c.valueOf())&&/\bbase\b/.test(c)){var d=c.valueOf();c=function(){var i=this.base||objectclass.prototype.base;this.base=e;var j=d.apply(this,arguments);this.base=i;return j};c.valueOf=function(i){return i=="object"?c:d};c.toString=objectclass.toString}this[a]=c}else if(a){var g=objectclass.prototype.extend;if(!objectclass._prototyping&&typeof this!="function")g=this.extend||
g;for(var b={toSource:null},h=["constructor","toString","valueOf"],k=objectclass._prototyping?0:1;f=h[k++];)a[f]!=b[f]&&g.call(this,f,a[f]);for(var f in a)b[f]||g.call(this,f,a[f])}return this}};
objectclass=objectclass.extend({constructor:function(a){this.extend(a)}},{ancestor:Object,version:"1.1",forEach:function(a,c,e){for(var d in a)this.prototype[d]===undefined&&c.call(e,a[d],d,a)},implement:function(){for(var a=0;a<arguments.length;a++)if(typeof arguments[a]=="function")arguments[a](this.prototype);else this.prototype.extend(arguments[a]);return this},toString:function(){return String(this.valueOf())}});

/*
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * uniproxyx.base.src.js
 */

var SXActiveX = objectclass.extend({
	CONTROL_MAP: {},
	LOGSHOW_ID: "",
	MAINX_ID: "",
	MAINX_VERSION: "",
	MAINX_PROGID: "",  // must be overrided by child class
	MAINX_CLASSID: "", // must be overrided by child class
	ACTIVEX32_CODEBASE: "",
	ACTIVEX64_CODEBASE: "",
	NPAPI_MIME: "",    // can be overrided by child class
	MSI_CODEBASE: "",
	SCRIPT_VERSION: "1.0.0",
	DEBUG: 0,
	
	assert: function(v) {
		if (!v && this.DEBUG) {
			console.log("ASSERT!");
			alert('ASSERT!');
		}
	},

	isie: function() {
		var x = (window.ActiveXObject || ("ActiveXObject" in window));
		return x;
	},

	is64: function() {
		try {
			var x = navigator.cpuClass.toLowerCase();
			return (x === "x64");
		}
		catch (e) {
			return false;
		}
	},

	vardump: function(arr, level) {
		var dumped_text = "";
		if(!level) level = 0;
		
		//The padding given at the beginning of the line.
		var level_padding = "";
		for(var j=0;j<level+1;j++) level_padding += "    ";
		
		if(typeof(arr) == 'object') { //Array/Hashes/Objects 
			for(var item in arr) {
				var value = arr[item];
				
				if(typeof(value) == 'object') { //If it is an array,
					dumped_text += level_padding + "'" + item + "' ...\n";
					dumped_text += dump(value,level+1);
				} else {
					dumped_text += level_padding + "'" + item + "' => \"" + value + "\"\n";
				}
			}
		} else { //Stings/Chars/Numbers etc.
			dumped_text = "===>"+arr+"<===("+typeof(arr)+")";
		}
		return dumped_text;
	},

	vb2js_array: function(v) {
		if (typeof VBArray !== 'undefined' && typeof v == 'unknown') {
			var j = (new VBArray(v)).toArray();
			return j;
		}
		return v;
	},

	js2vb_array: function(v) {
		if (typeof VBArray !== 'undefined') {
			// we can convert VBArray to javascript array in IE
			var dictionary = new ActiveXObject("Scripting.Dictionary");
			var i;
			var n = 0;
			for (i in v) {
				dictionary.add(n, v[i]);
				n ++;
			}
			return dictionary.Items();
		}
		return v;
	},
	
	asInt: function(v) {
		if (isNaN(v)) return 0;
		return parseInt(v);
	},

	asString: function(v) {
		if (!v) return '';
		return '' + v;
	},
	
	getLogElementID: function() {
		return this.LOGSHOW_ID;
	},

	getMainXElementID: function() {
		return this.MAINX_ID;
	},

	log: function(e) {
		var x = this.getLogElementID();
		if (!x) {
			return;
		}		
		var msg = '';
		if ('string' == typeof e) {
			msg = $.sprintf('<span class="green">%s</span>', e);
		}
		else {
			msg = this.DEBUG ? $.sprintf('<span class="red">[%s] %s</span>', e.stack, e.message) : $.sprintf('<span class="red">%s</span>', e.message);
		}
		var t = new Date();
		var d = $.sprintf('<br/>%d-%d-%d %d:%d:%d %s', t.getFullYear(), t.getMonth() + 1, t.getDate(), t.getHours(), t.getMinutes(), t.getSeconds(), msg);
		$('#'+x).append(d);	
	},

	logClean:function() {
		var x = this.getLogElementID();
		$('#'+x).html('');
	},
	
	checkMainXActiveX: function(mainx) {
		if (!('Version' in mainx)) {
			throw new Error('ActiveX is not running.');
		}
		if (!this.isMainXUpToDate(mainx.Version)) {
			throw new Error('ActiveX is not up to date.');
		}
		return true;
	},

	getMainXNpapi: function(obj) {
		return false;
	},

	getMainX: function() {
		var m = this.CONTROL_MAP['MainX'];
		if ('undefined' != typeof m) {
			return m;
		}
		if (this.isie()) {
			try {
				this.assert(this.MAINX_PROGID);
				m = new ActiveXObject(this.MAINX_PROGID);
			}	
			catch(e) {
				//just continue;
			}
			if (m) {
				this.checkMainXActiveX(m);
				this.CONTROL_MAP['MainX'] = m;
				return m;
			}	
		}
		var id = this.getMainXElementID();
		if (!id) {
			throw new Error('Object element id is not set. Can not initialize object instance.');
		}
		m = document.getElementById(id);
		if (this.isie()) {
			this.checkMainXActiveX(m);
			this.CONTROL_MAP['MainX'] = m;
			return m;
		}
		else {
			if (this.NPAPI_MIME) {
				var x = this.getMainXNpapi(m);
				this.checkMainXActiveX(x);
				this.CONTROL_MAP['MainX'] = x;
				return x;
			}
		}
		throw new Error('ActiveX can only be running in Internet Explorer.');
	},
	
	getObjectElement: function() {
		if (!this.isie()) {
			if (this.NPAPI_MIME) {
				var r = document.createElement('object');
				this.assert(this.MAINX_ID);
				r.id = this.MAINX_ID;
				r.width = "1px";
				r.height = "1px";
				r.type = this.NPAPI_MIME;
				return r;
			}
			throw new Error('Unsupported browser, please try Internet Explorer.');
		}
		var codebase = this.is64() ? this.ACTIVEX64_CODEBASE : this.ACTIVEX32_CODEBASE;
		if (!codebase) {
			throw new Error('Can not initialize ActiveX object since codebase is not set.');
		}
		var r = document.createElement('object');
		this.assert(this.MAINX_ID);
		r.id = this.MAINX_ID;
		r.width = "1px";
		r.height = "1px";
		this.assert(this.MAINX_CLASSID);
		r.classid = "CLSID:" + this.MAINX_CLASSID;
		r.codeBase = $.sprintf('%s#Version=%s', codebase, this.MAINX_VERSION.replace(/\./g, ','));
		return r;
	},
	
	divSetup: function(div) {
		this.LOGSHOW_ID = div.attr('logshowid');
		this.MAINX_VERSION = div.attr('version');
		this.ACTIVEX32_CODEBASE = div.attr('activex32_codebase');
		this.ACTIVEX64_CODEBASE = div.attr('activex64_codebase');
		var a = div.attr('msi_codebase');
		if (!a) {
			// for compatible issue
			a = div.attr('npapi_codebase');
		}
		this.MSI_CODEBASE = a;
		this.assert(this.MAINX_ID);

		var s = this.getObjectElement();
		if (s) {
			div.append(s);
		}

		try {
			this.getMainX();
		}
		catch (e) {
			this.log(e);
			throw new Error($.sprintf('Please download and install <a href="%s">this installer</a>, restart the browser after the installation is finished.', this.MSI_CODEBASE));
		}
	},

	isMainXUpToDate: function(mainv) {
		if (!this.MAINX_VERSION) return true;
		var d = this.MAINX_VERSION.split('.');
		var i, v = 0;	
		for (i in d) {
			var q = this.asInt(d[i]);
			v = v * 0x100 + q;
		}
		var a = this.asInt(mainv);
		return (a >= v) ? 1 : 0;
	},

	isNpapiInstalled: function() {
		if (!this.NPAPI_MIME) {
			return 0;
		}
		var x = navigator.mimeTypes[this.NPAPI_MIME];
		return (x === undefined) ? 0 : 1;
	}

});


	
/*
 * Copyright 2014-2015 Jiangsu SYAN tech. ltd.
 * netone.base.src.js
 */

var NetONEX = SXActiveX.extend({
	MAINX_PROGID: "NetONEX.MainX",
	MAINX_CLASSID: "EC336339-69E2-411A-8DE3-7FF7798F8307",
	MAINX_ID: "netonex", 
	NPAPI_MIME: "application/x-netone",
	NETONEX_ATTRS: {},
	SCRIPT_VERSION: "1.0.4",

	getMainXNpapi: function(obj) {
		var m = obj.NP_IMainX();
		return m;
	},

	getMainX: function() {
		var m = this.base();
		if (m) {
			m.DEBUG = this.asInt(this.NETONEX_ATTRS['DEBUG']);
			m.Quiet = this.asInt(this.NETONEX_ATTRS['Quiet']);
		}
		return m;
	},

	getBase64X: function() {
		return this.getInstanceX('Base64X');
	},

	getHashX: function() {
		return this.getInstanceX('HashX');		
	},

	getCertificateCollectionX: function() {
		return this.getInstanceX('CertificateCollectionX');		
	},
	
	getCipherX: function() {
		return this.getInstanceX('CreateCipherXInstanceX');
	},
	
	getCSPEnrollX: function() {
		return this.getInstanceX('CSPEnrollX');
	},

	getSKFEnrollX: function() {
		return this.getInstanceX('SKFEnrollX');
	},
    
    getSKFTokenCollectionX: function() {
		return this.getInstanceX('SKFTokenCollectionX');        
    },
    
	getInstanceX: function(id) {
		var m = this.getMainX();
		var r = this.CONTROL_MAP[id];
		if ('undefined' != typeof r) {
			return this.CONTROL_MAP[id];
		}
		if (id == 'Base64X') {
			r = m.CreateBase64XInstance();
		}
		else if (id == 'HashX') {
			r = m.CreateHashXInstance();
		}
		else if (id == 'CertificateCollectionX') {
			r = m.CreateCertificateCollectionXInstance();
		}
		else if (id == 'CreateCipherXInstanceX') {
			r = m.CreateCipherXInstance();
		}
		else if (id == 'CSPEnrollX') {
			r = m.CreateCSPEnrollXInstance();
		}
		else if (id == 'SKFEnrollX') {
			r = m.CreateSKFEnrollXInstance();
		}
		else if (id == 'SKFTokenCollectionX') {
			r = m.CreateSKFTokenCollectionXInstance();
		}
		if (!('Quiet' in r)) {
			throw new Error($.sprintf('%s is not running.', id));
		}
		this.CONTROL_MAP[id] = r;
		return r;
	},

	divSetup: function(div) {
		this.base(div);
		this.NETONEX_ATTRS['DEBUG'] = div.attr('debug') ? 1 : 0;
		this.NETONEX_ATTRS['Quiet'] = div.attr('quiet') ? 1 : 0;
	},

	setupObject: function() {
		var self = this;
		var r = false;
		$('div[action=netonex]').each(function() {
			self.divSetup($(this));
			r = true;
			return false;
		});
		return r;
	},

	/*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	 *???????????????GZCA???????????????
	 *>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>*/
	
	//??????????????????
	getDocumentType: function(crtx) {
		//????????????:1.2.156.10260.4.1.4  ??????:1.2.156.10260.4.1.1
		var oid = ['1.2.156.10260.4.1.4', '1.2.156.10260.4.1.1'];
		var d;
		for (var i in oid) {
			d = crtx.GetExtensionString(oid[i], 0);
			if(d){
				if(oid[i]=='1.2.156.10260.4.1.4'){
					return "????????????";//????????????
				}else if(oid[i]=='1.2.156.10260.4.1.1'){
					return "????????????";//????????????
				}
			}
		}
		return "";
	},
	
    //-------------------------------------------------
	//?????????????????????????????????/?????????
	getUserName: function(crtx) {
		return this.analysisDN(crtx.Subject,"CN");
	},
	
    //-------------------------------------------------
	//????????????ID(??????????????????/????????????) 
	getUserID: function(crtx) {		
		//????????????:1.2.156.10260.4.1.4  ??????:1.2.156.10260.4.1.1
		var oid = ['1.2.156.10260.4.1.4', '1.2.156.10260.4.1.1'];
		var d;
		for (var i in oid) {
			d = crtx.GetExtensionString(oid[i], 0);
			if(d){
				if(oid[i]=='1.2.156.10260.4.1.4'){
					return this.hexToString(d,2);
				}else if(oid[i]=='1.2.156.10260.4.1.1'){
					
					if(crtx.Issuer.indexOf("CN=GZCA",0)>=0){
						return this.hexToString(d,4);
					}else if(crtx.Issuer.indexOf("CN=HNCA",0)>=0){
						return this.hexToString(d,6);
					}
				}
			}
		}
	},
	
    //-------------------------------------------------
	//??????????????????
	getIdCode: function(crtx) {		
		//??????:1.2.156.10260.4.1.1
		var oid = '1.2.156.10260.4.1.1';
		var d = crtx.GetExtensionString(oid, 0);
		if(d){
			if(crtx.Issuer.indexOf("CN=GZCA",0)>=0){
				return this.hexToString(d,4);
			}else if(crtx.Issuer.indexOf("CN=HNCA",0)>=0 || crtx.Issuer.indexOf("CN=SZCA SM2 CA",0)){
				return this.hexToString(d,6);
			}
		}
		return "";
	},	
    //-------------------------------------------------
	//?????????????????????????????? 
	getOrgCode: function(crtx) {		
		//????????????:1.2.156.10260.4.1.4
		var oid = '1.2.156.10260.4.1.4';
		var d = crtx.GetExtensionString(oid, 0);
		if(d){
			return this.hexToString(d,2);
		}
		return "";
	},
	
    //-------------------------------------------------
	//?????????????????????
	getTrustNO: function(crtx) {
		if(crtx.Issuer.indexOf("CN=GZCA",0)>=0){
            var d = crtx.GetExtensionString('1.2.86.21.1.3', 0);
			if(d){
    		    return this.hexToString(d,2);
			}
        }
        return "";
	},
    /*-------------------------------------------------
	????????????????????????DN?????????????????????????????????DN??????????????????????????????????????????????????????????????????
	?????????DN ?????????DN???????????????DNname ????????????????????????CN???O???L??????
	?????????????????????????????????????????????
    */
	analysisDN: function(DN,DNname){
        var dnarr=DN.split(",");
        var dnvalue="";
        DNname+="=";
        
        for (var i=0;i<dnarr.length;i++){
            if(dnarr[i].indexOf(DNname)>=0){
                //?????????????????????
                dnarr[i]=dnarr[i].replace(/(^\s*)|(\s*$)/g,"");
                dnvalue=dnarr[i].substring(DNname.length,dnarr[i].length);
                return dnvalue;
            }
        }
    },
    
    /*-------------------------------------------------
	??????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????????
	????????????????????????
	?????????????????????????????????????????????
    */
	hexToString: function(pStr,pType) {
        var arr = (""+pStr).split(" "); 
        var str="";
        for (var j = pType; j < arr.length; j++){
            str+=String.fromCharCode(parseInt(arr[j].toUpperCase(),16));
        }
        return str;
    },

    /*-------------------------------------------------
	?????????
    */
	getGZCAErr: function() {
	    var ms="?????????????????????????????????????????????????????????";
	    ms+="\n1???????????????USBKEY???????????????USB???;";
	    ms+="\n2?????????????????????????????????????????????????????????;";
	    ms+="\n3?????????????????????????????????;";
	    ms+="\n4?????????USB????????????????????????USB???;";
	    ms+="\n5??????????????????????????????????????????????????????";
	    ms+="\n\n??????????????????????????????????????????????????????????????????";
        return ms;
    },
	
	/*-------------------------------------------------
	???????????????				Zjq
	iStr???	???????????????
	*/
	 Trim: function(iStr) {
		return iStr.replace(/(^\s+)|(\s+$)/g, "");
	}
	/*<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
	 *???????????????GZCA???????????????
	 *<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
});
