/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorTasasOtrosIngresos', [])
  .controller('TsBusCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                     ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    if ($rootScope.numTasa != null) {
      $scope.identificadorTasa = $rootScope.numTasa;
    } else {
      $scope.identificadorTasa = '';
    }
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
    $scope.validarTasa = /^[0-9]{4,10}$/;
    $scope.showLoadingProperTimes();
    var cmbxTablas = new Array();
    var propiedades = {
      id: "TO",
      titulo: "TASA Y OTRO INGRESO/VALORADOS"
    }
    cmbxTablas[0] = propiedades;
    var propiedades = {
      id: "ME",
      titulo: "PUESTO MERCADO"
    }
    cmbxTablas[1] = propiedades;
    var propiedades = {
      id: "CE",
      titulo: "SEPULTURA/CONCESIÓN CEMENTERIO"
    }
    cmbxTablas[2] = propiedades;
    var propiedades = {
      id: "AR",
      titulo: "ARBITRIO MUNICIPAL"
    }
    cmbxTablas[3] = propiedades;

    $scope.tipoTasas = cmbxTablas;
    var urlModulo = '/tasas/criterio_alcaldia';
    var auth_token = $rootScope.globalExample;
    $scope.resultado = ServiciosRuat.getGlobal(urlModulo + '/' + auth_token);
    $scope.resultado.then(function (datas) {
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
    $scope.buscarTasa = function (numTasa: string, codAlcaldia: string, codTasa: string) {
      $scope.showLoadingProperTimes();
      if ($rootScope.numTasa == '') {
        if (numTasa != null) {
          $rootScope.numTasa = numTasa;
        } else {
          $rootScope.numTasa = '';
        }
      } else {
        $rootScope.numTasa = numTasa;
      }
      ServicioDatos.data = {
        identificador: numTasa,
        codAlcaldia: codAlcaldia,
        codTasa: codTasa
      }
      $location.url("app/ts-datos-general");
    }
  })
  .controller('TsDatosCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                       ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
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
    var urlModulo = '/tasas/busca_tasa';
    var auth_token = $rootScope.globalExample;
    $scope.tasaElegida = ServicioDatos.data.codTasa;
    var objetoEntrada = {
      authToken: auth_token,
      identificador: ServicioDatos.data.identificador,
      codAlcaldia: ServicioDatos.data.codAlcaldia,
      codTasa: ServicioDatos.data.codTasa
    };
    $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
    $scope.resultado.then(function (datas) {
      $scope.hideLoadingProperTimes();
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          $scope.tasaElegida = ServicioDatos.data.codTasa;
          if (data.continuarFlujo == true) {

            if (data.beanDatosOtrosIngresos != undefined) {
              $scope.subTipoTasa = data.beanDatosOtrosIngresos.bnDatosIdentificacionTasasOI.tipoTasa;
            }
            $scope.respuesta = data;
          } else {
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
            $location.url("app/ts-bus-general");
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
          $location.url("app/ts-bus-general");
        }
      }else{
        //TODO: Alexeis
        ServiciosRuat.getStatus(datas.status);
        $scope.hideLoadingProperTimes();
        $location.url("app/mo-inicio");
      }
    });

    $scope.consultaDeudaTO = function (deuda, datosIdentificacion) {
      var observacion = deuda.observacion;
      var concepto = deuda.concepto;
      var montos = deuda.montoBs;
      var codigo = deuda.codigo;
      var desde = deuda.desde;
      var hasta = deuda.hasta;
      var cantidad = deuda.cantidad;
      var costoUnitario = deuda.costoUnitario;
      var tipoTasa = datosIdentificacion.tipoTasa;

      if (costoUnitario == undefined) {
        costoUnitario = '--';
      }
      if (cantidad == undefined) {
        cantidad = '--';
      }
      if (montos == undefined) {
        montos = '--';
      }
      if (observacion == undefined) {
        observacion = '--';
      }
      if (concepto == undefined) {
        concepto = '--';
      }
      if (desde == undefined) {
        desde = '--';
      }
      if (hasta == undefined) {
        hasta = '--';
      }
      $ionicPopup.alert({
        title: 'Detalle Deuda',
        template: '<b>Tipo de tasa: </b>' + datosIdentificacion.tipoTasa +
        '<br/><b>Concepto: </b>' + concepto +
        '<br/><b>Desde: </b>' + desde +
        '<br/><b>Hasta: </b>' + hasta +
        '<br/><b>Costo unitario: </b>' + costoUnitario +
        '<br/><b>Cantidad: </b>' + cantidad +
        '<br/><b>Monto (Bs.): </b>' + montos +
        '<br/><b>Observación: </b>' + observacion,
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
          $scope.showLoadingProperTimes();
          if (index == 0) {
            var objetoEntrada = {
              authToken: $rootScope.globalExample,
              identificador: ServicioDatos.data.identificador,
              codAlcaldia: ServicioDatos.data.codAlcaldia,
              codTasa: ServicioDatos.data.codTasa
            };
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            $scope.datosURL = $rootScope.urlServicio + '/tasas/pdf_deuda/' + $rootScope.globalExample
              + '/' + ServicioDatos.data.identificador
              + '/' + ServicioDatos.data.codAlcaldia
              + '/' + ServicioDatos.data.codTasa
              + '/proformaDeudaTasas.pdf';
            $scope.hideLoadingProperTimes();
            window.open($scope.datosURL, '_system', 'location=yes');
            return false;
          }
          return true;
        }
      });
    }


  })
