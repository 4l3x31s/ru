/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorInformaciones', [])
  .controller('InfAgenciasCobroCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                                ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup,
                                                $ionicHistory, $state, $cordovaGeolocation, Util) {
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

    if (Util.datosAuxiliar.realizarInsert) {
      $rootScope.db.transaction(function (tx) {
      }, function (error) {
        console.log('Transaction ERROR: ' + error.message);
      }, function () {
        console.log('Populated database OK');
      });
      $rootScope.db.transaction(function (tx) {

        tx.executeSql("DELETE FROM mapas", [], function (tx, res) {
        }, function (e) {
        });
        var i;
        for (i = 0; i < ServicioDatos.data.puntosCobro.length; i++) {
          tx.executeSql("INSERT INTO mapas(nombre, direccion, linea, telefono, latitud, logintud) VALUES (?,?,?,?,?,?)",
            [ServicioDatos.data.puntosCobro[i].nombre, ServicioDatos.data.puntosCobro[i].direccion,
              ServicioDatos.data.puntosCobro[i].lineaGratuita, ServicioDatos.data.puntosCobro[i].telefono,
              ServicioDatos.data.puntosCobro[i].latitud, ServicioDatos.data.puntosCobro[i].logintud], function (tx, res) {
            }, function (e) {
            });
        }
      }, function (error) {
      }, function () {
      });
    }


    $scope.mostrarDato = false;
    var options = {timeout: 30000, enableHighAccuracy: true};
    if ($rootScope.sinGPS) {
      var latLng;
      if ($rootScope.latitud != undefined) {
        latLng = new google.maps.LatLng($rootScope.latitud, $rootScope.longitud);
      } else {
        latLng = new google.maps.LatLng(-16.4960246, -68.1334758);
      }
      var mapOptions = {
        center: latLng,
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      };
      $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
      google.maps.event.addListenerOnce($scope.map, 'idle', function () {
        var pinGps = {
          url: "img/gps-icon.png",
          scaledSize: new google.maps.Size(50, 50)
        };
        var marker = new google.maps.Marker({
          map: $scope.map,
          animation: google.maps.Animation.BOUNCE,
          position: latLng,
          icon: pinGps
        });
        //var cadenaDatos: string = `<div class="map-detail"><div class="row"><div class="col-20 icono-punto"><img src="img/ico-banco-1.png" height="40" width="40"/></div><div class="col-80"><span class="nombreEF wrap">Banco Mercantil Santa Cruz S.A.</span><span class="direccion">C/ Mercado # 1452</span><i class="icon icon-left ion-android-call"></i><a class="telefono" href="tel:75889696">75889696</a></div></div></div>`;

      });
      var datosMapa = ServicioDatos.data;
      var infowindow = new google.maps.InfoWindow();
      var marker, i;
      for (i = 0; i < datosMapa.puntosCobro.length; i++) {
        var telefono = '';
        if (datosMapa.puntosCobro[i].telefono) {
          telefono = '<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].telefono + '">' + datosMapa.puntosCobro[i].telefono + '</a></span>';
        }
        var linea = '';
        if (datosMapa.puntosCobro[i].linea) {
          linea = '<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].linea + '">' + datosMapa.puntosCobro[i].linea + '</a></span>';
        }
        var contentString = '<div id="map-content">' +
          '<div id="map-site-notice" class="entidad">' + datosMapa.puntosCobro[i].nombre + '</div>' +
          '<div id="map-body-content">' +
          '<span>' + datosMapa.puntosCobro[i].direccion + '</span>' +
          telefono +
          linea +
          '</div>' +
          '</div>';

        var pinIcon = {
          url: "img/bancos_point.png",
          scaledSize: new google.maps.Size(42, 42)
        };
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(datosMapa.puntosCobro[i].latitud, datosMapa.puntosCobro[i].logintud),
          map: $scope.map,
          animation: google.maps.Animation.DROP,
          icon: pinIcon
        });

        google.maps.event.addListener(marker, 'click', (function (marker, contentString) {
          return function () {
            infowindow.setContent(contentString);
            infowindow.open($scope.map, marker);
          }
        })(marker, contentString));

      }
      $scope.hideLoadingProperTimes();
    } else {
      $cordovaGeolocation.getCurrentPosition(options).then(function (position) {
        $rootScope.db.transaction(function (tx) {
          tx.executeSql('INSERT INTO last_loc VALUES(?,?)', [position.coords.latitude, position.coords.longitude]);
        }, function (error) {
        }, function () {
        });
        var latLng = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
        var mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        var pinGps = {
          url: "img/gps-icon.png",
          scaledSize: new google.maps.Size(50, 50)
        };
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.BOUNCE,
            position: latLng,
            icon: pinGps
          });
        });

        var datosMapa = ServicioDatos.data;
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < datosMapa.puntosCobro.length; i++) {
          var telefono = '';
          if (datosMapa.puntosCobro[i].telefono) {
            telefono = '<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].telefono + '">' + datosMapa.puntosCobro[i].telefono + '</a></span>'
          }
          var linea = '';
          if (datosMapa.puntosCobro[i].linea) {
            linea ='<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].linea + '">' + datosMapa.puntosCobro[i].linea + '</a></span>';
          }
          var contentString = '<div id="map-content">' +
            '<div id="map-site-notice" class="entidad">' + datosMapa.puntosCobro[i].nombre + '</div>' +
            '<div id="map-body-content">' +
            '<span>' + datosMapa.puntosCobro[i].direccion + '</span>' +
            telefono +
            linea +
            '</div>' +
            '</div>';

          var pinIcon = {
            url: "img/bancos_point.png",
            scaledSize: new google.maps.Size(42, 42)
          };
          marker = new google.maps.Marker({
            position: new google.maps.LatLng(datosMapa.puntosCobro[i].latitud, datosMapa.puntosCobro[i].logintud),
            map: $scope.map,
            animation: google.maps.Animation.DROP,
            icon: pinIcon
          });

          google.maps.event.addListener(marker, 'click', (function (marker, contentString) {
            return function () {
              infowindow.setContent(contentString);
              infowindow.open($scope.map, marker);
            }
          })(marker, contentString));
        }
        $scope.hideLoadingProperTimes();
      }, function (error) {
        console.log("Could not get location: " + error);
        var latLng;
        if ($rootScope.latitud != undefined) {
          latLng = new google.maps.LatLng($rootScope.latitud, $rootScope.longitud);
        } else {
          latLng = new google.maps.LatLng(-16.4960246, -68.1334758);
        }
        var mapOptions = {
          center: latLng,
          zoom: 17,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        $scope.map = new google.maps.Map(document.getElementById("map"), mapOptions);
        google.maps.event.addListenerOnce($scope.map, 'idle', function () {
          var pinGps = {
            url: "img/gps-icon.png",
            scaledSize: new google.maps.Size(50, 50)
          };
          var marker = new google.maps.Marker({
            map: $scope.map,
            animation: google.maps.Animation.BOUNCE,
            position: latLng,
            icon: pinGps
          });
          //var cadenaDatos: string = `<div class="map-detail"><div class="row"><div class="col-20 icono-punto"><img src="img/ico-banco-1.png" height="40" width="40"/></div><div class="col-80"><span class="nombreEF wrap">Banco Mercantil Santa Cruz S.A.</span><span class="direccion">C/ Mercado # 1452</span><i class="icon icon-left ion-android-call"></i><a class="telefono" href="tel:75889696">75889696</a></div></div></div>`;
        });
        var datosMapa = ServicioDatos.data;
        var infowindow = new google.maps.InfoWindow();
        var marker, i;
        for (i = 0; i < datosMapa.puntosCobro.length; i++) {

          for (i = 0; i < datosMapa.puntosCobro.length; i++) {
            var telefono = '';
            if (datosMapa.puntosCobro[i].telefono) {
              telefono = '<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].telefono + '">' + datosMapa.puntosCobro[i].telefono + '</a></span>'
            }
            var linea = '';
            if (datosMapa.puntosCobro[i].linea) {
              linea ='<span><i class="icon icon-left ion-android-call"></i><a href="tel:' + datosMapa.puntosCobro[i].linea + '">' + datosMapa.puntosCobro[i].linea + '</a></span>';
            }
            var contentString = '<div id="map-content">' +
              '<div id="map-site-notice" class="entidad">' + datosMapa.puntosCobro[i].nombre + '</div>' +
              '<div id="map-body-content">' +
              '<span>' + datosMapa.puntosCobro[i].direccion + '</span>' +
              telefono +
              linea +
              '</div>' +
              '</div>';

            var pinIcon = {
              url: "img/bancos_point.png",
              scaledSize: new google.maps.Size(42, 42)
            };
            marker = new google.maps.Marker({
              position: new google.maps.LatLng(datosMapa.puntosCobro[i].latitud, datosMapa.puntosCobro[i].logintud),
              map: $scope.map,
              animation: google.maps.Animation.DROP,
              icon: pinIcon
            });

            google.maps.event.addListener(marker, 'click', (function (marker, contentString) {
              return function () {
                infowindow.setContent(contentString);
                infowindow.open($scope.map, marker);
              }
            })(marker, contentString));
          }
        }
        $scope.hideLoadingProperTimes();
      });
    }


  })
  .controller('InfComentariosCtrl', function ($scope) {
  })
  .controller('InfVencimientosCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                               ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup,
                                               $ionicHistory) {
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
    $scope.clearSearch = function () {
      $scope.search = '';
    };
    var auth_token = $rootScope.globalExample;
    var urlModulo = '/vencimientos/consulta_vencimientos/' + auth_token;
    $scope.resultado = ServiciosRuat.getGlobal(urlModulo);
    $scope.resultado.then(function (datas) {
      $scope.hideLoadingProperTimes();
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        try {
          if (data.continuarFlujo) {
            $scope.query = {};
            $scope.queryBy = 'gobiernoMunicipal'
            $scope.listaVencimientos = data.lstBeanVencimientos;
            $scope.fechaActual = data.fecha;
          } else {
            //todo: error
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
            $location.url("app/mo-inicio");
          }
        } catch (err) {
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
          $location.url("app/mo-inicio");
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
        template: reason.mensaje,
        buttons: [
          {
            text: 'Aceptar',
            type: 'button-positive'
          }
        ]
      });
      $location.url("app/mo-inicio");
    });
    $scope.diasRestantes = function (fechaFin, fechaActual) {
      var parts = fechaActual.split('/');
      var hoy = new Date(parts[2], parts[1] - 1, parts[0]);
      var dia = String(hoy.getDate());
      var mes = String(hoy.getMonth() + 1);
      var anio = String(hoy.getFullYear());
      var fechaActual: any = String(dia + "/" + mes + "/" + anio);
      var afechaActual: any = fechaActual.split('/');
      var aFechaFin = fechaFin.split('/');
      var fFechaFin = Date.UTC(aFechaFin[2], aFechaFin[1] - 1, aFechaFin[0]);
      var fFechaActual = Date.UTC(afechaActual[2], afechaActual[1] - 1, afechaActual[0]);
      var restaFechas = fFechaFin - fFechaActual;
      var dias = Math.round(restaFechas / (1000 * 60 * 60 * 24));
      return dias;
    }
  })
  .controller('InfCargarMapasCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope, ServiciosRuat, ServicioDatos,
                                              $location, $ionicLoading, $ionicPopup, $ionicHistory, $state,
                                              $cordovaGeolocation, Util) {
    Util.datosAuxiliar.data = {
      realizarInsert: false
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
    $scope.showLoadingProperTimes();

    $rootScope.db = null;
    document.addEventListener('deviceready', function () {
      $rootScope.db = window.sqlitePlugin.openDatabase({name: 'dbFechas.db', location: 'default'});
    });

    $rootScope.db.transaction(function (tx) {
      tx.executeSql('CREATE TABLE IF NOT EXISTS fecha_mod (fecha)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS mapas (nombre text, direccion text, linea text, telefono text, latitud text, logintud text)');
      tx.executeSql('CREATE TABLE IF NOT EXISTS last_loc (latitud text, longitud text)');
    }, function (error) {
    }, function () {
    });

    if (window.cordova) {
      cordova.plugins.diagnostic.isLocationEnabled(function (enabled) {
        if (!enabled) {
          $rootScope.sinGPS = true;
          var estado = "El GPS está " + (enabled ? "activado." : "desactivado.");
          /*$scope.alertMapas = $ionicPopup.alert({
           title: 'Alerta',
           template: estado,
           buttons: [
           {
           text: 'Aceptar',
           type: 'button-positive'
           }
           ]
           });*/
          alert("El GPS está " + (enabled ? "activado." : "desactivado."));
        } else {
          $rootScope.sinGPS = false;
        }
        $rootScope.db.transaction(function (tx) {
          tx.executeSql('SELECT latitud, longitud FROM last_loc', [], function (tx, res) {
            var cantidad = res.rows.item(0);
            if (cantidad != undefined) {
              $rootScope.latitud = res.rows.item(0).latitud;
              $rootScope.longitud = res.rows.item(0).longitud;
            } else {
              tx.executeSql('DELETE FROM last_loc', [], function (tx, resultSet) {
              }, function (tx, error) {
              });

            }
          });
        }, function (error) {
        }, function () {
        });
      }, function (error) {
      });
    }

    var auth_token = $rootScope.globalExample;
    var urlFecha = '/puntos_cobro/consulta_puntos_cobro/ultima_fecha/' + auth_token;
    $scope.resultadoFecha = ServiciosRuat.getGlobal(urlFecha);
    $scope.resultadoFecha.then(function (datas) {
      var data = datas.data;
      if(datas.status == 401 || datas.status == 200){
        if (data.continuarFlujo) {
          var respuesta = Util.convertirFechas(data);
          $rootScope.db.transaction(function (tx) {
            tx.executeSql('SELECT fecha FROM fecha_mod', [], function (tx, res) {
              var cantidad = res.rows.item(0);
              if (cantidad != undefined) {
                var fechaGuardada = Util.convertirFechas(res.rows.item(0));
                if (respuesta > fechaGuardada) {
                  tx.executeSql('DELETE FROM fecha_mod', [], function (tx, resultSet) {
                    tx.executeSql('INSERT INTO fecha_mod VALUES (?)', [data.fecha], function (tx, resultSet) {
                      var urlModulo = '/puntos_cobro/consulta_puntos_cobro/' + auth_token;
                      $scope.resultado = ServiciosRuat.getGlobal(urlModulo);
                      $scope.resultado.then(function (datas) {
                        var data = datas.data;
                        if(datas.status == 401 || datas.status == 200){
                          ServicioDatos.data = data;
                          Util.datosAuxiliar = {
                            realizarInsert: true
                          }
                        }else{
                          //TODO: Alexeis
                          ServiciosRuat.getStatus(datas.status);
                          $scope.hideLoadingProperTimes();
                          $location.url("app/mo-inicio");
                        }
                        $scope.hideLoadingProperTimes();
                        $location.url("app/inf-agencias-cobro");
                      });
                    }, function (tx, error) {
                    });
                  }, function (tx, error) {
                  });
                }
                else {
                  //TODO: seleccionar datos de BD
                  tx.executeSql("SELECT * FROM mapas", [], function (tx, res) {
                    var data = new Array();
                    var j;
                    for (j = 0; j < res.rows.length; j++) {
                      data.push(res.rows.item(j));
                    }
                    Util.datosAuxiliar = {
                      realizarInsert: false
                    }
                    ServicioDatos.data.puntosCobro = data;
                    $scope.hideLoadingProperTimes();
                    $location.url("app/inf-agencias-cobro");
                  }, function (e) {
                  });
                }
              }
              else {
                tx.executeSql('INSERT INTO fecha_mod VALUES (?)', [data.fecha], function (tx, resultSet) {
                  var urlModulo = '/puntos_cobro/consulta_puntos_cobro/' + auth_token;
                  $scope.resultado = ServiciosRuat.getGlobal(urlModulo);
                  $scope.resultado.then(function (datas) {
                    var data = datas.data;
                    if(datas.status == 401 || datas.status == 200){
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
                        $location.url("app/mo-inicio");
                      } else {
                        ServicioDatos.data = data;
                        Util.datosAuxiliar = {
                          realizarInsert: true
                        }
                        $scope.hideLoadingProperTimes();
                        $location.url("app/inf-agencias-cobro");
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
                }, function (tx, error) {
                });
              }
            }, function (error) {
            }, function () {
            });
          }, function (error) {
          }, function () {
          });
        } else {
          $scope.hideLoadingProperTimes();
          $location.url("app/mo-inicio");
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
  })
  //InfAcercadeCtrl
  .controller('InfAcercadeCtrl', function ($scope, $ionicActionSheet, $timeout, $rootScope,
                                           ServiciosRuat, ServicioDatos, $location, $ionicLoading, $ionicPopup, $ionicHistory, $state, $sce) {
    try {
      if (cordova) {
        if (cordova.getAppVersion) {
          cordova.getAppVersion.getVersionNumber(function (version) {
            $scope.versionApp = version;
          });
        }
      }
    } catch (err) {
      $scope.versionApp = '1.0.3';
    }

  })

  .controller('InfVerificaPagoCtrl', function ($scope, $cordovaBarcodeScanner, $ionicPopup, $location,ServicioDatos,$ionicHistory) {
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });

    ServicioDatos.data = null;
    $scope.iniciarCamara = function () {
      $cordovaBarcodeScanner
        .scan()
        .then(function (barcodeData) {
          // Success! Barcode data is here
          ServicioDatos.data = undefined;
          ServicioDatos.data = barcodeData.text;
          if(ServicioDatos.data) {
            $location.url("app/mo-verificacion-pago");
          }

        }, function (error) {
          // An error occurred
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
        }, {
          prompt: "Enfoque la cámara en el código QR."
        });


    };

  })
  .controller('InfVerificaPagosCtrl', function ($scope, $cordovaBarcodeScanner, $ionicPopup, $location,ServicioDatos,$ionicHistory, $rootScope,ServiciosRuat, $ionicLoading) {

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

    $scope.numeroComprobante = "";
    $scope.nroObjetoIdentificador = "";
    $scope.montoPagado = "";
    $scope.urlDescarga = "";
    $scope.$on("$ionicView.enter", function () {
      $ionicHistory.clearCache();
      $ionicHistory.clearHistory();
    });
    if(ServicioDatos.data){
      var data = ServicioDatos.data + "";
      ServicioDatos.data = undefined;
      ServicioDatos.data = null;
      //console.log(data);
      var cadenaQR = data.split("\n");
      $scope.numeroComprobante = cadenaQR[0];
      $scope.nroObjetoIdentificador = cadenaQR[1];
      $scope.montoPagado = cadenaQR[2];
      $scope.clave = cadenaQR[3];
    }

      $scope.showLoadingProperTimes();
      var urlModulo = '/verificarPago/obtieneRubro/' + $rootScope.globalExample + '/' + $scope.clave;
      $scope.resultado = ServiciosRuat.getGlobal(urlModulo);
      $scope.resultado.then(function (datas) {
        var paginaValida = datas.data.paginaValida;
        if(paginaValida){
          if(datas.status == 200 || datas.status == 401){
            $scope.hideLoadingProperTimes();
            $scope.rubro = datas.data.rubro + "";
            $scope.esComprobante = datas.data.comprobantePago;

            if($scope.esComprobante){
              $scope.tipoPDF = 'Comprobante de Pago';
            }else{
              $scope.tipoPDF = 'Detalle de Pago';
            }
          }else{
            ServiciosRuat.getStatus(datas.status);
            $scope.hideLoadingProperTimes();
            $location.url("app/mo-inicio");
          }
        }else{
          $scope.hideLoadingProperTimes();
          $location.url("app/mo-verificacion-pago-error");
        }
      })

    $scope.abrirPdf = function(){
      $scope.datosURL = $rootScope.urlServicio + '/verificarPago/generarComprobantePDF/'
        + $rootScope.globalExample
        + '/' + $scope.clave
        + '/comprobantePago.pdf';
      $scope.hideLoadingProperTimes();
      window.open($scope.datosURL, '_system', 'location=yes');
    }
  })

