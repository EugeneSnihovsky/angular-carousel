'use strict';
// регистрация базового модуля
(function () {
  angular.module('carousel', [

  ]);
})();
// регистрация фабрики с массивами карточек и действий
(function () {
  angular.module('carousel')
      .factory('card', ['$q', function ($q) {
        var list = [],
            action = [],
            done = $q.defer();
// добавляем новую карточку
        function addCard(card, last) {
          if(typeof card === 'object' && card.length > 0) {
            list.push(card);
            if(last) { done.resolve(); }
          }
        }
// добавляем действие при клике на карточку
        function addAction(foo) {
          action.push(foo);
        }
// возвращаем методы наполнения и массивы карточек, и действий
        return {
          addCard: addCard,
          addAction: addAction,
          list: list,
          action: action,
          done: done.promise
        };
      }]);
})();
// регистрация директивы, которая отвечает за наполнение массивов карточек и их действий
(function () {
  angular.module('carousel')
      .directive('esCard', ['card', function(card) {
        return {
          scope: {
            action: '&cardAction',
            item: '=elCard',
            last: '=lastCard'
          },
          restrict: 'A',
          transclude: true,
          link: function(scope, elem, attr, ctrl, transclude) {
// наполняем массив действий при клике на соответствующую карточку
            card.addAction(scope.action);
// наполняем массив элементов карточек
            transclude(scope, function(item) {
              card.addCard(item, scope.last);
              elem.remove();
            });
          }
        };
      }]);
})();
// регистрация директивы карусели
(function () {
  angular.module('carousel')
      .directive('esCarousel', ['$window', '$compile', '$interval', 'card', function($window, $compile, $interval, card) {
        return {
          scope: {
            elements: '=elCarousel'
          },
          restrict: 'A',
          link: function($scope, elem) {
            var cards = [],
                action = [],
                heightCoeff = ($scope.elements === 3) ? 2 : ($scope.elements === 5) ? 3.3 : 3.96,
                cardAmount = ($scope.elements === 3) ? 8 : ($scope.elements === 5) ? 10 : 12;
            $scope.card = [];
// присваиваем элементу необходимый для работы класс
            elem.addClass('el-carousel');
// выполняем подготовительные действия для обычных карточек и созданных при помощи ng-repeat
            function preStartActions() {
              if(card.list.length < 1) { return; }
              cards = card.list;
              action = card.action;
              makeCards();
            }
            preStartActions();
            card.done.then(preStartActions);
// изменяем высоту элемента в зависимости от ширины
            function changeHeight() {
              var carouselWidth = elem.width(),
                  carouselHeight = carouselWidth / heightCoeff;

              elem.css('height', carouselHeight);
            }
            angular.element($window).bind('resize', changeHeight);
            changeHeight();
// создаем DOM элементы карточек из массива
            function makeCards() {
              elem.empty();
              var k = 0,
                  cardNumber = (cards.length > cardAmount) ? cards.length : cardAmount,
                  numClass  = (cardAmount === 8) ? 'sm-' : (cardAmount === 10) ? 'md-' : 'lg-';

              for(var i = 0; i < cardNumber; i++) {
                var div = angular.element('<div ng-click="cardAction' + i +
                    '()" class="el-card" ng-class="card[' + i + ']"></div>');

                if(i < cards.length) {
                  div.append(cards[i].clone());
                  $scope['cardAction' + i] = action[i];
                } else {
                  div.append(cards[k].clone());
                  $scope['cardAction' + i] = action[k];
                  k = (k > cards.length - 2) ? 0 : k + 1;
                }
                $scope.card[i] = (i < cardAmount) ? numClass + 'el-card-' + (i + 1) : numClass + 'el-card-hide';
                $compile(div)($scope);
                elem.append(div);
              }
            }
// перемещаем карточки в порядке очереди
            function moveCards() {
              var lastElem = $scope.card.shift();
              $scope.card.push(lastElem);
            }
// старт/стоп карусели в зависимости от активности окна
            var moveInterval;
            runCarousel();
            angular.element($window).bind('blur', stopCarousel);
            function stopCarousel() {
              $interval.cancel(moveInterval);
            }
            angular.element($window).bind('focus', runCarousel);
            function runCarousel() {
              moveInterval = $interval(moveCards, 2000);
            }
            elem.bind('$destroy', function () {
              $interval.cancel(moveInterval);
              angular.element($window).unbind('blur', stopCarousel);
              angular.element($window).unbind('focus', runCarousel);
              angular.element($window).unbind('resize', changeHeight);
            });
          }
        };
      }]);
})();