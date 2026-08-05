//#region node_modules/@lit/reactive-element/css-tag.js
var e = globalThis, t = e.ShadowRoot && (e.ShadyCSS === void 0 || e.ShadyCSS.nativeShadow) && "adoptedStyleSheets" in Document.prototype && "replace" in CSSStyleSheet.prototype, n = Symbol(), r = /* @__PURE__ */ new WeakMap(), i = class {
	constructor(e, t, r) {
		if (this._$cssResult$ = !0, r !== n) throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");
		this.cssText = e, this.t = t;
	}
	get styleSheet() {
		let e = this.o, n = this.t;
		if (t && e === void 0) {
			let t = n !== void 0 && n.length === 1;
			t && (e = r.get(n)), e === void 0 && ((this.o = e = new CSSStyleSheet()).replaceSync(this.cssText), t && r.set(n, e));
		}
		return e;
	}
	toString() {
		return this.cssText;
	}
}, a = (e) => new i(typeof e == "string" ? e : e + "", void 0, n), o = (e, ...t) => new i(e.length === 1 ? e[0] : t.reduce((t, n, r) => t + ((e) => {
	if (!0 === e._$cssResult$) return e.cssText;
	if (typeof e == "number") return e;
	throw Error("Value passed to 'css' function must be a 'css' function result: " + e + ". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.");
})(n) + e[r + 1], e[0]), e, n), s = (n, r) => {
	if (t) n.adoptedStyleSheets = r.map((e) => e instanceof CSSStyleSheet ? e : e.styleSheet);
	else for (let t of r) {
		let r = document.createElement("style"), i = e.litNonce;
		i !== void 0 && r.setAttribute("nonce", i), r.textContent = t.cssText, n.appendChild(r);
	}
}, c = t ? (e) => e : (e) => e instanceof CSSStyleSheet ? ((e) => {
	let t = "";
	for (let n of e.cssRules) t += n.cssText;
	return a(t);
})(e) : e, { is: l, defineProperty: u, getOwnPropertyDescriptor: d, getOwnPropertyNames: f, getOwnPropertySymbols: p, getPrototypeOf: m } = Object, h = globalThis, g = h.trustedTypes, _ = g ? g.emptyScript : "", v = h.reactiveElementPolyfillSupport, y = (e, t) => e, b = {
	toAttribute(e, t) {
		switch (t) {
			case Boolean:
				e = e ? _ : null;
				break;
			case Object:
			case Array: e = e == null ? e : JSON.stringify(e);
		}
		return e;
	},
	fromAttribute(e, t) {
		let n = e;
		switch (t) {
			case Boolean:
				n = e !== null;
				break;
			case Number:
				n = e === null ? null : Number(e);
				break;
			case Object:
			case Array: try {
				n = JSON.parse(e);
			} catch {
				n = null;
			}
		}
		return n;
	}
}, x = (e, t) => !l(e, t), S = {
	attribute: !0,
	type: String,
	converter: b,
	reflect: !1,
	useDefault: !1,
	hasChanged: x
};
Symbol.metadata ??= Symbol("metadata"), h.litPropertyMetadata ??= /* @__PURE__ */ new WeakMap();
var C = class extends HTMLElement {
	static addInitializer(e) {
		this._$Ei(), (this.l ??= []).push(e);
	}
	static get observedAttributes() {
		return this.finalize(), this._$Eh && [...this._$Eh.keys()];
	}
	static createProperty(e, t = S) {
		if (t.state && (t.attribute = !1), this._$Ei(), this.prototype.hasOwnProperty(e) && ((t = Object.create(t)).wrapped = !0), this.elementProperties.set(e, t), !t.noAccessor) {
			let n = Symbol(), r = this.getPropertyDescriptor(e, n, t);
			r !== void 0 && u(this.prototype, e, r);
		}
	}
	static getPropertyDescriptor(e, t, n) {
		let { get: r, set: i } = d(this.prototype, e) ?? {
			get() {
				return this[t];
			},
			set(e) {
				this[t] = e;
			}
		};
		return {
			get: r,
			set(t) {
				let a = r?.call(this);
				i?.call(this, t), this.requestUpdate(e, a, n);
			},
			configurable: !0,
			enumerable: !0
		};
	}
	static getPropertyOptions(e) {
		return this.elementProperties.get(e) ?? S;
	}
	static _$Ei() {
		if (this.hasOwnProperty(y("elementProperties"))) return;
		let e = m(this);
		e.finalize(), e.l !== void 0 && (this.l = [...e.l]), this.elementProperties = new Map(e.elementProperties);
	}
	static finalize() {
		if (this.hasOwnProperty(y("finalized"))) return;
		if (this.finalized = !0, this._$Ei(), this.hasOwnProperty(y("properties"))) {
			let e = this.properties, t = [...f(e), ...p(e)];
			for (let n of t) this.createProperty(n, e[n]);
		}
		let e = this[Symbol.metadata];
		if (e !== null) {
			let t = litPropertyMetadata.get(e);
			if (t !== void 0) for (let [e, n] of t) this.elementProperties.set(e, n);
		}
		this._$Eh = /* @__PURE__ */ new Map();
		for (let [e, t] of this.elementProperties) {
			let n = this._$Eu(e, t);
			n !== void 0 && this._$Eh.set(n, e);
		}
		this.elementStyles = this.finalizeStyles(this.styles);
	}
	static finalizeStyles(e) {
		let t = [];
		if (Array.isArray(e)) {
			let n = new Set(e.flat(1 / 0).reverse());
			for (let e of n) t.unshift(c(e));
		} else e !== void 0 && t.push(c(e));
		return t;
	}
	static _$Eu(e, t) {
		let n = t.attribute;
		return !1 === n ? void 0 : typeof n == "string" ? n : typeof e == "string" ? e.toLowerCase() : void 0;
	}
	constructor() {
		super(), this._$Ep = void 0, this.isUpdatePending = !1, this.hasUpdated = !1, this._$Em = null, this._$Ev();
	}
	_$Ev() {
		this._$ES = new Promise((e) => this.enableUpdating = e), this._$AL = /* @__PURE__ */ new Map(), this._$E_(), this.requestUpdate(), this.constructor.l?.forEach((e) => e(this));
	}
	addController(e) {
		(this._$EO ??= /* @__PURE__ */ new Set()).add(e), this.renderRoot !== void 0 && this.isConnected && e.hostConnected?.();
	}
	removeController(e) {
		this._$EO?.delete(e);
	}
	_$E_() {
		let e = /* @__PURE__ */ new Map(), t = this.constructor.elementProperties;
		for (let n of t.keys()) this.hasOwnProperty(n) && (e.set(n, this[n]), delete this[n]);
		e.size > 0 && (this._$Ep = e);
	}
	createRenderRoot() {
		let e = this.shadowRoot ?? this.attachShadow(this.constructor.shadowRootOptions);
		return s(e, this.constructor.elementStyles), e;
	}
	connectedCallback() {
		this.renderRoot ??= this.createRenderRoot(), this.enableUpdating(!0), this._$EO?.forEach((e) => e.hostConnected?.());
	}
	enableUpdating(e) {}
	disconnectedCallback() {
		this._$EO?.forEach((e) => e.hostDisconnected?.());
	}
	attributeChangedCallback(e, t, n) {
		this._$AK(e, n);
	}
	_$ET(e, t) {
		let n = this.constructor.elementProperties.get(e), r = this.constructor._$Eu(e, n);
		if (r !== void 0 && !0 === n.reflect) {
			let i = (n.converter?.toAttribute === void 0 ? b : n.converter).toAttribute(t, n.type);
			this._$Em = e, i == null ? this.removeAttribute(r) : this.setAttribute(r, i), this._$Em = null;
		}
	}
	_$AK(e, t) {
		let n = this.constructor, r = n._$Eh.get(e);
		if (r !== void 0 && this._$Em !== r) {
			let e = n.getPropertyOptions(r), i = typeof e.converter == "function" ? { fromAttribute: e.converter } : e.converter?.fromAttribute === void 0 ? b : e.converter;
			this._$Em = r;
			let a = i.fromAttribute(t, e.type);
			this[r] = a ?? this._$Ej?.get(r) ?? a, this._$Em = null;
		}
	}
	requestUpdate(e, t, n, r = !1, i) {
		if (e !== void 0) {
			let a = this.constructor;
			if (!1 === r && (i = this[e]), n ??= a.getPropertyOptions(e), !((n.hasChanged ?? x)(i, t) || n.useDefault && n.reflect && i === this._$Ej?.get(e) && !this.hasAttribute(a._$Eu(e, n)))) return;
			this.C(e, t, n);
		}
		!1 === this.isUpdatePending && (this._$ES = this._$EP());
	}
	C(e, t, { useDefault: n, reflect: r, wrapped: i }, a) {
		n && !(this._$Ej ??= /* @__PURE__ */ new Map()).has(e) && (this._$Ej.set(e, a ?? t ?? this[e]), !0 !== i || a !== void 0) || (this._$AL.has(e) || (this.hasUpdated || n || (t = void 0), this._$AL.set(e, t)), !0 === r && this._$Em !== e && (this._$Eq ??= /* @__PURE__ */ new Set()).add(e));
	}
	async _$EP() {
		this.isUpdatePending = !0;
		try {
			await this._$ES;
		} catch (e) {
			Promise.reject(e);
		}
		let e = this.scheduleUpdate();
		return e != null && await e, !this.isUpdatePending;
	}
	scheduleUpdate() {
		return this.performUpdate();
	}
	performUpdate() {
		if (!this.isUpdatePending) return;
		if (!this.hasUpdated) {
			if (this.renderRoot ??= this.createRenderRoot(), this._$Ep) {
				for (let [e, t] of this._$Ep) this[e] = t;
				this._$Ep = void 0;
			}
			let e = this.constructor.elementProperties;
			if (e.size > 0) for (let [t, n] of e) {
				let { wrapped: e } = n, r = this[t];
				!0 !== e || this._$AL.has(t) || r === void 0 || this.C(t, void 0, n, r);
			}
		}
		let e = !1, t = this._$AL;
		try {
			e = this.shouldUpdate(t), e ? (this.willUpdate(t), this._$EO?.forEach((e) => e.hostUpdate?.()), this.update(t)) : this._$EM();
		} catch (t) {
			throw e = !1, this._$EM(), t;
		}
		e && this._$AE(t);
	}
	willUpdate(e) {}
	_$AE(e) {
		this._$EO?.forEach((e) => e.hostUpdated?.()), this.hasUpdated || (this.hasUpdated = !0, this.firstUpdated(e)), this.updated(e);
	}
	_$EM() {
		this._$AL = /* @__PURE__ */ new Map(), this.isUpdatePending = !1;
	}
	get updateComplete() {
		return this.getUpdateComplete();
	}
	getUpdateComplete() {
		return this._$ES;
	}
	shouldUpdate(e) {
		return !0;
	}
	update(e) {
		this._$Eq &&= this._$Eq.forEach((e) => this._$ET(e, this[e])), this._$EM();
	}
	updated(e) {}
	firstUpdated(e) {}
};
C.elementStyles = [], C.shadowRootOptions = { mode: "open" }, C[y("elementProperties")] = /* @__PURE__ */ new Map(), C[y("finalized")] = /* @__PURE__ */ new Map(), v?.({ ReactiveElement: C }), (h.reactiveElementVersions ??= []).push("2.1.2");
//#endregion
//#region node_modules/lit-html/lit-html.js
var w = globalThis, T = (e) => e, E = w.trustedTypes, D = E ? E.createPolicy("lit-html", { createHTML: (e) => e }) : void 0, O = "$lit$", k = `lit$${Math.random().toFixed(9).slice(2)}$`, A = "?" + k, j = `<${A}>`, M = document, N = () => M.createComment(""), P = (e) => e === null || typeof e != "object" && typeof e != "function", ee = Array.isArray, te = (e) => ee(e) || typeof e?.[Symbol.iterator] == "function", ne = "[ 	\n\f\r]", re = /<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g, ie = /-->/g, F = />/g, I = RegExp(`>|${ne}(?:([^\\s"'>=/]+)(${ne}*=${ne}*(?:[^ \t\n\f\r"'\`<>=]|("|')|))|$)`, "g"), L = /'/g, ae = /"/g, oe = /^(?:script|style|textarea|title)$/i, R = ((e) => (t, ...n) => ({
	_$litType$: e,
	strings: t,
	values: n
}))(1), z = Symbol.for("lit-noChange"), B = Symbol.for("lit-nothing"), V = /* @__PURE__ */ new WeakMap(), H = M.createTreeWalker(M, 129);
function se(e, t) {
	if (!ee(e) || !e.hasOwnProperty("raw")) throw Error("invalid template strings array");
	return D === void 0 ? t : D.createHTML(t);
}
var ce = (e, t) => {
	let n = e.length - 1, r = [], i, a = t === 2 ? "<svg>" : t === 3 ? "<math>" : "", o = re;
	for (let t = 0; t < n; t++) {
		let n = e[t], s, c, l = -1, u = 0;
		for (; u < n.length && (o.lastIndex = u, c = o.exec(n), c !== null);) u = o.lastIndex, o === re ? c[1] === "!--" ? o = ie : c[1] === void 0 ? c[2] === void 0 ? c[3] !== void 0 && (o = I) : (oe.test(c[2]) && (i = RegExp("</" + c[2], "g")), o = I) : o = F : o === I ? c[0] === ">" ? (o = i ?? re, l = -1) : c[1] === void 0 ? l = -2 : (l = o.lastIndex - c[2].length, s = c[1], o = c[3] === void 0 ? I : c[3] === "\"" ? ae : L) : o === ae || o === L ? o = I : o === ie || o === F ? o = re : (o = I, i = void 0);
		let d = o === I && e[t + 1].startsWith("/>") ? " " : "";
		a += o === re ? n + j : l >= 0 ? (r.push(s), n.slice(0, l) + O + n.slice(l) + k + d) : n + k + (l === -2 ? t : d);
	}
	return [se(e, a + (e[n] || "<?>") + (t === 2 ? "</svg>" : t === 3 ? "</math>" : "")), r];
}, le = class e {
	constructor({ strings: t, _$litType$: n }, r) {
		let i;
		this.parts = [];
		let a = 0, o = 0, s = t.length - 1, c = this.parts, [l, u] = ce(t, n);
		if (this.el = e.createElement(l, r), H.currentNode = this.el.content, n === 2 || n === 3) {
			let e = this.el.content.firstChild;
			e.replaceWith(...e.childNodes);
		}
		for (; (i = H.nextNode()) !== null && c.length < s;) {
			if (i.nodeType === 1) {
				if (i.hasAttributes()) for (let e of i.getAttributeNames()) if (e.endsWith(O)) {
					let t = u[o++], n = i.getAttribute(e).split(k), r = /([.?@])?(.*)/.exec(t);
					c.push({
						type: 1,
						index: a,
						name: r[2],
						strings: n,
						ctor: r[1] === "." ? pe : r[1] === "?" ? me : r[1] === "@" ? he : fe
					}), i.removeAttribute(e);
				} else e.startsWith(k) && (c.push({
					type: 6,
					index: a
				}), i.removeAttribute(e));
				if (oe.test(i.tagName)) {
					let e = i.textContent.split(k), t = e.length - 1;
					if (t > 0) {
						i.textContent = E ? E.emptyScript : "";
						for (let n = 0; n < t; n++) i.append(e[n], N()), H.nextNode(), c.push({
							type: 2,
							index: ++a
						});
						i.append(e[t], N());
					}
				}
			} else if (i.nodeType === 8) {
				if (i.data === A) c.push({
					type: 2,
					index: a
				});
				else {
					let e = -1;
					for (; (e = i.data.indexOf(k, e + 1)) !== -1;) c.push({
						type: 7,
						index: a
					}), e += k.length - 1;
				}
			}
			a++;
		}
	}
	static createElement(e, t) {
		let n = M.createElement("template");
		return n.innerHTML = e, n;
	}
};
function U(e, t, n = e, r) {
	if (t === z) return t;
	let i = r === void 0 ? n._$Cl : n._$Co?.[r], a = P(t) ? void 0 : t._$litDirective$;
	return i?.constructor !== a && (i?._$AO?.(!1), a === void 0 ? i = void 0 : (i = new a(e), i._$AT(e, n, r)), r === void 0 ? n._$Cl = i : (n._$Co ??= [])[r] = i), i !== void 0 && (t = U(e, i._$AS(e, t.values), i, r)), t;
}
var ue = class {
	constructor(e, t) {
		this._$AV = [], this._$AN = void 0, this._$AD = e, this._$AM = t;
	}
	get parentNode() {
		return this._$AM.parentNode;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	u(e) {
		let { el: { content: t }, parts: n } = this._$AD, r = (e?.creationScope ?? M).importNode(t, !0);
		H.currentNode = r;
		let i = H.nextNode(), a = 0, o = 0, s = n[0];
		for (; s !== void 0;) {
			if (a === s.index) {
				let t;
				s.type === 2 ? t = new de(i, i.nextSibling, this, e) : s.type === 1 ? t = new s.ctor(i, s.name, s.strings, this, e) : s.type === 6 && (t = new ge(i, this, e)), this._$AV.push(t), s = n[++o];
			}
			a !== s?.index && (i = H.nextNode(), a++);
		}
		return H.currentNode = M, r;
	}
	p(e) {
		let t = 0;
		for (let n of this._$AV) n !== void 0 && (n.strings === void 0 ? n._$AI(e[t]) : (n._$AI(e, n, t), t += n.strings.length - 2)), t++;
	}
}, de = class e {
	get _$AU() {
		return this._$AM?._$AU ?? this._$Cv;
	}
	constructor(e, t, n, r) {
		this.type = 2, this._$AH = B, this._$AN = void 0, this._$AA = e, this._$AB = t, this._$AM = n, this.options = r, this._$Cv = r?.isConnected ?? !0;
	}
	get parentNode() {
		let e = this._$AA.parentNode, t = this._$AM;
		return t !== void 0 && e?.nodeType === 11 && (e = t.parentNode), e;
	}
	get startNode() {
		return this._$AA;
	}
	get endNode() {
		return this._$AB;
	}
	_$AI(e, t = this) {
		e = U(this, e, t), P(e) ? e === B || e == null || e === "" ? (this._$AH !== B && this._$AR(), this._$AH = B) : e !== this._$AH && e !== z && this._(e) : e._$litType$ === void 0 ? e.nodeType === void 0 ? te(e) ? this.k(e) : this._(e) : this.T(e) : this.$(e);
	}
	O(e) {
		return this._$AA.parentNode.insertBefore(e, this._$AB);
	}
	T(e) {
		this._$AH !== e && (this._$AR(), this._$AH = this.O(e));
	}
	_(e) {
		this._$AH !== B && P(this._$AH) ? this._$AA.nextSibling.data = e : this.T(M.createTextNode(e)), this._$AH = e;
	}
	$(e) {
		let { values: t, _$litType$: n } = e, r = typeof n == "number" ? this._$AC(e) : (n.el === void 0 && (n.el = le.createElement(se(n.h, n.h[0]), this.options)), n);
		if (this._$AH?._$AD === r) this._$AH.p(t);
		else {
			let e = new ue(r, this), n = e.u(this.options);
			e.p(t), this.T(n), this._$AH = e;
		}
	}
	_$AC(e) {
		let t = V.get(e.strings);
		return t === void 0 && V.set(e.strings, t = new le(e)), t;
	}
	k(t) {
		ee(this._$AH) || (this._$AH = [], this._$AR());
		let n = this._$AH, r, i = 0;
		for (let a of t) i === n.length ? n.push(r = new e(this.O(N()), this.O(N()), this, this.options)) : r = n[i], r._$AI(a), i++;
		i < n.length && (this._$AR(r && r._$AB.nextSibling, i), n.length = i);
	}
	_$AR(e = this._$AA.nextSibling, t) {
		for (this._$AP?.(!1, !0, t); e !== this._$AB;) {
			let t = T(e).nextSibling;
			T(e).remove(), e = t;
		}
	}
	setConnected(e) {
		this._$AM === void 0 && (this._$Cv = e, this._$AP?.(e));
	}
}, fe = class {
	get tagName() {
		return this.element.tagName;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	constructor(e, t, n, r, i) {
		this.type = 1, this._$AH = B, this._$AN = void 0, this.element = e, this.name = t, this._$AM = r, this.options = i, n.length > 2 || n[0] !== "" || n[1] !== "" ? (this._$AH = Array(n.length - 1).fill(/* @__PURE__ */ new String()), this.strings = n) : this._$AH = B;
	}
	_$AI(e, t = this, n, r) {
		let i = this.strings, a = !1;
		if (i === void 0) e = U(this, e, t, 0), a = !P(e) || e !== this._$AH && e !== z, a && (this._$AH = e);
		else {
			let r = e, o, s;
			for (e = i[0], o = 0; o < i.length - 1; o++) s = U(this, r[n + o], t, o), s === z && (s = this._$AH[o]), a ||= !P(s) || s !== this._$AH[o], s === B ? e = B : e !== B && (e += (s ?? "") + i[o + 1]), this._$AH[o] = s;
		}
		a && !r && this.j(e);
	}
	j(e) {
		e === B ? this.element.removeAttribute(this.name) : this.element.setAttribute(this.name, e ?? "");
	}
}, pe = class extends fe {
	constructor() {
		super(...arguments), this.type = 3;
	}
	j(e) {
		this.element[this.name] = e === B ? void 0 : e;
	}
}, me = class extends fe {
	constructor() {
		super(...arguments), this.type = 4;
	}
	j(e) {
		this.element.toggleAttribute(this.name, !!e && e !== B);
	}
}, he = class extends fe {
	constructor(e, t, n, r, i) {
		super(e, t, n, r, i), this.type = 5;
	}
	_$AI(e, t = this) {
		if ((e = U(this, e, t, 0) ?? B) === z) return;
		let n = this._$AH, r = e === B && n !== B || e.capture !== n.capture || e.once !== n.once || e.passive !== n.passive, i = e !== B && (n === B || r);
		r && this.element.removeEventListener(this.name, this, n), i && this.element.addEventListener(this.name, this, e), this._$AH = e;
	}
	handleEvent(e) {
		typeof this._$AH == "function" ? this._$AH.call(this.options?.host ?? this.element, e) : this._$AH.handleEvent(e);
	}
}, ge = class {
	constructor(e, t, n) {
		this.element = e, this.type = 6, this._$AN = void 0, this._$AM = t, this.options = n;
	}
	get _$AU() {
		return this._$AM._$AU;
	}
	_$AI(e) {
		U(this, e);
	}
}, _e = w.litHtmlPolyfillSupport;
_e?.(le, de), (w.litHtmlVersions ??= []).push("3.3.2");
var ve = (e, t, n) => {
	let r = n?.renderBefore ?? t, i = r._$litPart$;
	if (i === void 0) {
		let e = n?.renderBefore ?? null;
		r._$litPart$ = i = new de(t.insertBefore(N(), e), e, void 0, n ?? {});
	}
	return i._$AI(e), i;
}, ye = globalThis, be = class extends C {
	constructor() {
		super(...arguments), this.renderOptions = { host: this }, this._$Do = void 0;
	}
	createRenderRoot() {
		let e = super.createRenderRoot();
		return this.renderOptions.renderBefore ??= e.firstChild, e;
	}
	update(e) {
		let t = this.render();
		this.hasUpdated || (this.renderOptions.isConnected = this.isConnected), super.update(e), this._$Do = ve(t, this.renderRoot, this.renderOptions);
	}
	connectedCallback() {
		super.connectedCallback(), this._$Do?.setConnected(!0);
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._$Do?.setConnected(!1);
	}
	render() {
		return z;
	}
};
be._$litElement$ = !0, be.finalized = !0, ye.litElementHydrateSupport?.({ LitElement: be });
var xe = ye.litElementPolyfillSupport;
xe?.({ LitElement: be }), (ye.litElementVersions ??= []).push("4.2.2");
//#endregion
//#region src/const.ts
var Se = "price-graph-card", Ce = "price-graph-card-editor", we = "#1AC5AA", Te = "#FE8730", Ee = Object.freeze([
	{
		key: "color_cheap",
		label: "editor_color_cheap",
		fallback: "#cddc39"
	},
	{
		key: "color_normal",
		label: "editor_color_normal",
		fallback: "#ff9800"
	},
	{
		key: "color_expensive",
		label: "editor_color_expensive",
		fallback: "#f44336"
	},
	{
		key: "color_very_expensive",
		label: "editor_color_very_expensive",
		fallback: "#b71c1c"
	}
]), De = Object.freeze([
	"EUR",
	"CHF",
	"GBP",
	"NOK",
	"SEK",
	"DKK",
	"ISK",
	"PLN",
	"CZK",
	"HUF",
	"RON",
	"USD",
	"CAD",
	"MXN"
]), Oe = new Set(De), ke = Object.freeze([
	"attribute",
	"entity",
	"price_level",
	"next_price_level",
	"current_price",
	"price_range",
	"avg_price"
]), Ae = Object.freeze(["title", ...ke]), je = Object.freeze(["per_kwh", "value_only"]), Me = Object.freeze(["below_avg", "above_avg"]), Ne = Object.freeze([
	"cheap",
	"normal",
	"expensive",
	"very_expensive"
]), Pe = Object.freeze([
	[.08, .01],
	[.16, .02],
	[.3, .05],
	[.8, .1],
	[1.6, .2],
	[3.5, .5],
	[8, 1],
	[16, 2],
	[35, 5],
	[80, 10]
]), Fe = "M19.14,12.94C19.18,12.64 19.2,12.33 19.2,12C19.2,11.68 19.18,11.36 19.13,11.06L21.19,9.45C21.37,9.31 21.42,9.05 21.3,8.84L19.3,5.38C19.18,5.16 18.92,5.08 18.69,5.16L16.26,6.14C15.76,5.76 15.23,5.45 14.62,5.22L14.25,2.64C14.21,2.4 14,2.22 13.75,2.22H10.25C10,2.22 9.79,2.4 9.76,2.64L9.38,5.22C8.77,5.45 8.24,5.76 7.74,6.14L5.31,5.16C5.08,5.08 4.82,5.16 4.7,5.38L2.7,8.84C2.57,9.05 2.63,9.31 2.81,9.45L4.86,11.06C4.82,11.36 4.8,11.69 4.8,12C4.8,12.31 4.82,12.64 4.87,12.94L2.81,14.55C2.63,14.69 2.57,14.95 2.7,15.16L4.7,18.62C4.82,18.84 5.08,18.92 5.31,18.84L7.74,17.86C8.24,18.24 8.77,18.55 9.38,18.78L9.76,21.36C9.79,21.6 10,21.78 10.25,21.78H13.75C14,21.78 14.21,21.6 14.24,21.36L14.62,18.78C15.23,18.55 15.76,18.24 16.26,17.86L18.69,18.84C18.92,18.92 19.18,18.84 19.3,18.62L21.3,15.16C21.42,14.95 21.37,14.69 21.19,14.55L19.14,12.94M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5Z", Ie = Object.freeze({
	entity: "editor_entity",
	view_mode: "editor_view_mode",
	decimals: "editor_decimals",
	height: "editor_height",
	show_now_line: "editor_show_now_line",
	show_hover_line: "editor_show_hover_line",
	unit_format: "editor_unit_format",
	currency_override: "editor_currency",
	currency_custom: "editor_currency_custom",
	minor_label: "editor_minor_label",
	unit_factor: "editor_unit_factor",
	use_fixed_expensive: "editor_use_fixed_expensive",
	fixed_expensive_value: "editor_fixed_expensive_value",
	show_currency_override: "editor_show_currency_override",
	show_day_buttons: "editor_show_day_buttons",
	day_view_default: "editor_day_view_default",
	two_day_mode: "editor_two_day_mode",
	content_items: "editor_content_items",
	content_items_position: "editor_content_items_position",
	content_items_max_cols: "editor_content_items_max_cols",
	unit_display_mode: "editor_unit_display_mode",
	tap_action: "editor_tap_action",
	hold_action: "editor_hold_action",
	double_tap_action: "editor_double_tap_action",
	tap_action_target: "editor_action_target",
	hold_action_target: "editor_action_target",
	double_tap_action_target: "editor_action_target",
	tap_action_entity: "editor_action_entity",
	hold_action_entity: "editor_action_entity",
	double_tap_action_entity: "editor_action_entity",
	debug: "editor_debug",
	color_cheap: "editor_color_cheap",
	color_normal: "editor_color_normal",
	color_expensive: "editor_color_expensive",
	color_very_expensive: "editor_color_very_expensive"
}), Le = /* @__PURE__ */ new Set([
	"tomorrow",
	"two_days",
	"selected"
]);
function Re() {
	return {
		label: "",
		source: "attribute",
		entity: "",
		attribute: "",
		show_unit: !1,
		unit_display_mode: "per_kwh",
		use_color: !1,
		price_level: "",
		range_day: "today",
		actions: ze()
	};
}
function ze() {
	return {
		enabled: !1,
		tap_action: { action: "more-info" },
		hold_action: { action: "none" },
		double_tap_action: { action: "none" },
		use_target_entity: !1,
		target_entity: ""
	};
}
function Be(e = "title", t = "") {
	return {
		label: t,
		source: e,
		entity: "",
		attribute: "",
		show_unit: !1,
		unit_display_mode: "per_kwh",
		use_color: !1,
		price_level: "",
		time_overwrite: !1,
		range_day: "today"
	};
}
var Ve = {
	type: `custom:${Se}`,
	title_item_left: Be("title", ""),
	title_item_right: Be("attribute", ""),
	entity: "",
	view_mode: "graph",
	decimals: 1,
	show_now_line: !0,
	color_cheap: "#4CAF50",
	color_normal: "#CDDC39",
	color_expensive: "#FF9800",
	color_very_expensive: "#F44336",
	height: 280,
	debug: !1,
	unit_format: "currency",
	unit_factor: 100,
	currency_override: "auto",
	currency_custom: "",
	minor_label: "",
	show_currency_override: !1,
	show_hover_line: !0,
	detailed_colors: !1,
	use_fixed_p20: !1,
	fixed_p20_value: null,
	use_fixed_avg: !1,
	fixed_avg_value: null,
	use_fixed_expensive: !1,
	fixed_expensive_value: null,
	show_day_buttons: !1,
	day_view_default: "today",
	two_day_mode: "span",
	content_items: [],
	content_items_position: "top",
	content_items_max_cols: 4
};
function He(e) {
	let t = {
		...Ve,
		...e || {}
	};
	return t.view_mode !== "graph" && t.view_mode !== "timeline" && (t.view_mode = "graph"), t.content_items_position !== "bottom" && (t.content_items_position = "top"), t.content_items_max_cols = Number(t.content_items_max_cols) === 3 ? 3 : 4, t;
}
function Ue(e) {
	return Le.has(e) ? e : "today";
}
function We(e) {
	return ke.includes(e) ? e : "attribute";
}
function Ge(e, t = "title") {
	let n = Ae.includes(t) ? t : "attribute";
	return Ae.includes(e) ? e : n;
}
function Ke(e) {
	return je.includes(e) ? e : "per_kwh";
}
function qe(e, t = "none") {
	let n = e && typeof e == "object" ? e : {}, r = typeof n.action == "string" && n.action ? n.action : t;
	return {
		...n,
		action: r
	};
}
function Je(e) {
	return e && typeof e == "object" && e.enabled ? {
		enabled: !0,
		tap_action: qe(e.tap_action, "more-info"),
		hold_action: qe(e.hold_action, "none"),
		double_tap_action: qe(e.double_tap_action, "none"),
		use_target_entity: !!e.use_target_entity || !!String(e.target_entity || "").trim(),
		target_entity: String(e.target_entity || "").trim()
	} : ze();
}
function W(e) {
	let t = [];
	if (!Array.isArray(e)) return t;
	for (let n of e) {
		if (!n || typeof n != "object") continue;
		let e = We(n.source), r = e === "price_range" || e === "avg_price";
		t.push({
			label: String(n.label || "").trim(),
			source: e,
			entity: String(n.entity || "").trim(),
			attribute: String(n.attribute || "").trim(),
			show_unit: n.show_unit === void 0 ? r : !!n.show_unit,
			unit_display_mode: Ke(n.unit_display_mode),
			use_color: !!n.use_color,
			price_level: String(n.price_level || "").trim(),
			range_day: Ue(n.range_day),
			actions: Je(n.actions)
		});
	}
	return t;
}
function G(e, t = "title", n = "") {
	if (!e || typeof e != "object") return Be(t, n);
	let r = Ge(e.source, t), i = r === "price_range" || r === "avg_price";
	return {
		label: String(e.label || n || "").trim(),
		source: r,
		entity: String(e.entity || "").trim(),
		attribute: String(e.attribute || "").trim(),
		show_unit: e.show_unit === void 0 ? i : !!e.show_unit,
		unit_display_mode: Ke(e.unit_display_mode),
		use_color: !!e.use_color,
		price_level: String(e.price_level || "").trim(),
		time_overwrite: !!e.time_overwrite,
		range_day: Ue(e.range_day)
	};
}
function Ye(e, t, n = !1) {
	let { source: r } = e;
	r === "entity" ? (e.entity && (t.entity = e.entity), e.show_unit && (t.show_unit = !0), e.show_unit && e.unit_display_mode !== "per_kwh" && (t.unit_display_mode = e.unit_display_mode)) : r === "attribute" ? (e.attribute && (t.attribute = e.attribute), e.show_unit && (t.show_unit = !0), e.show_unit && e.unit_display_mode !== "per_kwh" && (t.unit_display_mode = e.unit_display_mode)) : r === "current_price" ? (n && e.time_overwrite && (t.time_overwrite = !0), e.show_unit && (t.show_unit = !0), e.show_unit && e.unit_display_mode !== "per_kwh" && (t.unit_display_mode = e.unit_display_mode)) : r === "price_range" || r === "avg_price" ? (e.range_day !== "today" && (t.range_day = e.range_day), e.show_unit || (t.show_unit = !1), e.show_unit && e.unit_display_mode !== "per_kwh" && (t.unit_display_mode = e.unit_display_mode)) : r === "price_level" ? e.use_color && (t.use_color = !0) : r === "next_price_level" && e.price_level && (t.price_level = e.price_level);
}
function Xe(e, t = "title") {
	let n = G(e, t, ""), r = {};
	return n.label && (n.source !== "current_price" || n.time_overwrite) && (r.label = n.label), n.source !== t && (r.source = n.source), Ye(n, r, !0), !Object.keys(r).some((e) => e !== "source") && n.source === t ? null : r;
}
function Ze(e) {
	if (!e || typeof e != "object") return null;
	let t = W([e])[0];
	if (!t) return null;
	let n = {};
	if (t.label && (n.label = t.label), t.source !== "attribute" && (n.source = t.source), Ye(t, n), t.actions?.enabled) {
		let e = { enabled: !0 };
		e.tap_action = t.actions.tap_action || { action: "more-info" }, t.actions.hold_action?.action && t.actions.hold_action.action !== "none" && (e.hold_action = t.actions.hold_action), t.actions.double_tap_action?.action && t.actions.double_tap_action.action !== "none" && (e.double_tap_action = t.actions.double_tap_action), t.actions.use_target_entity && (e.use_target_entity = !0, t.actions.target_entity && (e.target_entity = t.actions.target_entity)), n.actions = e;
	}
	return !Object.keys(n).some((e) => e !== "source") && t.source === "attribute" ? { source: "attribute" } : n;
}
//#endregion
//#region src/i18n.ts
var Qe = Object.freeze({
	de: {
		waiting_ha: "Warte auf Home Assistant…",
		entity_not_found: "Entity nicht gefunden",
		no_data: "Keine Daten für heute gefunden.",
		debug: "Debug",
		points: "Punkte",
		currency: "Währung",
		factor: "Faktor",
		unit_currency: "Währung",
		unit_minor: "Kleinste Einheit",
		unit_factor_hint: "Erkannte Währung: {currency}. Faktor wird nur hier genutzt.",
		editor_entity: "Entity",
		editor_view_mode: "Ansicht-Modus",
		editor_decimals: "Dezimalstellen",
		editor_height: "Höhe",
		editor_show_now_line: "Jetzt-Linie anzeigen",
		editor_show_hover_line: "Hover-Linie anzeigen",
		editor_detailed_colors: "Detaillierte Farben",
		editor_unit_format: "Einheitsformat",
		editor_currency: "Währungsquelle",
		editor_currency_custom: "Benutzerdefinierte Währung",
		editor_minor_label: "Bezeichnung (Kleinste Einheit)",
		editor_unit_factor: "Faktor (Kleinste Einheit)",
		editor_unit_display_mode: "Einheitenanzeige",
		editor_show_currency_override: "Währung überschreiben",
		editor_debug: "Debug-Modus",
		editor_show_day_buttons: "Tagesbuttons anzeigen",
		editor_day_view_default: "Standardansicht",
		editor_two_day_mode: "2‑Tage‑Modus",
		editor_tap_action: "Aktion bei Tippen",
		editor_hold_action: "Aktion bei Halten",
		editor_double_tap_action: "Aktion bei Doppeltippen",
		editor_action_entity: "Aktion-Entität",
		editor_action_target: "Aktionsziel",
		editor_action_other_entity_tap: "Andere Entität für Tippen verwenden",
		editor_action_other_entity_hold: "Andere Entität für Halten verwenden",
		editor_action_other_entity_double: "Andere Entität für Doppeltippen verwenden",
		editor_action_add_target_entity: "Globale Ziel-Entität hinzufügen",
		editor_content_items: "Inhalte",
		editor_content_items_position: "Position der Extra Slots",
		editor_content_items_max_cols: "Max. Kacheln pro Reihe",
		editor_content_extra_details: "Extra Details",
		editor_content_grid_slot: "Info-Slot",
		editor_content_label: "Label",
		editor_content_source: "Quelle",
		editor_content_source_attr: "Attribut (Haupt-Entity)",
		editor_content_source_entity: "Entity-Wert",
		editor_content_source_title: "Titel",
		editor_content_source_price: "Preislevel",
		editor_content_source_next_price_level: "Nächstes Preisniveau",
		editor_content_source_current: "Aktueller Preis",
		editor_content_source_price_range: "Preisspanne",
		editor_content_source_avg_price: "Durchschnittspreis",
		editor_price_range_day: "Tag",
		editor_price_range_day_selected: "Automatisch (aus Ansicht)",
		editor_content_attribute: "Attribut-Schlüssel",
		editor_content_entity: "Entity",
		editor_content_show_unit: "Einheit anzeigen",
		editor_current_price_time_overwrite: "Uhrzeit überschreiben",
		editor_content_use_color: "Farbe des Preislevels",
		editor_next_price_level: "Gesuchtes Preisniveau",
		editor_content_add_slot: "Slot hinzufügen",
		editor_content_remove_slot: "Slot entfernen",
		editor_slot_actions_enabled: "Eigene Interaktionen",
		editor_slot_action_target_entity: "Ziel-Entität",
		editor_slot_action_other_entity: "Andere Ziel-Entität verwenden",
		editor_slot_action_add_target_entity: "Slot-Ziel-Entität hinzufügen",
		editor_header_title_left: "Titel links",
		editor_header_title_right: "Titel rechts",
		content_price_level_label: "Aktuelles Preisniveau",
		content_next_price_level_label: "Nächstes Preisniveau",
		content_current_price_label: "Aktueller Preis",
		content_price_range_label: "Preisspanne",
		content_avg_price_label: "Durchschnittspreis",
		price_range_unavailable: "Noch keine Daten verfügbar",
		header_price_level_default: "Derzeit",
		editor_fixed_p20_value: "Normal ab",
		editor_fixed_avg_value: "Teuer ab",
		editor_fixed_expensive_value: "Sehr teuer ab",
		editor_color_cheap: "Günstig",
		editor_color_normal: "Normal",
		editor_color_expensive: "Teuer",
		editor_color_very_expensive: "Sehr teuer",
		editor_colors_toggle: "Zonenfarben",
		currency_auto: "Auto (Sensor)",
		currency_custom: "Benutzerdefiniert",
		currency_EUR: "Euro",
		currency_CHF: "Schweizer Franken",
		currency_GBP: "Britisches Pfund",
		currency_NOK: "Norwegische Krone",
		currency_SEK: "Schwedische Krone",
		currency_DKK: "Dänische Krone",
		currency_ISK: "Isländische Krone",
		currency_PLN: "Polnischer Złoty",
		currency_CZK: "Tschechische Krone",
		currency_HUF: "Ungarischer Forint",
		currency_RON: "Rumänischer Leu",
		currency_USD: "US-Dollar",
		currency_CAD: "Kanadischer Dollar",
		currency_MXN: "Mexikanischer Peso",
		minor_EUR: "ct",
		minor_CHF: "Rp",
		minor_GBP: "p",
		minor_NOK: "øre",
		minor_SEK: "öre",
		minor_DKK: "øre",
		minor_ISK: "aur",
		minor_PLN: "gr",
		minor_CZK: "h",
		minor_HUF: "f",
		minor_RON: "b",
		minor_USD: "¢",
		minor_CAD: "¢",
		minor_MXN: "¢",
		label_region: "Zone",
		region_cheap: "Günstig",
		region_normal: "Normal",
		region_expensive: "Teuer",
		region_very_expensive: "Sehr teuer",
		region_below_avg: "Unter Durchschnitt",
		region_above_avg: "Über Durchschnitt",
		label_today: "Heute",
		label_tomorrow: "Morgen",
		label_two_days: "2 Tage",
		tomorrow_pending: "Daten von morgen noch nicht verfügbar",
		label_now: "Jetzt",
		next_price_level_tomorrow: "Morgen {time}",
		two_day_mode_span: "Zwei Tage hintereinander",
		two_day_mode_overlay: "Morgen überlagern (Vergleich)",
		panel_content: "Ansicht",
		panel_header: "Kopfbereich",
		panel_units: "Einheiten & Schwellen",
		panel_graph: "Graph Einstellungen",
		panel_actions: "Interaktionen",
		view_mode_graph: "Graph",
		view_mode_timeline: "Timeline",
		content_section_display: "Anzeige",
		content_section_units: "Einheiten",
		content_section_detailed_colors: "Detaillierte Farben",
		content_section_thresholds: "Schwellenwerte",
		panel_extra_slots: "Extra Slots",
		content_items_position_top: "Oben (über Graph/Timeline)",
		content_items_position_bottom: "Unten (unter Tagesbuttons)"
	},
	en: {
		waiting_ha: "Waiting for Home Assistant…",
		entity_not_found: "Entity not found",
		no_data: "No data found for today.",
		debug: "Debug",
		points: "points",
		currency: "currency",
		factor: "factor",
		unit_currency: "Currency",
		unit_minor: "Minor unit",
		unit_factor_hint: "Detected currency: {currency}. Factor is only used here.",
		editor_entity: "Entity",
		editor_view_mode: "View mode",
		editor_decimals: "Decimals",
		editor_height: "Height",
		editor_show_now_line: "Show now line",
		editor_show_hover_line: "Show hover line",
		editor_detailed_colors: "Detailed colors",
		editor_unit_format: "Unit format",
		editor_currency: "Currency source",
		editor_currency_custom: "Custom currency",
		editor_minor_label: "Minor unit label",
		editor_unit_factor: "Minor unit factor",
		editor_unit_display_mode: "Unit display",
		editor_show_currency_override: "Override currency",
		editor_debug: "Debug mode",
		editor_show_day_buttons: "Show day buttons",
		editor_day_view_default: "Default view",
		editor_two_day_mode: "2-day mode",
		editor_tap_action: "Tap action",
		editor_hold_action: "Hold action",
		editor_double_tap_action: "Double tap action",
		editor_action_entity: "Action entity",
		editor_action_target: "Action target",
		editor_action_other_entity_tap: "Use other entity for tap",
		editor_action_other_entity_hold: "Use other entity for hold",
		editor_action_other_entity_double: "Use other entity for double tap",
		editor_action_add_target_entity: "Add global target entity",
		editor_content_items: "Content items",
		editor_content_items_position: "Extra slots position",
		editor_content_items_max_cols: "Max tiles per row",
		editor_content_extra_details: "Extra details",
		editor_content_grid_slot: "Info slot",
		editor_content_label: "Label",
		editor_content_source: "Source",
		editor_content_source_attr: "Attribute (main entity)",
		editor_content_source_entity: "Entity value",
		editor_content_source_title: "Title",
		editor_content_source_price: "Price level",
		editor_content_source_next_price_level: "Next price level",
		editor_content_source_current: "Current price",
		editor_content_source_price_range: "Price range",
		editor_content_source_avg_price: "Average price",
		editor_price_range_day: "Day",
		editor_price_range_day_selected: "Auto (from view)",
		editor_content_attribute: "Attribute key",
		editor_content_entity: "Entity",
		editor_content_show_unit: "Show unit",
		editor_current_price_time_overwrite: "Overwrite time",
		editor_content_use_color: "Use level color",
		editor_next_price_level: "Target price level",
		editor_content_add_slot: "Add slot",
		editor_content_remove_slot: "Remove slot",
		editor_slot_actions_enabled: "Own interactions",
		editor_slot_action_target_entity: "Target entity",
		editor_slot_action_other_entity: "Use other target entity",
		editor_slot_action_add_target_entity: "Add slot target entity",
		editor_header_title_left: "Title left",
		editor_header_title_right: "Title right",
		content_price_level_label: "Current price level",
		content_next_price_level_label: "Next price level",
		content_current_price_label: "Current price",
		content_price_range_label: "Price range",
		content_avg_price_label: "Average price",
		price_range_unavailable: "No data available yet",
		header_price_level_default: "Now",
		editor_fixed_p20_value: "Normal from",
		editor_fixed_avg_value: "Expensive from",
		editor_fixed_expensive_value: "Very expensive from",
		editor_color_cheap: "Cheap",
		editor_color_normal: "Normal",
		editor_color_expensive: "Expensive",
		editor_color_very_expensive: "Very expensive",
		editor_colors_toggle: "Zone colors",
		currency_auto: "Auto (sensor)",
		currency_custom: "Custom",
		currency_EUR: "Euro",
		currency_CHF: "Swiss franc",
		currency_GBP: "Pound sterling",
		currency_NOK: "Norwegian krone",
		currency_SEK: "Swedish krona",
		currency_DKK: "Danish krone",
		currency_ISK: "Icelandic króna",
		currency_PLN: "Polish złoty",
		currency_CZK: "Czech koruna",
		currency_HUF: "Hungarian forint",
		currency_RON: "Romanian leu",
		currency_USD: "US dollar",
		currency_CAD: "Canadian dollar",
		currency_MXN: "Mexican peso",
		minor_EUR: "ct",
		minor_CHF: "Rp",
		minor_GBP: "p",
		minor_NOK: "øre",
		minor_SEK: "öre",
		minor_DKK: "øre",
		minor_ISK: "aur",
		minor_PLN: "gr",
		minor_CZK: "h",
		minor_HUF: "f",
		minor_RON: "b",
		minor_USD: "¢",
		minor_CAD: "¢",
		minor_MXN: "¢",
		label_region: "Region",
		region_cheap: "Cheap",
		region_normal: "Normal",
		region_expensive: "Expensive",
		region_very_expensive: "Very expensive",
		region_below_avg: "Below average",
		region_above_avg: "Above average",
		label_today: "Today",
		label_tomorrow: "Tomorrow",
		label_two_days: "2 Days",
		tomorrow_pending: "Tomorrow's data will be provided later.",
		label_now: "Now",
		next_price_level_tomorrow: "Tomorrow {time}",
		two_day_mode_span: "Two days in a row",
		two_day_mode_overlay: "Overlay tomorrow (compare)",
		panel_content: "View",
		panel_header: "Header",
		panel_units: "Units & thresholds",
		panel_graph: "Graph settings",
		panel_actions: "Interactions",
		view_mode_graph: "Graph",
		view_mode_timeline: "Timeline",
		content_section_display: "Display",
		content_section_units: "Units",
		content_section_detailed_colors: "Detailed colors",
		content_section_thresholds: "Thresholds",
		panel_extra_slots: "Extra slots",
		content_items_position_top: "Top (above graph/timeline)",
		content_items_position_bottom: "Bottom (below day buttons)"
	}
}), K = /* @__PURE__ */ new Map(), $e = /* @__PURE__ */ new Map();
function et(e) {
	let t = String(e || "en").trim().toLowerCase();
	return t && t.split("-")[0] || "en";
}
async function tt(e) {
	let t = et(e);
	if (K.has(t)) return K.get(t);
	if ($e.has(t)) return $e.get(t);
	let n = (async () => {
		try {
			let e = Qe[t];
			if (!e) {
				if (t !== "en") {
					let e = await tt("en");
					return K.set(t, e || {}), e;
				}
				return K.set(t, {}), K.get(t);
			}
			K.set(t, e && typeof e == "object" ? e : {});
		} catch {
			if (t !== "en") {
				let e = await tt("en");
				return K.set(t, e || {}), e;
			}
			K.set(t, {});
		} finally {
			$e.delete(t);
		}
		return K.get(t);
	})();
	return $e.set(t, n), n;
}
function q(e, t, n = {}) {
	let r = et(t), i = (K.get(r) || {})?.[e] || e;
	if (!n) return i;
	for (let e in n) Object.prototype.hasOwnProperty.call(n, e) && (i = i.replace(`{${e}}`, n[e]));
	return i;
}
function J(e) {
	return et(e?.locale?.language || e?.language || "en");
}
//#endregion
//#region src/format.ts
function Y(e, t = 1) {
	let n = 10 ** t;
	return Math.round(e * n) / n;
}
function nt(e, t) {
	if (e == null || typeof e == "string" && !e.trim()) return "—";
	if (typeof e == "boolean") return String(e);
	if (typeof e == "number" && Number.isFinite(e)) return Y(e, t).toString();
	let n = Number(e);
	return Number.isFinite(n) ? Y(n, t).toString() : String(e);
}
function rt(e) {
	let t = Y(e, 3);
	return Number(t.toFixed(3)).toString();
}
function it(e) {
	return String(e).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
//#endregion
//#region src/time.ts
function at(e) {
	return new Date(e.getFullYear(), e.getMonth(), e.getDate(), 0, 0, 0, 0);
}
function ot(e) {
	return String(e).padStart(2, "0");
}
var st = /* @__PURE__ */ new Map();
function ct(e) {
	let t = e || "UTC", n = st.get(t);
	return n || (n = new Intl.DateTimeFormat("en-GB", {
		timeZone: t,
		year: "numeric",
		month: "2-digit",
		day: "2-digit",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		hour12: !1,
		hourCycle: "h23"
	}), st.set(t, n)), n;
}
function lt(e, t) {
	let n = ct(t).formatToParts(e), r = {};
	for (let e of n) e.type === "year" ? r.year = Number(e.value) : e.type === "month" ? r.month = Number(e.value) : e.type === "day" ? r.day = Number(e.value) : e.type === "hour" ? r.hour = Number(e.value) : e.type === "minute" ? r.minute = Number(e.value) : e.type === "second" && (r.second = Number(e.value));
	return r;
}
function ut(e, t, n, r, i, a, o, s) {
	let c = Date.UTC(e, t - 1, n, r, i, a, 0), l = c;
	for (let e = 0; e < 4; e++) {
		let e = lt(new Date(l), s), t = c - Date.UTC(e.year, e.month - 1, e.day, e.hour, e.minute, e.second, 0);
		if (!t) break;
		l += t;
	}
	return new Date(l + (o || 0));
}
function dt(e, t, n) {
	let r = lt(e, n);
	return ut(r.year, r.month, r.day + t, 0, 0, 0, 0, n);
}
function ft(e, t) {
	return dt(e, 0, t);
}
function pt(e, t, n) {
	let r = lt(e, n), i = lt(t, n);
	return ut(i.year, i.month, i.day, r.hour, r.minute, r.second, e.getMilliseconds(), n);
}
function mt(e, t) {
	let n = lt(e, t);
	return `${ot(n.hour)}:${ot(n.minute)}`;
}
function ht(e = Date.now()) {
	return 6e4 - e % 6e4 + 25;
}
function gt(e) {
	return e?.config?.time_zone || Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
}
//#endregion
//#region src/data.ts
function X(e) {
	if (e == null || typeof e == "string" && !e.trim() || typeof e == "boolean") return null;
	let t = Number(e);
	return Number.isFinite(t) ? t : null;
}
function _t(e, t) {
	return X(e?.[t]);
}
function vt(e) {
	return e.length ? e.reduce((e, t) => e + t, 0) / e.length : null;
}
function yt(e, t) {
	if (!e.length) return null;
	let n = (e.length - 1) * t, r = Math.floor(n), i = n - r;
	return e[r + 1] === void 0 ? e[r] : e[r] + i * (e[r + 1] - e[r]);
}
function bt(e) {
	if (!e || typeof e != "object") return [];
	let t = e.data;
	if (!Array.isArray(t) || !t.length) return [];
	let n = [];
	for (let e of t) {
		if (!e || typeof e != "object") continue;
		let t = new Date(e.start_time), r = X(e.price_per_kwh);
		!Number.isFinite(t.getTime()) || r === null || n.push({
			start: t,
			price: r
		});
	}
	return n.sort((e, t) => e.start.getTime() - t.start.getTime()), n;
}
function Z(e, t = /* @__PURE__ */ new Date(), n = 0, r = "UTC") {
	let i = dt(t, n, r), a = dt(t, n + 1, r);
	return e.filter((e) => e.start >= i && e.start < a);
}
//#endregion
//#region src/graph.ts
function Q(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function xt(e, t = "#ffffff") {
	if (typeof e == "string" && e.trim()) return e.trim();
	if (Array.isArray(e) && e.length >= 3) {
		let t = X(e[0]), n = X(e[1]), r = X(e[2]);
		if (t !== null && n !== null && r !== null) return `rgb(${Q(Math.round(t), 0, 255)}, ${Q(Math.round(n), 0, 255)}, ${Q(Math.round(r), 0, 255)})`;
	}
	if (e && typeof e == "object") {
		let t = X(e.r ?? e.red), n = X(e.g ?? e.green), r = X(e.b ?? e.blue);
		if (t !== null && n !== null && r !== null) return `rgb(${Q(Math.round(t), 0, 255)}, ${Q(Math.round(n), 0, 255)}, ${Q(Math.round(r), 0, 255)})`;
	}
	return t;
}
function St(e, t = "#ffffff") {
	if (!e) return t;
	let n = String(e).trim();
	if (n.startsWith("#") || (n = `#${n}`), /^#([0-9a-f]{3})$/i.test(n)) {
		let e = n.match(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/i);
		if (e) return `#${e[1]}${e[1]}${e[2]}${e[2]}${e[3]}${e[3]}`.toLowerCase();
	}
	return /^#([0-9a-f]{6})$/i.test(n) ? n.toLowerCase() : t;
}
function Ct(e) {
	if (typeof e != "string") return null;
	let t = e.trim().match(/^rgba?\(([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
	return t ? [
		Q(Number(t[1]), 0, 255),
		Q(Number(t[2]), 0, 255),
		Q(Number(t[3]), 0, 255)
	] : null;
}
function wt(e, t) {
	if (!e || !t) return "";
	let n = document.createElement("span");
	n.style.display = "none", n.style.color = t, e.appendChild(n);
	let r = getComputedStyle(n).color || "";
	return n.remove(), r;
}
function Tt(e) {
	if (!e) return "rgba(38, 14, 25, 0.6)";
	let t = getComputedStyle(e), n = t.getPropertyValue("--card-background-color")?.trim() || "";
	n ||= t.backgroundColor || "", (!n || n === "transparent" || n === "rgba(0, 0, 0, 0)") && (n = getComputedStyle(document.documentElement).getPropertyValue("--card-background-color")?.trim() || "");
	let r = Ct(wt(e, n || "#ffffff"));
	if (!r) return "rgba(38, 14, 25, 0.6)";
	let [i, a, o] = r.map((e) => e / 255);
	return .2126 * i + .7152 * a + .0722 * o < .5 ? "rgba(38, 14, 25, 0.6)" : "rgba(235, 238, 241, 0.7)";
}
function Et(e, t = !1) {
	let n = String(e || "");
	return t ? Ne.includes(n) ? n : n === "above_avg" ? "expensive" : "cheap" : Me.includes(n) ? n : n === "expensive" || n === "very_expensive" ? "above_avg" : "below_avg";
}
function Dt(e, t, n = !!t?.detailed) {
	return !t || !Number.isFinite(e) || !Number.isFinite(t.avg) ? "" : n ? t?.fixed !== null && t?.fixed !== void 0 && e >= t.fixed ? "very_expensive" : e <= t.p20 ? "cheap" : e <= t.avg ? "normal" : e <= t.p70 ? "expensive" : "very_expensive" : e <= t.avg ? "below_avg" : "above_avg";
}
function Ot(e, t, n) {
	let r = Dt(t, n, !!e?.detailed_colors);
	if (!e?.detailed_colors) return r === "below_avg" ? we : Te;
	let i = xt(e.color_cheap, "#CDDC39"), a = xt(e.color_normal, "#FF9800"), o = xt(e.color_expensive, "#F44336"), s = xt(e.color_very_expensive, "#B71C1C");
	return r === "cheap" ? i : r === "normal" ? a : r === "expensive" ? o : s;
}
function kt(e, t, n) {
	let r = Dt(e, t);
	return r ? q(`region_${r}`, n) : "";
}
function At(e, t) {
	if (!t) return [];
	if (!t.detailed) return [t.avg].filter((e) => Number.isFinite(e));
	let n = [
		t.p20,
		t.avg,
		t.p70
	];
	return t.fixed !== null && t.fixed !== void 0 && n.push(t.fixed), n.filter((e) => Number.isFinite(e));
}
function jt(e) {
	return (Pe.find(([t]) => e <= t) ?? [null, 20])[1];
}
function Mt(e, t) {
	if (!e.length) return {
		yMin: 0,
		yMax: 10,
		ticks: [
			0,
			2,
			4,
			6,
			8,
			10
		]
	};
	let n = Infinity, r = -Infinity;
	for (let t of e) n = Math.min(n, t.price), r = Math.max(r, t.price);
	let i = r - n;
	i <= 0 && (i = t === "currency" ? .04 : 4);
	let a = jt(i), o = Q(i * .08, a * .5, a * 1), s = n - o, c = r + o;
	c <= s && (c = s + a * 4), s = Math.floor(s / a) * a, c = Math.ceil(c / a) * a;
	let l = [];
	for (let e = s; e <= c + 1e-9; e += a) l.push(e);
	return {
		yMin: s,
		yMax: c,
		ticks: l
	};
}
function Nt(e, t, n, r, i, a = 24, o = null) {
	let { left: s, top: c, innerW: l, innerH: u, yMin: d, yMax: f } = n, p = i || at(/* @__PURE__ */ new Date()), m = new Date(p.getTime() + a * 3600 * 1e3), h = Pt(p, a, s, l), g = Ft(c, u, d, f), _ = [...t].sort((e, t) => e.start - t.start), v = [];
	for (let t = 0; t < _.length; t++) {
		let n = _[t], i = _[t + 1] || {
			start: m,
			price: n.price
		}, a = h(n.start), s = h(i.start), c = g(n.price), l = o ? o(n.price) : Ot(e, n.price, r);
		if (v.push({
			x1: a,
			y1: c,
			x2: s,
			y2: c,
			stroke: l,
			width: 2
		}), t < _.length - 1) {
			let t = g(i.price), a = n.price, u = i.price;
			if (a === u) v.push({
				x1: s,
				y1: c,
				x2: s,
				y2: t,
				stroke: l,
				width: 2
			});
			else {
				let t = Math.min(a, u), n = Math.max(a, u), i = At(e, r).filter((e) => e > t && e < n).sort((e, t) => e - t), c = a < u ? [
					a,
					...i,
					u
				] : [
					a,
					...i.reverse(),
					u
				];
				for (let t = 0; t < c.length - 1; t++) {
					let n = c[t], i = c[t + 1], a = (n + i) / 2, l = o ? o(a) : Ot(e, a, r);
					v.push({
						x1: s,
						y1: g(n),
						x2: s,
						y2: g(i),
						stroke: l,
						width: 2
					});
				}
			}
		}
	}
	return v;
}
function Pt(e, t, n, r) {
	let i = new Date(e.getTime() + t * 3600 * 1e3);
	return (t) => n + (Q(t.getTime(), e.getTime(), i.getTime()) - e.getTime()) / (i.getTime() - e.getTime()) * r;
}
function Ft(e, t, n, r) {
	return (i) => e + (1 - Q((i - n) / (r - n || 1), 0, 1)) * t;
}
function It(e, t, n) {
	for (let r of n) {
		let n = document.createElementNS(t, "line");
		n.setAttribute("stroke-linecap", r.cap || "square"), n.setAttribute("stroke-linejoin", r.join || "miter"), n.setAttribute("x1", r.x1), n.setAttribute("y1", r.y1), n.setAttribute("x2", r.x2), n.setAttribute("y2", r.y2), n.setAttribute("stroke", r.stroke), n.setAttribute("stroke-width", r.width), e.appendChild(n);
	}
}
//#endregion
//#region src/units.ts
function Lt(e, t) {
	let n = String(e || "").trim();
	return n ? t === "value_only" ? n.replace(/\/\s*kwh$/i, "").trim() : n : "";
}
function Rt(e) {
	return String(e || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function zt(e) {
	let t = String(e || "").trim().toUpperCase();
	if (!/^[A-Z]{3}$/.test(t)) return [];
	let n = /* @__PURE__ */ new Set();
	for (let e of ["symbol", "narrowSymbol"]) try {
		let r = new Intl.NumberFormat(void 0, {
			style: "currency",
			currency: t,
			currencyDisplay: e
		}).formatToParts(1).find((e) => e.type === "currency")?.value;
		r && r !== t && n.add(r.trim());
	} catch {}
	return [...n];
}
function Bt(e, t) {
	let n = [
		String(e?.attributes?.unit_of_measurement || "").trim(),
		t,
		String(e?.attributes?.currency || "").trim()
	].filter(Boolean), r = new Set(n);
	for (let e of n) for (let t of zt(e)) r.add(t);
	return [...r].sort((e, t) => t.length - e.length);
}
function Vt(e, t) {
	let n = String(e ?? "").replace(/\u00A0/g, " ").trim();
	for (let e of t) {
		if (!e) continue;
		let t = Rt(e);
		n = n.replace(RegExp(`^\\s*${t}\\s*`, "i"), "").trim(), n = n.replace(RegExp(`\\s*${t}\\s*$`, "i"), "").trim();
	}
	return n;
}
function Ht(e, t) {
	let n = String(e ?? "").replace(/\u00A0/g, " ").trim();
	for (let e of t) {
		if (!e) continue;
		let t = Rt(e), r = n.match(RegExp(`^(.*?)\\s*(${t})\\s*$`, "i"));
		if (r?.[1]?.trim()) return {
			value: r[1].trim(),
			unit: r[2].trim()
		};
		let i = n.match(RegExp(`^(${t})\\s*(.*?)$`, "i"));
		if (i?.[2]?.trim()) return {
			value: i[2].trim(),
			unit: i[1].trim()
		};
	}
	return {
		value: n,
		unit: ""
	};
}
function Ut(e) {
	let t = String(e || "").replace(/\s+/g, "");
	if (!t) return "";
	let n = t.match(/^([A-Z]{3})\/kWh$/i);
	if (n) {
		let e = n[1].toUpperCase();
		if (Oe.has(e)) return e;
	}
	let r = t.toLowerCase(), i = [
		["€/kwh", "EUR"],
		["£/kwh", "GBP"],
		["chf/kwh", "CHF"],
		["zł/kwh", "PLN"],
		["kč/kwh", "CZK"],
		["ft/kwh", "HUF"],
		["lei/kwh", "RON"]
	].find(([e]) => r === e);
	return i ? i[1] : "";
}
function Wt(e) {
	let t = e?.currency && String(e.currency).trim() || "";
	return t ? t.toUpperCase() : Ut(e?.unit_of_measurement);
}
function Gt(e) {
	return Oe.has(e);
}
function Kt(e, t) {
	return e.currency_override && e.currency_override !== "auto" ? e.currency_override === "custom" ? String(e.currency_custom || "").trim().toUpperCase() : String(e.currency_override).trim().toUpperCase() : Wt(t);
}
function qt(e, t) {
	if (e.unit_format !== "minor") return 1;
	if (t && Gt(t)) return 100;
	let n = X(e.unit_factor);
	return n && n > 0 ? n : 100;
}
function Jt(e, t) {
	return !e.length || t === 1 ? {
		points: e,
		scaled: !1,
		factor: t
	} : {
		points: e.map((e) => ({
			...e,
			price: e.price * t
		})),
		scaled: !0,
		factor: t
	};
}
function Yt(e, t, n) {
	if (e.currency_override === "custom") return e.minor_label || q("unit_minor", n);
	if (t && Gt(t)) {
		let e = q(`minor_${t}`, n);
		return e && !e.startsWith("minor_") ? e : "";
	}
	return "";
}
function Xt(e, t, n) {
	let r = Kt(e, t);
	if (e.unit_format === "minor") {
		let t = Yt(e, r, n);
		return t ? `${t}/kWh` : "minor/kWh";
	}
	return r ? `${r}/kWh` : "";
}
//#endregion
//#region src/pricing.ts
function Zt(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function Qt(e, t) {
	let n = Ue(e);
	return n === "selected" ? fn(t) : n;
}
function $t(e, t, n = "today") {
	let r = Qt(e, n);
	return q(r === "tomorrow" ? "label_tomorrow" : r === "two_days" ? "label_two_days" : "label_today", t);
}
function en(e) {
	if (!Array.isArray(e) || e.length < 2) return null;
	let t = null;
	for (let n = 1; n < e.length; n++) {
		let r = e[n].start - e[n - 1].start, i = Math.round(r / 6e4);
		if (!Number.isFinite(i) || i <= 0) return null;
		if (t === null) t = i;
		else if (Math.abs(i - t) > 1) return null;
	}
	return t === 15 || t === 60 ? t : null;
}
function tn(e, t) {
	let n = e[t];
	if (!n) return 9e5;
	let r = t > 0 ? n.start.getTime() - e[t - 1].start.getTime() : null, i = e[t + 1] ? e[t + 1].start.getTime() - n.start.getTime() : null;
	return r > 0 && i > 0 ? i > r * 1.5 ? r : i : i > 0 ? i : r > 0 ? r : 9e5;
}
function nn(e, t = 1, n = "UTC", r = /* @__PURE__ */ new Date()) {
	if (!Array.isArray(e) || !e.length) return !1;
	let i = en(e);
	if (!i) return !1;
	let a = dt(r, t, n), o = dt(r, t + 1, n), s = Math.round((o.getTime() - a.getTime()) / (i * 6e4));
	if (s <= 0 || e.length !== s) return !1;
	for (let t = 0; t < e.length; t++) {
		let n = a.getTime() + t * i * 6e4;
		if (Math.abs(e[t].start.getTime() - n) > 1e3) return !1;
	}
	return !0;
}
function rn(e) {
	return !!e && Object.prototype.hasOwnProperty.call(e, "tomorrow_status");
}
function an(e, t = null, n = "UTC") {
	if (rn(e)) {
		let t = String(e?.tomorrow_status || "").toLowerCase();
		return t === "ok" || t === "preview";
	}
	return nn(Z(Array.isArray(t) ? t : bt(e), /* @__PURE__ */ new Date(), 1, n), 1, n);
}
function on(e, t, n = "UTC") {
	let r = bt(e);
	if (t === "today") return Z(r, /* @__PURE__ */ new Date(), 0, n);
	if (t === "tomorrow") return Z(r, /* @__PURE__ */ new Date(), 1, n);
	let i = Z(r, /* @__PURE__ */ new Date(), 0, n), a = Z(r, /* @__PURE__ */ new Date(), 1, n);
	return [...i, ...a];
}
function sn(e, t, n, r = "today", i = "range", a = "today", o = !0, s = "per_kwh", c = "UTC") {
	let l = Qt(r, a);
	if ((l === "tomorrow" || l === "two_days") && !an(t, null, c)) return q("price_range_unavailable", n);
	let u = l === "today" ? "today" : l === "tomorrow" ? "tomorrow" : "today_tomorrow", d = qt(e, Kt(e, t)), f = Lt(Xt(e, t, n), s), p = () => Jt(on(t, l, c), d).points;
	if (i === "avg") {
		let r = _t(t, `avg_${u}`);
		if (r === null) {
			if (r = vt(p().map((e) => e.price).filter((e) => Number.isFinite(e))), r === null) return q("price_range_unavailable", n);
		} else r *= d;
		return `${nt(r, e.decimals)}${o && f ? ` ${f}` : ""}`;
	}
	let m = _t(t, `min_${u}`), h = _t(t, `max_${u}`);
	if (m !== null && (m *= d), h !== null && (h *= d), m === null || h === null) {
		let e = p().map((e) => e.price).filter((e) => Number.isFinite(e));
		if (!e.length) return q("price_range_unavailable", n);
		m === null && (m = Math.min(...e)), h === null && (h = Math.max(...e));
	}
	return h < m && ([m, h] = [h, m]), `${nt(m, e.decimals)} - ${nt(h, e.decimals)}${o && f ? ` ${f}` : ""}`;
}
function cn(e, t, n, r, i) {
	let a = i === "today_tomorrow" ? "_today_tomorrow" : i === "tomorrow" ? "_tomorrow" : "_today", o = _t(t, `p20${a}`), s = _t(t, `avg${a}`), c = _t(t, `p70${a}`);
	if (r !== 1 && (o !== null && (o *= r), s !== null && (s *= r), c !== null && (c *= r)), o === null || s === null || c === null) {
		let e = (n || []).map((e) => e.price).filter((e) => typeof e == "number" && Number.isFinite(e)).slice();
		e.sort((e, t) => e - t);
		let t = yt(e, .2), r = vt(e), i = yt(e, .7);
		o === null && (o = t), s === null && (s = r), c === null && (c = i);
	}
	if (o === null && s === null && c === null) return {
		p20: 0,
		avg: 0,
		p70: 0
	};
	let l = dn(e, "use_fixed_p20", "fixed_p20_value", r), u = dn(e, "use_fixed_avg", "fixed_avg_value", r), d = dn(e, "use_fixed_expensive", "fixed_expensive_value", r);
	l !== null && (o = l), u !== null && (s = u), d !== null && (c = d);
	let f = Math.min(o ?? s ?? c, s ?? o ?? c, c ?? s ?? o), p = Math.max(o ?? s ?? c, s ?? o ?? c, c ?? s ?? o);
	return {
		p20: f,
		avg: Zt(s ?? f, f, p),
		p70: p,
		fixed: null,
		detailed: !!e.detailed_colors
	};
}
function ln(e, t, n, r, i, a = "UTC", o = /* @__PURE__ */ new Date()) {
	let s = !!e?.detailed_colors, c = Et(r, s), l = qt(e, Kt(e, t));
	for (let r of [0, 1]) {
		let u = r === 0 ? "today" : "tomorrow", d = Jt(Z(n, o, r, a), l).points;
		if (!d.length) continue;
		let f = cn(e, t, d, l, u);
		for (let e = 0; e < d.length; e++) {
			let t = d[e];
			if (Dt(t.price, f, s) !== c) continue;
			let n = t.start.getTime();
			if (n > o.getTime()) {
				let e = mt(t.start, a);
				return r === 0 ? e : q("next_price_level_tomorrow", i, { time: e });
			}
			let l = n + tn(d, e);
			if (o.getTime() >= n && o.getTime() < l) return q("label_now", i);
		}
	}
	return "—";
}
function un(e, t, n) {
	return Jt(n, qt(e, Kt(e, t)));
}
function dn(e, t, n, r) {
	if (!e?.detailed_colors || !e?.[t]) return null;
	let i = X(e?.[n]);
	return i === null ? null : i * (r || 1);
}
function fn(e) {
	return e === "tomorrow" ? "tomorrow" : e === "two_days" ? "two_days" : "today";
}
function pn(e, t, n, r = "UTC") {
	let i = t?.attributes || {}, a = bt(i), o = fn(n), s = Kt(e, i), c = an(i, a, r), l = e.two_day_mode || "span", u = [], d = null, f = null, p = null, m = {
		factor: 1,
		points: []
	}, h = /* @__PURE__ */ new Date(), g = ft(h, r), _ = dt(h, 1, r), v = dt(h, 2, r), y = (e, t) => (t.getTime() - e.getTime()) / 36e5, b = y(g, _), x = g, S = b, C = 0;
	if (o === "tomorrow") c && (m = un(e, i, Z(a, h, 1, r)), u = m.points, p = cn(e, i, u, m.factor, "tomorrow"), C = u.length, x = _, S = y(_, v));
	else if (o === "two_days") {
		if (c) {
			let t = Z(a, h, 0, r), n = Z(a, h, 1, r);
			m = un(e, i, t);
			let o = m.factor, s = m.points, c = Jt(n, o).points;
			c.length && (l === "span" ? (u = [...s, ...c], p = cn(e, i, u, o, "today_tomorrow"), S = y(g, v), C = u.length) : (u = s, d = c, f = c.map((e) => ({
				...e,
				start: pt(e.start, g, r)
			})), p = cn(e, i, u, o, "today"), S = y(g, _), C = u.length)), x = g;
		}
	} else m = un(e, i, Z(a, h, 0, r)), u = m.points, p = cn(e, i, u, m.factor, "today"), C = u.length, x = g;
	let w = (o === "tomorrow" || o === "two_days") && !c;
	return w && !p && (p = {
		p20: 0,
		avg: 0,
		p70: 0,
		detailed: !!e.detailed_colors
	}), {
		attrs: i,
		timelineAll: a,
		dayView: o,
		currency: s,
		tomorrowOk: c,
		twoDayMode: l,
		dayPoints: u,
		overlayPoints: d,
		overlayShifted: f,
		thresholds: p,
		scaled: m,
		dayStart: x,
		dayHours: S,
		firstDayHours: b,
		debugPointsCount: C,
		showPending: w
	};
}
function mn(e, t, n, r = "UTC") {
	let i = un(e, t, Z(n, /* @__PURE__ */ new Date(), 0, r)), a = i.points, o = a.length ? cn(e, t, a, i.factor, "today") : null, s = null, c = "";
	if (a.length) {
		let e = /* @__PURE__ */ new Date(), t = -1;
		for (let n = 0; n < a.length && a[n].start <= e; n++) t = n;
		if (t >= 0) {
			let n = a[t], i = tn(a, t), o = a[t + 1], l = n.start.getTime() + i, u = o?.start ? Math.min(o.start.getTime(), l) : l;
			if (e.getTime() < u) {
				s = n;
				let e = new Date(u), t = (e) => mt(e, r);
				c = `${t(s.start)}-${t(e)}`;
			}
		}
	}
	return {
		currentPoint: s,
		thresholds: o,
		currentWindow: c
	};
}
//#endregion
//#region src/card-content.ts
function hn(e, t, n, r, i) {
	if (!e) return null;
	if (e.source === "entity") {
		let n = t?.states?.[e.entity];
		if (!n) return null;
		let r = t?.formatEntityState ? t.formatEntityState(n) : String(n.state ?? ""), i = String(r ?? "").replace(/\u00A0/g, " ").trim(), a = Bt(n, Lt(n.attributes?.unit_of_measurement || "", e.unit_display_mode));
		return e.show_unit ? Ht(i, a) : {
			value: Vt(i, a),
			unit: ""
		};
	}
	if (e.source === "attribute") {
		if (!n) return null;
		let a = n.attributes?.[e.attribute], o = X(a);
		return o === null ? (a == null || typeof a == "string" && !a.trim()) && (a = null) : a = o * qt(i, Kt(i, n.attributes)), {
			value: nt(a, r),
			unit: Lt(Xt(i, n.attributes, J(t)), e.unit_display_mode)
		};
	}
	return null;
}
//#endregion
//#region src/card-styles.ts
var gn = "\n        ha-card { overflow: hidden; }\n        .header { padding: 16px 16px 0 16px; font-size: 16px; font-weight: 600; display: flex; align-items: center; justify-content: space-between; gap: 10px; }\n        .header-item { min-width: 0; font-size: 16px; font-weight: 600; color: var(--primary-text-color); }\n        .header-item-right { margin-left: auto; text-align: right; }\n        .header-metric { display: flex; flex-direction: column; line-height: 1.05; }\n        .header-metric-top { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); min-height: 13px; }\n        .header-metric-main { font-size: 18px; font-weight: 700; color: var(--primary-text-color); white-space: nowrap; }\n        .header-price-main { font-size: 30px; font-weight: 800; color: var(--primary-text-color); white-space: nowrap; }\n        .header-metric-unit { font-size: 12px; font-weight: 500; color: var(--secondary-text-color); }\n        .info-grid {\n          display: grid;\n          grid-template-columns: repeat(var(--info-cols, var(--info-max-cols, 4)), minmax(100px, 1fr));\n          gap: var(--info-gap, 10px);\n          margin: 6px 0 0 0;\n        }\n        .info-grid.top { margin-bottom: -6px; }\n        .info-grid.bottom { margin-top: 14px; margin-bottom: 0; }\n        .info-item {\n          font-size: 12px;\n          color: var(--secondary-text-color);\n          display: grid;\n          grid-template-rows: minmax(0, 1fr) auto;\n          align-items: end;\n          background: color-mix(in srgb, var(--card-background-color) 92%, var(--primary-text-color) 8%);\n          border: 1px solid rgba(120,120,120,0.26);\n          border-radius: 14px;\n          padding: 10px 10px;\n          aspect-ratio: 1 / 1;\n          min-height: 0;\n          box-sizing: border-box;\n        }\n        .info-item.has-action { cursor: pointer; }\n        .info-item.has-action:focus-visible {\n          outline: 2px solid var(--primary-color);\n          outline-offset: 2px;\n        }\n        .info-label {\n          font-size: 11px;\n          opacity: .82;\n          min-height: 12px;\n          width: 100%;\n          text-align: center;\n          overflow: hidden;\n          white-space: nowrap;\n          line-height: 1.1;\n        }\n        .info-label-text { display: inline-block; transform: translateX(0); will-change: transform; }\n        .info-label.marquee .info-label-text { animation: info-label-marquee var(--marquee-duration, 5s) ease-in-out infinite alternate; }\n        @keyframes info-label-marquee { from { transform: translateX(0); } to { transform: translateX(calc(-1 * var(--marquee-shift, 0px))); } }\n        .info-value {\n          color: var(--primary-text-color);\n          font-weight: 700;\n          line-height: 1.08;\n          text-align: center;\n          width: 100%;\n          height: 100%;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          align-self: center;\n          justify-self: center;\n          gap: 0;\n          overflow: hidden;\n          white-space: nowrap;\n          text-overflow: ellipsis;\n        }\n        .info-value-inline { display: inline-flex; align-items: baseline; justify-content: center; max-width: 100%; overflow: hidden; }\n        .info-value-main { font-size: var(--info-main-size, 24px); font-weight: 800; line-height: 1; }\n        .info-value-unit { font-size: 11px; font-weight: 600; color: var(--secondary-text-color); line-height: 1; }\n        .content { padding: 8px 16px 12px 16px; }\n        .pg-wrap { position: relative; padding-top: 0; margin-top: 0; touch-action: pan-y; cursor: pointer; }\n        .pg-wrap:focus-visible {\n          outline: 2px solid var(--primary-color);\n          outline-offset: 2px;\n          border-radius: 10px;\n        }\n        .content.no-info .pg-wrap { margin-top: -10px; }\n        .content.has-info .pg-wrap { margin-top: -6px; }\n        .pg-empty {\n          position: absolute;\n          inset: 0;\n          display: flex;\n          align-items: center;\n          justify-content: center;\n          pointer-events: none;\n        }\n        .pg-empty-card {\n          display: flex;\n          flex-direction: column;\n          align-items: center;\n          gap: 10px;\n          color: var(--secondary-text-color);\n          background: color-mix(in srgb, var(--card-background-color) 82%, var(--primary-color) 18%);\n          border: 1px solid rgba(120,120,120,0.28);\n          border-radius: 12px;\n          padding: 12px 14px;\n          max-width: min(88%, 420px);\n          max-height: calc(100% - 8px);\n          text-align: center;\n          overflow: hidden;\n        }\n        .pg-empty-text { font-size: 13px; line-height: 1.35; }\n        .pg-empty-gears {\n          width: 62px;\n          height: 44px;\n          overflow: visible;\n          color: var(--secondary-text-color);\n          opacity: 0.95;\n        }\n        .pg-empty-gear-lg { transform-origin: 20px 24px; animation: pg-spin-cw 9s linear infinite; }\n        .pg-empty-gear-sm-a { transform-origin: 39px 17px; animation: pg-spin-ccw 7s linear infinite; }\n        .pg-empty-gear-sm-b { transform-origin: 47px 31px; animation: pg-spin-ccw 11s linear infinite; }\n        .pg-empty-gear-lg, .pg-empty-gear-sm-a, .pg-empty-gear-sm-b { transform-box: fill-box; transform-origin: center; }\n        .pg-empty.is-timeline .pg-empty-card { padding: 0px 10px; border-radius: 10px; gap: 0px; max-width: min(86%, 360px); }\n        .pg-empty.is-timeline .pg-empty-text { font-size: 12px; line-height: 1.2; }\n        .pg-empty.is-timeline .pg-empty-gears { width: 40px; height: 24px; }\n        @keyframes pg-spin-cw { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }\n        @keyframes pg-spin-ccw { from { transform: rotate(360deg); } to { transform: rotate(0deg); } }\n        .pg-legend { display: flex; gap: 12px; align-items: center; justify-content: center; flex-wrap: wrap; margin: 8px 0 6px 0; font-size: 13px; opacity: .9; }\n        .pg-legend.is-timeline { margin-top: -17px; }\n        .pg-legend-item { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }\n        .pg-legend-dot { width: 8px; height: 8px; border-radius: 999px; background: #999; }\n        .pg-buttons {\n          position: relative;\n          display: grid;\n          grid-template-columns: repeat(3, minmax(0, 1fr));\n          margin-top: 6px;\n          background: color-mix(in srgb, var(--card-background-color) 92%, var(--primary-text-color) 8%);\n          border: 1px solid rgba(120,120,120,0.26);\n          border-radius: 14px;\n          overflow: hidden;\n        }\n        .pg-buttons-indicator {\n          position: absolute;\n          left: 0;\n          bottom: 0;\n          width: 33.3333%;\n          height: 3px;\n          background: var(--primary-color);\n          transition: transform .22s cubic-bezier(.2,.7,.2,1);\n          pointer-events: none;\n        }\n        .pg-buttons.day-today .pg-buttons-indicator { transform: translateX(0%); }\n        .pg-buttons.day-tomorrow .pg-buttons-indicator { transform: translateX(100%); }\n        .pg-buttons.day-two_days .pg-buttons-indicator { transform: translateX(200%); }\n        .pg-btn {\n          position: relative;\n          padding: 11px 8px;\n          border-radius: 0;\n          border: 0;\n          background: transparent;\n          color: var(--primary-text-color);\n          font-size: 13px;\n          font-weight: 600;\n          opacity: .8;\n          cursor: pointer;\n          overflow: visible;\n          -webkit-tap-highlight-color: transparent;\n          transition: color .18s ease, opacity .18s ease;\n        }\n        .pg-btn.active {\n          color: var(--primary-color);\n          opacity: 1;\n        }\n        .pg-btn-state {\n          position: absolute;\n          width: 12px;\n          height: 12px;\n          border-radius: 999px;\n          background: color-mix(in srgb, var(--primary-color) 22%, transparent);\n          transform: translate(-50%, -50%) scale(0);\n          opacity: 0;\n          pointer-events: none;\n        }\n        .pg-btn-state.run { animation: pg-btn-state .36s cubic-bezier(.2,.7,.2,1); }\n        @keyframes pg-btn-state {\n          0% { opacity: .95; transform: translate(-50%, -50%) scale(0); }\n          70% { opacity: .38; transform: translate(-50%, -50%) scale(14); }\n          100% { opacity: 0; transform: translate(-50%, -50%) scale(18); }\n        }\n        .pg-tooltip {\n          position:absolute; pointer-events:none;\n          background: var(--card-background-color);\n          border: 1px solid rgba(120,120,120,.35);\n          box-shadow: 0 2px 10px rgba(0,0,0,.18);\n          border-radius: 10px;\n          padding: 6px 8px;\n          font-size: 12px;\n          color: var(--primary-text-color);\n          transform: translate(-50%, -100%);\n          display:none;\n          white-space: nowrap;\n          z-index: 2;\n        }\n        .pg-sub { opacity:.75; font-size:11px; }\n        svg.svg { width: 100%; height: 100%; display:block; }\n        .tl-root { position: relative; display: flex; flex-direction: column; gap: 9px; height: 100%; justify-content: center; }\n        .tl-track { position: relative; display: flex; height: 6px; align-items: stretch; }\n        .tl-slot { flex: 1 1 0; min-width: 0; }\n        .tl-past {\n          position: absolute;\n          left: 0;\n          top: 0;\n          bottom: 0;\n          background: rgba(0, 0, 0, 0.22);\n          pointer-events: none;\n        }\n        .tl-now {\n          position: absolute;\n          top: 50%;\n          width: 3px;\n          height: 14px;\n          border-radius: 10px;\n          transform: translateY(-50%);\n          pointer-events: none;\n          box-shadow: 0 0 4px rgba(0,0,0,0.3);\n          box-sizing: border-box;\n        }\n        .tl-scale { display: grid; gap: 0; }\n        .tl-tick { display: flex; flex-direction: column; align-items: center; justify-content: flex-start; }\n        .tl-dot { width: 3px; height: 3px; border-radius: 999px; background: rgba(120,120,120,0.55); margin-bottom: 3px; }\n        .tl-dot.major { width: 4px; height: 4px; background: rgba(20,20,20,0.9); }\n        .tl-hour { font-size: 11px; line-height: 1; color: var(--secondary-text-color); }\n        .tl-days { position: absolute; left: 0; right: 0; bottom: 0; display: grid; grid-template-columns: 1fr 1fr; align-items: center; pointer-events: none; }\n        .tl-day { text-align: center; font-size: 11px; line-height: 1; color: var(--secondary-text-color); }\n      ";
//#endregion
//#region src/runtime-config.ts
function _n(e, t) {
	return e?.view_mode === "timeline" && t === "two_days" && e.two_day_mode !== "span" ? {
		...e,
		two_day_mode: "span"
	} : e;
}
//#endregion
//#region src/card-render.ts
function vn() {
	if (!this._config) return R``;
	let e = this._config, t = this.hass, n = J(t), r = gt(t), i = G(e.title_item_left, "title", ""), a = G(e.title_item_right, "attribute", ""), o = i.label || "", s = W(e.content_items), c = e.view_mode === "timeline" ? 74 : Number(e.height) || 280;
	if (!t) return R`
        <ha-card>
          <div class="header">${o}</div>
          <div class="content">
            <div style="padding:8px;color:var(--secondary-text-color)">${q("waiting_ha", n)}</div>
          </div>
        </ha-card>
      `;
	let l = t.states?.[e.entity];
	if (!l) return R`
        <ha-card>
          <div class="header">${o}</div>
          <div class="content">
            <div style="padding:8px;color:var(--error-color)">${q("entity_not_found", n)}</div>
          </div>
        </ha-card>
      `;
	let u = _n(e, this._dayView), { timelineAll: d, dayView: f, currency: p, dayPoints: m, thresholds: h, scaled: g, debugPointsCount: _, showPending: v } = this._getDayCtx(u, l, r);
	if (!m.length && !v) return R`
        <ha-card>
          <div class="header">${o}</div>
          <div class="content">
            <div style="padding:8px;color:var(--secondary-text-color)">
              ${q("no_data", n)}
            </div>
          </div>
        </ha-card>
      `;
	let y = e.debug ? R`
      <div style="margin-top:8px;font-size:12px;opacity:.85">
        <div><b>${q("debug", n)}</b> — ${q("points", n)}: ${_}, ${q("currency", n)}: ${p || "?"}, ${q("factor", n)}: ${g.factor}</div>
        <div>p20: ${Y(h.p20, 2)}, avg: ${Y(h.avg, 2)}, p70: ${Y(h.p70, 2)}</div>
      </div>
    ` : R``, b = mn(e, l.attributes, d, r), x = b.currentPoint, S = b.thresholds || h, C = b.currentWindow || "", w = (i, a = "header") => {
		if (!i) return null;
		if (i.source === "title") {
			if (a !== "header") return null;
			let e = i.label || "";
			return e ? {
				variant: "single",
				label: "",
				value: e,
				color: null
			} : null;
		}
		if (i.source === "price_level") {
			if (!x) return null;
			let t = kt(x.price, S, n), r = i.use_color ? Ot(e, x.price, S) : null;
			return a === "header" ? {
				variant: "metric",
				top: i.label || q("header_price_level_default", n),
				main: t,
				color: r
			} : {
				variant: "info",
				label: i.label || q("content_price_level_label", n),
				value: t,
				color: r || "var(--primary-text-color)",
				item: i
			};
		}
		if (i.source === "next_price_level") {
			let t = ln(e, l.attributes, d, i.price_level, n, r), o = i.label || q("content_next_price_level_label", n);
			return a === "header" ? {
				variant: "metric",
				top: o,
				main: t,
				color: null
			} : {
				variant: "info",
				label: o,
				value: t,
				color: null,
				item: i
			};
		}
		if (i.source === "current_price") {
			if (!x) return null;
			let t = Lt(Xt(e, l.attributes, n), i.unit_display_mode), r = nt(x.price, e.decimals);
			return a === "header" ? {
				variant: "price",
				top: i.time_overwrite && i.label ? i.label : C,
				main: r,
				unit: i.show_unit ? t : "",
				color: null
			} : {
				variant: "info",
				label: i.label || q("content_current_price_label", n),
				value: r,
				unit: i.show_unit && t ? t : "",
				color: null,
				item: i
			};
		}
		if (i.source === "price_range" || i.source === "avg_price") {
			let t = i.source === "price_range", o = i.label || `${q(t ? "content_price_range_label" : "content_avg_price_label", n)} ${$t(i.range_day, n, f)}`, s = i.show_unit ? Lt(Xt(e, l.attributes, n), i.unit_display_mode) : "", c = sn(e, l.attributes, n, i.range_day, t ? "range" : "avg", f, !1, i.unit_display_mode, r);
			return a === "header" ? {
				variant: "metric",
				top: o,
				main: `${c}${s ? ` ${s}` : ""}`,
				color: null
			} : {
				variant: "info",
				label: o,
				value: c,
				unit: s,
				color: null,
				item: i
			};
		}
		let o = hn(i, t, l, e.decimals, e);
		if (!o) return null;
		let s = o.value === "—" || o.value === "";
		if (a === "header" && !i.label && s || a !== "header" && !i.label && !i.attribute && !i.entity && s) return null;
		let c = `${o.value}${i.show_unit && o.unit ? ` ${o.unit}` : ""}`;
		return a === "header" && (i.source === "entity" || i.source === "attribute") ? {
			variant: "metric",
			top: i.label || "",
			main: c,
			color: null
		} : {
			variant: "info",
			label: i.label || "",
			value: o.value,
			unit: i.show_unit ? o.unit : "",
			color: null,
			item: i
		};
	}, T = (e, t) => {
		let n = w(e, "header");
		return n ? n.variant === "metric" ? R`
          <div class="${t}">
            <div class="header-metric">
              <div class="header-metric-top">${n.top || "\xA0"}</div>
              <div class="header-metric-main" style=${n.color ? `color:${n.color}` : ""}>${n.main}</div>
            </div>
          </div>
        ` : n.variant === "price" ? R`
          <div class="${t}">
            <div class="header-metric">
              <div class="header-metric-top">${n.top || "\xA0"}</div>
              <div class="header-price-main">
                ${n.main}
                ${n.unit ? R`<span class="header-metric-unit"> ${n.unit}</span>` : R``}
              </div>
            </div>
          </div>
        ` : R`
        <div class="${t}">
          ${n.label ? `${n.label}: ` : ""}${n.color ? R`<span style="color:${n.color}">${n.value}</span>` : n.value}
        </div>
      ` : R``;
	}, E = (e) => {
		let t = !!e.item?.actions?.enabled;
		return R`
        <div class="info-item ${t ? "has-action" : ""}"
          role=${t ? "button" : B}
          tabindex=${t ? "0" : B}
          @pointerdown=${(t) => this._onSlotPointerDown(e.item, t)}
          @pointerup=${(t) => this._onSlotPointerUp(e.item, t)}
          @pointerleave=${(t) => this._onSlotPointerLeave(e.item, t)}
          @click=${(t) => this._onSlotClick(e.item, t)}
          @dblclick=${(t) => this._onSlotDblClick(e.item, t)}
        >
          <div class="info-value" style=${e.color ? `color:${e.color}` : ""}>
            <span class="info-value-inline">
              <span class="info-value-main">${e.value}</span>${e.unit ? R`<span class="info-value-unit"> ${e.unit}</span>` : R``}
            </span>
          </div>
          <div class="info-label" title=${e.label || ""}>
            <span class="info-label-text">${e.label || "\xA0"}</span>
          </div>
        </div>
      `;
	}, D = s.map((e) => w(e, "info")).filter((e) => !!e), O = e.content_items_position === "bottom" ? "bottom" : "top", k = O === "top" ? D : [], A = O === "bottom" ? D : [], j = k.length > 0, M = e.detailed_colors ? Ee.map(({ key: t, label: n, fallback: r }) => ({
		color: xt(e[t], r),
		label: n
	})) : [{
		color: we,
		label: "region_below_avg"
	}, {
		color: Te,
		label: "region_above_avg"
	}];
	return R`
      <style>${gn}</style>
      <ha-card>
        <div class="header"
          role="button"
          tabindex="0"
          @pointerdown=${this._onHeaderPointerDown}
          @pointerup=${this._onHeaderPointerUp}
          @pointerleave=${this._onHeaderPointerLeave}
          @click=${this._onHeaderClick}
          @dblclick=${this._onHeaderDblClick}
        >
          ${T(i, "header-item")}
          ${T(a, "header-item header-item-right")}
        </div>
        <div class="content ${j ? "has-info" : "no-info"}">
          ${j ? R`
            <div class="info-grid top">
              ${k.map((e) => E(e))}
            </div>
          ` : R``}
          <div class="pg-wrap"
            role="button"
            tabindex="0"
            @pointerdown=${this._onHeaderPointerDown}
            @pointerup=${this._onHeaderPointerUp}
            @pointerleave=${this._onHeaderPointerLeave}
            @click=${this._onHeaderClick}
            @dblclick=${this._onHeaderDblClick}
          >
            <div class="pg-tooltip" id="pg-tooltip"></div>
            <div id="pg-svg-host" style="height:${c}px"></div>
            ${v ? R`
              <div class="pg-empty ${u.view_mode === "timeline" ? "is-timeline" : ""}">
                <div class="pg-empty-card">
                  <svg class="pg-empty-gears" viewBox="0 0 64 44" aria-hidden="true">
                    <g class="pg-empty-gear-lg">
                      <g transform="translate(8 12) scale(0.92)">
                        <path fill="currentColor" d="${Fe}"></path>
                      </g>
                    </g>
                    <g class="pg-empty-gear-sm-a">
                      <g transform="translate(30 8) scale(0.56)">
                        <path fill="currentColor" d="${Fe}"></path>
                      </g>
                    </g>
                    <g class="pg-empty-gear-sm-b">
                      <g transform="translate(38 22) scale(0.48)">
                        <path fill="currentColor" d="${Fe}"></path>
                      </g>
                    </g>
                  </svg>
                  <div class="pg-empty-text">${q("tomorrow_pending", n)}</div>
                </div>
              </div>
            ` : R``}
          </div>
          <div class="pg-legend ${e.view_mode === "timeline" ? "is-timeline" : ""}">
            ${M.map((e) => R`
              <div class="pg-legend-item">
                <span class="pg-legend-dot" style="background:${e.color}"></span>
                <span>${q(e.label, n)}</span>
              </div>
            `)}
            ${e.view_mode === "graph" && this._dayView === "two_days" && (u.two_day_mode || "span") === "overlay" ? R`
              <div class="pg-legend-item">
                <span class="pg-legend-dot" style="background:rgba(120,120,120,0.6)"></span>
                <span>${q("label_tomorrow", n)}</span>
              </div>
            ` : R``}
          </div>
          ${e.show_day_buttons ? R`
            <div class="pg-buttons day-${this._dayView}">
              <button class="pg-btn ${this._dayView === "today" ? "active" : ""}" data-day-view="today" @pointerdown=${(e) => this._onDayButtonPointerDown(e)} @click=${() => this._setDayView("today")}>
                ${q("label_today", n)}
                <span class="pg-btn-state"></span>
              </button>
              <button class="pg-btn ${this._dayView === "tomorrow" ? "active" : ""}" data-day-view="tomorrow" @pointerdown=${(e) => this._onDayButtonPointerDown(e)} @click=${() => this._setDayView("tomorrow")}>
                ${q("label_tomorrow", n)}
                <span class="pg-btn-state"></span>
              </button>
              <button class="pg-btn ${this._dayView === "two_days" ? "active" : ""}" data-day-view="two_days" @pointerdown=${(e) => this._onDayButtonPointerDown(e)} @click=${() => this._setDayView("two_days")}>
                ${q("label_two_days", n)}
                <span class="pg-btn-state"></span>
              </button>
              <div class="pg-buttons-indicator"></div>
            </div>
          ` : R``}
          ${A.length ? R`
            <div class="info-grid bottom">
              ${A.map((e) => E(e))}
            </div>
          ` : R``}
          ${y}
        </div>
      </ha-card>
    `;
}
//#endregion
//#region src/card-update.ts
function $(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
function yn(e, t) {
	return e?.get(t) ?? null;
}
function bn() {
	if (!this.hass || !this._config) return;
	let e = this._config, t = J(this.hass), n = gt(this.hass), r = this.renderRoot?.querySelector(".pg-wrap"), i = this.renderRoot?.querySelector("#pg-svg-host"), a = this.renderRoot?.querySelector("#pg-tooltip"), o = this.renderRoot?.querySelector(".content"), s = this.renderRoot?.querySelectorAll(".info-grid") || [];
	if (o && s.length) {
		let e = Math.round(o.clientWidth || 0);
		if (e > 0) {
			let t = Number(this._config?.content_items_max_cols) === 3 ? 3 : 4, n = $(Math.round(e * .018), 8, 12), r = $(Math.floor((e + n) / (100 + n)) || 2, 2, t);
			s.forEach((e) => {
				e.style.setProperty("--info-cols", String(r)), e.style.setProperty("--info-max-cols", String(t)), e.style.setProperty("--info-gap", `${n}px`);
			});
		}
	}
	if (this._syncInfoLabelMarquee(), this._syncInfoValueFit(), !r || !i || !a) return;
	this._syncResizeObserver(o, r, i);
	let c = this.hass.states?.[this._config.entity];
	if (!c) return;
	let l = _n(e, this._dayView), u = this._getDayCtx(l, c, n), { dayView: d, twoDayMode: f, dayPoints: p, overlayPoints: m, overlayShifted: h, thresholds: g, dayStart: _, dayHours: v, firstDayHours: y, showPending: b } = u;
	if (!p.length || b) {
		this._lastGraphSignature = null, this._unbindGraphPointer(), i.innerHTML = "", a.style.display = "none";
		return;
	}
	let x = [...p].sort((e, t) => e.start - t.start), S = Xt(l, c.attributes, t), C = this._buildGraphSignature(l, c, u, i, r, t, n);
	if (C && C === this._lastGraphSignature) return;
	if (this._lastGraphSignature = C, l.view_mode === "timeline") {
		this._unbindGraphPointer(), a.style.display = "none";
		let e = new Date(_.getTime() + v * 3600 * 1e3), o = document.createElement("div");
		o.className = "tl-root";
		let s = document.createElement("div");
		s.className = "tl-track";
		let c = document.createElement("div");
		c.className = "tl-scale", c.style.gridTemplateColumns = `repeat(${v + 1}, minmax(0, 1fr))`;
		for (let e = 0; e < x.length; e++) {
			let t = x[e], n = Ot(l, t.price, g), r = x[e - 1], i = x[e + 1], a = r ? Ot(l, r.price, g) : null, o = i ? Ot(l, i.price, g) : null, c = document.createElement("div");
			c.className = "tl-slot", c.style.background = n, a !== n && (c.style.borderTopLeftRadius = "999px", c.style.borderBottomLeftRadius = "999px"), o !== n && (c.style.borderTopRightRadius = "999px", c.style.borderBottomRightRadius = "999px"), s.appendChild(c);
		}
		let u = /* @__PURE__ */ new Date();
		if (u >= _ && u <= e && x.length) {
			let t = x[0];
			for (let e = 0; e < x.length; e++) {
				let n = x[e + 1];
				if (!n || u < n.start) {
					t = x[e];
					break;
				}
			}
			let n = $((u.getTime() - _.getTime()) / (e.getTime() - _.getTime()), 0, 1), i = document.createElement("div");
			i.className = "tl-past", i.style.width = `${n * 100}%`, i.style.background = Tt(r), s.appendChild(i);
			let a = Ot(l, t.price, g), o = document.createElement("div");
			o.className = "tl-now", o.style.left = `calc(${n * 100}% - 3.5px)`, o.style.height = "14px", o.style.width = "7px", o.style.background = a, o.style.border = "2px solid var(--card-background-color)", s.appendChild(o);
		}
		for (let e = 0; e <= v; e += 1) {
			let t = document.createElement("div");
			t.className = "tl-tick";
			let r = e % 6 == 0 || e === v, i = document.createElement("div");
			if (i.className = `tl-dot ${r ? "major" : ""}`.trim(), t.appendChild(i), r) {
				let r = document.createElement("div");
				r.className = "tl-hour", r.textContent = mt(new Date(_.getTime() + e * 3600 * 1e3), n).slice(0, 2), t.appendChild(r);
			}
			c.appendChild(t);
		}
		if (o.appendChild(s), o.appendChild(c), d === "two_days") {
			let e = document.createElement("div");
			e.className = "tl-days", e.style.gridTemplateColumns = `${y || 24}fr ${Math.max(1, v - (y || 24))}fr`;
			let n = document.createElement("div");
			n.className = "tl-day", n.textContent = q("label_today", t);
			let r = document.createElement("div");
			r.className = "tl-day", r.textContent = q("label_tomorrow", t), e.appendChild(n), e.appendChild(r), o.appendChild(e);
		}
		i.innerHTML = "", i.appendChild(o);
		return;
	}
	let w = Math.round(i.clientWidth || r.clientWidth || this.clientWidth || 0), T = Math.max(320, w || 600), E = Number(e.height) || 280, D = T - 14, O = E - 26, k = D - 44, A = O - 18, { yMin: j, yMax: M, ticks: N } = Mt(h ? [...p, ...h] : m ? [...p, ...m] : p, l.unit_format), P = {
		w: T,
		h: E,
		left: 44,
		right: D,
		top: 18,
		bottom: O,
		innerW: k,
		innerH: A,
		yMin: j,
		yMax: M
	}, ee = N.map((e) => ({
		y: 18 + (1 - $((e - j) / (M - j || 1), 0, 1)) * A,
		label: rt(e)
	})), te = [];
	for (let e = 0; e <= v; e += 2) {
		let t = 44 + e / v * k, r = new Date(_.getTime() + e * 3600 * 1e3);
		te.push({
			x: t,
			label: mt(r, n).slice(0, 2)
		});
	}
	let ne = Nt(l, p, P, g, _, v), re = h ? Nt(l, h, P, g, _, v, () => "rgb(120,120,120)") : [], ie = 44 + $(((/* @__PURE__ */ new Date()).getTime() - _.getTime()) / (v * 3600 * 1e3), 0, 1) * k, F = "http://www.w3.org/2000/svg", I = document.createElementNS(F, "svg");
	I.setAttribute("class", "svg"), I.setAttribute("preserveAspectRatio", "xMinYMin meet"), I.setAttribute("viewBox", `0 0 ${T} ${E}`);
	let L = document.createElementNS(F, "rect");
	L.setAttribute("x", "0"), L.setAttribute("y", "0"), L.setAttribute("width", String(T)), L.setAttribute("height", String(E)), L.setAttribute("fill", "transparent"), L.setAttribute("pointer-events", "all"), I.appendChild(L);
	for (let e of ee) {
		let t = document.createElementNS(F, "line");
		t.setAttribute("stroke-width", "1"), t.setAttribute("x1", 44), t.setAttribute("x2", D), t.setAttribute("y1", e.y), t.setAttribute("y2", e.y), t.setAttribute("stroke", "rgba(120,120,120,0.25)"), I.appendChild(t);
		let n = document.createElementNS(F, "text");
		n.setAttribute("x", "6"), n.setAttribute("font-size", "12"), n.setAttribute("y", e.y + 4), n.setAttribute("fill", "var(--secondary-text-color)"), n.textContent = e.label, I.appendChild(n);
	}
	for (let e of te) {
		let t = document.createElementNS(F, "text");
		t.setAttribute("text-anchor", "middle"), t.setAttribute("font-size", "12"), t.setAttribute("x", e.x), t.setAttribute("y", E - 6), t.setAttribute("fill", "var(--secondary-text-color)"), t.textContent = e.label, I.appendChild(t);
	}
	if (l.show_now_line && d === "today") {
		let e = document.createElementNS(F, "line");
		e.setAttribute("stroke-width", "1.5"), e.setAttribute("stroke-dasharray", "4 3"), e.setAttribute("x1", ie), e.setAttribute("x2", ie), e.setAttribute("y1", 18), e.setAttribute("y2", O), e.setAttribute("stroke", "rgba(120,120,120,0.6)"), I.appendChild(e);
		let n = document.createElementNS(F, "text");
		n.setAttribute("x", ie), n.setAttribute("y", 30), n.setAttribute("text-anchor", "middle"), n.setAttribute("font-size", "12"), n.setAttribute("fill", "rgba(120,120,120,0.8)"), n.textContent = q("label_now", t), I.appendChild(n);
	}
	if (d === "two_days" && f === "span") {
		let e = 44 + (y || 24) / v * k, n = document.createElementNS(F, "line");
		n.setAttribute("stroke-width", "1.2"), n.setAttribute("x1", e), n.setAttribute("x2", e), n.setAttribute("y1", 18), n.setAttribute("y2", O), n.setAttribute("stroke", "rgba(120,120,120,0.35)"), I.appendChild(n);
		let r = document.createElementNS(F, "text");
		r.setAttribute("x", 44 + k * .25), r.setAttribute("y", 34), r.setAttribute("text-anchor", "middle"), r.setAttribute("font-size", "16"), r.setAttribute("fill", "rgba(120,120,120,0.8)"), r.textContent = q("label_today", t), I.appendChild(r);
		let i = document.createElementNS(F, "text");
		i.setAttribute("x", 44 + k * .75), i.setAttribute("y", 34), i.setAttribute("text-anchor", "middle"), i.setAttribute("font-size", "16"), i.setAttribute("fill", "rgba(120,120,120,0.8)"), i.textContent = q("label_tomorrow", t), I.appendChild(i);
	}
	It(I, F, re), It(I, F, ne), i.innerHTML = "", i.appendChild(I);
	let ae = new Date(_.getTime() + v * 3600 * 1e3), oe = Pt(_, v, 44, k), R = Ft(18, A, j, M), z = null;
	l.show_hover_line && (z = document.createElementNS(F, "line"), z.setAttribute("stroke-width", "1.2"), z.setAttribute("stroke-dasharray", "3 3"), z.setAttribute("stroke", "rgba(120,120,120,0.7)"), z.setAttribute("y1", 18), z.setAttribute("y2", O), z.style.display = "none", I.appendChild(z));
	let B = document.createElementNS(F, "circle");
	B.setAttribute("r", "4.5"), B.setAttribute("fill", "#ffffff"), B.setAttribute("stroke", "rgba(0,0,0,0.45)"), B.setAttribute("stroke-width", "1"), B.style.display = "none", I.appendChild(B);
	let V = document.createElementNS(F, "circle");
	V.setAttribute("r", "2.2"), V.setAttribute("fill", "var(--primary-text-color)"), V.style.display = "none", I.appendChild(V);
	let H = document.createElementNS(F, "circle");
	H.setAttribute("r", "4"), H.setAttribute("fill", "rgba(120,120,120,0.6)"), H.setAttribute("stroke", "rgba(255,255,255,0.8)"), H.setAttribute("stroke-width", "1"), H.style.display = "none", I.appendChild(H);
	let se = (e, t, n) => {
		z && (z.setAttribute("x1", e), z.setAttribute("x2", e)), B.setAttribute("cx", e), B.setAttribute("cy", t), V.setAttribute("cx", e), V.setAttribute("cy", t), typeof n == "number" ? (H.setAttribute("cx", e), H.setAttribute("cy", n), H.style.display = "block") : H.style.display = "none", z && (z.style.display = "block"), B.style.display = "block", V.style.display = "block";
	}, ce = () => {
		z && (z.style.display = "none"), B.style.display = "none", V.style.display = "none", H.style.display = "none";
	}, le = [];
	for (let e = 0; e < x.length - 1; e++) {
		let t = x[e].start.getTime(), n = x[e + 1].start.getTime();
		le.push((t + n) / 2);
	}
	let U = null;
	if (d === "two_days" && f === "overlay" && h && h.length) {
		U = /* @__PURE__ */ new Map();
		for (let e of h) {
			let t = Math.round((e.start.getTime() - _.getTime()) / 6e4);
			U.set(t, e.price);
		}
	}
	let ue = (e) => {
		if (!x.length) return null;
		for (let t = 0; t < le.length; t++) if (e < le[t]) return x[t];
		return x[x.length - 1];
	}, de = (e) => {
		let i = e.pointerType === "mouse", o = r.getBoundingClientRect();
		if (i && (e.clientX < o.left || e.clientX > o.right || e.clientY < o.top || e.clientY > o.bottom)) {
			a.style.display = "none", ce();
			return;
		}
		let s = I.getBoundingClientRect(), c = 44 / T * s.width, u = D / T * s.width, p = $(($(e.clientX, o.left, o.right) - s.left - c) / (u - c), 0, 1), m = _.getTime() + p * v * 3600 * 1e3, y = ue(m);
		if (y ||= this._lastBest, !y) return;
		this._lastBest = y;
		let b = mt(y.start, n), C = Y(y.price, l.decimals), w = x.indexOf(y), O = x[w + 1]?.start || ae, k = (oe(y.start) + oe(O)) / 2, A = R(y.price), j = null;
		if (d === "two_days" && f === "overlay" && h && h.length && U) {
			let e = Math.round((y.start.getTime() - _.getTime()) / 6e4), t = U.get(e);
			t != null && (j = R(t));
		}
		if (se(k, A, j), d === "two_days" && f === "overlay" && h && h.length) {
			let e = x.length > 1 ? Math.round((x[1].start.getTime() - x[0].start.getTime()) / 6e4) : 60, r = new Date(y.start.getTime() + e * 6e4), i = `${mt(y.start, n)}-${mt(r, n)}`, o = Math.round((y.start.getTime() - _.getTime()) / 6e4), s = yn(U, o), c = `${C} ${S}`, u = s === null ? "--" : `${Y(s, l.decimals)} ${S}`;
			a.innerHTML = `<div><b>${it(i)}</b></div><div class="pg-sub">${q("label_today", t)}: ${it(c)}</div><div class="pg-sub">${q("label_tomorrow", t)}: ${it(u)}</div>`;
		} else {
			let e = kt(y.price, g, t);
			a.innerHTML = `<div><b>${it(b)}</b> — ${it(C)} ${it(S)}</div><div class="pg-sub">${q("label_region", t)}: ${it(e)}</div>`;
		}
		let M = 18 / E * s.height + (s.top - o.top), N = k / T * s.width;
		a.style.display = "block", a.style.left = `${N}px`, a.style.top = `${M + 10}px`;
		let P = a.getBoundingClientRect(), ee = o.width - P.width / 2, te = $(N, P.width / 2, ee);
		a.style.left = `${te}px`, a.style.display = "block";
	}, fe = (e) => {
		e && e.pointerType && e.pointerType !== "mouse" || (a.style.display = "none", ce());
	}, pe = (e) => {
		r.setPointerCapture?.(e.pointerId), this._pinHover = !0, de(e);
	}, me = () => {
		this._pinHover = !1, a.style.display = "none", ce();
	};
	this._boundSvg !== I && (this._unbindGraphPointer(), this._boundSvg = I, this._boundWrap = r, this._onMove = (e) => {
		(e.pointerType === "mouse" || this._pinHover || e.pointerType === "touch") && de(e);
	}, this._onLeave = fe, this._onDown = pe, this._onUp = me, r.addEventListener("pointermove", this._onMove, { passive: !0 }), r.addEventListener("pointerleave", fe, { passive: !0 }), r.addEventListener("pointerdown", pe, { passive: !0 }), r.addEventListener("pointerup", me, { passive: !0 }), r.addEventListener("pointercancel", me, { passive: !0 }));
}
//#endregion
//#region src/price-graph-card.ts
var xn = () => window.customCardHelpers || null, Sn = "2026.8.4";
function Cn(e, t, n) {
	return Math.max(t, Math.min(n, e));
}
var wn = class extends be {
	static get properties() {
		return {
			hass: {},
			_config: { state: !0 },
			_dayView: { state: !0 }
		};
	}
	set hass(e) {
		this._hass = e, this._effectiveHassCache = null, this.isConnected && this._scheduleClockUpdate();
		let t = J(e);
		t !== this._loadedLang && (this._loadedLang = t, tt(t).then(() => this.requestUpdate())), this.requestUpdate();
	}
	get hass() {
		if (!this._hass || !this._contextStates || this._hass.states === this._contextStates) return this._hass;
		let e = this._effectiveHassCache;
		if (e?.base === this._hass && e?.states === this._contextStates) return e.value;
		let t = {
			...this._hass,
			states: this._contextStates
		};
		return this._effectiveHassCache = {
			base: this._hass,
			states: this._contextStates,
			value: t
		}, t;
	}
	connectedCallback() {
		if (super.connectedCallback(), this._scheduleClockUpdate(), this._statesUnsubscribe) return;
		let e = new CustomEvent("context-request", {
			bubbles: !0,
			composed: !0,
			cancelable: !0
		});
		e.context = "states", e.subscribe = !0, e.callback = (e, t) => {
			if (typeof t == "function" && (this._statesUnsubscribe = t), !e || e === this._contextStates) return;
			let n = this._contextStates;
			this._contextStates = e, this._effectiveHassCache = null, (!n || this._observedStatesChanged(n, e)) && (this._scheduleClockUpdate(), this.requestUpdate());
		}, this.dispatchEvent(e);
	}
	_observedStatesChanged(e, t) {
		let n = /* @__PURE__ */ new Set();
		this._config?.entity && n.add(this._config.entity);
		for (let e of W(this._config?.content_items)) e.source === "entity" && e.entity && n.add(e.entity);
		for (let [e, t] of [[this._config?.title_item_left, "title"], [this._config?.title_item_right, "attribute"]]) {
			let r = G(e, t, "");
			r.source === "entity" && r.entity && n.add(r.entity);
		}
		for (let r of n) if (e?.[r] !== t?.[r]) return !0;
		return !1;
	}
	static async getConfigElement() {
		return document.createElement(Ce);
	}
	static getStubConfig() {
		return {};
	}
	setConfig(e) {
		if (!e || typeof e != "object") throw Error("Invalid configuration");
		this._config = He(e);
		let t = this._config.day_view_default;
		this._dayView = t === "tomorrow" || t === "two_days" ? t : "today", this._lastDayCtx = null, this._lastGraphSignature = null, this.isConnected && this._scheduleClockUpdate();
	}
	disconnectedCallback() {
		super.disconnectedCallback(), this._statesUnsubscribe?.(), this._statesUnsubscribe = null, this._contextStates = null, this._effectiveHassCache = null, this._unbindGraphPointer(), this._disconnectResizeObserver(), clearTimeout(this._holdTimer), clearTimeout(this._tapTimer), clearTimeout(this._slotHoldTimer), clearTimeout(this._slotTapTimer), clearTimeout(this._clockTimer), this._clockTimer = null, this._lastDayCtx = null, this._lastGraphSignature = null;
	}
	getCardSize() {
		let e = Math.round(this.getBoundingClientRect?.().height || 0);
		if (e > 0) return Math.max(1, Math.ceil(e / 50));
		let t = this._config || {}, n = t.view_mode === "timeline" ? 74 : Number(t.height) || 280, r = W(t.content_items).length, i = Number(t.content_items_max_cols) === 3 ? 3 : 4, a = Math.ceil(r / i), o = 70 + n + 38 + (t.show_day_buttons ? 52 : 0) + a * 120;
		return Math.max(1, Math.ceil(o / 50));
	}
	getGridOptions() {
		return {
			columns: 12,
			rows: "auto",
			min_columns: 6,
			min_rows: 3
		};
	}
	render() {
		return vn.call(this);
	}
	updated() {
		return bn.call(this);
	}
	_getDayCtx(e, t, n) {
		let r = this._lastDayCtx, i = ft(/* @__PURE__ */ new Date(), n).getTime(), a = r && r.st === t && r.cfg === e && r.dayView === this._dayView && r.timeZone === n && r.dayKey === i ? r.value : pn(e, t, this._dayView, n);
		return this._lastDayCtx = {
			st: t,
			cfg: e,
			dayView: this._dayView,
			timeZone: n,
			dayKey: i,
			value: a
		}, a;
	}
	_scheduleClockUpdate() {
		clearTimeout(this._clockTimer), this._clockTimer = setTimeout(() => {
			this._lastGraphSignature = null, this.requestUpdate(), this._scheduleClockUpdate();
		}, ht());
	}
	_buildGraphSignature(e, t, n, r, i, a, o) {
		let s = t?.attributes || {}, c = Array.isArray(s.data) ? s.data : [], l = [
			"currency",
			"unit_of_measurement",
			"tomorrow_status",
			"timeline_status",
			"avg_today",
			"min_today",
			"max_today",
			"p20_today",
			"p70_today",
			"avg_tomorrow",
			"min_tomorrow",
			"max_tomorrow",
			"p20_tomorrow",
			"p70_tomorrow",
			"avg_today_tomorrow",
			"min_today_tomorrow",
			"max_today_tomorrow",
			"p20_today_tomorrow",
			"p70_today_tomorrow",
			"today_rows",
			"tomorrow_rows"
		], u = {};
		for (let e of l) Object.prototype.hasOwnProperty.call(s, e) && (u[e] = s[e]);
		let d = Math.floor(Date.now() / 6e4);
		return JSON.stringify({
			cfg: e,
			dayView: n.dayView,
			twoDayMode: n.twoDayMode,
			dayStart: n.dayStart?.getTime?.() || null,
			dayHours: n.dayHours,
			firstDayHours: n.firstDayHours,
			showPending: n.showPending,
			thresholds: n.thresholds,
			timeline: c,
			metrics: u,
			width: Math.round(r?.clientWidth || i?.clientWidth || this.clientWidth || 0),
			measuredHeight: Math.round(r?.clientHeight || i?.clientHeight || 0),
			height: e.view_mode === "timeline" ? 74 : Number(e.height) || 280,
			lang: a,
			timeZone: o,
			nowMinute: d
		});
	}
	_setDayView(e) {
		let t = fn(e);
		this._dayView !== t && (this._dayView = t, this._lastDayCtx = null, this._lastGraphSignature = null, this.requestUpdate());
	}
	_syncResizeObserver(...e) {
		if (!window.ResizeObserver) return;
		let t = e.filter((e) => !!e);
		if (t.length) {
			this._resizeObserver || (this._resizeObserver = new ResizeObserver((e) => {
				let t = !1;
				for (let n of e) {
					let e = Math.round(n.contentRect?.width || 0), r = Math.round(n.contentRect?.height || 0), i = this._observedSizes?.get(n.target);
					(!i || i.width !== e || i.height !== r) && (this._observedSizes.set(n.target, {
						width: e,
						height: r
					}), t = !0);
				}
				t && (this._lastGraphSignature = null, this.requestUpdate());
			}), this._observedElements = /* @__PURE__ */ new Set(), this._observedSizes = /* @__PURE__ */ new WeakMap());
			for (let e of t) this._observedElements.has(e) || (this._observedElements.add(e), this._resizeObserver.observe(e));
			for (let e of [...this._observedElements]) t.includes(e) || (this._resizeObserver.unobserve(e), this._observedElements.delete(e));
		}
	}
	_disconnectResizeObserver() {
		this._resizeObserver && (this._resizeObserver.disconnect(), this._resizeObserver = null, this._observedElements = null, this._observedSizes = null);
	}
	_unbindGraphPointer() {
		this._boundWrap && (this._boundWrap.removeEventListener("pointermove", this._onMove), this._boundWrap.removeEventListener("pointerleave", this._onLeave), this._boundWrap.removeEventListener("pointerdown", this._onDown), this._boundWrap.removeEventListener("pointerup", this._onUp), this._boundWrap.removeEventListener("pointercancel", this._onUp), this._boundWrap = null, this._boundSvg = null, this._onMove = null, this._onLeave = null, this._onDown = null, this._onUp = null);
	}
	_syncInfoLabelMarquee() {
		(this.renderRoot?.querySelectorAll(".info-label") || []).forEach((e) => {
			let t = e.querySelector(".info-label-text");
			if (!t) return;
			let n = Math.ceil((t.scrollWidth || 0) - (e.clientWidth || 0));
			if (n > 2) {
				e.classList.add("marquee"), e.style.setProperty("--marquee-shift", `${n}px`);
				let t = Cn(4 + n / 22, 4, 12);
				e.style.setProperty("--marquee-duration", `${t}s`);
			} else e.classList.remove("marquee"), e.style.removeProperty("--marquee-shift"), e.style.removeProperty("--marquee-duration");
		});
	}
	_syncInfoValueFit() {
		(this.renderRoot?.querySelectorAll(".info-value") || []).forEach((e) => {
			let t = e.querySelector(".info-value-main");
			if (!t) return;
			let n = e.querySelector(".info-value-unit"), r = Math.max(0, e.clientWidth - 2);
			if (!r) return;
			let i = (i) => (e.style.setProperty("--info-main-size", `${i}px`), (t.scrollWidth || 0) + (n && n.scrollWidth || 0) <= r);
			if (i(24)) return;
			let a = 12, o = 23;
			for (; a < o;) {
				let e = a + o + 1 >> 1;
				i(e) ? a = e : o = e - 1;
			}
			e.style.setProperty("--info-main-size", `${a}px`);
		});
	}
	_hasActionConfig(e) {
		return !!(e && e.action && e.action !== "none");
	}
	_defaultAction(e) {
		return { action: e === "tap" ? "more-info" : "none" };
	}
	_getActionConfig(e) {
		let t = `${e}_action`, n = `${e}_action_target`, r = `${e}_action_entity`, i = this._config?.[t] || this._defaultAction(e);
		if (this._config?.[n] === "other") {
			let e = this._config?.[r] || this._config?.entity;
			return {
				action: i,
				config: {
					...this._config,
					entity: e
				}
			};
		}
		return {
			action: i,
			config: this._config
		};
	}
	_runAction(e) {
		if (!this.hass || !this._config) return;
		let { action: t, config: n } = this._getActionConfig(e);
		this._hasActionConfig(t) && this._dispatchAction(n, e);
	}
	_dispatchAction(e, t) {
		let n = xn();
		if (n?.handleAction) {
			n.handleAction(this, this.hass, e, t);
			return;
		}
		this.dispatchEvent(new CustomEvent("hass-action", {
			bubbles: !0,
			composed: !0,
			detail: {
				action: t,
				config: e
			}
		}));
	}
	_getSlotActionConfig(e, t) {
		let n = e?.actions;
		if (!n?.enabled) return {
			action: { action: "none" },
			config: null
		};
		let r = n[`${t}_action`] || this._defaultAction(t), i = (n.use_target_entity ? n.target_entity : "") || (e?.source === "entity" ? e.entity : "") || this._config?.entity, a = `${t}_action`;
		return {
			action: r,
			config: {
				...this._config,
				entity: i,
				[a]: r
			}
		};
	}
	_runSlotAction(e, t) {
		if (!this.hass || !this._config) return;
		let { action: n, config: r } = this._getSlotActionConfig(e, t);
		!r || !this._hasActionConfig(n) || this._dispatchAction(r, t);
	}
	_onHeaderPointerDown() {
		clearTimeout(this._holdTimer), this._holdFired = !1;
		let { action: e } = this._getActionConfig("hold");
		this._hasActionConfig(e) && (this._holdTimer = setTimeout(() => {
			this._holdFired = !0, this._runAction("hold");
		}, 500));
	}
	_onHeaderPointerUp() {
		clearTimeout(this._holdTimer);
	}
	_onHeaderPointerLeave() {
		clearTimeout(this._holdTimer);
	}
	_onHeaderClick() {
		this._holdFired || (clearTimeout(this._tapTimer), this._tapTimer = setTimeout(() => {
			this._runAction("tap");
		}, 200));
	}
	_onHeaderDblClick() {
		clearTimeout(this._tapTimer), this._runAction("double_tap");
	}
	_onSlotPointerDown(e, t) {
		if (!e?.actions?.enabled) return;
		t?.stopPropagation?.(), clearTimeout(this._slotHoldTimer), this._slotHoldFired = !1;
		let { action: n } = this._getSlotActionConfig(e, "hold");
		this._hasActionConfig(n) && (this._slotHoldTimer = setTimeout(() => {
			this._slotHoldFired = !0, this._runSlotAction(e, "hold");
		}, 500));
	}
	_onSlotPointerUp(e, t) {
		t?.stopPropagation?.(), clearTimeout(this._slotHoldTimer);
	}
	_onSlotPointerLeave(e, t) {
		t?.stopPropagation?.(), clearTimeout(this._slotHoldTimer);
	}
	_onSlotClick(e, t) {
		e?.actions?.enabled && (t?.stopPropagation?.(), !this._slotHoldFired && (clearTimeout(this._slotTapTimer), this._slotTapTimer = setTimeout(() => {
			this._runSlotAction(e, "tap");
		}, 200)));
	}
	_onSlotDblClick(e, t) {
		e?.actions?.enabled && (t?.stopPropagation?.(), clearTimeout(this._slotTapTimer), this._runSlotAction(e, "double_tap"));
	}
	_onDayButtonPointerDown(e) {
		let t = e.currentTarget;
		t && this._runDayButtonRipple(t, e);
	}
	_runDayButtonRipple(e, t) {
		let n = e.querySelector(".pg-btn-state");
		if (!n) return;
		let r = e.getBoundingClientRect(), i = (t.clientX ?? r.left + r.width / 2) - r.left, a = (t.clientY ?? r.top + r.height / 2) - r.top;
		n.style.left = `${i}px`, n.style.top = `${a}px`, n.classList.remove("run"), n.offsetWidth, n.classList.add("run");
	}
};
customElements.get("price-graph-card") || customElements.define(Se, wn), window.customCards = window.customCards || [], window.customCards.push({
	type: Se,
	name: "Price Graph Card",
	description: "Spot market electricity price step graph with auto thresholds.",
	version: Sn
});
//#endregion
//#region src/editor-styles.ts
var Tn = o`
      .wrap { padding: 8px 0; }
      .row { margin-top: 12px; }
      .row ha-form { width: 100%; }
      .hint { font-size: 12px; opacity: 0.8; margin-top: 6px; }
      .two-col { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 12px; margin-top: 12px; }
      .full-row { margin-top: 12px; }
      .toggle-item { display: flex; align-items: center; gap: 10px; }
      .toggle-label { font-size: 13px; }
      .editor-pill-button {
        display: inline-flex;
        align-items: center;
        gap: 8px;
        min-height: 36px;
        padding: 0 14px;
        border: 0;
        border-radius: 18px;
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        font: inherit;
        font-size: 14px;
        font-weight: 500;
        cursor: pointer;
      }
      .editor-pill-button:hover {
        background: color-mix(in srgb, var(--primary-color) 16%, transparent);
      }
      .editor-pill-button ha-icon {
        width: 18px;
        height: 18px;
      }
      .two-col ha-form { width: 100%; }
      .threshold-row { align-items: start; }
      .threshold-toggle { min-height: 56px; padding-top: 9px; box-sizing: border-box; }
      .form-disabled { opacity: 0.55; pointer-events: none; }
      .color-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px; }
      .color-item { display: flex; align-items: center; gap: 10px; }
      .color-swatch {
        width: 40px; height: 34px; border: 1px solid rgba(120,120,120,0.35);
        border-radius: 8px; padding: 0; background: transparent; overflow: hidden;
      }
      .color-swatch input { width: 100%; height: 100%; border: 0; padding: 0; background: transparent; }
      .color-label { font-size: 12px; opacity: 0.8; margin-bottom: 4px; }
      .panel { margin-top: 12px; border: 1px solid rgba(120,120,120,0.25); border-radius: 10px; overflow: hidden; }
      .panel-header { display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; cursor: pointer; }
      .panel-header-left { display: flex; align-items: center; gap: 8px; }
      .panel-header-left ha-svg-icon, .panel-header-left ha-icon { width: 20px; height: 20px; }
      .panel-body { padding: 0 12px 12px 12px; }
      .graph-mode-row { margin-top: 12px; }
      .panel-subtitle { margin-top: 14px; font-size: 12px; font-weight: 600; opacity: 0.75; letter-spacing: 0.02em; text-transform: uppercase; }
      .panel-subsection { border-top: 1px solid rgba(120,120,120,0.2); margin-top: 12px; padding-top: 12px; }
      .panel-subsection.is-first { border-top: 0; margin-top: 0; padding-top: 0; }
      .slot-card {
        margin-top: 10px;
        border: 1px solid rgba(120,120,120,0.22);
        border-radius: 10px;
        padding: 10px;
        background: rgba(120,120,120,0.05);
      }
      .slot-card-title { font-size: 12px; font-weight: 600; opacity: 0.85; margin-bottom: 2px; }
      .slot-actions {
        border-top: 1px solid rgba(120,120,120,0.18);
        margin-top: 12px;
        padding-top: 12px;
      }
      .slot-actions-body {
        margin-top: 10px;
      }
      .slot-action-target-row,
      .action-target-row {
        align-items: start;
      }
      @media (max-width: 520px) {
        .color-grid { grid-template-columns: 1fr; }
      }
    `;
//#endregion
//#region src/editor-options.ts
function En(e, t) {
	let n = e?.states?.[t]?.attributes;
	return !n || typeof n != "object" ? [] : Object.keys(n).filter((e) => e !== "data").sort((e, t) => e.localeCompare(t)).map((e) => ({
		value: e,
		label: e
	}));
}
function Dn(e) {
	return [
		{
			value: "attribute",
			label: q("editor_content_source_attr", e)
		},
		{
			value: "entity",
			label: q("editor_content_source_entity", e)
		},
		{
			value: "price_level",
			label: q("editor_content_source_price", e)
		},
		{
			value: "next_price_level",
			label: q("editor_content_source_next_price_level", e)
		},
		{
			value: "current_price",
			label: q("editor_content_source_current", e)
		},
		{
			value: "price_range",
			label: q("editor_content_source_price_range", e)
		},
		{
			value: "avg_price",
			label: q("editor_content_source_avg_price", e)
		}
	];
}
function On(e, t) {
	return e ? [
		{
			value: "cheap",
			label: q("region_cheap", t)
		},
		{
			value: "normal",
			label: q("region_normal", t)
		},
		{
			value: "expensive",
			label: q("region_expensive", t)
		},
		{
			value: "very_expensive",
			label: q("region_very_expensive", t)
		}
	] : [{
		value: "below_avg",
		label: q("region_below_avg", t)
	}, {
		value: "above_avg",
		label: q("region_above_avg", t)
	}];
}
function kn(e) {
	return [
		{
			value: "selected",
			label: q("editor_price_range_day_selected", e)
		},
		{
			value: "today",
			label: q("label_today", e)
		},
		{
			value: "tomorrow",
			label: q("label_tomorrow", e)
		},
		{
			value: "two_days",
			label: q("label_two_days", e)
		}
	];
}
function An(e, t, n) {
	let r = e.unit_format === "minor" ? Yt(e, t, n) || q("unit_minor", n) : t || q("unit_currency", n);
	return [{
		value: "value_only",
		label: r
	}, {
		value: "per_kwh",
		label: `${r}/kWh`
	}];
}
function jn(e) {
	return [{
		value: "title",
		label: q("editor_content_source_title", e)
	}, ...Dn(e)];
}
function Mn(e) {
	return e === "title_item_left" ? "title" : "attribute";
}
//#endregion
//#region src/editor-sanitize.ts
function Nn(e, t) {
	let n = { ...e };
	delete n.title;
	let r = n.currency_override || "auto", i = r === "auto" ? t() : r === "custom" ? String(n.currency_custom || "").trim().toUpperCase() : r, a = i ? Gt(i) : !1, o = n.unit_format !== "currency";
	if (r === "auto" && delete n.currency_override, r !== "custom" && delete n.currency_custom, o && !a || (delete n.unit_factor, delete n.minor_label), !n.detailed_colors) delete n.use_fixed_p20, delete n.fixed_p20_value, delete n.use_fixed_avg, delete n.fixed_avg_value, delete n.use_fixed_expensive, delete n.fixed_expensive_value;
	else for (let [e, t] of [
		["use_fixed_p20", "fixed_p20_value"],
		["use_fixed_avg", "fixed_avg_value"],
		["use_fixed_expensive", "fixed_expensive_value"]
	]) n[e] || (delete n[e], delete n[t]);
	n.show_day_buttons || (delete n.day_view_default, delete n.two_day_mode);
	for (let e of [
		"tap",
		"hold",
		"double_tap"
	]) n[`${e}_action_target`] !== "other" && (delete n[`${e}_action_target`], delete n[`${e}_action_entity`]);
	for (let [e, t] of [["title_item_left", "title"], ["title_item_right", "attribute"]]) {
		let r = Xe(n[e], t);
		r ? n[e] = r : delete n[e];
	}
	if (Array.isArray(n.content_items)) {
		let e = n.content_items.map(Ze).filter(Boolean);
		e.length ? n.content_items = e : delete n.content_items;
	}
	return n.content_items_position !== "bottom" && delete n.content_items_position, Number(n.content_items_max_cols) === 3 ? n.content_items_max_cols = 3 : delete n.content_items_max_cols, n;
}
//#endregion
//#region src/editor-item-renderers.ts
function Pn(e) {
	return {
		enabled: !!e?.enabled,
		tap_action: e?.tap_action || { action: "more-info" },
		hold_action: e?.hold_action || { action: "none" },
		double_tap_action: e?.double_tap_action || { action: "none" },
		use_target_entity: !!e?.use_target_entity || !!e?.target_entity,
		target_entity: e?.target_entity || ""
	};
}
function Fn({ item: e, index: t, hass: n, lang: r, onPatch: i, onEnableTargetEntity: a }) {
	let o = Pn(e.actions), s = (e) => i({ actions: {
		...o,
		...e
	} }), c = (e) => {
		e?.preventDefault?.(), e?.stopPropagation?.(), a();
	}, l = {
		tap_action: o.tap_action,
		...o.hold_action?.action && o.hold_action.action !== "none" ? { hold_action: o.hold_action } : {},
		...o.double_tap_action?.action && o.double_tap_action.action !== "none" ? { double_tap_action: o.double_tap_action } : {}
	}, u = (e) => q({
		tap_action: "editor_tap_action",
		hold_action: "editor_hold_action",
		double_tap_action: "editor_double_tap_action",
		target_entity: "editor_slot_action_target_entity"
	}[e.name] || e.name, r), d = o.use_target_entity ? R`
    <div class="two-col slot-action-target-row">
      <div class="toggle-item">
        <ha-switch
          .checked=${o.use_target_entity}
          @change=${(e) => s({
		use_target_entity: e.target.checked,
		target_entity: e.target.checked ? o.target_entity : ""
	})}
        ></ha-switch>
        <div class="toggle-label">${q("editor_slot_action_other_entity", r)}</div>
      </div>
      <ha-form
        .hass=${n}
        .data=${{ target_entity: o.target_entity }}
        .schema=${[{
		name: "target_entity",
		selector: { entity: {} }
	}]}
        .computeLabel=${u}
        @value-changed=${(e) => s(e.detail.value)}
      ></ha-form>
    </div>
  ` : R`
    <div class="row">
      <button class="editor-pill-button" type="button" .onclick=${c} .onpointerup=${c}>
        <ha-icon icon="mdi:plus"></ha-icon>
        ${q("editor_slot_action_add_target_entity", r)}
      </button>
    </div>
  `;
	return R`
    <div class="slot-actions">
      <div class="toggle-item">
        <ha-switch
          .checked=${o.enabled}
          @change=${(e) => s({ enabled: e.target.checked })}
        ></ha-switch>
        <div class="toggle-label">${q("editor_slot_actions_enabled", r)}</div>
      </div>
      ${o.enabled ? R`
        <div class="slot-actions-body">
          <ha-form
            .hass=${n}
            .data=${l}
            .schema=${[{
		name: "tap_action",
		selector: { ui_action: { default_action: "more-info" } }
	}, {
		name: "",
		type: "optional_actions",
		flatten: !0,
		schema: ["hold_action", "double_tap_action"].map((e) => ({
			name: e,
			selector: { ui_action: { default_action: "none" } }
		}))
	}]}
            .computeLabel=${u}
            @value-changed=${(e) => s(e.detail.value)}
          ></ha-form>
          ${d}
        </div>
      ` : R``}
    </div>
  `;
}
function In({ item: e, hass: t, lang: n, onPatch: r, mode: i = "content" }) {
	if (e.source === "title") return R``;
	if (e.source === "price_level") return R`
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${!!e.use_color}
              @change=${(e) => r({ use_color: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${q("editor_content_use_color", n)}</div>
          </div>
          <div></div>
        </div>
      `;
	if (e.source === "next_price_level") {
		let i = !!this._config?.detailed_colors;
		return R`
        <div class="row">
          <ha-form
            .hass=${t}
            .data=${{ price_level: Et(e.price_level, i) }}
            .schema=${[{
			name: "price_level",
			selector: { select: {
				mode: "dropdown",
				options: this._nextPriceLevelOptions(n)
			} }
		}]}
            .computeLabel=${() => q("editor_next_price_level", n)}
            @value-changed=${(e) => r({ price_level: e.detail.value.price_level })}
          ></ha-form>
        </div>
      `;
	}
	return e.source === "price_range" || e.source === "avg_price" ? R`
        <div class="row">
          <ha-form
            .hass=${t}
            .data=${{ range_day: e.range_day || "today" }}
            .schema=${[{
		name: "range_day",
		selector: { select: {
			mode: "dropdown",
			options: this._priceRangeDayOptions(n)
		} }
	}]}
            .computeLabel=${() => q("editor_price_range_day", n)}
            @value-changed=${(e) => r({ range_day: e.detail.value.range_day })}
          ></ha-form>
        </div>
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${e.show_unit !== !1}
              @change=${(e) => r({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${q("editor_content_show_unit", n)}</div>
          </div>
          ${e.show_unit === !1 ? R`<div></div>` : R`
            <ha-form
              .hass=${t}
              .data=${{ unit_display_mode: e.unit_display_mode || "per_kwh" }}
              .schema=${[{
		name: "unit_display_mode",
		selector: { select: {
			mode: "dropdown",
			options: this._itemUnitDisplayOptions(n)
		} }
	}]}
              .computeLabel=${() => q("editor_unit_display_mode", n)}
              @value-changed=${(e) => r({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          `}
        </div>
      ` : i === "header" && e.source === "current_price" ? R`
        <div class="two-col">
          <div class="toggle-item">
            <ha-switch
              .checked=${!!e.time_overwrite}
              @change=${(e) => r({ time_overwrite: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${q("editor_current_price_time_overwrite", n)}</div>
          </div>
          <div class="toggle-item">
            <ha-switch
              .checked=${e.show_unit !== !1}
              @change=${(e) => r({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${q("editor_content_show_unit", n)}</div>
          </div>
        </div>
        <div class="two-col">
          <div></div>
          ${e.show_unit === !1 ? R`<div></div>` : R`
            <ha-form
              .hass=${t}
              .data=${{ unit_display_mode: e.unit_display_mode || "per_kwh" }}
              .schema=${[{
		name: "unit_display_mode",
		selector: { select: {
			mode: "dropdown",
			options: this._itemUnitDisplayOptions(n)
		} }
	}]}
              .computeLabel=${() => q("editor_unit_display_mode", n)}
              @value-changed=${(e) => r({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          `}
        </div>
      ` : e.source === "current_price" ? R`
        <div class="two-col">
          <div></div>
          <div class="toggle-item">
            <ha-switch
              .checked=${e.show_unit !== !1}
              @change=${(e) => r({ show_unit: e.target.checked })}
            ></ha-switch>
            <div class="toggle-label">${q("editor_content_show_unit", n)}</div>
          </div>
        </div>
        <div class="two-col">
          <div></div>
          ${e.show_unit === !1 ? R`<div></div>` : R`
            <ha-form
              .hass=${t}
              .data=${{ unit_display_mode: e.unit_display_mode || "per_kwh" }}
              .schema=${[{
		name: "unit_display_mode",
		selector: { select: {
			mode: "dropdown",
			options: this._itemUnitDisplayOptions(n)
		} }
	}]}
              .computeLabel=${() => q("editor_unit_display_mode", n)}
              @value-changed=${(e) => r({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          `}
        </div>
      ` : R`
      <div class="two-col">
        ${e.source === "entity" ? R`
          <ha-form
            .hass=${t}
            .data=${{ entity: e.entity || "" }}
            .schema=${[{
		name: "entity",
		selector: { entity: {} }
	}]}
            .computeLabel=${() => q("editor_content_entity", n)}
            @value-changed=${(e) => r({ entity: e.detail.value.entity })}
          ></ha-form>
        ` : e.source === "current_price" ? R`
          <div></div>
        ` : R`
          <ha-form
            .hass=${t}
            .data=${{ attribute: e.attribute || "" }}
            .schema=${[{
		name: "attribute",
		selector: { select: {
			mode: "dropdown",
			options: this._attributeOptions()
		} }
	}]}
            .computeLabel=${() => q("editor_content_attribute", n)}
            @value-changed=${(e) => r({ attribute: e.detail.value.attribute })}
          ></ha-form>
        `}
        <div class="toggle-item">
          <ha-switch
            .checked=${e.show_unit !== !1}
            @change=${(e) => r({ show_unit: e.target.checked })}
          ></ha-switch>
          <div class="toggle-label">${q("editor_content_show_unit", n)}</div>
        </div>
      </div>
      ${e.source === "attribute" ? R`
        <div class="two-col">
          <div></div>
          ${e.show_unit === !1 ? R`<div></div>` : R`
            <ha-form
              .hass=${t}
              .data=${{ unit_display_mode: e.unit_display_mode || "per_kwh" }}
              .schema=${[{
		name: "unit_display_mode",
		selector: { select: {
			mode: "dropdown",
			options: this._itemUnitDisplayOptions(n)
		} }
	}]}
              .computeLabel=${() => q("editor_unit_display_mode", n)}
              @value-changed=${(e) => r({ unit_display_mode: e.detail.value.unit_display_mode })}
            ></ha-form>
          `}
        </div>
      ` : R``}
    `;
}
function Ln({ item: e, title: t, hass: n, lang: r, sourceOptions: i, sourceFallback: a = "attribute", onPatch: o, mode: s = "content", wrapped: c = !0, showRemove: l = !1, onRemove: u = null, hideLabelWhenCurrentPrice: d = !1 }) {
	let f = R`
      ${t ? R`<div class="slot-card-title">${t}</div>` : R``}
      <div class="two-col">
        ${d && e.source === "current_price" && !e.time_overwrite ? R`<div></div>` : R`
          <ha-textfield
            label="${q("editor_content_label", r)}"
            .value=${e.label || ""}
            @input=${(e) => o({ label: e.target.value })}
          ></ha-textfield>
        `}
        <ha-form
          .hass=${n}
          .data=${{ source: e.source || a }}
          .schema=${[{
		name: "source",
		selector: { select: {
			mode: "dropdown",
			options: i
		} }
	}]}
          .computeLabel=${() => q("editor_content_source", r)}
          @value-changed=${(e) => o({ source: e.detail.value.source })}
        ></ha-form>
      </div>
      ${this._renderItemSourceFields({
		item: e,
		hass: n,
		lang: r,
		onPatch: o,
		mode: s
	})}
      ${l && u ? R`
        <div class="row">
          <ha-button appearance="plain" @click=${u}>
            ${q("editor_content_remove_slot", r)}
          </ha-button>
        </div>
      ` : R``}
    `;
	return c ? R`<div class="slot-card">${f}</div>` : f;
}
function Rn({ item: e, key: t, title: n, hass: r, lang: i }) {
	let a = this._headerDefaultSource(t);
	return this._renderItemEditor({
		item: e,
		title: n,
		hass: r,
		lang: i,
		sourceOptions: this._headerSourceOptions(i),
		sourceFallback: a,
		onPatch: (e) => this._updateHeaderItem(t, e, a),
		mode: "header",
		wrapped: !0,
		showRemove: !1,
		hideLabelWhenCurrentPrice: !0
	});
}
function zn({ item: e, index: t, title: n, hass: r, lang: i, sourceOptions: a, wrapped: o = !0, showRemove: s = !0 }) {
	let c = a || this._contentSourceOptions(i), l = (e) => this._updateContentItem(t, e), u = R`
      ${this._renderItemEditor({
		item: e,
		title: n,
		hass: r,
		lang: i,
		sourceOptions: c,
		sourceFallback: "attribute",
		onPatch: l,
		mode: "content",
		showRemove: s,
		onRemove: () => this._removeContentSlot(t),
		hideLabelWhenCurrentPrice: !1,
		wrapped: !1
	})}
      ${Fn({
		item: e,
		index: t,
		hass: r,
		lang: i,
		onPatch: l,
		onEnableTargetEntity: () => this._enableContentItemTargetEntity(t)
	})}
    `;
	return o ? R`<div class="slot-card">${u}</div>` : u;
}
function Bn({ actionKey: e, targetKey: t, entityKey: n, labelKey: r, hass: i, lang: a }) {
	let o = this._config?.[e];
	if (e !== "tap_action" && (!o?.action || o.action === "none")) return R``;
	let s = this._config?.[t] === "other", c = this._boundComputeLabel ||= this._computeLabel.bind(this), l = (e) => {
		e?.preventDefault?.(), e?.stopPropagation?.(), this._enableActionTargetEntity(t);
	};
	return s ? R`
      <div class="two-col action-target-row">
        <div class="toggle-item">
          <ha-switch
            .checked=${!0}
            @change=${(e) => this._commit({
		...this._config,
		[t]: e.target.checked ? "other" : "default",
		[n]: e.target.checked ? this._config?.[n] : ""
	})}
          ></ha-switch>
          <div class="toggle-label">${q(r, a)}</div>
        </div>
        <ha-form
          .hass=${i}
          .data=${this._config}
          .schema=${[{
		name: n,
		selector: { entity: {} }
	}]}
          .computeLabel=${c}
          @value-changed=${this._valueChanged}
        ></ha-form>
      </div>
    ` : R`
      <div class="row">
        <button class="editor-pill-button" type="button" .onclick=${l} .onpointerup=${l}>
          <ha-icon icon="mdi:plus"></ha-icon>
          ${q("editor_action_add_target_entity", a)}
        </button>
      </div>
    `;
}
//#endregion
//#region src/editor-render.ts
function Vn({ hass: e, lang: t, computeLabel: n, titleItemLeft: r, titleItemRight: i, infoItems: a, sourceOptions: o, currencyOverrideOptions: s, currencyLabel: c, minorLabel: l, showCustomCurrency: u, showMinorLabel: d, showFactor: f, effectiveCurrency: p, thresholdHints: m }) {
	return R`
      <div class="wrap">
        <ha-form
          .hass=${e}
          .data=${this._config}
          .schema=${[{
		name: "entity",
		selector: { entity: {} }
	}]}
          .computeLabel=${n}
          @value-changed=${this._valueChanged}
        ></ha-form>

        ${this._renderPanel("mdi:eye-outline", q("panel_content", t), this._contentOpen, () => {
		this._contentOpen = !this._contentOpen;
	}, () => R`
              <div class="row">
                <ha-form
                  .hass=${e}
                  .data=${this._config}
                  .schema=${[{
		name: "view_mode",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "graph",
				label: q("view_mode_graph", t)
			}, {
				value: "timeline",
				label: q("view_mode_timeline", t)
			}]
		} }
	}]}
                  .computeLabel=${n}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="two-col">
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_day_buttons}
                    @change=${(e) => this._setToggle("show_day_buttons", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_day_buttons")}</div>
                </div>
                <ha-form
                  .hass=${e}
                  .data=${this._config}
                  .schema=${[{
		name: "day_view_default",
		selector: { select: {
			mode: "dropdown",
			options: [
				{
					value: "today",
					label: q("label_today", t)
				},
				{
					value: "tomorrow",
					label: q("label_tomorrow", t)
				},
				{
					value: "two_days",
					label: q("label_two_days", t)
				}
			]
		} }
	}]}
                  .computeLabel=${n}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="row">
                <ha-form
                  .hass=${e}
                  .data=${this._config}
                  .schema=${[{
		name: "two_day_mode",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "span",
				label: q("two_day_mode_span", t)
			}, {
				value: "overlay",
				label: q("two_day_mode_overlay", t)
			}]
		} }
	}]}
                  .computeLabel=${n}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
        `)}

        ${this._renderPanel("mdi:card-text-outline", q("panel_header", t), this._headerOpen, () => {
		this._headerOpen = !this._headerOpen;
	}, () => R`
              ${this._renderHeaderItemEditor({
		item: r,
		key: "title_item_left",
		title: q("editor_header_title_left", t),
		hass: e,
		lang: t
	})}
              ${this._renderHeaderItemEditor({
		item: i,
		key: "title_item_right",
		title: q("editor_header_title_right", t),
		hass: e,
		lang: t
	})}
        `)}

        ${this._renderPanel("mdi:cash-multiple", q("panel_units", t), this._unitsOpen, () => {
		this._unitsOpen = !this._unitsOpen;
	}, () => R`
              <div class="panel-subsection is-first">
                <div class="panel-subtitle">${q("content_section_display", t)}</div>
                <div class="full-row">
                  <ha-form
                    .hass=${e}
                    .data=${this._config}
                    .schema=${[{
		name: "decimals",
		selector: { number: {
			min: 0,
			max: 4,
			step: 1,
			mode: "box"
		} }
	}]}
                    .computeLabel=${n}
                    @value-changed=${this._valueChanged}
                  ></ha-form>
                </div>
              </div>

              <div class="panel-subsection">
                <div class="panel-subtitle">${q("content_section_units", t)}</div>
                <div class="full-row">
                  <ha-form
                    .hass=${e}
                    .data=${this._config}
                    .schema=${[{
		name: "unit_format",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "currency",
				label: `${c}/kWh`
			}, ...l ? [{
				value: "minor",
				label: `${l}/kWh`
			}] : []]
		} }
	}]}
                    .computeLabel=${n}
                    @value-changed=${this._valueChanged}
                  ></ha-form>
                </div>

                <div class="two-col threshold-row">
                  <div class="toggle-item threshold-toggle">
                    <ha-switch
                      .checked=${!!this._config.show_currency_override}
                      @change=${(e) => this._setToggle("show_currency_override", e.target.checked)}
                    ></ha-switch>
                    <div class="toggle-label">${this._label("editor_show_currency_override")}</div>
                  </div>
                  <div class=${this._config.show_currency_override ? "" : "form-disabled"}>
                    <ha-form
                      .hass=${e}
                      .data=${{
		...this._config,
		currency_override: this._config.currency_override || "auto"
	}}
                      .schema=${[{
		name: "currency_override",
		selector: { select: {
			mode: "dropdown",
			options: s
		} }
	}]}
                      .computeLabel=${n}
                      @value-changed=${this._valueChanged}
                    ></ha-form>
                  </div>
                </div>

                ${u || d || f ? R`
                  <div class="two-col">
                    ${u ? R`
                      <ha-textfield
                        label="${q("editor_currency_custom", t)}"
                        .value=${String(this._config.currency_custom ?? "")}
                        @input=${(e) => {
		this._commit({
			...this._config,
			currency_custom: e.target.value
		});
	}}
                      ></ha-textfield>
                    ` : R``}
                    ${d ? R`
                      <ha-textfield
                        label="${q("editor_minor_label", t)}"
                        .value=${String(this._config.minor_label ?? "")}
                        @input=${(e) => {
		this._commit({
			...this._config,
			minor_label: e.target.value
		});
	}}
                      ></ha-textfield>
                    ` : R``}
                    ${f ? R`
                      <ha-textfield
                        label="${q("editor_unit_factor", t)}"
                        type="number"
                        step="1"
                        .value=${String(this._config.unit_factor ?? "")}
                        @input=${this._onFactorChanged}
                      ></ha-textfield>
                    ` : R``}
                  </div>
                  ${f ? R`<div class="hint">${q("unit_factor_hint", t, { currency: p || "?" })}</div>` : R``}
                ` : ""}
              </div>

              <div class="panel-subsection">
                <div class="panel-subtitle">${q("content_section_detailed_colors", t)}</div>
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.detailed_colors}
                    @change=${(e) => this._setToggle("detailed_colors", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_detailed_colors")}</div>
                </div>
              </div>

              ${this._config.detailed_colors ? R`
                <div class="panel-subsection">
                  <div class="panel-subtitle">${q("content_section_thresholds", t)}</div>
                  ${this._renderFixedThresholdRow({
		enabledKey: "use_fixed_p20",
		valueKey: "fixed_p20_value",
		labelKey: "editor_fixed_p20_value",
		placeholderValue: m.p20
	})}
                  ${this._renderFixedThresholdRow({
		enabledKey: "use_fixed_avg",
		valueKey: "fixed_avg_value",
		labelKey: "editor_fixed_avg_value",
		placeholderValue: m.avg
	})}
                  ${this._renderFixedThresholdRow({
		enabledKey: "use_fixed_expensive",
		valueKey: "fixed_expensive_value",
		labelKey: "editor_fixed_expensive_value",
		placeholderValue: m.p70
	})}
                </div>
              ` : R``}
        `)}

        ${this._renderPanel("mdi:view-grid-plus", `${q("panel_extra_slots", t)} (${a.length}/16)`, this._extraSlotsOpen, () => {
		this._extraSlotsOpen = !this._extraSlotsOpen;
	}, () => R`
              <div class="row">
                <ha-form
                  .hass=${e}
                  .data=${this._config}
                  .schema=${[{
		name: "content_items_position",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: "top",
				label: q("content_items_position_top", t)
			}, {
				value: "bottom",
				label: q("content_items_position_bottom", t)
			}]
		} }
	}]}
                  .computeLabel=${n}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>
              <div class="row">
                <ha-form
                  .hass=${e}
                  .data=${this._config}
                  .schema=${[{
		name: "content_items_max_cols",
		selector: { select: {
			mode: "dropdown",
			options: [{
				value: 4,
				label: "4"
			}, {
				value: 3,
				label: "3"
			}]
		} }
	}]}
                  .computeLabel=${n}
                  @value-changed=${this._valueChanged}
                ></ha-form>
              </div>

              ${a.map((n, r) => {
		let i = r, a = `${q("editor_content_grid_slot", t)} ${r + 1}`;
		return this._renderSlotEditor({
			item: n,
			index: i,
			title: a,
			hass: e,
			lang: t,
			sourceOptions: o,
			wrapped: !0,
			showRemove: !0
		});
	})}

              ${a.length < 16 ? R`
                <div class="row">
                  <ha-button appearance="filled" size="small" variant="brand" @click=${this._addContentSlot.bind(this)}>
                    <ha-icon slot="start" icon="mdi:plus"></ha-icon>
                    ${q("editor_content_add_slot", t)}
                  </ha-button>
                </div>
              ` : R``}
        `)}

        ${this._renderPanel("mdi:chart-line-variant", q("panel_graph", t), this._graphOpen, () => {
		this._graphOpen = !this._graphOpen;
	}, () => R`
              <ha-form
                .hass=${e}
                .data=${this._config}
                .schema=${[{
		name: "height",
		selector: { number: {
			min: 160,
			max: 600,
			step: 10,
			mode: "box"
		} }
	}]}
                .computeLabel=${n}
                @value-changed=${this._valueChanged}
              ></ha-form>

              <div class="two-col">
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_now_line}
                    @change=${(e) => this._setToggle("show_now_line", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_now_line")}</div>
                </div>
                <div class="toggle-item">
                  <ha-switch
                    .checked=${!!this._config.show_hover_line}
                    @change=${(e) => this._setToggle("show_hover_line", e.target.checked)}
                  ></ha-switch>
                  <div class="toggle-label">${this._label("editor_show_hover_line")}</div>
                </div>
              </div>

        `)}

        ${this._renderPanel("mdi:gesture-tap", q("panel_actions", t), this._actionsOpen, () => {
		this._actionsOpen = !this._actionsOpen;
	}, () => R`
              <ha-form
                .hass=${e}
                .data=${this._config}
                .schema=${[{
		name: "tap_action",
		selector: { ui_action: { default_action: "more-info" } }
	}, {
		name: "",
		type: "optional_actions",
		flatten: !0,
		schema: ["hold_action", "double_tap_action"].map((e) => ({
			name: e,
			selector: { ui_action: { default_action: "none" } }
		}))
	}]}
                .computeLabel=${n}
                @value-changed=${this._valueChanged}
              ></ha-form>

              ${this._renderOtherEntityAction({
		actionKey: "tap_action",
		targetKey: "tap_action_target",
		entityKey: "tap_action_entity",
		labelKey: "editor_action_other_entity_tap",
		hass: e,
		lang: t
	})}
              ${this._renderOtherEntityAction({
		actionKey: "hold_action",
		targetKey: "hold_action_target",
		entityKey: "hold_action_entity",
		labelKey: "editor_action_other_entity_hold",
		hass: e,
		lang: t
	})}
              ${this._renderOtherEntityAction({
		actionKey: "double_tap_action",
		targetKey: "double_tap_action_target",
		entityKey: "double_tap_action_entity",
		labelKey: "editor_action_other_entity_double",
		hass: e,
		lang: t
	})}
        `)}

        ${this._config.detailed_colors ? R`
          ${this._renderPanel("mdi:palette", this._label("editor_colors_toggle"), this._colorsOpen, () => {
		this._colorsOpen = !this._colorsOpen;
	}, () => R`
                <div class="color-grid">
                  ${Ee.map(({ key: e, label: t, fallback: n }) => R`
                    <div>
                      <div class="color-label">${this._label(t)}</div>
                      <div class="color-item">
                        <div class="color-swatch">
                          <input type="color" .value=${St(this._config[e], n)} @input=${(t) => this._setColor(e, t.target.value)} />
                        </div>
                        <ha-textfield
                          label="#"
                          .value=${St(this._config[e], n)}
                          @input=${(t) => this._setColor(e, t.target.value)}
                        ></ha-textfield>
                      </div>
                    </div>
                  `)}
                </div>
          `)}
        ` : R``}
      </div>
    `;
}
//#endregion
//#region src/editor-thresholds.ts
function Hn() {
	return this._getSensorThresholdValue("p70");
}
function Un(e) {
	let t = this._hass || this.hass, n = t?.states?.[this._config?.entity];
	if (!n) return null;
	let r = n.attributes, i = Z(bt(r), /* @__PURE__ */ new Date(), 0, gt(t));
	return X(cn({
		...this._config,
		use_fixed_p20: !1,
		use_fixed_avg: !1,
		use_fixed_expensive: !1
	}, r, i, 1, "today")?.[e]);
}
function Wn(e) {
	return {
		use_fixed_p20: "fixed_p20_value",
		use_fixed_avg: "fixed_avg_value",
		use_fixed_expensive: "fixed_expensive_value"
	}[e] || "";
}
function Gn(e) {
	let t = {
		use_fixed_p20: "p20",
		use_fixed_avg: "avg",
		use_fixed_expensive: "p70"
	}[e];
	return t ? this._getSensorThresholdValue(t) : null;
}
function Kn(e, t) {
	let n = Number(t);
	this._commit({
		...this._config,
		[e]: Number.isFinite(n) ? n : null
	});
}
function qn({ enabledKey: e, valueKey: t, labelKey: n, placeholderValue: r }) {
	let i = !!this._config[e], a = r == null ? "" : String(Y(r, 3));
	return R`
      <div class="two-col threshold-row">
        <div class="toggle-item threshold-toggle">
          <ha-switch
            .checked=${i}
            @change=${(t) => this._setToggle(e, t.target.checked)}
          ></ha-switch>
          <div class="toggle-label">${this._label(n)}</div>
        </div>
        <ha-textfield
          label="${this._label(n)}"
          type="number"
          step="0.001"
          ?disabled=${!i}
          .value=${String(this._config[t] ?? "")}
          .placeholder=${a}
          @input=${(e) => this._setFixedThresholdValue(t, e.target.value)}
        ></ha-textfield>
      </div>
    `;
}
//#endregion
//#region src/price-graph-card-editor.ts
var Jn = class extends be {
	static get properties() {
		return {
			hass: {},
			_config: { state: !0 },
			_contentOpen: { state: !0 },
			_headerOpen: { state: !0 },
			_unitsOpen: { state: !0 },
			_extraSlotsOpen: { state: !0 },
			_graphOpen: { state: !0 },
			_actionsOpen: { state: !0 },
			_colorsOpen: { state: !0 }
		};
	}
	set hass(e) {
		this._hass = e;
		let t = J(e);
		t !== this._loadedLang && (this._loadedLang = t, tt(t).then(() => this.requestUpdate())), this.requestUpdate();
	}
	get hass() {
		return this._hass;
	}
	static get styles() {
		return Tn;
	}
	setConfig(e) {
		this._config = He(e);
		for (let e of [
			"_contentOpen",
			"_headerOpen",
			"_unitsOpen",
			"_extraSlotsOpen",
			"_graphOpen",
			"_actionsOpen",
			"_colorsOpen"
		]) this[e] === void 0 && (this[e] = !1);
		this._ensureActionEditor();
	}
	_valueChanged(e) {
		this._commit({
			...this._config,
			...e.detail.value
		});
	}
	async _ensureActionEditor() {
		if (!this._actionEditorReady) {
			this._actionEditorReady = !0;
			try {
				if (customElements.get("hui-action-editor")) return;
				let e = await window.loadCardHelpers?.();
				if (!e?.createCardElement) return;
				(await e.createCardElement({ type: "button" }))?.constructor?.getConfigElement?.();
			} catch {}
		}
	}
	_onFactorChanged(e) {
		let t = Number(e.target.value);
		this._commit({
			...this._config,
			unit_factor: Number.isFinite(t) ? t : this._config.unit_factor
		});
	}
	_getCurrency() {
		let e = (this._hass || this.hass)?.states?.[this._config?.entity];
		return e ? Wt(e.attributes) : "";
	}
	_sanitizeConfig(e) {
		return Nn(e, () => this._getCurrency());
	}
	_commit(e) {
		let t = this._sanitizeConfig(e);
		this._config = He(t), this.dispatchEvent(new CustomEvent("config-changed", {
			detail: { config: t },
			bubbles: !0,
			composed: !0
		}));
	}
	_label(e) {
		return q(e, J(this._hass || this.hass));
	}
	_computeLabel(e) {
		return this._label(Ie[e.name] || e.name);
	}
	_setColor(e, t) {
		let n = St(t, this._config[e] || "#ffffff");
		this._commit({
			...this._config,
			[e]: n
		});
	}
	_setToggle(e, t) {
		let n = {
			...this._config,
			[e]: !!t
		};
		e === "detailed_colors" && !t && (n.use_fixed_p20 = !1, n.fixed_p20_value = null, n.use_fixed_avg = !1, n.fixed_avg_value = null, n.use_fixed_expensive = !1, n.fixed_expensive_value = null);
		let r = this._getThresholdDefaultValue(e), i = this._fixedThresholdValueKey(e);
		t && i && n[i] == null && r !== null && (n[i] = r), this._commit(n);
	}
	_contentSourceOptions(e) {
		return Dn(e);
	}
	_attributeOptions() {
		return En(this._hass || this.hass, this._config?.entity);
	}
	_priceRangeDayOptions(e) {
		return kn(e);
	}
	_itemUnitDisplayOptions(e) {
		let t = this._config.currency_override || "auto", n = this._getCurrency(), r = t === "auto" ? n : t === "custom" ? String(this._config.currency_custom || "").trim().toUpperCase() : t;
		return An(this._config, r, e);
	}
	_nextPriceLevelOptions(e) {
		return On(!!this._config?.detailed_colors, e);
	}
	_headerSourceOptions(e) {
		return jn(e);
	}
	_headerDefaultSource(e) {
		return Mn(e);
	}
	_updateHeaderItem(e, t, n = "title") {
		let r = G(this._config[e], n, "");
		this._commit({
			...this._config,
			[e]: {
				...r,
				...t
			}
		});
	}
	_renderItemSourceFields(e) {
		return In.call(this, e);
	}
	_renderItemEditor(e) {
		return Ln.call(this, e);
	}
	_renderHeaderItemEditor(e) {
		return Rn.call(this, e);
	}
	_renderSlotEditor(e) {
		return zn.call(this, e);
	}
	_renderOtherEntityAction(e) {
		return Bn.call(this, e);
	}
	_updateContentItem(e, t) {
		let n = W(this._config.content_items);
		for (; n.length <= e && n.length < 16;) n.push(Re());
		e >= 16 || (n[e] = {
			...n[e] || Re(),
			...t
		}, this._commit({
			...this._config,
			content_items: n
		}));
	}
	_enableContentItemTargetEntity(e) {
		this._updateContentItem(e, { actions: {
			...W(this._config.content_items)[e]?.actions || {},
			use_target_entity: !0
		} });
	}
	_enableActionTargetEntity(e) {
		this._commit({
			...this._config,
			[e]: "other"
		});
	}
	_addContentSlot() {
		let e = W(this._config.content_items);
		e.length >= 16 || (e.push(Re()), this._commit({
			...this._config,
			content_items: e
		}));
	}
	_removeContentSlot(e) {
		let t = W(this._config.content_items);
		e < 0 || e >= t.length || (t.splice(e, 1), this._commit({
			...this._config,
			content_items: t
		}));
	}
	_renderPanel(e, t, n, r, i) {
		return R`
      <div class="panel">
        <div class="panel-header" @click=${r}>
          <div class="panel-header-left">
            <ha-icon icon=${e}></ha-icon>
            <div>${t}</div>
          </div>
          <ha-icon icon=${n ? "mdi:chevron-up" : "mdi:chevron-down"}></ha-icon>
        </div>
        ${n ? R`<div class="panel-body">${i()}</div>` : R``}
      </div>
    `;
	}
	_getP70SensorValue() {
		return Hn.call(this);
	}
	_getSensorThresholdValue(e) {
		return Un.call(this, e);
	}
	_fixedThresholdValueKey(e) {
		return Wn(e);
	}
	_getThresholdDefaultValue(e) {
		return Gn.call(this, e);
	}
	_setFixedThresholdValue(e, t) {
		return Kn.call(this, e, t);
	}
	_renderFixedThresholdRow(e) {
		return qn.call(this, e);
	}
	render() {
		let e = this._hass || this.hass;
		if (!e || !this._config) return R``;
		let t = J(e), n = this._getCurrency(), r = this._config.currency_override || "auto", i = r === "auto" ? n : r === "custom" ? String(this._config.currency_custom || "").trim().toUpperCase() : r, a = i ? Gt(i) : !1, o = this._config.unit_format !== "currency", s = o && !a, c = this._config.show_currency_override && r === "custom", l = o && !a, u = i || q("unit_currency", t), d = Yt(this._config, i, t) || "", f = this._config.detailed_colors ? {
			p20: this._getSensorThresholdValue("p20"),
			avg: this._getSensorThresholdValue("avg"),
			p70: this._getSensorThresholdValue("p70")
		} : {
			p20: null,
			avg: null,
			p70: null
		}, p = this._boundComputeLabel ||= this._computeLabel.bind(this), m = G(this._config.title_item_left, "title", ""), h = G(this._config.title_item_right, "attribute", ""), g = W(this._config.content_items).slice(0, 16), _ = this._contentSourceOptions(t), v = [
			{
				value: "auto",
				label: q("currency_auto", t)
			},
			...De.map((e) => ({
				value: e,
				label: `${e} — ${q(`currency_${e}`, t)}`
			})),
			{
				value: "custom",
				label: q("currency_custom", t)
			}
		];
		return Vn.call(this, {
			hass: e,
			lang: t,
			computeLabel: p,
			titleItemLeft: m,
			titleItemRight: h,
			infoItems: g,
			sourceOptions: _,
			currencyOverrideOptions: v,
			currencyLabel: u,
			minorLabel: d,
			showCustomCurrency: c,
			showMinorLabel: l,
			showFactor: s,
			effectiveCurrency: i,
			thresholdHints: f
		});
	}
};
customElements.get("price-graph-card-editor") || customElements.define(Ce, Jn);
//#endregion
