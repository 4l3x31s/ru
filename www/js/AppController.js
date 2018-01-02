/**
 * Created by acarrillo on 8 sep 2017.
 */
/// <reference path="../typings/tsd.d.ts" />
angular.module('ControladorApp', [])
    .controller('AppCtrl', function ($scope, $ionicModal, $timeout) {
    $scope.modalT = $ionicModal.fromTemplateUrl('templates/mo-terminos.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalT) {
        $scope.modalT = modalT;
    });
    $scope.openModal = function () {
        $scope.modalT.show();
    };
    $scope.closeModal = function () {
        $scope.modalT.hide();
    };
    $scope.$on('$destroy', function () {
        $scope.modalT.remove();
    });
    //Modal politicas
    $scope.modalP = $ionicModal.fromTemplateUrl('templates/mo-politicas.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modalP) {
        $scope.modalP = modalP;
    });
    $scope.openModal = function () {
        $scope.modalP.show();
    };
    $scope.closeModal = function () {
        $scope.modalP.hide();
    };
    // Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modalP.remove();
    });
})
    .controller('MoInicioCtrl', function ($scope, $ionicLoading, $rootScope, ServiciosRuat, $ionicPopup, $ionicHistory, $state, $ionicPlatform, $location, $ionicBackdrop, $timeout, $cordovaDevice) {
    var cadenaDireccion = "{\"iv\":\"d+mrexKHI1ysDBGrOUUQ/w==\",\"v\":1,\"iter\":1000,\"ks\":128,\"ts\":64,\"mode\":\"ccm\",\"adata\":\"\",\"cipher\":\"aes\",\"salt\":\"N7p4vjWaOIE=\",\"ct\":\"izfFUsx2uA2zHbwRijl8QGh9DVAQ1pUxEjAGxrXgpdvPU6Wz1wpKNne5H2Ey6zWbd1Ce2FzrPXtMxQ==\"}";
    var clave = "RUATMOVIL";
    var desencriptado = sjcl.decrypt(clave, cadenaDireccion);
    console.log(desencriptado);
    $scope.$on("$ionicView.enter", function () {
        $ionicHistory.clearCache();
        $ionicHistory.clearHistory();
    });
    $rootScope.urlServicio = desencriptado;
    var contadorBack = 0;
    $ionicPlatform.registerBackButtonAction(function (event) {
        if (true) {
            var location = $location;
            var valor = location.path().indexOf('mo-inicio') > -1;
            if (valor == true) {
                contadorBack = contadorBack + 1;
                if (contadorBack == 1) {
                    contadorBack = 0;
                    ionic.Platform.exitApp();
                }
            }
            $location.url("app/mo-inicio");
            $ionicBackdrop.retain();
            $timeout(function () {
                $ionicBackdrop.release();
            }, 10);
            $ionicHistory.clearCache().then(function () {
                $state.go('app.mo-inicio');
            });
            $ionicHistory.clearCache();
            $ionicHistory.clearHistory();
        }
    }, 100);
    var irA = function (state) {
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        $state.go(state);
    };
    $rootScope.numActEco = '';
    $rootScope.placa = '';
    $scope.doListUpdate = function () {
        $scope.$broadcast('scroll.refreshComplete');
    };
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
    var urlModulo = '/session/token_autorizacion';
    ionic.Platform.ready(function () {
        var device;
        device = ionic.Platform.device();
        //TODO: Este trozo de código se deja comentado para ejecutar por la web
        if (device.version == undefined) {
            device.version = '1.0.0';
        }
        if (device.platform == undefined) {
            device.platform = 'Web';
        }
        $rootScope.plataforma = device.platform;
        var objetoEntrada = {
            sistemaOperativo: device.platform,
            version: device.version
        };
        if ($rootScope.globalExample == undefined) {
            $rootScope.authToken = consumirServicio(objetoEntrada, urlModulo).then(function (datas) {
                var data = datas.data;
                if (datas.status == 401 || datas.status == 200) {
                    try {
                        $rootScope.globalExample = data.authToken;
                        $scope.testData = $rootScope.globalExample;
                        try {
                            if (cordova) {
                                if (cordova.getAppVersion) {
                                    cordova.getAppVersion.getVersionNumber(function (version) {
                                        $scope.versionApp = version;
                                        // Consumir Servicio
                                        var auth_token = $rootScope.globalExample;
                                        var objetoEntrada = {
                                            authToken: auth_token,
                                            version: $scope.versionApp
                                        };
                                        urlModulo = "/session/control_version";
                                        $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
                                        $scope.resultado.then(function (datas) {
                                            var data = datas.data;
                                            if (datas.status == 401 || datas.status == 200) {
                                                /*if(data.continuarFlujo){
                                                  if(data.tipoCambio == "CF"){
                                                    $scope.alertVersion = $ionicPopup.alert({
                                                      title: 'Alerta',
                                                      template: data.mensajeCambio,
                                                      buttons:[{
                                                        text: 'Aceptar',
                                                        type: 'button-positive'
                                                      }]
                                                    });
                                                    $scope.alertVersion.then(function(res){
                                                      if($rootScope.plataforma.toLowerCase() == 'android'){
                                                        window.open("https://play.google.com/store/apps/details?id=bo.gob.ruat.ruatmovil&hl=es", '_system', 'location=yes');
                                                      }else if($rootScope.plataforma.toLowerCase() == 'ios'){
                                                        window.open("https://itunes.apple.com/us/app/ruat/id1327026554?l=es&ls=1&mt=8", '_system', 'location=yes');
                                                      }else{
                                                        window.open("http://www.ruat.gob.bo", '_system', 'location=yes');
                                                      }
                      
                                                    })
                                                  }else if(data.tipoCambio == "CM"){
                                                    $scope.alertVersion = $ionicPopup.confirm({
                                                      title: 'Alerta',
                                                      template: data.mensajeCambio,
                                                      buttons:
                                                        [{
                                                          text:'Cancelar',
                                                          type: 'button-default',
                                                          onTap: function() { return false; }
                                                        },
                                                          {
                                                            text: 'Aceptar',
                                                            type: 'button-positive',
                                                            onTap: function() { return true; }
                                                          }]
                                                    });
                                                    $scope.alertVersion.then(function(res){
                                                      if(res){
                                                        if($rootScope.plataforma.toLowerCase() == 'android'){
                                                          window.open("https://play.google.com/store/apps/details?id=bo.gob.ruat.ruatmovil&hl=es", '_system', 'location=yes');
                                                        }else if($rootScope.plataforma.toLowerCase() == 'ios'){
                                                          window.open("https://itunes.apple.com/es/genre/ios/id36?mt=8", '_system', 'location=yes');
                                                        }else{
                                                          window.open("http://www.ruat.gob.bo", '_system', 'location=yes');
                                                        }
                                                      }
                                                    });
                                                  }
                                                }*/
                                            }
                                            else {
                                                //TODO: alexeis
                                                ServiciosRuat.getStatus(datas.status);
                                                $scope.hideLoadingProperTimes();
                                                $location.url("app/mo-inicio");
                                            }
                                        });
                                    });
                                }
                            }
                        }
                        catch (err) {
                            $scope.versionApp = '1.0.3';
                            // Consumir Servicio
                            var auth_token = $rootScope.globalExample;
                            var objetoEntrada = {
                                authToken: auth_token,
                                version: $scope.versionApp
                            };
                            urlModulo = "/session/control_version";
                            $scope.resultado = ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
                            $scope.resultado.then(function (datas) {
                                var data = datas.data;
                                if (datas.status == 401 || datas.status == 200) {
                                    if (data.continuarFlujo) {
                                        /*if(data.tipoCambio == "CF"){
                                          $scope.alertVersion = $ionicPopup.alert({
                                            title: 'Alerta',
                                            template: data.mensajeCambio,
                                            buttons:[{
                                              text: 'Aceptar',
                                              type: 'button-positive'
                                            }]
                                          });
                                          $scope.alertVersion.then(function(res){
                                            if($rootScope.plataforma.toLowerCase() == 'android'){
                                              window.open("https://play.google.com/store/apps/details?id=bo.gob.ruat.ruatmovil&hl=es", '_system', 'location=yes');
                                            }else if($rootScope.plataforma.toLowerCase() == 'ios'){
                                              window.open("https://itunes.apple.com/es/genre/ios/id36?mt=8", '_system', 'location=yes');
                                            }else{
                                              window.open("http://www.ruat.gob.bo", '_system', 'location=yes');
                                            }
                                          })
                                        }else if(data.tipoCambio == "CM"){
                                          $scope.alertVersion = $ionicPopup.confirm({
                                            title: 'Alerta',
                                            template: data.mensajeCambio,
                                            buttons:
                                              [{
                                                text:'Cancelar',
                                                type: 'button-default',
                                                onTap: function() { return false; }
                                              },
                                                {
                                                  text: 'Aceptar',
                                                  type: 'button-positive',
                                                  onTap: function() { return true; }
                                                }]
                                          });
                                          $scope.alertVersion.then(function(res){
                                            if(res){
                                              if($rootScope.plataforma.toLowerCase() == 'android'){
                                                window.open("https://play.google.com/store/apps/details?id=bo.gob.ruat.ruatmovil&hl=es", '_system', 'location=yes');
                                              }else if($rootScope.plataforma.toLowerCase() == 'ios'){
                                                window.open("https://itunes.apple.com/es/genre/ios/id36?mt=8", '_system', 'location=yes');
                                              }else{
                                                window.open("http://www.ruat.gob.bo", '_system', 'location=yes');
                                              }
                                            }
                                          });
                                        }*/
                                    }
                                }
                                else {
                                    //TODO: alexeis
                                    ServiciosRuat.getStatus(datas.status);
                                    $scope.hideLoadingProperTimes();
                                    $location.url("app/mo-inicio");
                                }
                            });
                        }
                        $scope.hideLoadingProperTimes();
                        return data;
                    }
                    catch (err) {
                        $rootScope.authToken = '';
                        $scope.hideLoadingProperTimes();
                        $scope.alertPopup = $ionicPopup.alert({
                            title: 'Alerta',
                            template: 'Hubo un problema al establecer la conexión.',
                            buttons: [
                                {
                                    text: 'Aceptar',
                                    type: 'button-positive'
                                }
                            ]
                        });
                    }
                }
                else {
                    //TODO: Alexeis
                    ServiciosRuat.getStatus(datas.status);
                    $scope.hideLoadingProperTimes();
                    $location.url("app/mo-inicio");
                }
            }, function (reason) {
                $rootScope.authToken = '';
                $scope.hideLoadingProperTimes();
                $scope.alertPopup = $ionicPopup.alert({
                    title: 'Alerta',
                    template: 'Revise su conexión a internet.',
                    buttons: [
                        {
                            text: 'Aceptar',
                            type: 'button-positive'
                        }
                    ]
                });
                ionic.Platform.exitApp();
            })["catch"](function (error) {
                $rootScope.authToken = '';
                console.log('ERROR:', error);
                throw error;
            });
        }
        else {
            $scope.hideLoadingProperTimes();
        }
        //mensaje para las versiones
    });
    function consumirServicio(objetoEntrada, urlModulo) {
        try {
            return ServiciosRuat.getPostGlobal(objetoEntrada, urlModulo);
        }
        catch (err) {
            console.log(err);
        }
    }
    ;
});
