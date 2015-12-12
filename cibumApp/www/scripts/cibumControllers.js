//Esteban Morales
//email:esteban.a.morales.morales@gmail.com

angular.module('cibumControllers', [])

.controller('Ingredientes', Ingredientes)

.controller('ListaRecetas', ListaRecetas)
;

//////////////////////////////////////
Ingredientes.$inject = ['Azureservice', '$ionicLoading', '$ionicPopup', '$ionicPlatform', '$scope'];
function Ingredientes(Azureservice, $ionicLoading, $ionicPopup, $ionicPlatform, $scope) {
    var scope = this;
    scope.buscarReceta = buscarReceta;

    FirstActivate();

    var deregisterFirst = $ionicPlatform.registerBackButtonAction(function (event) {
        if (true) { // your check here
            $ionicPopup.confirm({
                title: '¡Aviso!',
                template: '¿Quieres salir?'
            }).then(function (res) {
                if (res) {
                    ionic.Platform.exitApp();
                }
            })
        }
    }, 100);
    $scope.$on('$destroy', deregisterFirst);

    //////////
    function FirstActivate() {
        scope.show = function () {
            $ionicLoading.show({
                template:'<ion-spinner></ion-spinner>'
            });
        };
        scope.hide = function () {
            $ionicLoading.hide();
        };
        scope.show();
        console.log('first activate');
        Azureservice.getAll('Ingredientes')
            .then(function (items) {
                scope.ingredientes = items;
                console.log('Ingredientes was successfully returned!');
                scope.hide();
            }, function (err) {
                console.log('Error querying Azure' + err);
            });        
    }

    function buscarReceta() {
        scope.query = [];
        for (var i = 0; i < scope.ingredientes.length; i++) {
            if (scope.ingredientes[i].ischecked == true) {
                scope.query.push(scope.ingredientes[i].id);
                console.log('Lee el query '+ scope.query);
            }
        }
    }
}

ListaRecetas.$inject = ['Azureservice', '$stateParams', '$ionicModal', '$scope', '$ionicLoading', '$ionicPlatform'];
function ListaRecetas(Azureservice, $stateParams, $ionicModal, $scope, $ionicLoading, $ionicPlatform) {
    var scope = this;
    scope.queryReceta = [];
    scope.listaRecetas = [];
    scope.pasos = [];
    var query = $stateParams.lista;

    var deregisterSecond = $ionicPlatform.registerBackButtonAction(
      function () {
          window.location.assign(window.location.protocol + '//' + window.location.host + window.location.pathname + '#/ingredientes');
      }, 100
    );
    $scope.$on('$destroy', deregisterSecond);

    scope.InfoReceta = InfoReceta;

    SecondActivate();

    $ionicModal.fromTemplateUrl('receta.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });
    scope.openCard = function (index) {
        scope.InfoReceta(index);
        $scope.modal.show();
    };
    scope.closeCard = function () {
        $scope.modal.hide();
    };
    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });
    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        //TODO:
    });
    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        //TODO:
    });
    
    //////////

    function InfoReceta(index) {
        var nombre = scope.listaRecetas[index].nombre;
        var imagenUrl = scope.listaRecetas[index].imagenurl;
        var ingredientes = [];
        var pasos = [];

        scope.nombre = nombre;
        scope.imagenUrl = imagenUrl;
        scope.listaIngredientes = ingredientes;
        scope.listaPasos = pasos;


        for (var i = 0; i < scope.listaIngRec.length; i++) {
            if (scope.listaIngRec[i].idreceta == scope.listaRecetas[index].id) {
                for (var j = 0; j < scope.ingredientes.length; j++) {
                    if (scope.listaIngRec[i].idingrediente == scope.ingredientes[j].id) {
                        ingredientes.push({ nombre: scope.ingredientes[j].nombre, imagenUrl: scope.ingredientes[j].imagenurl });
                    }
                }
            }
        }
        for (var i = 0; i < scope.pasos.length; i++) {
            if (scope.pasos[i].idreceta == scope.listaRecetas[index].id) {
                pasos.push(scope.pasos[i].nombre);
            }
        }
    }

    function SecondActivate() {
        scope.show = function () {
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });
        };
        scope.show();
        console.log('second activate');
        Azureservice.getAll('ingrrec')
            .then(function (items) {
                scope.listaIngRec = items;
                console.log('IngrRec was successfully returned!');
                Azureservice.getAll('Recetas')
                    .then(function (items) {
                        scope.listaRec = items;
                        console.log('Recetas was successfully returned!');
                        queryResults();
                    }, function (err) {
                        console.log('Error querying Azure' + err);
                    });
            }, function (err) {
                console.log('Error querying Azure' + err);
            });

        Azureservice.getAll('Pasos')
            .then(function (items) {
                scope.pasos = items;
                console.log('Pasos was successfully returned!');
            }, function (err) {
                console.log('Error querying Azure' + err);
            });

        Azureservice.getAll('Ingredientes')
            .then(function (items) {
                scope.ingredientes = items;
                console.log('Ingredientes was successfully returned!');
            }, function (err) {
                console.log('Error querying Azure' + err);
            }); 
    }

    function queryResults() {
        if (query != null || query != undefined) {
            for (var i = 0; i < scope.listaIngRec.length; i++) {
                for (var j = 0; j < query.length; j++) {
                    console.log([j] + ' ' + query[j]);
                    if (scope.listaIngRec[i].idingrediente == query[j]) {
                        scope.queryReceta.push(scope.listaIngRec[i].idreceta);
                    };
                };
            };
        };
        console.log('query de recetas ' + scope.queryReceta);
        if (query != null || query != undefined) {
            for (var i = 0; i < scope.queryReceta.length; i++) {
                for (var j = i + 1; j < scope.queryReceta.length; j++) {
                    if (scope.queryReceta[i] == scope.queryReceta[j]) {
                        scope.queryReceta.splice(0, j);
                    };
                };
            };
        };
        for (var i = 0; i < scope.listaRec.length; i++) {
            for (var j = 0; j < scope.queryReceta.length; j++) {
                if (scope.listaRec[i].id == scope.queryReceta[j]) {
                    scope.listaRecetas.push(scope.listaRec[i]);
                };
            };
        }; 
        scope.hide = function () {
            $ionicLoading.hide();
        };
        scope.hide();
    }
}
