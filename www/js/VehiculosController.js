/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorVehiculos', [])
    .controller('BusDeudaCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicHistory, $ionicPopup, $state) {
    if ($rootScope.placa != null) {
        $scope.placaGeneral = $rootScope.placa;
    }
    else {
        $scope.placaGeneral = '';
    }
    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.validarLetrasNumeros = /^[a-zA-Z0-9]{0,1000}$/;
    $scope.consultaDeuda = function (numPlaca) {
        if (numPlaca != null) {
            $rootScope.placa = numPlaca;
        }
        else {
            $rootScope.placa = '';
        }
        if ($rootScope.placa == '') {
            if (numPlaca != null) {
                $rootScope.placa = numPlaca;
            }
            else {
                $rootScope.placa = '';
            }
        }
        else {
            $scope.placaGeneral = $rootScope.placa;
        }
        ServicioDatos.data = {
            placa: numPlaca
        };
        if ($rootScope.globalExample != null) {
            $location.url("app/ve-datos-deuda");
        }
        else {
            $location.url("app/mo-inicio");
        }
    };
})
    .controller('DetalleDeudaCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state, $sce) {
    $scope.isActive = -1;
    $scope.mostrarDeuda = true;
    $scope.mostrarInfraccion = false;
    $scope.showLoadingProperTimes = function () {
        $ionicLoading.show({
            templateUrl: "templates/mo-spinner.html",
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            showDelay: 0
        });
    };
    $scope.hideLoadingProperTimes = function () {
        $ionicLoading.hide();
    };
    $scope.showLoadingProperTimes();
    var urlModulo = '/vehiculos/consulta_deuda';
    var auth_token = $rootScope.globalExample;
    var objetoEntrada = {
        placa: ServicioDatos.data.placa,
        authToken: auth_token,
        crpva: ''
    };
    $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.resultado.then(function (datas) {
        var data = datas.data;
        if (datas.status == 401 || datas.status == 200) {
            try {
                if (data.continuarFlujo != false && data.beanDatosBasicos.tipoVehiculo != 'BAJA') {
                    $scope.placa = data.beanDatosBasicos.identificador;
                    $scope.tipoVehiculo = data.beanDatosBasicos.tipoVehiculo;
                    if (data.bnDetalleDeudas.length > 0) {
                        $scope.deudas = data.bnDetalleDeudas;
                    }
                    $scope.bnDatosTecnicos = data.bnDatosTecnicos;
                    $scope.bnDatosVehiculo = data.bnDatosVehiculo;
                    $scope.estado = data.estado;
                    $scope.observaciones = data.observaciones;
                    $scope.montoTotal = data.montoTotal;
                    $scope.mensajeDeudaPendiente = data.deudasPendientesLiquidacion;
                    $scope.beanDatosBasicos = data.beanDatosBasicos;
                    $scope.hideLoadingProperTimes();
                }
                else {
                    $location.url("app/ve-bus-general");
                    if (data.beanDatosBasicos) {
                        if (data.beanDatosBasicos.tipoVehiculo) {
                            if (data.beanDatosBasicos.tipoVehiculo == "BAJA") {
                                data.mensaje = "El vehículo ha sido dado de baja.";
                            }
                        }
                    }
                    $scope.alertPopup = $ionicPopup.alert({
                        title: 'Alerta',
                        template: data.mensaje,
                        buttons: [
                            {
                                text: 'Aceptar',
                                type: 'button-positive'
                            }
                        ]
                    });
                    $scope.hideLoadingProperTimes();
                }
            }
            catch (err) {
                $scope.hideLoadingProperTimes();
                $scope.alertPopup = $ionicPopup.alert({
                    title: 'Alerta',
                    template: 'No se pudo obtener los datos.',
                    buttons: [
                        {
                            text: 'Aceptar',
                            type: 'button-positive'
                        }
                    ]
                });
                $location.url("app/ve-bus-general");
            }
        }
        else {
            //TODO: Alexeis
            ServiciosRuat.getStatus(datas.status);
            $scope.hideLoadingProperTimes();
            $location.url("app/mo-inicio");
        }
    }, function (reason) {
        $scope.hideLoadingProperTimes();
        $scope.alertPopup = $ionicPopup.alert({
            title: 'Alerta',
            template: 'No se pudo obtener los datos.',
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
        $location.url("app/ve-bus-general");
    });
    $scope.opcion = '';
    $scope.show = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<a><span class="icon ion-document-text"></span>Infracciones e ITV</a>' },
                { text: '<a><span class="icon ion-document-text"></span>Consulta Deuda</a>' },
                { text: '<a><span class="icon ion-printer"></span>Generar Reporte PDF</a>' }
            ],
            destructiveText: 'Cancelar',
            destructiveButtonClicked: function () {
                hideSheet();
            },
            titleText: 'Seleccione una opción',
            buttonClicked: function (index) {
                if (index == 0) {
                    $scope.opcion = 'IN';
                    $scope.mostrarDeuda = false;
                    $scope.mostrarInfraccion = true;
                    if (!$scope.isActive == index) {
                        $scope.$on("$ionicView.enter", function () {
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                        });
                        $scope.showLoadingProperTimes();
                        var urlModulo = '/vehiculos/busca_infracciones_itv';
                        var auth_token = $rootScope.globalExample;
                        var objetoEntrada = {
                            placa: ServicioDatos.data.placa,
                            authToken: auth_token,
                            crpva: ''
                        };
                        $scope.obtenerInfraccion = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
                        $scope.obtenerInfraccion.then(function (datas) {
                            var data = datas.data;
                            if (datas.status == 401 || datas.status == 200) {
                                try {
                                    if (data.continuarFlujo != false) {
                                        if (data.lstBeanInfraccionesVehiculo.length > 0) {
                                            $scope.montoInfTotal = data.montoTotal;
                                            $scope.infracciones = data.lstBeanInfraccionesVehiculo;
                                        }
                                        $scope.hideLoadingProperTimes();
                                    }
                                    else {
                                        $scope.alertPopup = $ionicPopup.alert({
                                            title: 'Alerta',
                                            template: data.mensaje,
                                            buttons: [
                                                {
                                                    text: 'Aceptar',
                                                    type: 'button-positive'
                                                }
                                            ]
                                        });
                                        $scope.hideLoadingProperTimes();
                                        $location.url("app/ve-bus-general");
                                    }
                                }
                                catch (err) {
                                    $scope.hideLoadingProperTimes();
                                    $scope.alertPopup = $ionicPopup.alert({
                                        title: 'Alerta',
                                        template: 'No se pudo obtener los datos.',
                                        buttons: [
                                            {
                                                text: 'Aceptar',
                                                type: 'button-positive'
                                            }
                                        ]
                                    });
                                    $location.url("app/ve-bus-general");
                                }
                            }
                            else {
                                //TODO: Alexeis
                                ServiciosRuat.getStatus(datas.status);
                                $scope.hideLoadingProperTimes();
                                $location.url("app/mo-inicio");
                            }
                        }, function (reason) {
                            $scope.hideLoadingProperTimes();
                            $scope.alertPopup = $ionicPopup.alert({
                                title: 'Alerta',
                                template: 'No se pudo obtener los datos.',
                                buttons: [
                                    {
                                        text: 'Aceptar',
                                        type: 'button-positive'
                                    }
                                ]
                            });
                            $location.url("app/ve-bus-general");
                        });
                    }
                }
                else if (index == 1) {
                    $scope.opcion = 'DE';
                    $scope.mostrarDeuda = true;
                    $scope.mostrarInfraccion = false;
                    if (!$scope.isActive == index) {
                        $scope.$on("$ionicView.enter", function () {
                            $ionicHistory.clearCache();
                            $ionicHistory.clearHistory();
                        });
                    }
                }
                else if (index == 2) {
                    $scope.showLoadingProperTimes();
                    $ionicHistory.clearCache();
                    $ionicHistory.clearHistory();
                    var objetoEntrada = {
                        placa: ServicioDatos.data.placa.toUpperCase(),
                        authToken: $rootScope.globalExample,
                        crpva: ''
                    };
                    if ($scope.opcion == 'IN') {
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $scope.datosURL = $rootScope.urlServicio + '/vehiculos/pdf_infraccion/'
                            + $rootScope.globalExample
                            + '/' + ServicioDatos.data.placa
                            + '/proformaInfraccion.pdf';
                        $scope.hideLoadingProperTimes();
                        window.open($scope.datosURL, '_system', 'location=yes');
                        return false;
                    }
                    else {
                        $ionicHistory.clearCache();
                        $ionicHistory.clearHistory();
                        $scope.datosURL = $rootScope.urlServicio + '/vehiculos/pdf_deuda/'
                            + $rootScope.globalExample
                            + '/' + ServicioDatos.data.placa
                            + '/proformaDeuda.pdf';
                        $scope.hideLoadingProperTimes();
                        window.open($scope.datosURL, '_system', 'location=yes');
                        return false;
                    }
                }
                return true;
            }
        });
    };
    $scope.popup = function (infraccion) {
        var gestion;
        if (infraccion.gestion != '') {
            gestion = infraccion.gestion;
        }
        else if (infraccion.fecha != '') {
            gestion = infraccion.fecha;
        }
        else {
            gestion = "--";
        }
        $ionicPopup.alert({
            title: 'Detalle Infracción',
            template: '<b>Descripción: </b>' + infraccion.descripcion + ' <br /><b>Boleta: </b>' + infraccion.boleta +
                '<br/><b>Serie: </b>' + infraccion.serie + '<br /><b>Código: </b>' + infraccion.servicio +
                '<br /><b>Gestión: </b>' + gestion +
                '<br /><b>Monto (Bs.): </b>' + infraccion.monto,
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
    };
    $scope.popupDeuda = function (deuda) {
        var observacion = deuda.observacion;
        var concepto = deuda.concepto;
        var montos = deuda.montoBs;
        if (montos == undefined) {
            montos = '--';
        }
        else {
            if (montos == '0') {
                montos = '--';
            }
        }
        if (observacion == undefined) {
            observacion = '--';
        }
        if (concepto == undefined) {
            concepto = '';
        }
        else {
            concepto = '<b>Concepto: </b>' + deuda.concepto + ' <br />';
        }
        var gestion = '--';
        if (deuda.gestion == undefined) {
            gestion = '--';
        }
        else {
            gestion = deuda.gestion;
        }
        $ionicPopup.alert({
            title: 'Detalle Deuda',
            template: concepto + '<b>Gestión: </b>' + gestion +
                '<br/><b>Monto (Bs.): </b>' + montos +
                '<br /><b>Observación: </b>' + observacion,
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
    };
})
    .controller('DetVehCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    if ($rootScope.placa != null) {
        $scope.placaRoot = $rootScope.placa;
    }
    else {
        $rootScope.placa = '';
    }
    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.validarLetrasNumeros = /^[a-zA-Z0-9]{6,8}$/;
    $scope.validarCrpva = /^[a-zA-Z0-9]{5,10}$/;
    $scope.consultaDetallada = function (placa, crpva) {
        if (placa != null) {
            $rootScope.placa = placa;
        }
        else {
            $rootScope.placa = '';
        }
        if ($rootScope.placa == '') {
            if (placa != null) {
                $rootScope.placa = placa;
            }
            else {
                $rootScope.placa = '';
            }
        }
        else {
            $scope.placaRoot = $rootScope.placa;
        }
        ServicioDatos.data = {
            placa: placa,
            crpva: crpva
        };
        if ($rootScope.globalExample != null) {
            $location.url("app/ve-datos-detalle");
        }
        else {
            $location.url("app/mo-inicio");
        }
    };
})
    .controller('VeDatosDetCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.showLoadingProperTimes = function () {
        $ionicLoading.show({
            templateUrl: "templates/mo-spinner.html",
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            showDelay: 0
        });
    };
    $scope.hideLoadingProperTimes = function () {
        $ionicLoading.hide();
    };
    $scope.showLoadingProperTimes();
    var urlModulo = '/vehiculos/consulta_detallada';
    var auth_token = $rootScope.globalExample;
    var objetoEntrada = {
        placa: ServicioDatos.data.placa.toUpperCase(),
        authToken: auth_token,
        crpva: ServicioDatos.data.crpva.toUpperCase()
    };
    $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.resultado.then(function (datas) {
        var data = datas.data;
        if (datas.status == 401 || datas.status == 200) {
            try {
                if (data.continuarFlujo != false && data.beanDatosBasicos.tipoVehiculo != 'BAJA') {
                    $scope.radicatoria = data.radicatoria;
                    $scope.bnDatosVehiculo = data.bnDatosVehiculo;
                    $scope.datosTecnicosDetalle = data.beanDatosTecnicosDetalle;
                    $scope.tipoCotribuyente = data.tipoContribuyente;
                    if ($scope.tipoCotribuyente == 'JU') {
                        $scope.beanContribuyenteJuridico = data.beanContribuyenteJuridico;
                    }
                    else {
                        $scope.beanContribuyenteNatural = data.beanContribuyenteNatural;
                    }
                    $scope.beanBusquedaVehiculo = data.beanBusquedaVehiculo;
                    $scope.beanDatosServicio = data.beanDatosServicio;
                    /***DAI***/
                    $scope.direcciones = data.direccion;
                    $scope.datosEntrada = objetoEntrada;
                    $scope.hideLoadingProperTimes();
                }
                else {
                    if (data.beanDatosBasicos) {
                        if (data.beanDatosBasicos.tipoVehiculo) {
                            if (data.beanDatosBasicos.tipoVehiculo == "BAJA") {
                                data.mensaje = "El vehículo ha sido dado de baja.";
                            }
                        }
                    }
                    $scope.alertPopup = $ionicPopup.alert({
                        title: 'Alerta',
                        template: data.mensaje,
                        buttons: [
                            {
                                text: 'Aceptar',
                                type: 'button-positive'
                            }
                        ]
                    });
                    $scope.hideLoadingProperTimes();
                    $location.url("app/ve-bus-detalle");
                }
            }
            catch (err) {
                $scope.hideLoadingProperTimes();
                $scope.alertPopup = $ionicPopup.alert({
                    title: 'Alerta',
                    template: 'No se pudo obtener los datos.',
                    buttons: [
                        {
                            text: 'Aceptar',
                            type: 'button-positive'
                        }
                    ]
                });
                $location.url("app/ve-bus-detalle");
            }
        }
        else {
            //TODO: Alexeis
            ServiciosRuat.getStatus(datas.status);
            $scope.hideLoadingProperTimes();
            $location.url("app/mo-inicio");
        }
    }, function (reason) {
        $scope.hideLoadingProperTimes();
        $scope.alertPopup = $ionicPopup.alert({
            title: 'Alerta',
            template: 'No se pudo obtener los datos.',
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
        $location.url("app/ve-bus-detalle");
    });
    $scope.show = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<a><span class="icon ion-document-text"></span>Infracciones e ITV</a>' },
                { text: '<a><span class="icon ion-document-text"></span>Consulta Deuda</a>' }
            ],
            destructiveText: 'Cancelar',
            destructiveButtonClicked: function () {
                hideSheet();
            },
            titleText: 'Seleccione una opción',
            buttonClicked: function (index) {
                return true;
            }
        });
    };
})
    .controller('VeBusItvCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicHistory, $ionicPopup, $state) {
    if ($rootScope.placa != null) {
        $scope.placaGeneral = $rootScope.placa;
    }
    else {
        $scope.placaGeneral = '';
    }
    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $scope.validarLetrasNumeros = /^[a-zA-Z0-9]{0,1000}$/;
    $scope.consultaDeuda = function (numPlaca) {
        if (numPlaca != null) {
            $rootScope.placa = numPlaca;
        }
        else {
            $rootScope.placa = '';
        }
        if ($rootScope.placa == '') {
            if (numPlaca != null) {
                $rootScope.placa = numPlaca;
            }
            else {
                $rootScope.placa = '';
            }
        }
        else {
            $scope.placaGeneral = $rootScope.placa;
        }
        ServicioDatos.data = {
            placa: numPlaca
        };
        if ($rootScope.globalExample != null) {
            $location.url("app/ve-datos-itv");
        }
        else {
            $location.url("app/mo-inicio");
        }
    };
})
    .controller('VeDatosItvCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state, $sce) {
    $scope.showLoadingProperTimes = function () {
        $ionicLoading.show({
            templateUrl: "templates/mo-spinner.html",
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            showDelay: 0
        });
    };
    $scope.hideLoadingProperTimes = function () {
        $ionicLoading.hide();
    };
    $scope.showLoadingProperTimes();
    var urlModulo = '/vehiculos/busca_infracciones_itv';
    var auth_token = $rootScope.globalExample;
    var objetoEntrada = {
        placa: ServicioDatos.data.placa,
        authToken: auth_token,
        crpva: ''
    };
    $scope.obtenerInfraccion = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.obtenerInfraccion.then(function (datas) {
        var data = datas.data;
        if (datas.status == 401 || datas.status == 200) {
            try {
                if (data.continuarFlujo != false) {
                    $scope.datosIdentificacion = data.bnVehiculoIdentificacion;
                    $scope.datosTecnicos = data.bnVehiculoDatosTecnicos;
                    if (data.lstBeanInfraccionesVehiculo.length > 0) {
                        $scope.montoInfTotal = data.montoTotal;
                        $scope.infracciones = data.lstBeanInfraccionesVehiculo;
                    }
                    $scope.hideLoadingProperTimes();
                }
                else {
                    $scope.alertPopup = $ionicPopup.alert({
                        title: 'Alerta',
                        template: data.mensaje,
                        buttons: [
                            {
                                text: 'Aceptar',
                                type: 'button-positive'
                            }
                        ]
                    });
                    $scope.hideLoadingProperTimes();
                    $location.url("app/ve-bus-itv");
                }
            }
            catch (err) {
                $scope.hideLoadingProperTimes();
                $scope.alertPopup = $ionicPopup.alert({
                    title: 'Alerta',
                    template: 'No se pudo obtener los datos.',
                    buttons: [
                        {
                            text: 'Aceptar',
                            type: 'button-positive'
                        }
                    ]
                });
                $location.url("app/ve-bus-itv");
            }
        }
        else {
            //TODO: Alexeis
            ServiciosRuat.getStatus(datas.status);
            $scope.hideLoadingProperTimes();
            $location.url("app/mo-inicio");
        }
    }, function (reason) {
        $scope.hideLoadingProperTimes();
        $scope.alertPopup = $ionicPopup.alert({
            title: 'Alerta',
            template: 'No se pudo obtener los datos.',
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
        $location.url("app/ve-bus-itv");
    });
    $scope.show = function () {
        var hideSheet = $ionicActionSheet.show({
            buttons: [
                { text: '<a><span class="icon ion-printer"></span>Generar Reporte PDF</a>' }
            ],
            destructiveText: 'Cancelar',
            destructiveButtonClicked: function () {
                hideSheet();
            },
            titleText: 'Seleccione una opción',
            buttonClicked: function (index) {
                $scope.showLoadingProperTimes();
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                var objetoEntrada = {
                    placa: ServicioDatos.data.placa.toUpperCase(),
                    authToken: $rootScope.globalExample,
                    crpva: ''
                };
                $ionicHistory.clearCache();
                $ionicHistory.clearHistory();
                $scope.datosURL = $rootScope.urlServicio + '/vehiculos/pdf_infraccion/'
                    + $rootScope.globalExample
                    + '/' + ServicioDatos.data.placa
                    + '/proformaInfraccion.pdf';
                $scope.hideLoadingProperTimes();
                window.open($scope.datosURL, '_system', 'location=yes');
                return false;
            }
        });
    };
    $scope.popup = function (infraccion) {
        var gestion;
        if (infraccion.gestion != '') {
            gestion = infraccion.gestion;
        }
        else {
            gestion = infraccion.fecha;
        }
        $ionicPopup.alert({
            title: 'Detalle Infracción',
            template: '<b>Descripción: </b>' + infraccion.descripcion + ' <br /><b>Boleta: </b>' + infraccion.boleta +
                '<br/><b>Serie: </b>' + infraccion.serie + '<br /><b>Código: </b>' + infraccion.servicio +
                '<br /><b>Gestión: </b>' + gestion +
                '<br /><b>Monto (Bs.): </b>' + infraccion.monto,
            buttons: [
                {
                    text: 'Aceptar',
                    type: 'button-positive'
                }
            ]
        });
    };
});
