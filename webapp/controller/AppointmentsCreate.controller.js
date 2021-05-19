sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/demo/wt/model/Validator",
	"sap/m/MessageToast"
], function (Controller, JSONModel, Validator, MessageToast) {
	"use strict";

	return Controller.extend("sap.ui.demo.wt.controller.AppointmentsCreate", {
		onInit: function () {
			sap.ui.getCore().attachValidationError(function (oEvent) {
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.Error);
			});

			sap.ui.getCore().attachValidationSuccess(function (oEvent) {
				oEvent.getParameter("element").setValueState(sap.ui.core.ValueState.None);
			});
			
			this.getView().setModel(this.getEmptyModel());
			this.byId("appointmentDate").setMinDate(new Date());
		},
		getEmptyModel: function() {
			return new JSONModel({
				firstname: "",
				lastname: "",
				appointmentDate: "",
				appointmentTime: ""
			});
		},
		timeInputValidation:function(oEvent) {
			var newValue = oEvent.getParameter("newValue");
			var oSource = oEvent.getSource();
			
			this.validateTimeValue(newValue, oSource);
		},
		validateTimeValue: function(newValue, elem) {
			var showError = false;
			
			if (newValue == "") {
				showError = true;
			}else{
				var checkTime = newValue.split(":");
				//h:m
				if (checkTime.length == 2) {
					var hour = parseInt(checkTime[0]);
					if (!(hour > 7 && hour < 17)) {
						showError = true;
					}
				}else{
					showError = true;
				}
			}
			
			if (showError) {
				elem.setValueState(sap.ui.core.ValueState.Error);
				elem.setValueStateText("Select time between 8 and 17 hours");
			}
			
			return showError;
		},
		dateInputValidation: function(oEvent) {
			var newValue = oEvent.getParameter("newValue");
			var oSource = oEvent.getSource();
			
			var showError = this.validateDateValue(newValue, oSource);
		},
		validateDateValue: function(newValue, elem) {
			var showError = false;
			
			if (newValue == "") {
				showError = true;
			}else{
				var checkTime = newValue.split("-");
				if (checkTime.length == 3) {
					var year = parseInt(checkTime[0]);
					var month = parseInt(checkTime[1]);
					var day = parseInt(checkTime[2]);
					
					var todayDate = this.getTodayTime();
					
					if (todayDate.year <= year) {
						if (todayDate.month > month) {
							showError = true;
						}else{
							//Cannot be day earlier
							if (todayDate.month == month && todayDate.day > day) {
								showError = true;
							}
						}
					}else{
						showError = true;
					}
				}else{
					showError = true;
				}
			}
			
			if (showError) {
				elem.setValueState(sap.ui.core.ValueState.Error);
				elem.setValueStateText("You should select this day or future");		
			}
			
			return showError;
		},
		getTodayTime: function() {
			var today = new Date();
			var dd = today.getDate();
			var MM = today.getMonth() + 1;
			var yyyy = today.getFullYear();
			
			return { day: dd, month: MM, year: yyyy };
		},
		create:function() {
			var oModel = this.getView().getModel();
			var oData = oModel.getData();
			
			var validateDate = this.byId("appointmentDate");
			var validateTime = this.byId("appointmentTime");
			// Validate date and time fields
			var checkErrorOnDate = this.validateDateValue(oData.appointmentDate, validateDate);
			var checkErrorOnTime = this.validateTimeValue(oData.appointmentTime, validateTime);

          	var validator = new Validator();
            // Validate input fields
          	validator.validate(this.byId("AppointmentsCreate"));

			if (validator._isValid && !checkErrorOnDate && !checkErrorOnTime) {
				var firstname = oData.firstname;
				var lastname = oData.lastname;
				var appointmentDate = oData.appointmentDate;
				var appointmentTime = oData.appointmentTime;

				var paren = this;
				
				$.ajax({
					url : "http://localhost:8081/appointment",
					contentType : 'application/json',
					data: JSON.stringify(oData),
					type : 'POST'
				})
				.done(function(msg){
					paren.getOwnerComponent().myDialog.open(paren.getView(), oModel);
					paren.getView().setModel(paren.getEmptyModel());
				})
				.fail(function(xhr, status, error, dat) {
					MessageToast.show("Appointment time is taken or you already registered this week", {
						duration: 1000
					});
					paren.showColor('orange');
				});
			}
		},
		showColor: function(color) {
		  var oContentDOM = $('#content'); //Pass div Content ID
		  var oParent = $('#content').parent(); //Get Parent
		  //Find for MessageToast class
		  var oMessageToastDOM = $('#content').parent().find('.sapMMessageToast');
		  oMessageToastDOM.css('background', color);
		},
		showCalendar: function (oEvent) {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			oRouter.navTo("calendar");
		}
	});

});
