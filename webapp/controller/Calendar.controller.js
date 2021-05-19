sap.ui.define([
		'sap/ui/core/mvc/Controller',
		'sap/ui/model/json/JSONModel',
		'sap/m/MessageBox'
	],
	function (Controller, JSONModel, MessageBox) {
		"use strict";

		return Controller.extend("sap.ui.demo.wt.controller.Calendar", {

			onInit: function () {
			var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

			oRouter.attachRouteMatched(function (oEvent) {
				const route = oEvent.mParameters.config.name;

				if (route == "calendar") {
					this.loadAppointments();
				}
			}.bind(this), this);

			},
			loadAppointments: function () {
				var appointmentsLoad = new JSONModel();
				appointmentsLoad.loadData("http://localhost:8081/appointments");
				
				var self = this;
				appointmentsLoad.attachRequestCompleted(function(oEvent) {
					var appointments = appointmentsLoad.getData();
					appointments.map((res) => {
						var minutes = 30;
						res.start = new Date(res.appointment);
						res.end = new Date(res.start.getTime() + minutes*60000);
						res.title = res.firstname + " " + res.lastname;
						res.type = "Type01";
						res.tentative = false;
					});
					
					var oModel = new JSONModel();
					
					oModel.setData({
						startDate: new Date(),
						people: [{
							name: "Doctor",
							role: "Doctor",
							appointments: appointments
						}
						]
					});
					
					self.getView().setModel(oModel);
				});
			},
			handleAppointmentSelect: function (oEvent) {
				var oAppointment = oEvent.getParameter("appointment"),
					sSelected;
				if (oAppointment) {
					MessageBox.show(this.appointmentString(oAppointment) + " \n Selected appointments: " + this.byId("PC1").getSelectedAppointments().length);
				} else {
					var aAppointments = oEvent.getParameter("appointments");
					var appointments = "";
					aAppointments.forEach(appointment => {
						appointments += this.appointmentString(appointment);
					});
					var sValue = appointments + aAppointments.length + " Appointments selected";
					MessageBox.show(sValue);
				}
			},
			
			appointmentString: function(oAppointment) {
				var starts = this.getDateFormat(oAppointment.mProperties.startDate);
				var ends = this.getDateFormat(oAppointment.mProperties.endDate);
				
				return oAppointment.getTitle() + "\n Starts: "+starts+" \n Ends: "+ends+"\n --- \n";
			},

			handleSelectionFinish: function(oEvent) {
				var aSelectedKeys = oEvent.getSource().getSelectedKeys();
				this.byId("PC1").setBuiltInViews(aSelectedKeys);
			},
			getDateFormat: function(currentdate) {
				return currentdate.getFullYear() + "-"
                + this.addZero(currentdate.getMonth()+1)  + "-" 
                + this.addZero(currentdate.getDate()) + " "  
                + this.addZero(currentdate.getHours()) + ":"  
                + this.addZero(currentdate.getMinutes());
			},
			
			addZero: function(number) {
				return number < 10 ? "0"+number : number;
			},
			
			showAppointmen: function (oEvent) {
				var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				var dt = oRouter.navTo("AppointmentsCreate");
			}
		});

	});