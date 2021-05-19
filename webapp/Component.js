sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demo/wt/controller/myDialog"
], function (UIComponent, JSONModel, myDialog) {
	"use strict";

	return UIComponent.extend("sap.ui.demo.wt.Component", {

		metadata: {
			manifest: "json"
		},

		init: function () {

			// call the init function of the parent
			UIComponent.prototype.init.apply(this, arguments);

			// set dialog
			this.myDialog = new myDialog();

			// create the views based on the url/hash
			this.getRouter().initialize();
		}
	});

});
