/** ------------------------------
	介绍：division仿淘宝四级联动
	日期：2019-3-6
	作者：陈清元
	初始化html：
	<div class="cndzk-entrance-division suspend" style="width:500px;">
		<div class="cndzk-entrance-division-header">
			<span class="cndzk-entrance-division-header-label"><div class="next-form-item-label"><label required="">地址信息:</label></div></span>
			<div class="cndzk-entrance-division-header-click">
				<span class="cndzk-entrance-division-header-click-input">
					<p class="placeholder">请选择省/市/区/街道</p>
				</span>
				<span class="cndzk-entrance-division-header-click-icon"></span>
			</div>
		</div>
		<div class="cndzk-entrance-division-box" style="display:none;">
			<ul class="cndzk-entrance-division-box-title"><li class="cndzk-entrance-division-box-title-level active" style="width: 25%;">省</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">市</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">区</li><li class="cndzk-entrance-division-box-title-level " style="width: 25%;">街道</li></ul>
			<ul class="cndzk-entrance-division-box-content"><div></div></ul>
		</div>
	</div>
	支持验证：须添加验证控件
	<!--验证控件[ OPTIONAL ]-->
	<link href="/js/plugins/bootstrap-validator/bootstrapValidator.css" rel="stylesheet">
	<script src="/js/plugins/bootstrap-validator/bootstrapValidator.min.js"></script>
------------------------------ **/
;(function () {
	'use strict';
	

	/**
	* Windows Phone 8.1 fakes user agent string to look like Android and iPhone.
	*
	* @type boolean
	*/
	var deviceIsWindowsPhone = navigator.userAgent.indexOf("Windows Phone") >= 0;

	/**
	 * Android requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsAndroid = navigator.userAgent.indexOf('Android') > 0 && !deviceIsWindowsPhone;


	/**
	 * iOS requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsIOS = /iP(ad|hone|od)/.test(navigator.userAgent) && !deviceIsWindowsPhone;


	/**
	 * iOS 4 requires an exception for select elements.
	 *
	 * @type boolean
	 */
	var deviceIsIOS4 = deviceIsIOS && (/OS 4_\d(_\d)?/).test(navigator.userAgent);


	/**
	 * iOS 6.0-7.* requires the target element to be manually derived
	 *
	 * @type boolean
	 */
	var deviceIsIOSWithBadTarget = deviceIsIOS && (/OS [6-7]_\d/).test(navigator.userAgent);

	/**
	 * BlackBerry requires exceptions.
	 *
	 * @type boolean
	 */
	var deviceIsBlackBerry10 = navigator.userAgent.indexOf('BB10') > 0;

	 /**
	 * Instantiate division.
	 *
	 * @constructor
	 * @param {Element} layer The Element to listen on
	 * @param {Object} [options={}] The options to override the defaults
	 */
	function division(layer, options) {
		options = options || {};
	}

	 /**
	 * 区域显示框点击事件.
	 *
	 * @param {EventTarget|Element} target Target DOM element
	 * @returns {boolean} Returns true if the element needs a native click
	 */
	division.prototype.needsClick = function(target) {

	};

}());