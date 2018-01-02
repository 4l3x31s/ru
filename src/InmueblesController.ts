/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorInmuebles', [])
  .controller('InmBusGralCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                          ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    if ($rootScope.numInmueble != null) {
      $scope.identificadorInm = $rootScope.numInmueble;
    } else {
      $scope.identificadorInm = '';
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
    $scope.validarNumeroInm = /^[0-9]{1,13}$/;
    $scope.showLoadingProperTimes();

    var urlModulo = '/inmuebles/criterio_alcaldia';
    var auth_token = $rootScope.globalExample;
    $scope.resultado = ServiciosRuat.getGlobal(urlModulo + '/' + auth_token);
    $scope.resultado.then(function (datas) {

      if ($rootScope.numInmueble != null) {
        $scope.identificadorInm = $rootScope.numInmueble;
      } else {
        $scope.identificadorInm = '';
      }
      $scope.hideLoadingProperTimes();
      var data = datas.data;
      if(datas.status = 401 || datas.status == 200){
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
    $scope.buscarInmueble = function (numInmueble: string, codAlcaldia: string) {
      if ($rootScope.numInmueble == '') {
        if (numInmueble != null) {
          $rootScope.numInmueble = numInmueble;
        } else {
          $rootScope.numInmueble = '';
        }
      } else {
        $rootScope.numInmueble = numInmueble;
      }
      $scope.data = {
        authToken: $rootScope.globalExample,
        identificador: numInmueble,
        codAlcaldia: codAlcaldia
      };
      $scope.showLoadingProperTimes();
      var urlModulo = '/inmuebles/busca_inmueble';
      $scope.resultado = ServiciosRuat.getPostGlobal($scope.data, urlModulo);
      $scope.resultado.then(function (datas) {
        try {
          var data = datas.data;
          if(datas.status==200 || datas.status==401){
            $scope.hideLoadingProperTimes();
            if (data.solicitaDocumento == true) {
              if (!data.continuarFlujo) {
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
                $location.url("app/inm-bus-general");
              } else {
                $scope.alertPopup = $ionicPopup.alert({
                  title: 'Propiedad en Acciones y Derechos',
                  subTitle: 'Ingrese documento de identificación del propietario.',
                  template: '<input type="text" ng-model="data.ci" placeholder="Ej. 1248951"/>',
                  scope: $scope,
                  buttons: [
                    {text: 'Cancelar'},
                    {
                      text: '<b>Buscar</b>',
                      type: 'button-positive',
                      onTap: function (e) {
                        if (!$scope.data.ci) {
                          e.preventDefault();
                        } else {
                          return $scope.data.ci;
                        }
                      }
                    }
                  ]
                });
                $scope.alertPopup.then(function (res: string) {
                  if (!res) {
                    //$location.url("app/inm-bus-general");
                    //TODO: no ingresó datos
                    $location.url("app/inm-bus-general");
                  }
                  else {
                    var dummy = $scope.data;
                    $scope.data = {
                      authToken: $rootScope.globalExample,
                      identificador: dummy.identificador,
                      codAlcaldia: dummy.codAlcaldia,
                      numDocIdentidad: res + ""
                    };
                    ServicioDatos.data = {
                      identificador: $scope.data.identificador,
                      codAlcaldia: $scope.data.codAlcaldia,
                      docIdentidad: $scope.data.numDocIdentidad,
                      muestraBack: false
                    };
                    $scope.showLoadingProperTimes();
                    var urlModulo = '/inmuebles/busca_inmueble';
                    $scope.respuestaAD = ServiciosRuat.getPostGlobal($scope.data, urlModulo);
                    $scope.respuestaAD.then(function (datas) {
                      $scope.hideLoadingProperTimes();
                      var data = datas.data;
                      if(datas.status == 401 || datas.status == 200){
                        try {
                          if (data.beanInmuebleBasico.length > 1) {
                            $scope.listaInmuebles = data.beanInmuebleBasico;
                            $scope.nombrePropietario = data.nombrePropietario;
                            $scope.claseInmueble = data.claseInmueble;
                            ServicioDatos.data = {
                              identificador: $scope.data.identificador,
                              codAlcaldia: $scope.data.codAlcaldia,
                              docIdentidad: $scope.data.numDocIdentidad,
                              muestraBack: true,
                              listaInmuebles: $scope.listaInmuebles,
                              nombrePropietario: $scope.nombrePropietario,
                              claseInmueble: $scope.claseInmueble,
                              tipoPropiedad: data.tipoPropiedad
                            };
                            $location.url("app/inm-grilla-general");
                          } else {
                            $scope.listaInmuebles = data.beanInmuebleBasico;
                            $scope.claseInmueble = data.claseInmueble;
                            ServicioDatos.data = {
                              identificador: $scope.data.identificador,
                              codAlcaldia: $scope.data.codAlcaldia,
                              docIdentidad: $scope.data.numDocIdentidad,
                              muestraBack: false,
                              listaInmuebles: $scope.listaInmuebles,
                              nombrePropietario: "",
                              claseInmueble: $scope.claseInmueble,
                              tipoPropiedad: data.tipoPropiedad,
                              seleccionado: $scope.listaInmuebles[0],
                            };
                            $location.url("app/inm-datos-general");
                          }
                        } catch (err) {
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
                          $location.url("app/inm-bus-general");
                        }
                      }else{
                        //TODO: Alexeis
                        ServiciosRuat.getStatus(datas.status);
                        $scope.hideLoadingProperTimes();
                        $location.url("app/mo-inicio");
                      }


                    });
                  }
                });
              }
            } else {
              if (data.continuarFlujo) {
                $scope.listaInmuebles = data.beanInmuebleBasico;
                $scope.claseInmueble = data.claseInmueble;
                ServicioDatos.data = {
                  identificador: $scope.data.identificador,
                  codAlcaldia: $scope.data.codAlcaldia,
                  docIdentidad: "",
                  muestraBack: false,
                  listaInmuebles: $scope.listaInmuebles,
                  nombrePropietario: "",
                  claseInmueble: $scope.claseInmueble,
                  tipoPropiedad: data.tipoPropiedad,
                  seleccionado: $scope.listaInmuebles[0],
                };
                $location.url("app/inm-datos-general");
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
                $location.url("app/inm-bus-general");
              }
            }
          }else {
            //TODO: Alexeis
            ServiciosRuat.getStatus(datas.status);
            $scope.hideLoadingProperTimes();
            $location.url("app/mo-inicio");
          }

        } catch (err) {
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
          $location.url("app/inm-bus-general");
        }
      });
    };
  })
  .controller('InmDatosGralCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                            ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
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
    $scope.muestraBack = ServicioDatos.data.muestraBack;
    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };
    $scope.showLoadingProperTimes();
    var dummy = $scope.data;
    var beanSolicitud = {
      secInmueble: ServicioDatos.data.seleccionado.secInmueble,
      claseInmueble: ServicioDatos.data.claseInmueble,
      secPropiedad: ServicioDatos.data.seleccionado.secPropiedad,
      tipoPropiedad: ServicioDatos.data.tipoPropiedad,
      secDetallePropiedad: ServicioDatos.data.seleccionado.secDetallePropiedad,
      secContribuyente: ServicioDatos.data.seleccionado.secContribuyente,
      numeroInmueble: ServicioDatos.data.seleccionado.identificador
    }
    $scope.data = {
      authToken: $rootScope.globalExample,
      codAlcaldia: ServicioDatos.data.codAlcaldia,
      docIdentidad: null,
      bnSolicitudInmueble: beanSolicitud
    };
    $scope.beanSolicitud = beanSolicitud;
    var urlModulo = '/inmuebles/consulta_deuda';
    $scope.respuesta = ServiciosRuat.getPostGlobal($scope.data, urlModulo);
    $scope.respuesta.then(function (datas) {
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        $scope.respuestaWS = data;
        if (!data.continuarFlujo) {
          $ionicPopup.alert({
            title: 'Detalle Deuda',
            template: data.mensaje,
            buttons: [
              {
                text: 'Aceptar',
                type: 'button-positive'
              }
            ]
          });
          $location.url("app/inm-bus-general");
        }
      }else{
        //TODO: Alexeis
        ServiciosRuat.getStatus(datas.status);
        $scope.hideLoadingProperTimes();
        $location.url("app/mo-inicio");
      }
      $scope.hideLoadingProperTimes();

    })

    $scope.datosProforma = function (datos) {
      var montoBs = datos.montoBs != undefined ? datos.montoBs : '--';
      var observaciones = datos.observacion != undefined ? datos.observacion : '--';
      var mensaje = '<b>Concepto: </b>' + datos.concepto
        + '<br /><b>Monto (Bs.): </b>' + montoBs
        + '<br /><b>Observación: </b>' + observaciones;
      $ionicPopup.alert({
        title: 'Detalle Deuda',
        template: mensaje,
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
            var requestInmuebles = {
              authToken: $rootScope.globalExample,
              codAlcaldia: ServicioDatos.data.codAlcaldia,
              docIdentidad: null,
              bnSolicitudInmueble: $scope.beanSolicitud
            };
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
            var secContribuyente = $scope.beanSolicitud.secContribuyente == undefined ? '0' : $scope.beanSolicitud.secContribuyente;
            var numInmueble = $scope.beanSolicitud.numeroInmueble == undefined ? '0' : $scope.beanSolicitud.numeroInmueble;
            var docIdentidad = ServicioDatos.data.docIdentidad == '' ? '0' : ServicioDatos.data.docIdentidad;
            $scope.datosURL = $rootScope.urlServicio
              + '/inmuebles/pdf_deuda'
              + '/' + secContribuyente
              + '/' + numInmueble
              + '/' + docIdentidad
              + '/' + $rootScope.globalExample
              + '/' + ServicioDatos.data.codAlcaldia
              + '/' + $scope.beanSolicitud.claseInmueble
              + '/' + $scope.beanSolicitud.secDetallePropiedad
              + '/' + $scope.beanSolicitud.secInmueble
              + '/' + $scope.beanSolicitud.secPropiedad
              + '/' + $scope.beanSolicitud.tipoPropiedad
              + '/proformaDeudaInmuebles.pdf';
            $scope.hideLoadingProperTimes();
            window.open($scope.datosURL, '_system', 'location=yes');
            return false;
          }
          return true;
        }
      });
    };

  })
  .controller('InmGrillaGeneral', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                            ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
    });

    $scope.listaInmuebles = ServicioDatos.data.listaInmuebles;
    $scope.nombrePropietario = ServicioDatos.data.nombrePropietario;
    $scope.claseInmueble = ServicioDatos.data.claseInmueble;
    $scope.tempData = ServicioDatos.data;

    $scope.consultaDeuda = function (inmuebles, tempData) {
      ServicioDatos.data = {
        identificador: tempData.identificador,
        codAlcaldia: tempData.codAlcaldia,
        docIdentidad: tempData.numDocIdentidad,
        muestraBack: true,
        listaInmuebles: tempData.listaInmuebles,
        nombrePropietario: tempData.nombrePropietario,
        claseInmueble: tempData.claseInmueble,
        seleccionado: inmuebles,
        tipoPropiedad: tempData.tipoPropiedad
      };
      $location.url("app/inm-datos-general");
    };
  })
  .controller('InmBusDetCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                         ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    if ($rootScope.numInmueble != null) {
      $scope.identificadorInm = $rootScope.numInmueble;
    } else {
      $scope.identificadorInm = '';
    }
    $scope.validarNumeroInm = /^[0-9]{1,13}$/;
    $scope.validarCI = /^[a-zA-Z0-9-]{1,13}$/;
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

    var urlModulo = '/inmuebles/criterio_alcaldia';
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
    $scope.buscarInmueble = function (numInmueble: string, codAlcaldia: string, docIdentidad: string) {
      if ($rootScope.numInmueble == '') {
        if (numInmueble != null) {
          $rootScope.numInmueble = numInmueble;
        } else {
          $rootScope.numInmueble = '';
        }
      } else {
        $rootScope.numInmueble = numInmueble;
      }
      $scope.data = {
        authToken: $rootScope.globalExample,
        identificador: numInmueble,
        codAlcaldia: codAlcaldia,
        numDocIdentidad: docIdentidad
      };
      $scope.showLoadingProperTimes();
      var urlModulo = '/inmuebles/busca_inmueble';
      $scope.resultado = ServiciosRuat.getPostGlobal($scope.data, urlModulo);
      $scope.resultado.then(function (datas) {
        $scope.hideLoadingProperTimes();
        var data = datas.data;
        if(datas.status == 401 || datas.status == 200){
          try {
            if (data.continuarFlujo) {
              if (data.beanInmuebleBasico.length > 1) {
                //TODO: ir a grilla
                $scope.listaInmuebles = data.beanInmuebleBasico;
                $scope.nombrePropietario = data.nombrePropietario;
                $scope.claseInmueble = data.claseInmueble;
                ServicioDatos.data = {
                  identificador: $scope.data.identificador,
                  codAlcaldia: $scope.data.codAlcaldia,
                  docIdentidad: $scope.data.numDocIdentidad,
                  muestraBack: true,
                  listaInmuebles: $scope.listaInmuebles,
                  nombrePropietario: $scope.nombrePropietario,
                  claseInmueble: $scope.claseInmueble,
                  tipoPropiedad: data.tipoPropiedad
                };
                //TODO: ir grilla
                $location.url("app/inm-grilla-detalle");
              } else {
                //TODO: solo 1 inmueble
                $scope.listaInmuebles = data.beanInmuebleBasico;
                $scope.claseInmueble = data.claseInmueble;
                ServicioDatos.data = {
                  identificador: $scope.data.identificador,
                  codAlcaldia: $scope.data.codAlcaldia,
                  docIdentidad: $scope.data.numDocIdentidad,
                  muestraBack: false,
                  listaInmuebles: $scope.listaInmuebles,
                  nombrePropietario: "",
                  claseInmueble: $scope.claseInmueble,
                  tipoPropiedad: data.tipoPropiedad,
                  seleccionado: $scope.listaInmuebles[0],
                };
                $location.url("app/inm-datos-detalle");
              }
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
              $location.url("app/inm-bus-detalle");
            }

          } catch (err) {
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
            $location.url("app/inm-bus-detalle");
          }
        }else{
          //TODO: Alexeis
          ServiciosRuat.getStatus(datas.status);
          $scope.hideLoadingProperTimes();
          $location.url("app/mo-inicio");
        }
      });
    }
  })
  .controller('InmDatosDetCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                           ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
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
    $scope.muestraBack = ServicioDatos.data.muestraBack;
    $scope.myGoBack = function () {
      $ionicHistory.goBack();
    };
    $scope.showLoadingProperTimes();
    var dummy = $scope.data;
    var beanSolicitud = {
      secInmueble: ServicioDatos.data.seleccionado.secInmueble,
      claseInmueble: ServicioDatos.data.claseInmueble,
      secPropiedad: ServicioDatos.data.seleccionado.secPropiedad,
      tipoPropiedad: ServicioDatos.data.tipoPropiedad,
      secDetallePropiedad: ServicioDatos.data.seleccionado.secDetallePropiedad,
      secContribuyente: ServicioDatos.data.seleccionado.secContribuyente,
      numeroInmueble: ServicioDatos.data.seleccionado.identificador
    }
    $scope.data = {
      authToken: $rootScope.globalExample,
      codAlcaldia: ServicioDatos.data.codAlcaldia,
      docIdentidad: null,
      bnSolicitudInmueble: beanSolicitud
    };
    var urlModulo = '/inmuebles/consulta_datos_tecnicos';
    $scope.respuesta = ServiciosRuat.getPostGlobal($scope.data, urlModulo);
    $scope.respuesta.then(function (datas) {
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        $scope.respuestaWS = data;
        if (!data.continuarFlujo) {
          $ionicPopup.alert({
            title: 'Detalle',
            template: data.mensaje,
            buttons: [
              {
                text: 'Aceptar',
                type: 'button-positive'
              }
            ]
          });
          $location.url("app/inm-bus-detalle");
        }
      }else{
        //TODO: Alexeis
        ServiciosRuat.getStatus(datas.status);
        $scope.hideLoadingProperTimes();
        $location.url("app/mo-inicio");
      }
      $scope.hideLoadingProperTimes();
    });
    $scope.datosBloque = function (bloque) {
      var tamanio = bloque.listBeanBloques.length;
      var mensaje = '';
      for (var i = 0; i < tamanio; i++) {
        mensaje = mensaje + '<b>' + bloque.listBeanBloques[i].etiqueta + ': </b>' + bloque.listBeanBloques[i].valor + '<br />';
      }
      $ionicPopup.alert({
        title: 'Detalle',
        template: mensaje,
        buttons: [
          {
            text: 'Aceptar',
            type: 'button-positive'
          }
        ]
      });
    }
  })
  .controller('InmGrillaDetalle', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                            ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
    });

    $scope.listaInmuebles = ServicioDatos.data.listaInmuebles;
    $scope.nombrePropietario = ServicioDatos.data.nombrePropietario;
    $scope.claseInmueble = ServicioDatos.data.claseInmueble;
    $scope.tempData = ServicioDatos.data;

    $scope.consultaDeuda = function (inmuebles, tempData) {
      ServicioDatos.data = {
        identificador: tempData.identificador,
        codAlcaldia: tempData.codAlcaldia,
        docIdentidad: tempData.numDocIdentidad,
        muestraBack: true,
        listaInmuebles: tempData.listaInmuebles,
        nombrePropietario: tempData.nombrePropietario,
        claseInmueble: tempData.claseInmueble,
        seleccionado: inmuebles,
        tipoPropiedad: tempData.tipoPropiedad
      };
      $location.url("app/inm-datos-detalle");
    };

  })
