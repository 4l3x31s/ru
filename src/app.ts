/// <reference path="../typings/tsd.d.ts" />

angular.module('starter', ['ionic',
                          'ControladorApp',
                          'ControladorActividadesEconomicas',
                          'ControladorInformaciones',
                          'ControladorInmuebles',
                          'ControladorTasasOtrosIngresos',
                          'ControladorVehiculos',
                          'starter.services','ngCordova'])
  .constant('ApiEndpoint', {
    url: 'http://172.21.43.77:8100/api'
  })
.run(function($ionicPlatform, $rootScope,ServiciosRuat) {
  $ionicPlatform.ready(function() {
    $rootScope.deviceInformation = ionic.Platform.device();
    $rootScope.placa = '';
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(false);
      cordova.plugins.Keyboard.disableScroll(false);
    }
    if (window.StatusBar) {
      StatusBar.overlaysWebView(false);
      StatusBar.backgroundColorByHexString("#00786F");
    }
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider
    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/mo-menu.html',
    controller: 'AppCtrl'
  })
    .state('app.ve-bus-general', {
      url: '/ve-bus-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-bus-general.html',
          controller:'BusDeudaCtrl'
        }
      }
    })
    .state('app.ve-datos-deuda', {
      url: '/ve-datos-deuda',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-datos-deuda.html',
          controller:'DetalleDeudaCtrl'
        }
      }
    })
    .state('app.ve-bus-detalle', {
      url: '/ve-bus-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-bus-detalle.html',
          controller:'DetVehCtrl'
        }
      }
    })
    .state('app.ve-datos-detalle', {
      url: '/ve-datos-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-datos-detalle.html',
          controller:'VeDatosDetCtrl'
        }
      }
    })
    .state('app.ae-bus-general', {
      url: '/ae-bus-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/ae-bus-general.html',
          controller: 'AeBusGralCtrl'
        }
      }
    })
    .state('app.ae-bus-detalle', {
      url: '/ae-bus-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/ae-bus-detalle.html',
          controller: 'AeBusDetCtrl'
        }
      }
    })
    .state('app.ae-datos-general', {
      url: '/ae-datos-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/ae-datos-general.html',
          controller: 'AeDatosGralCtrl'
        }
      }
    })
    .state('app.ae-datos-detalle', {
      url: '/ae-datos-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/ae-datos-detalle.html',
          controller: 'AeDatosDetCtrl'
        }
      }
    })
    .state('app.mo-inicio', {
      cache: false,
      url: '/mo-inicio',
      views: {
        'menuContent': {
          templateUrl: 'templates/mo-inicio.html',
          //controller: 'PlaylistsCtrl'
          controller: 'MoInicioCtrl'
        }
      }
    })
    .state('app.inm-bus-general', {
      url: '/inm-bus-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-bus-general.html',
          controller: 'InmBusGralCtrl'
        }
      }
    })
    .state('app.inm-datos-general', {
      url: '/inm-datos-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-datos-general.html',
          controller: 'InmDatosGralCtrl'
        }
      }
    })
    .state('app.inm-grilla-general', {
      url: '/inm-grilla-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-grilla-general.html',
          controller: 'InmGrillaGeneral'
        }
      }
    })
    .state('app.inm-bus-detalle', {
      url: '/inm-bus-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-bus-detalle.html',
          controller: 'InmBusDetCtrl'
        }
      }
    })
    .state('app.inm-datos-detalle', {
      url: '/inm-datos-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-datos-detalle.html',
          controller: 'InmDatosDetCtrl'
        }
      }
    })
    .state('app.inm-grilla-detalle', {
      url: '/inm-grilla-detalle',
      views: {
        'menuContent': {
          templateUrl: 'templates/inm-grilla-detalle.html',
          controller: 'InmGrillaDetalle'
        }
      }
    })
    .state('app.ts-bus-general', {
      url: '/ts-bus-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/ts-bus-general.html',
          controller: 'TsBusCtrl'
        }
      }
    })
    .state('app.ts-datos-general', {
      url: '/ts-datos-general',
      views: {
        'menuContent': {
          templateUrl: 'templates/ts-datos-general.html',
          controller: 'TsDatosCtrl'
        }
      }
    })
  //inf-agencias-cobro
    .state('app.inf-agencias-cobro', {
      cache: false,
      url: '/inf-agencias-cobro',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-agencias-cobro.html',
          controller: 'InfAgenciasCobroCtrl'
        }
      }
    })
    .state('app.inf-comentarios', {
      url: '/inf-comentarios',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-comentarios.html',
          controller: 'InfComentariosCtrl'
        }
      }
    })
    .state('app.inf-vencimientos', {
      cache: false,
      url: '/inf-vencimientos',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-vencimientos.html',
          controller: 'InfVencimientosCtrl'
        }
      }
    })
    .state('app.inf-verifica-pago', {
      cache: false,
      url: '/inf-verifica-pago',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-verifica-pago.html',
          controller: 'InfVerificaPagoCtrl'
        }
      }
    })

    .state('app.inf-acerca-de', {
      cache: false,
      url: '/inf-acerca-de',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-acerca-de.html',
          controller: 'InfAcercadeCtrl'
        }
      }
    })
    .state('app.inf-load-maps', {
      cache: false,
      url: '/inf-load-maps',
      views: {
        'menuContent': {
          templateUrl: 'templates/inf-load-maps.html',
          controller: 'InfCargarMapasCtrl'
        }
      }
    })
    .state('app.ve-bus-itv', {
      url: '/ve-bus-itv',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-bus-itv.html',
          controller: 'VeBusItvCtrl'
        }
      }
    })
    .state('app.ve-datos-itv', {
      url: '/ve-datos-itv',
      views: {
        'menuContent': {
          templateUrl: 'templates/ve-datos-itv.html',
          controller: 'VeDatosItvCtrl'
        }
      }
    })


    .state('app.mo-verificacion-pago', {
      cache: false,
      url: '/mo-verificacion-pago',
      views: {
        'menuContent': {
          templateUrl: 'templates/mo-verificacion-pago.html',
          controller: 'InfVerificaPagosCtrl'
        }
      }
    })

    .state('app.mo-verificacion-pago-error', {
      cache: false,
      url: '/mo-verificacion-pago-error',
      views: {
        'menuContent': {
          templateUrl: 'templates/mo-verificacion-pago-error.html'

        }
      }
    })
  ;
  $urlRouterProvider.otherwise('/app/mo-inicio');
});
