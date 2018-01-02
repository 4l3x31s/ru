/// <reference path="../typings/tsd.d.ts" />
angular.module('starter.services', [])
    .factory("ServiciosRuat", function ($http, $q, ApiEndpoint, $rootScope, $ionicPopup) {
    return {
        getPostGlobal: function (objeto, urlModulo) {
            var defered = $q.defer();
            var promise = defered.promise;
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;'
                }
            };
            var url = $rootScope.urlServicio;
            $http.post(url + urlModulo, objeto, config)
                .success(function (data, status, headers, config) {
                var respuestaServicio = {
                    data: data,
                    status: status
                };
                defered.resolve(respuestaServicio);
            })
                .error(function (data, status, header, config) {
                var respuestaServicio = {
                    data: data,
                    status: status
                };
                defered.resolve(respuestaServicio);
            });
            return promise;
        },
        getPostPdf: function (objeto, urlModulo) {
            var defered = $q.defer();
            var promise = defered.promise;
            var config = {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8;',
                    'Content-Disposition': 'attachment;filename=reporte.pdf'
                },
                responseType: 'arraybuffer'
            };
            var url = $rootScope.urlServicio;
            $http.post(url + urlModulo, objeto, config)
                .success(function (data, status, headers, config) {
                defered.resolve(data);
            })
                .error(function (data, status, header, config) {
                defered.resolve(data);
            });
            return promise;
        },
        getGlobal: function (urlModulo) {
            var defered = $q.defer();
            var promise = defered.promise;
            var url = $rootScope.urlServicio;
            console.log("URL: Final: " + url + urlModulo);
            $http.get(url + urlModulo)
                .success(function (data, status, headers, config) {
                var respuestaServicio = {
                    data: data,
                    status: status
                };
                defered.resolve(respuestaServicio);
            })
                .error(function (data, status, header, config) {
                //defered.reject(err)
                var respuestaServicio = {
                    data: data,
                    status: status
                };
                defered.resolve(respuestaServicio);
            });
            return promise;
        },
        getAuxiliar: function () {
            var defered = $q.defer();
            var promise = defered.promise;
            return promise;
        },
        getStatus: function (status) {
            var mensaje = "";
            switch (status) {
                case 400://BadRequest
                    mensaje = "Hubo un error al realizar la petición (" + status + ").";
                    break;
                case 401://No autorizado
                    mensaje = "No se encuentra autorizado para acceder al servicio (" + status + ").";
                    break;
                case 403://Forbidden
                    mensaje = "No se encuentra autorizado para realizar la petición (" + status + ").";
                    break;
                case 404://Not Found
                    mensaje = "El servicio no se encuentra disponible, intente nuevamente (" + status + ").";
                    break;
                case 405://Method Not Allowed
                    mensaje = "La petición solicitada no puede ser encontrada (" + status + ").";
                    break;
                case 408://Request Timeout
                    mensaje = "Ha superado el tiempo de espera, revise su conexión a internet (" + status + ").";
                    break;
                case 500://Internal Server Error
                    mensaje = "Su petición no puede ser procesada en estos momentos, disculpe las molestias (" + status + ").";
                    break;
                case 502://Bad Gateway
                    mensaje = "La petición solicitada no es válida (" + status + ").";
                    break;
                case 503://Service Unavailable
                    mensaje = "El servicio se encuentra en mantenimiento, disculpe las molestias (" + status + ").";
                    break;
                case 504://Gateway Timeout
                    mensaje = "Ha superado el tiempo de espera (" + status + ").";
                    break;
                default:
                    if (status === -1) {
                        mensaje = "No se pudo obtener los datos, revise su conexión a Internet.";
                    }
                    else {
                        mensaje = "No se pudo obtener los datos (" + status + ").";
                    }
                    break;
            }
            console.log("Entró mensaje: " + mensaje);
            $ionicPopup.alert({
                title: 'Alerta',
                template: mensaje,
                buttons: [{
                        text: 'Aceptar',
                        type: 'button-positive'
                    }]
            });
            return mensaje;
        }
    };
})
    .factory("ServicioDatos", function () {
    return {
        data: {}
    };
})
    .factory("Util", function () {
    return {
        convertirFechas: function (data) {
            var reggie = /(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2}):(\d{2})/;
            var dateArray = reggie.exec(data.fecha);
            var dateObject = new Date((+dateArray[3]), (+dateArray[2]) - 1, // Careful, month starts at 0!
            (+dateArray[1]), (+dateArray[4]), (+dateArray[5]), (+dateArray[6]));
            return dateObject;
        },
        datosAuxiliar: function () {
            return {
                data: {}
            };
        }
    };
})
    .factory('MathServicePDF', function ($http) {
    return {
        downloadPdf: function () {
            return $http.get('api/downloadPDF', { responseType: 'arraybuffer' }).then(function (response) {
                return response;
            });
        }
    };
});
