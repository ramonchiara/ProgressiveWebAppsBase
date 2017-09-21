// cria a aplicação e indica que vamos usar o plugin de rotas
var app = angular.module('lojaApp', ['ngRoute']);

// configura o plugin de rotas
app.config(function ($routeProvider) {
    $routeProvider
            .when("/", {
                templateUrl: 'views/principal.html',
                controller: 'lojaCtrl'
            })
            // notar que nessa rota, há um parâmetro chamado "id";
            // ou seja, essa rota é "acionada" quando a URL for /produto/123, por exemplo
            .when("/produto/:id", {
                templateUrl: 'views/produto.html',
                controller: 'lojaCtrl'
            })
            .otherwise({
                redirectTo: "/"
            });
});

// cria o controlador, "injetando" o $scope, 
// o $http (para fazer AJAX) e 
// o $routeParams (para obter os parâmetros da URL)
app.controller('lojaCtrl', function ($scope, $http, $routeParams) {

    // guarda os valores dos sliders
    $scope.min = 0;
    $scope.max = 10000;

    // guarda o menor e o maior preço encontrados na lista de produtos
    $scope.minPreco = 0;
    $scope.maxPreco = 10000;

    // guarda a lista de produtos
    $scope.produtos = [];

    // faz a chamada AJAX para obter os produtos
    $http.get('produtos.json').then(function (response) {
        $scope.produtos = response.data;

        // transforma a lista de produtos em uma lista de preços para...
        var precos = response.data.map(function (p) {
            return p.preco;
        });

        // ... poder descobrir o maior e o maior preço
        $scope.minPreco = Math.min.apply(null, precos); // acha o menor preço na lista "precos"
        $scope.maxPreco = Math.max.apply(null, precos); // acha o maior preço na lista "precos"

        // caso estejamos na view "produto.html", procuramos o produto a ser mostrado e
        // que é indicado pelo parâmetro "id" que se encontra em $routeParams (ver a configuração de rotas)
        $scope.p = null;
        for (p of $scope.produtos) {
            if (p.id == $routeParams.id) {
                $scope.p = p;
                break;
            }
        }
    });

    // cria o filtro que será usado na view "principal.html" para filtrar os produtos pelo preço (min e max)
    $scope.filtro = function (value, index, array) {
        return value.preco >= $scope.min && value.preco <= $scope.max;
    };
});
