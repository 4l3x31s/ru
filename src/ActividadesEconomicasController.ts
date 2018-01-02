/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorActividadesEconomicas', [])
  .controller('AeBusGralCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                         ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });
    $scope.identificadorActEco = '';
    if ($rootScope.numActEco != null) {
      $scope.identificadorActEco = $rootScope.numActEco;
    } else {
      $scope.identificadorActEco = '';
    }
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
    $scope.validarActividadEconomica = /^[a-zA-Z0-9-]{1,25}$/;
    $scope.showLoadingProperTimes();
    var urlModulo = '/actividades_economicas/criterio_alcaldia';
    var auth_token = $rootScope.globalExample;
    $scope.resultado = ServiciosRuat.getGlobal(urlModulo + '/' + auth_token);
    $scope.resultado.then(function (datas) {
      if ($rootScope.numActEco != null) {
        $scope.identificadorActEco = $rootScope.numActEco;
      } else {
        $scope.identificadorActEco = '';
      }
      $scope.hideLoadingProperTimes();
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          $scope.alcaldias = data;

        } catch (err) {
          $scope.hideLoadingProperTimes();
        }
      }else{
        //TODO: Alexeis
        ServiciosRuat.getStatus(datas.status);
        $scope.hideLoadingProperTimes();
        $location.url("app/mo-inicio");
      }

    }, function (reason) {
      $scope.hideLoadingProperTimes();
      $location.url("app/mo-inicio");
    });
    $scope.buscarActividad = function (identificador: string, criterio: string, codAlcaldia: string) {
      $rootScope.numActEco = identificador;
      ServicioDatos.data = {
        identificador: identificador,
        codAlcaldia: codAlcaldia,
        criterio: criterio
      };
      if ($rootScope.globalExample != null) {
        $location.url("app/ae-datos-general");
      } else {
        $location.url("app/mo-inicio");
      }
    }
  })
  .controller('AeBusDetCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                        ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });
    $scope.identificadorActEco = '';
    if ($rootScope.numActEco != null) {
      $scope.identificadorActEco = $rootScope.numActEco;
    } else {
      $scope.identificadorActEco = '';
    }
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
    $scope.validarActividadEconomica = /^[a-zA-Z0-9-]{1,25}$/;
    $scope.validarCI = /^[a-zA-Z0-9-]{1,13}$/;
    $scope.showLoadingProperTimes();
    var urlModulo = '/actividades_economicas/criterio_alcaldia';
    var auth_token = $rootScope.globalExample;
    $scope.resultado = ServiciosRuat.getGlobal(urlModulo + '/' + auth_token);
    $scope.resultado.then(function (datas) {
      if ($rootScope.numActEco != null) {
        $scope.identificadorActEco = $rootScope.numActEco;
      } else {
        $scope.identificadorActEco = '';
      }
      $scope.hideLoadingProperTimes();
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          $scope.alcaldias = data;
        } catch (err) {
          $scope.hideLoadingProperTimes();
        }
      }else{
        //TODO: Alexeis
        ServiciosRuat.getStatus(datas.status);
        $scope.hideLoadingProperTimes();
        $location.url("app/mo-inicio");
      }
    }, function (reason) {
      $scope.hideLoadingProperTimes();
      $location.url("app/mo-inicio");
    })
    $scope.buscarDetalle = function (identificador: string, criterio: string, codAlcaldia: string, nroIdentificacion: string) {
      $rootScope.numActEco = identificador;
      ServicioDatos.data = {
        identificador: identificador,
        codAlcaldia: codAlcaldia,
        criterio: criterio,
        nroIdentificacion: nroIdentificacion
      }
      if ($rootScope.globalExample != null) {
        $location.url("app/ae-datos-detalle");
      } else {
        $location.url("app/mo-inicio");
      }
    }
  })
  .controller('AeDatosGralCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                           ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
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
    var urlModulo = '/actividades_economicas/consulta_deuda';
    var auth_token = $rootScope.globalExample;
    var objetoEntrada = {
      authToken: $rootScope.globalExample,
      identificador: ServicioDatos.data.identificador,
      codAlcaldia: ServicioDatos.data.codAlcaldia,
      criterio: ServicioDatos.data.criterio,
      documento: ''
    };
    $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.resultado.then(function (datas) {
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          $scope.hideLoadingProperTimes();
          if (data.continuarFlujo != true) {
            $scope.hideLoadingProperTimes();
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
            $location.url("app/ae-bus-general");
          } else {
            $scope.datosGenerales = data.datosGenerales;
            $scope.datosIdentificacion = data.datosIdentificacion;
            $scope.lstObservaciones = data.lstObservaciones;
            $scope.lstDeudas = data.datosDeudas;
            $scope.mensajeLiquidacion = data.mensajeLiquidacion;
            $scope.montoAcumulado = data.montoAcumulado;
            $scope.saldoFavor = data.saldoFavor;
          }
        } catch (err) {
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
          $location.url("app/ae-bus-general");
        }
      }else{
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
      $location.url("app/ae-bus-general");
    });
    $scope.detallePopup = function (deuda) {
      var observacion = deuda.observacion;
      var concepto = deuda.concepto;
      var montos = deuda.montoBs;
      var gestion = deuda.gestion;
      if (deuda.tipoImpuesto == 'RE') {
        gestion = 'N/A'
      }
      if (montos == undefined) {
        montos = '--';
      } else {
        if (montos == '0') {
          montos = '--';
        }
      }
      if (observacion == undefined) {
        observacion = '--'
      }
      if (concepto == undefined) {
        concepto = '';
      } else {
        concepto = '<b>Concepto: </b>' + deuda.concepto + ' <br />';
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

    $scope.show = function () {
      var hideSheet = $ionicActionSheet.show({
        buttons: [
          {text: '<a><span class="icon ion-document-text"></span>Generar Reporte</a>'}
        ],
        destructiveText: 'Cancelar',
        destructiveButtonClicked: function () {
          hideSheet();
        },
        titleText: 'Seleccione una opción',
        buttonClicked: function (index) {
          if (index == 0) {
            $scope.showLoadingProperTimes();
            var objetoEntrada = {
              authToken: $rootScope.globalExample,
              identificador: ServicioDatos.data.identificador,
              codAlcaldia: ServicioDatos.data.codAlcaldia,
              criterio: ServicioDatos.data.criterio,
              documento: ''
            };
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.datosURL = $rootScope.urlServicio + '/actividades_economicas/pdf_deuda/'
              + $rootScope.globalExample
              + '/' + ServicioDatos.data.identificador
              + '/' + ServicioDatos.data.codAlcaldia
              + '/' + ServicioDatos.data.criterio
              + '/proformaActividadEc.pdf';
            $scope.hideLoadingProperTimes();
            window.open($scope.datosURL, '_system', 'location=yes')
            return false;
          }
          return true;
        }
      });
    }

  })
  .controller('AeDatosDetCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                          ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
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
    var urlModulo = '/actividades_economicas/consulta_detallada';
    var auth_token = $rootScope.globalExample;
    var objetoEntrada = {
      authToken: $rootScope.globalExample,
      identificador: ServicioDatos.data.identificador,
      codAlcaldia: ServicioDatos.data.codAlcaldia,
      criterio: ServicioDatos.data.criterio,
      documento: ServicioDatos.data.nroIdentificacion
    };
    $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.resultado.then(function (datas) {
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          $scope.hideLoadingProperTimes();
          if (data.continuarFlujo == true) {
            $scope.identificacion = data.datosIdentificacion;
            $scope.datosPropietario = data.datosPropietario;
            $scope.datosActEcoConsulta = data.datosActEcoConsulta;
            $scope.datosUbicacion = data.datosUbicacion;
            $scope.datosPeriodoActEco = data.datosPeriodoActEco;
            $scope.grillaUbicacion = data.lstGrillaUbicacion;
          } else {
            $scope.hideLoadingProperTimes();
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
            $location.url("app/ae-bus-detalle");
          }
        } catch (err) {
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
          $location.url("app/ae-bus-detalle");
        }
      }else{
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
      $location.url("app/ae-bus-detalle");
    })
    $scope.mostrarDetallado = function (periodo) {
      var tipoActividad = (periodo.tipoActividad == undefined) ? '--' : periodo.tipoActividad;
      var fechaInicioPeriodo = (periodo.fechaInicioPeriodo == undefined) ? '--' : periodo.fechaInicioPeriodo;
      var fechaFinPeriodo = (periodo.fechaFinPeriodo == undefined) ? '--' : periodo.fechaFinPeriodo;
      var superficie = (periodo.superficie == undefined) ? '--' : periodo.superficie;
      var zona = (periodo.zona == undefined) ? '--' : periodo.zona;
      $ionicPopup.alert({
        title: 'Detalle',
        template: '<b>Tipo Actividad: </b>' + tipoActividad + '<br/><b>Fecha Inicio Periodo: </b>' + fechaInicioPeriodo +
        '<br/><b>Fecha Fin Periodo: </b>' + fechaFinPeriodo + '<br /><b>Superficie (m2): </b>' + superficie +
        '<br /><b>Zona: </b>' + zona,
        buttons: [
          {
            text: 'Aceptar',
            type: 'button-positive'
          }
        ]
      });
    }
  })
